'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { RiskDistributionChart, MonthlyUploadChart } from '@/components/ui/Charts';
import { useDocStore } from '@/stores/docStore';
import { FileText, Sparkles, AlertTriangle, ShieldCheck, Upload, ChevronRight, Eye } from 'lucide-react';
import Link from 'next/link';
import { FileUploadModal } from '@/components/documents/FileUploadModal';

export default function DashboardPage() {
  const { documents, selectDocument } = useDocStore();
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  const totalDocs = documents.length;
  const highRiskCount = documents.filter((d) => d.riskScore === 'High').length;
  const pendingReviewsCount = documents.filter((d) => d.riskScore === 'High' || d.riskScore === 'Medium').length;
  const totalAnalyses = totalDocs;

  return (
    <div className="space-y-6">
      {/* Hero Card */}
      <Card className="p-8 border-[#E6E4DF] dark:border-[#27272A] bg-white dark:bg-[#141414]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#EFECE6] dark:bg-[#222222] text-[11px] font-bold text-[#18181B] dark:text-slate-200 uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Legal Workspace</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold font-serif tracking-tight text-[#18181B] dark:text-slate-100">
              Legal Document Intelligence
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
              Real-time contract analysis powered by backend API endpoints & JSON outputs.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Button
              onClick={() => setUploadModalOpen(true)}
              variant="primary"
              leftIcon={<Upload className="w-4 h-4" />}
            >
              Upload Contract PDF
            </Button>
            <Link href="/documents">
              <Button variant="outline">
                View Repository
              </Button>
            </Link>
          </div>
        </div>
      </Card>

      {/* 4 Analytics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Docs */}
        <Card hoverLift className="flex flex-col justify-between p-6">
          <div className="flex items-start justify-between">
            <div className="p-2.5 rounded-xl bg-[#F0EEE8] dark:bg-[#222222] text-[#18181B] dark:text-slate-200">
              <FileText className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
              Real Data
            </span>
          </div>
          <div className="mt-6">
            <div className="text-4xl font-bold font-serif text-[#18181B] dark:text-slate-100">
              {totalDocs}
            </div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">
              Total Documents Uploaded
            </p>
          </div>
        </Card>

        {/* Card 2: AI Analyses */}
        <Card hoverLift className="flex flex-col justify-between p-6">
          <div className="flex items-start justify-between">
            <div className="p-2.5 rounded-xl bg-[#F0EEE8] dark:bg-[#222222] text-[#18181B] dark:text-slate-200">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
              Real Data
            </span>
          </div>
          <div className="mt-6">
            <div className="text-4xl font-bold font-serif text-[#18181B] dark:text-slate-100">
              {totalAnalyses}
            </div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">
              Backend JSON Runs
            </p>
          </div>
        </Card>

        {/* Card 3: Flagged for Review */}
        <Card hoverLift className="flex flex-col justify-between p-6">
          <div className="flex items-start justify-between">
            <div className="p-2.5 rounded-xl bg-[#F0EEE8] dark:bg-[#222222] text-[#18181B] dark:text-slate-200">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
              Action Items
            </span>
          </div>
          <div className="mt-6">
            <div className="text-4xl font-bold font-serif text-[#18181B] dark:text-slate-100">
              {pendingReviewsCount}
            </div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">
              Flagged for Review
            </p>
          </div>
        </Card>

        {/* Card 4: High Risk Contracts */}
        <Card hoverLift className="flex flex-col justify-between p-6">
          <div className="flex items-start justify-between">
            <div className="p-2.5 rounded-xl bg-[#F0EEE8] dark:bg-[#222222] text-[#18181B] dark:text-slate-200">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
              Critical
            </span>
          </div>
          <div className="mt-6">
            <div className="text-4xl font-bold font-serif text-[#18181B] dark:text-slate-100">
              {highRiskCount}
            </div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">
              High Risk Contracts
            </p>
          </div>
        </Card>
      </div>

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Distribution Chart */}
        <Card className="p-6">
          <CardHeader className="pb-2">
            <CardTitle>Contract Risk Portfolio Breakdown</CardTitle>
            <CardDescription>Aggregate clause risk index across active agreements</CardDescription>
          </CardHeader>
          <CardContent>
            <RiskDistributionChart />
          </CardContent>
        </Card>

        {/* Upload Activity Chart */}
        <Card className="p-6">
          <CardHeader className="pb-2">
            <CardTitle>Monthly Document Ingestion Volume</CardTitle>
            <CardDescription>Processed via backend PDF endpoint pipeline</CardDescription>
          </CardHeader>
          <CardContent>
            <MonthlyUploadChart />
          </CardContent>
        </Card>
      </div>

      {/* Recent Documents Table Section */}
      <Card className="p-6">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <div>
            <CardTitle>Recent Analyzed Contracts</CardTitle>
            <CardDescription>Latest contract files processed by backend AI endpoint</CardDescription>
          </div>
          <Link href="/documents">
            <Button variant="ghost" size="sm" className="gap-1 text-xs font-bold">
              <span>View All Documents</span>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="space-y-3">
          {totalDocs === 0 ? (
            <div className="py-8 text-center space-y-3">
              <FileText className="w-10 h-10 text-slate-400 mx-auto" />
              <p className="text-xs text-slate-500 font-medium">
                No contracts analyzed yet. Upload a PDF contract to process & extract clauses.
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
            documents.slice(0, 5).map((doc) => (
              <div
                key={doc.id}
                onClick={() => selectDocument(doc.id)}
                className="flex items-center justify-between p-4 rounded-xl bg-[#FAF9F5] dark:bg-[#181818] hover:bg-[#F2EFF7] dark:hover:bg-[#222222] transition-colors border border-[#E6E4DF] dark:border-[#27272A] cursor-pointer"
              >
                <div className="flex items-center gap-3.5">
                  <div className="p-2.5 rounded-lg bg-[#EFECE6] dark:bg-[#222222] text-[#18181B] dark:text-slate-200">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#18181B] dark:text-slate-100">
                      {doc.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                      {doc.parties.join(' • ')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Badge riskLevel={doc.riskScore} size="sm" />
                  <Link href={`/documents/${doc.id}`}>
                    <Button variant="outline" size="icon" className="w-8 h-8 rounded-lg">
                      <Eye className="w-4 h-4 text-slate-600" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <FileUploadModal isOpen={uploadModalOpen} onClose={() => setUploadModalOpen(false)} />
    </div>
  );
}
