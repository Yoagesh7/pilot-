import { AnalysisResult, RiskLevel, PartyInfo, ImportantDate, Clause, MissingClause, Obligation, Recommendation } from '@/types';

/**
 * Universal Webhook & AI Parser
 * Reads raw JSON, embedded stringified JSON (```json ... ```), array wrappers,
 * or AI prose text outputs returned by webhooks and converts them into structured AnalysisResult.
 */

export function parseWebhookPayloadToAnalysis(
  rawInput: any,
  fileName: string = 'Document.pdf'
): AnalysisResult {
  const timestamp = new Date().toLocaleTimeString();
  const docId = `doc-${Date.now()}`;

  // 1. Unwrap wrappers & find deep JSON or text content
  const extractedData = deepExtractJsonObject(rawInput);

  // If extraction returned a parsed object or partially filled object
  const obj = typeof extractedData === 'object' && extractedData !== null ? extractedData : {};
  
  // 2. Extract OCR text / raw text content for AI chat context
  const rawTextContent =
    typeof rawInput === 'string'
      ? rawInput
      : obj.ocr_text || obj.full_text || obj.document_text || obj.output || obj.text || obj.content || obj.summary || JSON.stringify(rawInput, null, 2);

  // 3. Fallback text parsing if structured JSON fields are missing
  const textAnalysis = (typeof rawTextContent === 'string' && (!obj.key_clauses || obj.key_clauses.length === 0))
    ? parseProseTextToStructure(rawTextContent, fileName)
    : {};

  // Combine structured JSON object with text analysis fallback
  const merged = { ...textAnalysis, ...obj };

  // 4. Normalize Risk Level & Risk Score
  const rawRiskStr = String(
    merged.risk_score ||
    merged.risk_level ||
    merged.riskScore ||
    merged.riskLevel ||
    merged.overall_risk ||
    merged.risk ||
    'Medium'
  );

  const normalizedRisk: RiskLevel =
    rawRiskStr.toLowerCase().includes('high') ? 'High' :
    rawRiskStr.toLowerCase().includes('low') ? 'Low' : 'Medium';

  const rawNumerical = merged.risk_numerical ?? merged.riskNumerical ?? merged.risk_index ?? merged.score;
  const riskNumerical = typeof rawNumerical === 'number'
    ? Math.min(100, Math.max(0, rawNumerical))
    : (normalizedRisk === 'High' ? 84 : normalizedRisk === 'Medium' ? 52 : 22);

  // 5. Normalize Contracting Parties
  const rawParties = merged.parties || merged.contracting_parties || merged.parties_involved || merged.entities || [];
  const normalizedParties: PartyInfo[] = Array.isArray(rawParties)
    ? rawParties.map((p: any, idx: number) => {
        if (typeof p === 'string') {
          return { name: p, role: idx === 0 ? 'Client / Customer' : 'Vendor / Provider' };
        }
        return {
          name: p.name || p.party_name || p.entity || `Party ${idx + 1}`,
          role: p.role || p.party_type || (idx === 0 ? 'Client' : 'Provider'),
          jurisdiction: p.jurisdiction || p.governing_law,
        };
      })
    : [];

  if (normalizedParties.length === 0) {
    normalizedParties.push(
      { name: 'Contracting Party A', role: 'Customer' },
      { name: 'Contracting Party B', role: 'Service Provider' }
    );
  }

  // 6. Normalize Summary
  const summaryText =
    merged.summary ||
    merged.executive_summary ||
    merged.overview ||
    merged.analysis_summary ||
    merged.description ||
    (typeof rawInput === 'string' ? rawInput : `AI analysis completed for "${fileName}".`);

  // 7. Normalize Key Clauses
  const rawClauses = merged.key_clauses || merged.keyClauses || merged.clauses || merged.extracted_clauses || merged.contract_clauses || merged.risks || [];
  const normalizedClauses: Clause[] = Array.isArray(rawClauses)
    ? rawClauses.map((c: any, i: number) => {
        const cRiskStr = String(c.riskLevel || c.risk_level || c.risk || c.severity || normalizedRisk);
        const cRisk: RiskLevel = cRiskStr.toLowerCase().includes('high') ? 'High' : cRiskStr.toLowerCase().includes('low') ? 'Low' : 'Medium';
        
        let titleStr = 'Extracted Clause';
        if (typeof c.title === 'string') titleStr = c.title;
        else if (c.title?.title) titleStr = c.title.title;
        else if (c.name) titleStr = c.name;

        return {
          id: c.id || `clause-${i + 1}`,
          title: titleStr,
          section: c.section || c.clause_number || c.section_number || `Section ${i + 1}.0`,
          content: c.content || c.text || c.clause_text || c.snippet || 'Clause text extracted from contract.',
          type: (c.type as any) || 'Custom',
          riskLevel: cRisk,
          summary: c.summary || c.analysis || c.description || 'Clause analyzed by AI system.',
          recommendation: c.recommendation || c.suggested_redline || c.action_item,
        };
      })
    : [];

  // 8. Normalize Missing Clauses
  const rawMissing = merged.missing_clauses || merged.missingClauses || merged.missing_provisions || merged.gaps || [];
  const normalizedMissing: MissingClause[] = Array.isArray(rawMissing)
    ? rawMissing.map((m: any, i: number) => {
        const mSevStr = String(m.severity || m.risk || 'Medium');
        const severity: RiskLevel = mSevStr.toLowerCase().includes('high') ? 'High' : mSevStr.toLowerCase().includes('low') ? 'Low' : 'Medium';
        return {
          id: m.id || `missing-${i + 1}`,
          title: m.title || m.clause_name || 'Recommended Provision',
          description: m.description || m.reason || 'Clause recommended for addition.',
          severity,
          suggestedAddition: m.suggestedAddition || m.suggested_text || m.recommendation || 'Standard protection clause.',
        };
      })
    : [];

  // 9. Normalize Obligations
  const rawObligations = merged.obligations || merged.party_obligations || merged.responsibilities || [];
  const normalizedObligations: Obligation[] = Array.isArray(rawObligations)
    ? rawObligations.map((o: any, i: number) => {
        const oRiskStr = String(o.risk || o.riskLevel || 'Low');
        const risk: RiskLevel = oRiskStr.toLowerCase().includes('high') ? 'High' : oRiskStr.toLowerCase().includes('medium') ? 'Medium' : 'Low';
        return {
          id: o.id || `ob-${i + 1}`,
          party: o.party || o.responsible_party || 'Contracting Party',
          description: o.description || o.task || o.obligation_text || 'Legal commitment',
          dueDate: o.dueDate || o.due_date || o.timeline || 'Ongoing',
          risk,
        };
      })
    : [];

  // 10. Normalize Recommendations
  const rawRecs = merged.recommendations || merged.action_items || merged.suggested_changes || merged.redlines || merged.playbook || [];
  const normalizedRecs: Recommendation[] = Array.isArray(rawRecs)
    ? rawRecs.map((r: any, i: number) => ({
        id: r.id || `rec-${i + 1}`,
        category: r.category || r.type || 'Legal Advisory',
        title: r.title || r.name || 'Contract Recommendation',
        description: r.description || r.details || 'AI action item',
        actionItem: r.actionItem || r.action || r.suggested_action || r.recommendation || 'Review term with counsel.',
      }))
    : [];

  // 11. Normalize Important Dates
  const rawDates = merged.important_dates || merged.dates || merged.key_dates || merged.milestones || [];
  const normalizedDates: ImportantDate[] = Array.isArray(rawDates)
    ? rawDates.map((d: any, i: number) => ({
        id: d.id || `date-${i + 1}`,
        title: d.title || d.name || 'Contract Milestone',
        date: d.date || d.deadline || new Date().toISOString().split('T')[0],
        type: (d.type as any) || 'Effective',
        isUrgent: Boolean(d.isUrgent || d.urgent || d.high_priority),
      }))
    : [];

  return {
    id: `an-${Date.now()}`,
    documentId: docId,
    summary: summaryText,
    risk_score: normalizedRisk,
    riskNumerical,
    parties: normalizedParties,
    important_dates: normalizedDates,
    key_clauses: normalizedClauses,
    missing_clauses: normalizedMissing,
    obligations: normalizedObligations,
    recommendations: normalizedRecs,
    webhookProcessedAt: timestamp,
    rawBackendJson: rawInput,
    ocrText: typeof rawTextContent === 'string' ? rawTextContent : JSON.stringify(rawTextContent, null, 2),
  };
}

