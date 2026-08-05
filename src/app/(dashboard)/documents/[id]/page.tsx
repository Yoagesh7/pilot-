'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useDocStore } from '@/stores/docStore';
import { Card, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Tabs } from '@/components/ui/Tabs';
import { Accordion } from '@/components/ui/Accordion';
import { exportDocumentReport } from '@/utils/pdfExport';
import { useToast } from '@/components/ui/Toast';
import {
  FileText,
  Download,
  Sparkles,
  ShieldAlert,
  Calendar,
  Users,
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  FileCheck,
  Zap,
  Terminal,
  Copy,
} from 'lucide-react';

export default function DocumentDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { showToast } = useToast();
  const docId = params?.id as string;
  const { documents, analyses } = useDocStore();

  const doc = documents.find((d) => d.id === docId);
  const analysis = docId ? analyses[docId] : undefined;

  const [activeTab, setActiveTab] = useState('summary');

  if (!doc || !analysis) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/documents')}
            className="p-2 rounded-xl bg-white dark:bg-[#141414] border border-[#E6E4DF] dark:border-[#27272A] text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h1 className="text-xl font-bold font-serif text-[#18181B] dark:text-slate-100">Document Details</h1>
        </div>

        <Card className="p-12 text-center space-y-4 max-w-xl mx-auto border-dashed border-2">
          <div className="w-16 h-16 rounded-3xl bg-[#EFECE6] dark:bg-[#1C1C1C] text-[#18181B] dark:text-slate-200 mx-auto flex items-center justify-center">
            <FileText className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold font-serif text-[#18181B] dark:text-slate-100">
              Contract Document Not Found
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
              No analyzed document exists for this ID. Please upload a PDF contract to view real backend analysis output.
            </p>
          </div>
          <Button onClick={() => router.push('/documents')} size="sm">
            Go to Document Repository
          </Button>
        </Card>
      </div>
    );
  }

  const handleExport = (format: 'pdf' | 'docx' | 'md') => {
    exportDocumentReport(doc, analysis, format);
    showToast('Report Exported', `Generated ${format.toUpperCase()} analysis report for "${doc.title}".`, 'success');
  };

  const copyJsonPayload = () => {
    const payload = analysis.rawBackendJson || analysis;
    navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
    showToast('JSON Copied', 'Backend JSON response output copied to clipboard.', 'info');
  };

  const tabs = [
    { id: 'summary', label: 'Executive Summary', icon: <FileText className="w-4 h-4" /> },
    { id: 'clauses', label: `Key Clauses (${analysis.key_clauses.length})`, icon: <Sparkles className="w-4 h-4" /> },
    { id: 'missing', label: `Missing Clauses (${analysis.missing_clauses.length})`, icon: <AlertTriangle className="w-4 h-4" /> },
    { id: 'obligations', label: `Obligations (${analysis.obligations.length})`, icon: <CheckCircle2 className="w-4 h-4" /> },
    { id: 'recommendations', label: 'AI Recommendations', icon: <Zap className="w-4 h-4" /> },
    { id: 'json', label: 'Backend JSON Output', icon: <Terminal className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-6">
      {/* Back Button & Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-xl bg-white dark:bg-[#141414] border border-[#E6E4DF] dark:border-[#27272A] text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold font-serif tracking-tight text-[#18181B] dark:text-slate-100">
              {doc.title}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
              {doc.fileName} • Processed via SNS Workbench Webhook
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => handleExport('md')}>
            Export MD
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleExport('docx')}>
            Word (.docx)
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => handleExport('pdf')}
            leftIcon={<Download className="w-4 h-4" />}
          >
            Download PDF Report
          </Button>
        </div>
      </div>

      {/* Contract Risk & Overview Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Risk Rating Card */}
        <Card className="flex flex-col justify-between">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Overall AI Risk Rating
          </span>
          <div className="flex items-center gap-3 my-2">
            <Badge riskLevel={analysis.risk_score} size="md" />
            <span className="text-3xl font-bold font-serif text-[#18181B] dark:text-slate-100">
              {analysis.riskNumerical} <span className="text-xs font-sans font-normal text-slate-400">/ 100 Risk Index</span>
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            {analysis.risk_score === 'High'
              ? 'Contains non-standard liability provisions & price escalation terms.'
              : 'Standard legal terms with minimal balance sheet exposure.'}
          </p>
        </Card>

        {/* Parties Card */}
        <Card className="flex flex-col justify-between">
          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            <Users className="w-4 h-4 text-slate-700 dark:text-slate-300" /> Contracting Parties
          </div>
          <div className="space-y-1.5 my-2">
            {analysis.parties.map((p, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs font-semibold text-slate-800 dark:text-slate-200">
                <span>{p.name}</span>
                <span className="text-[10px] font-bold text-slate-700 dark:text-slate-200 bg-[#EFECE6] dark:bg-[#1C1C1C] px-2 py-0.5 rounded-full">{p.role}</span>
              </div>
            ))}
          </div>
          <span className="text-[11px] text-slate-400 font-medium">Verified identity & Delaware governing jurisdiction</span>
        </Card>

        {/* Important Dates */}
        <Card className="flex flex-col justify-between">
          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            <Calendar className="w-4 h-4 text-slate-700 dark:text-slate-300" /> Critical Dates & Milestones
          </div>
          <div className="space-y-1.5 my-2">
            {analysis.important_dates.map((d) => (
              <div key={d.id} className="flex items-center justify-between text-xs">
                <span className="text-slate-600 dark:text-slate-400 font-medium">{d.title}</span>
                <span className={`font-bold ${d.isUrgent ? 'text-rose-600' : 'text-slate-900 dark:text-slate-100'}`}>
                  {d.date}
                </span>
              </div>
            ))}
          </div>
          <span className="text-[11px] text-rose-500 font-bold">90-day non-renewal notice deadline approaching</span>
        </Card>
      </div>

      {/* Tabs Bar */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} variant="pills" />

      {/* Tab Panels */}
      {activeTab === 'summary' && (
        <div className="space-y-4">
          {/* AI Summary Block */}
          <Card className="space-y-3 border-l-4 border-l-[#18181B] dark:border-l-white">
            <h3 className="text-lg font-bold font-serif text-[#18181B] dark:text-slate-100 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#18181B] dark:text-white" /> Executive AI Summary
            </h3>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-[#FAF9F5] dark:bg-[#1A1A1A] p-4 rounded-xl border border-[#E6E4DF] dark:border-[#27272A] font-medium">
              {analysis.summary}
            </p>
          </Card>

          {/* Risk Clause Breakdown - 2 column grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* High Risk Clauses */}
            <div className="p-4 rounded-2xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-900/40">
              <h4 className="text-xs font-bold text-rose-900 dark:text-rose-200 flex items-center gap-2 mb-2">
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                High Risk Clauses ({analysis.key_clauses.filter(c => c.riskLevel === 'High').length})
              </h4>
              <ul className="space-y-2">
                {analysis.key_clauses.filter(c => c.riskLevel === 'High').length > 0
                  ? analysis.key_clauses.filter(c => c.riskLevel === 'High').map(c => (
                      <li key={c.id} className="text-xs text-rose-800 dark:text-rose-300 space-y-0.5 font-medium">
                        <span className="font-bold block">{c.section}: {c.title}</span>
                        <span className="block">{c.summary}</span>
                        {c.recommendation && (
                          <span className="block italic text-rose-600 dark:text-rose-400">→ {c.recommendation}</span>
                        )}
                      </li>
                    ))
                  : <li className="text-xs text-rose-500 font-medium">No high risk clauses detected.</li>
                }
              </ul>
            </div>

            {/* Protective / Low Risk Clauses */}
            <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40">
              <h4 className="text-xs font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-2 mb-2">
                <FileCheck className="w-4 h-4 text-emerald-600" />
                Protective Provisions ({analysis.key_clauses.filter(c => c.riskLevel === 'Low').length})
              </h4>
              <ul className="space-y-2">
                {analysis.key_clauses.filter(c => c.riskLevel === 'Low').length > 0
                  ? analysis.key_clauses.filter(c => c.riskLevel === 'Low').map(c => (
                      <li key={c.id} className="text-xs text-emerald-800 dark:text-emerald-300 space-y-0.5 font-medium">
                        <span className="font-bold block">{c.section}: {c.title}</span>
                        <span className="block">{c.summary}</span>
                      </li>
                    ))
                  : <li className="text-xs text-emerald-600 font-medium">No protective provisions found.</li>
                }
              </ul>
            </div>
          </div>

          {/* Medium Risk Clauses */}
          {analysis.key_clauses.filter(c => c.riskLevel === 'Medium').length > 0 && (
            <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40">
              <h4 className="text-xs font-bold text-amber-900 dark:text-amber-200 flex items-center gap-2 mb-2">
                <ShieldAlert className="w-4 h-4 text-amber-500" />
                Medium Risk Clauses ({analysis.key_clauses.filter(c => c.riskLevel === 'Medium').length})
              </h4>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {analysis.key_clauses.filter(c => c.riskLevel === 'Medium').map(c => (
                  <li key={c.id} className="text-xs text-amber-800 dark:text-amber-300 space-y-0.5 font-medium">
                    <span className="font-bold block">{c.section}: {c.title}</span>
                    <span className="block">{c.summary}</span>
                    {c.recommendation && (
                      <span className="block italic text-amber-600 dark:text-amber-400">→ {c.recommendation}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Missing Clauses */}
          {analysis.missing_clauses.length > 0 && (
            <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40">
              <h4 className="text-xs font-bold text-amber-900 dark:text-amber-200 flex items-center gap-2 mb-3">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                Missing Clauses Detected by Backend ({analysis.missing_clauses.length})
              </h4>
              <ul className="space-y-3">
                {analysis.missing_clauses.map(m => (
                  <li key={m.id} className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge riskLevel={m.severity} size="sm" />
                      <span className="text-xs font-bold text-amber-900 dark:text-amber-100">{m.title}</span>
                    </div>
                    <p className="text-xs text-amber-800 dark:text-amber-300 ml-0 font-medium">{m.description}</p>
                    <div className="p-2 rounded-lg bg-amber-100/60 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800">
                      <span className="text-[10px] font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wide">Suggested Addition:</span>
                      <p className="text-xs font-mono text-amber-800 dark:text-amber-200 mt-0.5">&quot;{m.suggestedAddition}&quot;</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* AI Recommendations */}
          {analysis.recommendations.length > 0 && (
            <div className="p-4 rounded-2xl bg-[#FAF9F5] dark:bg-[#141414] border border-[#E6E4DF] dark:border-[#27272A]">
              <h4 className="text-xs font-bold text-[#18181B] dark:text-slate-100 flex items-center gap-2 mb-3">
                <Zap className="w-4 h-4 text-[#18181B] dark:text-white" />
                AI Recommended Action Items ({analysis.recommendations.length})
              </h4>
              <ul className="space-y-3">
                {analysis.recommendations.map((rec, idx) => (
                  <li key={rec.id} className="space-y-1 border-b border-[#E6E4DF] dark:border-[#27272A] last:border-0 pb-2 last:pb-0">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#18181B] dark:bg-white text-white dark:text-[#18181B] text-[10px] font-bold flex items-center justify-center shrink-0">{idx + 1}</span>
                      <span className="text-[10px] font-bold uppercase text-slate-500">{rec.category}</span>
                      <span className="text-xs font-bold text-[#18181B] dark:text-slate-100">{rec.title}</span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium ml-7">{rec.description}</p>
                    <p className="text-xs font-semibold text-[#18181B] dark:text-slate-200 ml-7">👉 {rec.actionItem}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {activeTab === 'clauses' && (
        <div className="space-y-4">
          <Accordion
            items={analysis.key_clauses.map((c) => ({
              id: c.id,
              title: (
                <div>
                  <span className="text-xs font-bold text-slate-500 block">{c.section}</span>
                  <span className="text-sm font-semibold">{c.title}</span>
                </div>
              ),
              badge: <Badge riskLevel={c.riskLevel} size="sm" />,
              content: (
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-[#FAF9F5] dark:bg-[#0A0A0A] font-mono text-xs text-slate-800 dark:text-slate-200 border border-[#E6E4DF] dark:border-[#27272A]">
                    &quot;{c.content}&quot;
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                    <strong className="text-[#18181B] dark:text-slate-100">AI Risk Assessment:</strong> {c.summary}
                  </p>
                  {c.recommendation && (
                    <div className="p-3 rounded-xl bg-[#F4F2EC] dark:bg-[#1A1A1A] border border-[#E2DFD6] dark:border-[#27272A] text-xs text-slate-800 dark:text-slate-200 font-medium">
                      <strong>AI Redline Suggestion:</strong> {c.recommendation}
                    </div>
                  )}
                </div>
              ),
            }))}
          />
        </div>
      )}

      {activeTab === 'missing' && (
        <div className="space-y-4">
          {analysis.missing_clauses.map((m) => (
            <Card key={m.id} className="border-l-4 border-l-amber-500">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-sm font-bold text-[#18181B] dark:text-slate-100">{m.title}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">{m.description}</p>
                </div>
                <Badge riskLevel={m.severity} />
              </div>
              <div className="mt-3 p-3 rounded-xl bg-[#FAF9F5] dark:bg-[#0A0A0A] border border-[#E6E4DF] dark:border-[#27272A] text-xs">
                <span className="font-bold text-[#18181B] dark:text-slate-200 block mb-1">Suggested Addition Clause:</span>
                <span className="font-mono text-slate-700 dark:text-slate-300">&quot;{m.suggestedAddition}&quot;</span>
              </div>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'obligations' && (
        <Card className="space-y-3">
          {analysis.obligations.map((ob) => (
            <div key={ob.id} className="flex items-center justify-between p-3.5 rounded-xl bg-[#FAF9F5] dark:bg-[#1A1A1A] border border-[#E6E4DF] dark:border-[#27272A]">
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-700 dark:text-slate-300 bg-[#EFECE6] dark:bg-[#1C1C1C] px-2 py-0.5 rounded-md">{ob.party}</span>
                <p className="text-xs font-bold text-[#18181B] dark:text-slate-100 mt-1.5">{ob.description}</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-slate-500 block">{ob.dueDate || 'Ongoing'}</span>
                <Badge riskLevel={ob.risk} size="sm" />
              </div>
            </div>
          ))}
        </Card>
      )}

      {activeTab === 'recommendations' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {analysis.recommendations.map((rec) => (
            <Card key={rec.id} hoverLift className="space-y-2 border-l-4 border-l-[#18181B] dark:border-l-white">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{rec.category}</span>
              <h4 className="text-sm font-bold text-[#18181B] dark:text-slate-100">{rec.title}</h4>
              <p className="text-xs text-slate-500 font-medium">{rec.description}</p>
              <div className="pt-2 border-t border-[#E6E4DF] dark:border-[#27272A]">
                <span className="text-xs font-bold text-[#18181B] dark:text-slate-200 block">Recommended Action:</span>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 font-medium">{rec.actionItem}</p>
              </div>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'json' && (
        <Card className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-500" /> Backend JSON Response Inspector
              </CardTitle>
              <CardDescription>
                Raw JSON output returned by backend endpoint after receiving PDF file:
              </CardDescription>
            </div>
            <Button size="sm" variant="outline" leftIcon={<Copy className="w-3.5 h-3.5" />} onClick={copyJsonPayload}>
              Copy Raw JSON
            </Button>
          </div>

          <div className="p-4 rounded-2xl bg-[#0A0A0A] border border-[#27272A] font-mono text-xs text-emerald-400 overflow-x-auto max-h-[500px]">
            <pre>{JSON.stringify(analysis.rawBackendJson || analysis, null, 2)}</pre>
          </div>
        </Card>
      )}
    </div>
  );
}
