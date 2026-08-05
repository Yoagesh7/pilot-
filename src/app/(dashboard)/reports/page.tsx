'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { DataTable, Column } from '@/components/ui/DataTable';
import { LegalReport } from '@/types';
import { BarChart3, Download, FileText, CheckCircle2, Sparkles, FileCheck, Upload } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import { useDocStore } from '@/stores/docStore';
import { FileUploadModal } from '@/components/documents/FileUploadModal';

export default function ReportsPage() {
  const { documents } = useDocStore();
  const [reports, setReports] = useState<LegalReport[]>([]);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const { showToast } = useToast();

  const handleGenerateReport = (type: LegalReport['type']) => {
    if (documents.length === 0) {
      showToast('No Documents Available', 'Please upload a PDF contract first before generating a report.', 'info');
      return;
    }

    const newRep: LegalReport = {
      id: `rep-${Date.now()}`,
      title: `${type} - ${new Date().toLocaleDateString()}`,
      type,
      generatedAt: new Date().toISOString(),
      documentIds: documents.map((d) => d.id),
      documentCount: documents.length,
      status: 'Ready',
      format: 'pdf',
    };

    setReports([newRep, ...reports]);
    showToast('Report Generated', `${type} generated successfully with ${documents.length} uploaded contract(s).`, 'success');
  };

  const handleDownload = (rep: LegalReport) => {
    showToast('Downloading Report', `Downloading ${rep.title} in ${rep.format.toUpperCase()} format.`, 'info');
  };

  const columns: Column<LegalReport>[] = [
    {
      key: 'title',
      header: 'Report Title',
      render: (rep) => (
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100">{rep.title}</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">{rep.type} • {rep.documentCount} Contracts Included</p>
          </div>
        </div>
      ),
    },
    {
      key: 'generatedAt',
      header: 'Generated Date',
      render: (rep) => (
        <span className="text-xs text-slate-500">
          {new Date(rep.generatedAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: () => (
        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
          <CheckCircle2 className="w-3.5 h-3.5" /> Ready
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Export',
      render: (rep) => (
        <Button
          size="sm"
          variant="outline"
          leftIcon={<Download className="w-3.5 h-3.5" />}
          onClick={() => handleDownload(rep)}
        >
          Download PDF
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
          Legal Risk & Compliance Reports
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Compile formal risk assessments, compliance audits, and contract summaries for executive review.
        </p>
      </div>

      {/* Instant Generator Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Risk Report */}
        <Card hoverLift className="flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 w-fit">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Contract Risk Assessment Report
            </h3>
            <p className="text-xs text-slate-500">
              Aggregates liability caps, uncapped indemnities, price escalation clauses, and legal exposures.
            </p>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={() => handleGenerateReport('Risk Report')}
            leftIcon={<Sparkles className="w-4 h-4" />}
          >
            Generate Risk Report
          </Button>
        </Card>

        {/* Compliance Report */}
        <Card hoverLift className="flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 w-fit">
              <FileCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              GDPR & Regulatory Compliance Report
            </h3>
            <p className="text-xs text-slate-500">
              Audits data privacy, CCPA warranties, SOC 2 Type II audit commitments, and regional regulations.
            </p>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={() => handleGenerateReport('Compliance Report')}
            leftIcon={<Sparkles className="w-4 h-4" />}
          >
            Generate Compliance Audit
          </Button>
        </Card>

        {/* Contract Summary */}
        <Card hoverLift className="flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 w-fit">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Executive Contract Briefing
            </h3>
            <p className="text-xs text-slate-500">
              Concise single-page executive overview summarizing contracting parties, effective dates, and SLA metrics.
            </p>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={() => handleGenerateReport('Contract Summary')}
            leftIcon={<Sparkles className="w-4 h-4" />}
          >
            Generate Executive Brief
          </Button>
        </Card>
      </div>

      {/* Generated Reports Table */}
      <Card className="space-y-4">
        <CardHeader>
          <CardTitle>Report Generation History</CardTitle>
          <CardDescription>Download compiled reports in PDF, Word, or Markdown</CardDescription>
        </CardHeader>
        {reports.length === 0 ? (
          <div className="py-10 text-center space-y-3">
            <BarChart3 className="w-10 h-10 text-slate-400 mx-auto" />
            <p className="text-xs text-slate-500">
              No reports generated yet. Click any button above to generate a report from your uploaded contracts.
            </p>
          </div>
        ) : (
          <DataTable columns={columns} data={reports} />
        )}
      </Card>

      <FileUploadModal isOpen={uploadModalOpen} onClose={() => setUploadModalOpen(false)} />
    </div>
  );
}