/**
 * Recursively inspects input for wrapped objects, stringified JSON, or codeblock JSON
 */
function deepExtractJsonObject(input: any): any {
  if (!input) return {};

  // If array (e.g. n8n webhook response: [{ output: "..." }])
  if (Array.isArray(input)) {
    if (input.length === 0) return {};
    return deepExtractJsonObject(input[0]);
  }

  // If string, try direct parse or regex extraction
  if (typeof input === 'string') {
    const parsed = attemptJsonStringParse(input);
    if (parsed) return deepExtractJsonObject(parsed);
    return { summary: input };
  }

  if (typeof input === 'object') {
    // Check if input has _responseData wrapper (e.g. res._responseData or res.responseData)
    if (input._responseData !== undefined) {
      return deepExtractJsonObject(input._responseData);
    }
    if (input.responseData !== undefined) {
      return deepExtractJsonObject(input.responseData);
    }

    // If input has data wrapper
    if (input.data && typeof input.data === 'object') {
      return deepExtractJsonObject(input.data);
    }
    if (input.result && typeof input.result === 'object') {
      return deepExtractJsonObject(input.result);
    }
    if (input.body && typeof input.body === 'object') {
      return deepExtractJsonObject(input.body);
    }
    if (input.json && typeof input.json === 'object') {
      return deepExtractJsonObject(input.json);
    }

    // Check string fields for nested JSON (e.g. output, text, content, response, message)
    const stringFields = ['output', 'text', 'content', 'response', 'message', 'result', 'body'];
    for (const field of stringFields) {
      if (typeof input[field] === 'string') {
        const parsed = attemptJsonStringParse(input[field]);
        if (parsed && typeof parsed === 'object') {
          return { ...input, ...parsed };
        }
      }
    }

    return input;
  }

  return {};
}

