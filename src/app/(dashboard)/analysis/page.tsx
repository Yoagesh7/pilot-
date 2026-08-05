'use client';

import React, { useState } from 'react';
import { useDocStore } from '@/stores/docStore';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Tabs } from '@/components/ui/Tabs';
import { Sparkles, FileText, CheckCircle2, Copy, Terminal, Upload, AlertCircle, AlertTriangle, ShieldCheck, Zap, Code } from 'lucide-react';
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
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-blue-600" /> AI Analysis Studio
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Deep clause extraction, automated redlining, & backend JSON inspector.
            </p>
          </div>
        </div>

        <Card className="p-12 text-center space-y-4 max-w-2xl mx-auto border-dashed border-2">
          <div className="w-16 h-16 rounded-3xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 mx-auto flex items-center justify-center">
            <Upload className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              No Document Analysis Active
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto leading-relaxed">
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
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-blue-600" /> AI Analysis Studio
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Deep clause extraction, automated redlining, & backend JSON inspector.
          </p>
        </div>

        {/* Contract Selector & New Document Button */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-slate-500">Active Contract:</label>
            <select
              value={selectedDoc.id}
              onChange={(e) => selectDocument(e.target.value)}
              className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-xs"
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
      <Card className="space-y-3 border-l-4 border-l-blue-600">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-600" /> Executive AI Summary
          </h3>
          <span className="text-[10px] text-slate-400 font-mono">ID: {selectedDoc.id}</span>
        </div>
        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800">
          {analysis.summary}
        </p>
      </Card>

      {/* Overview Metric Banner */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="flex flex-col justify-between">
          <span className="text-[11px] font-semibold text-slate-400 uppercase">AI Risk Index</span>
          <div className="flex items-center gap-2 my-1">
            <span className="text-2xl font-black text-slate-900 dark:text-slate-100">{analysis.riskNumerical}</span>
            <Badge riskLevel={analysis.risk_score} size="sm" />
          </div>
          <span className="text-[10px] text-slate-400">0 (Safe) to 100 (High Exposure)</span>
        </Card>

        <Card className="flex flex-col justify-between">
          <span className="text-[11px] font-semibold text-slate-400 uppercase">Extracted Clauses</span>
          <span className="text-2xl font-black text-slate-900 dark:text-slate-100 my-1">{analysis.key_clauses.length}</span>
          <span className="text-[10px] text-emerald-500 font-semibold">Parsed from Webhook Output</span>
        </Card>

        <Card className="flex flex-col justify-between">
          <span className="text-[11px] font-semibold text-slate-400 uppercase">Missing Clauses</span>
          <span className="text-2xl font-black text-amber-500 my-1">{analysis.missing_clauses.length}</span>
          <span className="text-[10px] text-amber-500 font-semibold">Recommended Additions</span>
        </Card>

        <Card className="flex flex-col justify-between">
          <span className="text-[11px] font-semibold text-slate-400 uppercase">Backend Response</span>
          <span className="text-xs font-extrabold text-emerald-500 my-2 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" /> Real Payload Active
          </span>
          <span className="text-[10px] text-slate-400">Processed at {analysis.webhookProcessedAt || 'Just now'}</span>
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
          {/* Key Clauses Breakdown (2 columns) */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Extracted Legal Clauses & Redlines
            </h3>
            {analysis.key_clauses.length === 0 ? (
              <Card className="p-8 text-center text-xs text-slate-500">
                No distinct key clauses detected in current payload.
              </Card>
            ) : (
              analysis.key_clauses.map((c) => (
                <Card key={c.id} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-[10px] font-bold">
                        {c.section}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{c.title}</h4>
                    </div>
                    <Badge riskLevel={c.riskLevel} size="sm" />
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 font-mono text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    &quot;{c.content}&quot;
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    <strong>Analysis:</strong> {c.summary}
                  </p>

                  {c.recommendation && (
                    <div className="p-3 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-200">
                      <strong className="text-emerald-700 dark:text-emerald-300 block mb-1">Recommended Redline:</strong>
                      {c.recommendation}
                    </div>
                  )}
                </Card>
              ))
            )}
          </div>

          {/* AI Strategic Recommendations Sidebar (1 column) */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Strategic AI Playbook
            </h3>
            {analysis.recommendations.length === 0 ? (
              <Card className="p-6 text-center text-xs text-slate-500">
                No strategic recommendations found in payload.
              </Card>
            ) : (
              analysis.recommendations.map((rec) => (
                <Card key={rec.id} className="space-y-2 border-l-4 border-l-blue-600">
                  <span className="text-[10px] font-bold uppercase text-blue-600">{rec.category}</span>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">{rec.title}</h4>
                  <p className="text-xs text-slate-500">{rec.description}</p>
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 font-medium">
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
            <Card className="p-8 text-center text-xs text-slate-500">
              No missing clauses flagged by AI for this document.
            </Card>
          ) : (
            analysis.missing_clauses.map((m) => (
              <Card key={m.id} className="border-l-4 border-l-amber-500 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{m.title}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{m.description}</p>
                  </div>
                  <Badge riskLevel={m.severity} />
                </div>
                <div className="mt-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs">
                  <span className="font-bold text-blue-600 block mb-1">Suggested Addition Clause:</span>
                  <span className="font-mono text-slate-700 dark:text-slate-300">&quot;{m.suggestedAddition}&quot;</span>
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      {activeTab === 'obligations' && (
        <Card className="space-y-3 max-w-4xl">
          {analysis.obligations.length === 0 ? (
            <p className="text-xs text-slate-500 py-4 text-center">No explicit party obligations extracted.</p>
          ) : (
            analysis.obligations.map((ob) => (
              <div key={ob.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <div>
                  <span className="text-[10px] font-bold uppercase text-blue-600 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded-full">{ob.party}</span>
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-1">{ob.description}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-slate-500 block">{ob.dueDate || 'Ongoing'}</span>
                  <Badge riskLevel={ob.risk} size="sm" />
                </div>
              </div>
            ))
          )}
        </Card>
      )}

      {activeTab === 'webhook' && (
        <Card className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-500" /> Backend JSON Response Schema
              </CardTitle>
              <CardDescription>Exact JSON payload returned from backend endpoint</CardDescription>
            </div>
            <Button size="sm" variant="outline" leftIcon={<Copy className="w-3.5 h-3.5" />} onClick={copyWebhookJson}>
              Copy JSON
            </Button>
          </div>

          <pre className="p-4 rounded-2xl bg-slate-950 text-emerald-400 text-xs font-mono overflow-x-auto max-h-96 border border-slate-800">
            {JSON.stringify(analysis.rawBackendJson || analysis, null, 2)}
          </pre>
        </Card>
      )}

      <FileUploadModal isOpen={uploadModalOpen} onClose={() => setUploadModalOpen(false)} />
    </div>
  );
}
