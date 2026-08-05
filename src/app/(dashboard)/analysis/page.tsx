'use client';

import React, { useState } from 'react';
import { useDocStore } from '@/stores/docStore';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Tabs } from '@/components/ui/Tabs';
import { Sparkles, FileText, CheckCircle2, Copy, Terminal, Upload, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import { FileUploadModal } from '@/components/documents/FileUploadModal';

export default function AnalysisPage() {
  const { documents, selectedDocumentId, selectDocument, getAnalysis } = useDocStore();
  const { showToast } = useToast();
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  const selectedDoc = documents.find((d) => d.id === selectedDocumentId) || documents[0];
  const analysis = selectedDoc ? getAnalysis(selectedDoc.id) : undefined;

  const [activeTab, setActiveTab] = useState('insights');

  const copyWebhookJson = () => {
    if (!analysis) return;
    const payload = analysis.rawBackendJson || analysis;
    navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
    showToast('JSON Copied', 'Backend JSON output copied to clipboard.', 'info');
  };

  if (documents.length === 0 || !selectedDoc || !analysis) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold font-serif tracking-tight text-[#18181B] dark:text-slate-100 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-[#18181B] dark:text-white" /> AI Analysis Studio
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
              Deep clause extraction, automated redlining, & backend JSON inspector.
            </p>
          </div>
        </div>

        <Card className="p-12 text-center space-y-4 max-w-2xl mx-auto border-dashed border-2 border-[#D6D3CC]">
          <div className="w-16 h-16 rounded-2xl bg-[#EFECE6] dark:bg-[#20222B] text-[#18181B] dark:text-slate-200 mx-auto flex items-center justify-center">
            <Upload className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-xl font-bold font-serif text-[#18181B] dark:text-slate-100">
              No Document Analysis Active
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto leading-relaxed font-medium">
              Upload a PDF contract or paste raw Webhook AI JSON output to render real dynamic legal analysis in the UI.
            </p>
          </div>
          <Button
            onClick={() => setUploadModalOpen(true)}
            leftIcon={<Upload className="w-4 h-4" />}
            className="mt-2"
          >
            Upload PDF or Paste AI JSON
          </Button>
        </Card>

        <FileUploadModal isOpen={uploadModalOpen} onClose={() => setUploadModalOpen(false)} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-serif tracking-tight text-[#18181B] dark:text-slate-100 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-[#18181B] dark:text-white" /> AI Analysis Studio
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Deep clause extraction, automated redlining, & backend JSON inspector.
          </p>
        </div>

        {/* Contract Selector & New Document Button */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-slate-500">Active Contract:</label>
            <select
              value={selectedDoc.id}
              onChange={(e) => selectDocument(e.target.value)}
              className="px-3.5 py-2 rounded-xl bg-white dark:bg-[#16171D] border border-[#E6E4DF] dark:border-[#252732] text-xs font-bold text-[#18181B] dark:text-slate-100 focus:outline-none shadow-2xs"
            >
              {documents.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.title} ({d.riskScore} Risk)
                </option>
              ))}
            </select>
          </div>

          <Button
            onClick={() => setUploadModalOpen(true)}
            size="sm"
            leftIcon={<Upload className="w-3.5 h-3.5" />}
          >
            Add Document / JSON
          </Button>
        </div>
      </div>

      {/* Executive Summary Card */}
      <Card className="space-y-3 border-l-4 border-l-[#18181B] dark:border-l-white">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold font-serif text-[#18181B] dark:text-slate-100 flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#18181B] dark:text-white" /> Executive AI Summary
          </h3>
          <span className="text-[10px] text-slate-400 font-mono">ID: {selectedDoc.id}</span>
        </div>
        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-[#FAF9F5] dark:bg-[#181920] p-4 rounded-xl border border-[#E6E4DF] dark:border-[#252732] font-medium">
          {analysis.summary}
        </p>
      </Card>

      {/* Overview Metric Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="flex flex-col justify-between p-5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">AI Risk Index</span>
          <div className="flex items-center gap-2 my-2">
            <span className="text-3xl font-bold font-serif text-[#18181B] dark:text-slate-100">{analysis.riskNumerical}</span>
            <Badge riskLevel={analysis.risk_score} size="sm" />
          </div>
          <span className="text-[10px] text-slate-500 font-medium">0 (Safe) to 100 (High Exposure)</span>
        </Card>

        <Card className="flex flex-col justify-between p-5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Extracted Clauses</span>
          <span className="text-3xl font-bold font-serif text-[#18181B] dark:text-slate-100 my-2">{analysis.key_clauses.length}</span>
          <span className="text-[10px] text-emerald-600 font-bold">Parsed from Webhook Output</span>
        </Card>

        <Card className="flex flex-col justify-between p-5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Missing Clauses</span>
          <span className="text-3xl font-bold font-serif text-[#18181B] dark:text-slate-100 my-2">{analysis.missing_clauses.length}</span>
          <span className="text-[10px] text-slate-500 font-medium">Recommended Additions</span>
        </Card>

        <Card className="flex flex-col justify-between p-5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Backend Response</span>
          <span className="text-xs font-bold text-[#18181B] dark:text-slate-100 my-2 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Real Payload Active
          </span>
          <span className="text-[10px] text-slate-500 font-medium">Processed at {analysis.webhookProcessedAt || 'Just now'}</span>
        </Card>
      </div>

      {/* Studio Tabs */}
      <Tabs
        tabs={[
          { id: 'insights', label: `Extracted Clauses (${analysis.key_clauses.length})`, icon: <Sparkles className="w-4 h-4" /> },
          { id: 'missing', label: `Missing Provisions (${analysis.missing_clauses.length})`, icon: <AlertTriangle className="w-4 h-4" /> },
          { id: 'obligations', label: `Obligations (${analysis.obligations.length})`, icon: <ShieldCheck className="w-4 h-4" /> },
          { id: 'webhook', label: 'Backend Raw JSON Output', icon: <Terminal className="w-4 h-4" /> },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
        variant="underline"
      />

      {activeTab === 'insights' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Key Clauses Breakdown */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-lg font-bold font-serif text-[#18181B] dark:text-slate-100">
              Extracted Legal Clauses & Redlines
            </h3>
            {analysis.key_clauses.length === 0 ? (
              <Card className="p-8 text-center text-xs text-slate-500 font-medium">
                No distinct key clauses detected in current payload.
              </Card>
            ) : (
              analysis.key_clauses.map((c) => (
                <Card key={c.id} className="space-y-3 p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-[#EFECE6] dark:bg-[#20222C] text-[#18181B] dark:text-slate-200 text-[10px] font-bold">
                        {c.section}
                      </span>
                      <h4 className="text-sm font-bold text-[#18181B] dark:text-slate-100">{c.title}</h4>
                    </div>
                    <Badge riskLevel={c.riskLevel} size="sm" />
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#FAF9F5] dark:bg-[#121318] font-mono text-xs text-slate-700 dark:text-slate-300 leading-relaxed border border-[#E6E4DF] dark:border-[#252732]">
                    &quot;{c.content}&quot;
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                    <strong>Analysis:</strong> {c.summary}
                  </p>

                  {c.recommendation && (
                    <div className="p-3.5 rounded-xl bg-[#F4F2EC] dark:bg-[#1A1C25] border border-[#E2DFD6] dark:border-[#272936] text-xs text-slate-800 dark:text-slate-200 font-medium">
                      <strong className="text-[#18181B] dark:text-slate-100 block mb-1">Recommended Redline:</strong>
                      {c.recommendation}
                    </div>
                  )}
                </Card>
              ))
            )}
          </div>

          {/* AI Strategic Recommendations Sidebar */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold font-serif text-[#18181B] dark:text-slate-100">
              Strategic AI Playbook
            </h3>
            {analysis.recommendations.length === 0 ? (
              <Card className="p-6 text-center text-xs text-slate-500 font-medium">
                No strategic recommendations found in payload.
              </Card>
            ) : (
              analysis.recommendations.map((rec) => (
                <Card key={rec.id} className="space-y-2 p-5 border-l-4 border-l-[#18181B] dark:border-l-white">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{rec.category}</span>
                  <h4 className="text-xs font-bold text-[#18181B] dark:text-slate-100">{rec.title}</h4>
                  <p className="text-xs text-slate-500 font-medium">{rec.description}</p>
                  <div className="pt-2 border-t border-[#E6E4DF] dark:border-[#252732] text-xs text-[#18181B] dark:text-slate-200 font-semibold">
                    👉 {rec.actionItem}
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === 'missing' && (
        <div className="space-y-4 max-w-4xl">
          {analysis.missing_clauses.length === 0 ? (
            <Card className="p-8 text-center text-xs text-slate-500 font-medium">
              No missing clauses flagged by AI for this document.
            </Card>
          ) : (
            analysis.missing_clauses.map((m) => (
              <Card key={m.id} className="border-l-4 border-l-amber-500 space-y-2 p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-[#18181B] dark:text-slate-100">{m.title}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">{m.description}</p>
                  </div>
                  <Badge riskLevel={m.severity} />
                </div>
                <div className="mt-3 p-3.5 rounded-xl bg-[#FAF9F5] dark:bg-[#121318] border border-[#E6E4DF] dark:border-[#252732] text-xs">
                  <span className="font-bold text-[#18181B] dark:text-slate-200 block mb-1">Suggested Addition Clause:</span>
                  <span className="font-mono text-slate-700 dark:text-slate-300">&quot;{m.suggestedAddition}&quot;</span>
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      {activeTab === 'obligations' && (
        <Card className="space-y-3 max-w-4xl p-5">
          {analysis.obligations.length === 0 ? (
            <p className="text-xs text-slate-500 py-4 text-center font-medium">No explicit party obligations extracted.</p>
          ) : (
            analysis.obligations.map((ob) => (
              <div key={ob.id} className="flex items-center justify-between p-3.5 rounded-xl bg-[#FAF9F5] dark:bg-[#14151B] border border-[#E6E4DF] dark:border-[#252732]">
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-700 dark:text-slate-300 bg-[#EFECE6] dark:bg-[#20222B] px-2 py-0.5 rounded-md">{ob.party}</span>
                  <p className="text-xs font-bold text-[#18181B] dark:text-slate-100 mt-1.5">{ob.description}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-slate-500 block mb-1">{ob.dueDate || 'Ongoing'}</span>
                  <Badge riskLevel={ob.risk} size="sm" />
                </div>
              </div>
            ))
          )}
        </Card>
      )}

      {activeTab === 'webhook' && (
        <Card className="space-y-4 p-5">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-500" /> Backend JSON Response Schema
              </CardTitle>
              <CardDescription>Exact JSON payload returned from backend endpoint</CardDescription>
            </div>
            <Button size="sm" variant="outline" leftIcon={<Copy className="w-3.5 h-3.5" />} onClick={copyWebhookJson}>
              Copy JSON
            </Button>
          </div>

          <pre className="p-4 rounded-2xl bg-[#121318] text-emerald-400 text-xs font-mono overflow-x-auto max-h-96 border border-[#2B2D3C]">
            {JSON.stringify(analysis.rawBackendJson || analysis, null, 2)}
          </pre>
        </Card>
      )}

      <FileUploadModal isOpen={uploadModalOpen} onClose={() => setUploadModalOpen(false)} />
    </div>
  );
}