/**
 * Attempts to parse JSON from string, handling ```json ... ``` codeblocks and curly brace bounds
 */
function attemptJsonStringParse(str: string): any | null {
  if (!str || typeof str !== 'string') return null;

  const trimmed = str.trim();

  // 1. Direct JSON parse
  try {
    return JSON.parse(trimmed);
  } catch {}

  // 2. Codeblock extraction: ```json { ... } ``` or ``` { ... } ```
  const codeBlockMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (codeBlockMatch && codeBlockMatch[1]) {
    try {
      return JSON.parse(codeBlockMatch[1].trim());
    } catch {}
  }

  // 3. Outermost curly brace bounds: { ... }
  const firstBrace = trimmed.indexOf('{');
  const lastBrace = trimmed.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    const candidate = trimmed.substring(firstBrace, lastBrace + 1);
    try {
      return JSON.parse(candidate);
    } catch {}
  }

  return null;
}

/**
 * Fallback AI prose text parser: extracts sections out of human-written markdown AI text
 */
function parseProseTextToStructure(text: string, fileName: string): Partial<AnalysisResult> {
  const result: Partial<AnalysisResult> = {
    key_clauses: [],
    recommendations: [],
    missing_clauses: [],
    obligations: [],
  };

  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
  
  let currentSection = 'summary';
  let summaryLines: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Detect risk score mentions
    if (/risk\s*(score|level|index|rating)?\s*:\s*(high|medium|low)/i.test(line)) {
      const match = line.match(/risk\s*(score|level|index|rating)?\s*:\s*(high|medium|low)/i);
      if (match && match[2]) {
        const r = match[2].toLowerCase();
        result.risk_score = r === 'high' ? 'High' : r === 'low' ? 'Low' : 'Medium';
      }
    }

    // Detect numerical score mentions e.g. 85/100 or Score: 72
    if (/(\d{1,3})\s*\/\s*100|score\s*:\s*(\d{1,3})/i.test(line)) {
      const match = line.match(/(\d{1,3})\s*\/\s*100|score\s*:\s*(\d{1,3})/i);
      const val = parseInt(match?.[1] || match?.[2] || '50', 10);
      if (!isNaN(val)) result.riskNumerical = val;
    }

    // Section header detection
    if (/^(#+|\*\*)\s*(executive\s+summary|summary|overview)/i.test(line)) {
      currentSection = 'summary';
      continue;
    } else if (/^(#+|\*\*)\s*(key\s+clauses|extracted\s+clauses|clauses)/i.test(line)) {
      currentSection = 'clauses';
      continue;
    } else if (/^(#+|\*\*)\s*(recommendations|playbook|suggested\s+changes|redlines)/i.test(line)) {
      currentSection = 'recommendations';
      continue;
    } else if (/^(#+|\*\*)\s*(missing\s+clauses|gaps|omitted)/i.test(line)) {
      currentSection = 'missing';
      continue;
    } else if (/^(#+|\*\*)\s*(obligations|responsibilities|commitments)/i.test(line)) {
      currentSection = 'obligations';
      continue;
    }

    // Process line based on current section
    if (currentSection === 'summary' && !line.startsWith('#')) {
      summaryLines.push(line);
    } else if (currentSection === 'clauses' && (line.startsWith('-') || line.startsWith('*') || /^\d+\./.test(line))) {
      const cleanText = line.replace(/^[-*\d.]+\s*/, '');
      result.key_clauses?.push({
        id: `c-prose-${result.key_clauses.length + 1}`,
        title: cleanText.split(':')[0] || `Clause ${result.key_clauses.length + 1}`,
        section: `Section ${result.key_clauses.length + 1}.0`,
        content: cleanText,
        type: 'Custom',
        riskLevel: cleanText.toLowerCase().includes('high') ? 'High' : cleanText.toLowerCase().includes('low') ? 'Low' : 'Medium',
        summary: cleanText,
      });
    } else if (currentSection === 'recommendations' && (line.startsWith('-') || line.startsWith('*') || /^\d+\./.test(line))) {
      const cleanText = line.replace(/^[-*\d.]+\s*/, '');
      result.recommendations?.push({
        id: `rec-prose-${result.recommendations.length + 1}`,
        category: 'Legal Advisory',
        title: cleanText.split(':')[0] || 'AI Recommendation',
        description: cleanText,
        actionItem: cleanText,
      });
    }
  }

  if (summaryLines.length > 0) {
    result.summary = summaryLines.join(' ');
  }

  return result;
}
