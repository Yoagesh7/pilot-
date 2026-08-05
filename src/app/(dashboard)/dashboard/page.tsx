'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { RiskDistributionChart, MonthlyUploadChart } from '@/components/ui/Charts';
import { Timeline, TimelineItem } from '@/components/ui/Timeline';
import { useDocStore } from '@/stores/docStore';
import { FileText, Sparkles, AlertTriangle, ShieldCheck, Upload, ArrowUpRight, ChevronRight, Eye } from 'lucide-react';
import Link from 'next/link';
import { FileUploadModal } from '@/components/documents/FileUploadModal';

export default function DashboardPage() {
  const { documents, selectDocument } = useDocStore();
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  const totalDocs = documents.length;
  const highRiskCount = documents.filter((d) => d.riskScore === 'High').length;
  const pendingReviewsCount = documents.filter((d) => d.riskScore === 'High' || d.riskScore === 'Medium').length;
  const totalAnalyses = totalDocs;

  const activityTimeline: TimelineItem[] = totalDocs === 0 ? [
    {
      id: 'act-0',
      title: 'Backend Pipeline Ready',
      description: 'Waiting for contract PDF upload to run real AI legal extraction & return JSON response.',
      timestamp: 'Now',
      type: 'upload',
    }
  ] : documents.map((doc, idx) => ({
    id: `act-${doc.id}`,
    title: `Backend Analysis Completed: ${doc.title}`,
    description: `Extracted ${doc.clausesCount} clauses and ${doc.obligationsCount} obligations. Risk rating: ${doc.riskScore}.`,
    timestamp: `${idx + 1}m ago`,
    type: doc.riskScore === 'High' ? 'risk' : 'analysis',
  }));

  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 text-white shadow-xl shadow-blue-500/15 relative overflow-hidden">
        <div className="relative z-10 space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-xs font-medium backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Legal Workspace</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Legal Document Intelligence
          </h1>
          <p className="text-xs sm:text-sm text-blue-100/90 max-w-xl">
            Real-time contract analysis powered by backend API endpoints & JSON outputs.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <Button
            onClick={() => setUploadModalOpen(true)}
            variant="glass"
            className="text-xs"
            leftIcon={<Upload className="w-4 h-4" />}
          >
            Upload Contract PDF
          </Button>
          <Link href="/documents">
            <Button variant="outline" className="text-xs text-white border-white/30 hover:bg-white/10">
              View Repository
            </Button>
          </Link>
        </div>
      </div>

      {/* Analytics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Docs */}
        <Card hoverLift>
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <FileText className="w-6 h-6" />
            </div>
            <span className="flex items-center text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              Real Data
            </span>
          </div>
          <div className="mt-4">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">{totalDocs}</span>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Documents Uploaded</p>
          </div>
        </Card>

        {/* AI Analyses */}
        <Card hoverLift>
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <Sparkles className="w-6 h-6" />
            </div>
            <span className="flex items-center text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              Real Data
            </span>
          </div>
          <div className="mt-4">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">{totalAnalyses}</span>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Backend JSON Runs</p>
          </div>
        </Card>

        {/* Pending Reviews */}
        <Card hoverLift>
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">Action Items</span>
          </div>
          <div className="mt-4">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">{pendingReviewsCount}</span>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Flagged for Review</p>
          </div>
        </Card>

        {/* High Risk Contracts */}
        <Card hoverLift>
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold text-rose-600 dark:text-rose-400">Critical</span>
          </div>
          <div className="mt-4">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">{highRiskCount}</span>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">High Risk Contracts</p>
          </div>
        </Card>
      </div>

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Distribution Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Contract Risk Portfolio Breakdown</CardTitle>
            <CardDescription>Aggregate clause risk index across active agreements</CardDescription>
          </CardHeader>
          <CardContent>
            <RiskDistributionChart />
          </CardContent>
        </Card>

        {/* Upload Activity Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Document Ingestion Volume</CardTitle>
            <CardDescription>Processed via backend PDF endpoint pipeline</CardDescription>
          </CardHeader>
          <CardContent>
            <MonthlyUploadChart />
          </CardContent>
        </Card>
      </div>

      {/* Recent Documents Table & Activity Timeline Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Documents (2 columns) */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Analyzed Contracts</CardTitle>
              <CardDescription>Latest files ingested into LEGALOS</CardDescription>
            </div>
            <Link href="/documents">
              <Button variant="ghost" size="sm" className="gap-1 text-xs">
                <span>View All</span>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {totalDocs === 0 ? (
              <div className="py-10 text-center space-y-3">
                <FileText className="w-10 h-10 text-slate-400 mx-auto" />
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  No contracts analyzed yet. Upload a PDF file to process and display real output.
                </p>
                <Button
                  onClick={() => setUploadModalOpen(true)}
                  size="sm"
                  leftIcon={<Upload className="w-4 h-4" />}
                >
                  Upload Contract PDF
                </Button>
              </div>
            ) : (
              documents.slice(0, 4).map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => selectDocument(doc.id)}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-100 dark:border-slate-800/60 cursor-pointer"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="p-2.5 rounded-xl bg-blue-100/70 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                        {doc.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {doc.parties.join(' • ')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge riskLevel={doc.riskScore} size="sm" />
                    <Link href={`/documents/${doc.id}`}>
                      <Button variant="outline" size="icon" className="w-8 h-8 rounded-xl">
                        <Eye className="w-4 h-4 text-slate-500" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Activity Timeline (1 column) */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity Stream</CardTitle>
            <CardDescription>Audit trail of AI actions & backend events</CardDescription>
          </CardHeader>
          <CardContent>
            <Timeline items={activityTimeline} />
          </CardContent>
        </Card>
      </div>

      <FileUploadModal isOpen={uploadModalOpen} onClose={() => setUploadModalOpen(false)} />
    </div>
  );
}
