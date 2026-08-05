'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { RiskDistributionChart, MonthlyUploadChart } from '@/components/ui/Charts';
import { useDocStore } from '@/stores/docStore';
import { useAuthStore } from '@/stores/authStore';
import { FileText, Sparkles, AlertTriangle, ShieldCheck, Upload, ChevronRight, Eye, HelpCircle, Activity } from 'lucide-react';
import Link from 'next/link';
import { FileUploadModal } from '@/components/documents/FileUploadModal';

export default function DashboardPage() {
  const { documents, selectDocument } = useDocStore();
  const { user } = useAuthStore();
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  const totalDocs = documents.length;
  const highRiskCount = documents.filter((d) => d.riskScore === 'High').length;
  const averageRisk = totalDocs > 0
    ? Math.round(documents.reduce((acc, d) => acc + (d.riskNumerical || 50), 0) / totalDocs)
    : 0;

  const recentQuestions = [
    { question: 'What is our financial liability cap for data breaches?', contract: 'CloudScale SaaS Agreement', time: '10m ago' },
    { question: 'When is the non-renewal notice deadline?', contract: 'Apex Supply Master Contract', time: '1h ago' },
    { question: 'Does indemnification cover third-party IP claims?', contract: 'DataVault Vendor Agreement', time: '3h ago' },
  ];

  return (
    <div className="space-y-6">
      {/* Hero Welcome Card */}
      <Card className="p-8 border-[#E6E4DF] dark:border-[#27272A] bg-white dark:bg-[#141414]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#EFECE6] dark:bg-[#222222] text-[11px] font-bold text-[#18181B] dark:text-slate-200 uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Multi-Tenant AI Legal Hub</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold font-serif tracking-tight text-[#18181B] dark:text-slate-100">
              Welcome, {user?.name || 'Legal Counsel'}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
              Real-time contract risk analysis and multi-tenant document intelligence.
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

      {/* 4 Analytics Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Contracts */}
        <Card hoverLift className="flex flex-col justify-between p-6">
          <div className="flex items-start justify-between">
            <div className="p-2.5 rounded-xl bg-[#F0EEE8] dark:bg-[#222222] text-[#18181B] dark:text-slate-200">
              <FileText className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
              Total
            </span>
          </div>
          <div className="mt-6">
            <div className="text-4xl font-bold font-serif text-[#18181B] dark:text-slate-100">
              {totalDocs}
            </div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">
              Active User Contracts
            </p>
          </div>
        </Card>

        {/* Card 2: High Risk Contracts */}
        <Card hoverLift className="flex flex-col justify-between p-6">
          <div className="flex items-start justify-between">
            <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold tracking-widest text-rose-500 uppercase">
              Action Needed
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

        {/* Card 3: Average Risk Score */}
        <Card hoverLift className="flex flex-col justify-between p-6">
          <div className="flex items-start justify-between">
            <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400">
              <Activity className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold tracking-widest text-amber-500 uppercase">
              Average Risk
            </span>
          </div>
          <div className="mt-6">
            <div className="text-4xl font-bold font-serif text-[#18181B] dark:text-slate-100">
              {averageRisk}/100
            </div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">
              Portfolio Risk Index
            </p>
          </div>
        </Card>

        {/* Card 4: AI Analysis Status */}
        <Card hoverLift className="flex flex-col justify-between p-6">
          <div className="flex items-start justify-between">
            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold tracking-widest text-emerald-600 uppercase">
              Isolated
            </span>
          </div>
          <div className="mt-6">
            <div className="text-4xl font-bold font-serif text-[#18181B] dark:text-slate-100">
              100%
            </div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">
              Row Level Security Enforced
            </p>
          </div>
        </Card>
      </div>

      {/* Visual Risk Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Contract Risk Distribution</CardTitle>
            <CardDescription>Breakdown of portfolio risk levels across uploaded contracts</CardDescription>
          </CardHeader>
          <CardContent className="h-64">
            <RiskDistributionChart documents={documents} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Upload Telemetry</CardTitle>
            <CardDescription>Volume of user contract reviews over time</CardDescription>
          </CardHeader>
          <CardContent className="h-64">
            <MonthlyUploadChart />
          </CardContent>
        </Card>
      </div>

      {/* Recent Contracts & Recent AI Questions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Contracts */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent User Contracts</CardTitle>
              <CardDescription>Your uploaded legal documents</CardDescription>
            </div>
            <Link href="/documents">
              <Button variant="ghost" size="sm">
                View All <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {documents.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6">No contracts uploaded yet.</p>
            ) : (
              documents.slice(0, 4).map((doc) => (
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

        {/* Recent AI Questions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent AI Questions</CardTitle>
              <CardDescription>Bound questions asked across your contracts</CardDescription>
            </div>
            <Link href="/chat">
              <Button variant="ghost" size="sm">
                Open AI Chat <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentQuestions.map((q, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-[#FAF9F5] dark:bg-[#181818] border border-[#E6E4DF] dark:border-[#27272A] space-y-1.5"
              >
                <div className="flex items-center justify-between text-xs font-bold text-[#18181B] dark:text-slate-100">
                  <span className="flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                    {q.question}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">{q.time}</span>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  Bound Contract: <span className="font-semibold text-slate-700 dark:text-slate-300">{q.contract}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <FileUploadModal isOpen={uploadModalOpen} onClose={() => setUploadModalOpen(false)} />
    </div>
  );
}