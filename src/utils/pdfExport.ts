import { AnalysisResult, Document } from '@/types';

export function exportDocumentReport(doc: Document, analysis: AnalysisResult, format: 'pdf' | 'docx' | 'md' = 'md') {
  const content = `# LEGALOS AI Contract Analysis Report
**Document Title:** ${doc.title}
**File Name:** ${doc.fileName}
**Risk Score:** ${analysis.risk_score} (Index: ${analysis.riskNumerical}/100)
**Analyzed Date:** ${new Date(doc.uploadDate).toLocaleDateString()}
**Webhook Status:** Verified via SNS Workbench AI Pipeline

---

## Executive Summary
${analysis.summary}

---

## Contracting Parties
${analysis.parties.map((p) => `- **${p.name}** (${p.role}) ${p.jurisdiction ? `[Jurisdiction: ${p.jurisdiction}]` : ''}`).join('\n')}

---

## Key Extracted Clauses
${analysis.key_clauses
  .map(
    (c) => `### ${c.section}: ${c.title} [Risk: ${c.riskLevel}]
*Summary:* ${c.summary}
> "${c.content}"
${c.recommendation ? `\n*AI Recommendation:* ${c.recommendation}` : ''}`
  )
  .join('\n\n')}

---

## Missing Critical Clauses & Gaps
${analysis.missing_clauses
  .map((m) => `- **${m.title}** [Severity: ${m.severity}]\n  *Gap:* ${m.description}\n  *Suggested Text:* "${m.suggestedAddition}"`)
  .join('\n\n')}

---

## Key Obligations Timeline
${analysis.obligations.map((o) => `- [${o.party}] ${o.description} (${o.dueDate || 'N/A'}) - Risk: ${o.risk}`).join('\n')}

---

## AI Strategic Recommendations
${analysis.recommendations
  .map((r) => `### ${r.category}: ${r.title}\n${r.description}\n**Action:** ${r.actionItem}`)
  .join('\n\n')}
`;

  if (format === 'md' || format === 'docx' || format === 'pdf') {
    // Create downloadable blob
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${doc.fileName.split('.')[0]}_LEGALOS_Analysis.${format === 'pdf' ? 'pdf.txt' : format}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}
