'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { DataTable, Column } from '@/components/ui/DataTable';
import { useDocStore } from '@/stores/docStore';
import { useAuthStore } from '@/stores/authStore';
import { Document, RiskLevel } from '@/types';
import { FileText, Search, Filter, Trash2, Eye, Upload, CheckCircle2, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { FileUploadModal } from '@/components/documents/FileUploadModal';

export default function DocumentsPage() {
  const { documents, selectedDocumentId, selectDocument, deleteDocument, loading } = useDocStore();
  const { user } = useAuthStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState<'All' | RiskLevel>('All');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('grid');
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  const filteredDocs = documents.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.parties.some((p) => p.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesRisk = riskFilter === 'All' || doc.riskScore === riskFilter;

    return matchesSearch && matchesRisk;
  });

  const handleDelete = async (docId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (confirm('Are you sure you want to delete this contract? This will remove its storage file and database entry.')) {
      await deleteDocument(docId, user?.id || '');
    }
  };

  const handleSelect = (docId: string) => {
    selectDocument(docId);
  };

  const columns: Column<Document>[] = [
    {
      key: 'title',
      header: 'Contract Document',
      render: (doc) => (
        <div
          onClick={() => handleSelect(doc.id)}
          className="flex items-center gap-3 cursor-pointer"
        >
          <div className={`p-2 rounded-xl text-[#18181B] dark:text-slate-200 ${selectedDocumentId === doc.id ? 'bg-[#18181B] text-white dark:bg-white dark:text-[#18181B]' : 'bg-[#EFECE6] dark:bg-[#1C1C1C]'}`}>
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <Link
              href={`/documents/${doc.id}`}
              className="text-xs font-bold text-[#18181B] dark:text-slate-100 hover:underline transition-colors"
            >
              {doc.title}
            </Link>
            <p className="text-[11px] text-slate-400 mt-0.5 font-medium">{doc.fileName}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (doc) => (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold border border-emerald-200/80 dark:border-emerald-800/60">
          <ShieldCheck className="w-3 h-3" />
          {doc.status || 'analyzed'}
        </span>
      ),
    },
    {
      key: 'riskScore',
      header: 'Risk Score',
      render: (doc) => (
        <div className="flex items-center gap-2">
          <Badge riskLevel={doc.riskScore} />
          <span className="text-[11px] font-bold text-slate-500">({doc.riskNumerical}/100)</span>
        </div>
      ),
    },
    {
      key: 'uploadDate',
      header: 'Upload Date',
      render: (doc) => (
        <span className="text-xs text-slate-500 font-medium">
          {doc.uploadDate}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (doc) => (
        <div className="flex items-center gap-2">
          <Link href={`/documents/${doc.id}`}>
            <Button
              onClick={() => handleSelect(doc.id)}
              variant="outline"
              size="sm"
              leftIcon={<Eye className="w-3.5 h-3.5" />}
            >
              Inspect
            </Button>
          </Link>
          <button
            onClick={(e) => handleDelete(doc.id, e)}
            className="p-2 rounded-xl text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-[#F0EEE8] dark:hover:bg-slate-800 transition-colors"
            title="Delete Contract"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-serif tracking-tight text-[#18181B] dark:text-slate-100">
            Document Repository
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Multi-Tenant isolated legal contract repository for <span className="font-bold text-[#18181B] dark:text-white">{user?.email || 'User'}</span>
          </p>
        </div>

        <Button
          onClick={() => setUploadModalOpen(true)}
          leftIcon={<Upload className="w-4 h-4" />}
        >
          Upload New Contract
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by title, file name, or party..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#FAF9F5] dark:bg-[#1A1A1A] border border-[#E2DFD6] dark:border-[#27272A] rounded-xl text-xs font-semibold text-[#18181B] dark:text-slate-100 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <span className="text-xs font-bold text-slate-500">Risk:</span>
              <select
                value={riskFilter}
                onChange={(e) => setRiskFilter(e.target.value as any)}
                className="px-3 py-2 rounded-xl bg-[#FAF9F5] dark:bg-[#1A1A1A] border border-[#E2DFD6] dark:border-[#27272A] text-xs font-bold text-[#18181B] dark:text-slate-100 focus:outline-none"
              >
                <option value="All">All Levels</option>
                <option value="High">High Risk Only</option>
                <option value="Medium">Medium Risk Only</option>
                <option value="Low">Low Risk Only</option>
              </select>
            </div>

            <div className="flex items-center gap-1 bg-[#FAF9F5] dark:bg-[#1A1A1A] p-1 rounded-xl border border-[#E2DFD6] dark:border-[#27272A]">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'grid'
                    ? 'bg-[#18181B] text-white dark:bg-white dark:text-[#18181B]'
                    : 'text-slate-500 hover:text-[#18181B] dark:hover:text-white'
                }`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'table'
                    ? 'bg-[#18181B] text-white dark:bg-white dark:text-[#18181B]'
                    : 'text-slate-500 hover:text-[#18181B] dark:hover:text-white'
                }`}
              >
                Table
              </button>
            </div>
          </div>
        </div>
      </Card>

      {/* Main Grid / Table Content */}
      {viewMode === 'table' ? (
        <DataTable data={filteredDocs} columns={columns} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocs.map((doc) => {
            const isSelected = selectedDocumentId === doc.id;

            return (
              <Card
                key={doc.id}
                onClick={() => handleSelect(doc.id)}
                className={`flex flex-col justify-between p-6 cursor-pointer transition-all border ${
                  isSelected
                    ? 'ring-2 ring-[#18181B] dark:ring-white border-transparent'
                    : 'border-[#E6E4DF] dark:border-[#27272A]'
                }`}
              >
                <div className="space-y-4">
                  {/* Top Bar */}
                  <div className="flex items-start justify-between">
                    <div className="p-3 rounded-2xl bg-[#FAF9F5] dark:bg-[#1C1C1C] text-[#18181B] dark:text-white border border-[#E2DFD6] dark:border-[#27272A]">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge riskLevel={doc.riskScore} />
                      <button
                        onClick={(e) => handleDelete(doc.id, e)}
                        className="p-2 rounded-xl text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-[#F0EEE8] dark:hover:bg-slate-800 transition-colors"
                        title="Delete Document"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Document Title & File Info */}
                  <div>
                    <h3 className="text-base font-bold font-serif text-[#18181B] dark:text-slate-100 line-clamp-1">
                      {doc.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
                      {doc.fileName}
                    </p>
                  </div>

                  {/* Summary */}
                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 font-medium leading-relaxed">
                    {doc.summary}
                  </p>
                </div>

                {/* Footer Metadata */}
                <div className="mt-6 pt-4 border-t border-[#E6E4DF] dark:border-[#27272A] flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Uploaded Date
                    </span>
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {doc.uploadDate}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold border border-emerald-200/80 dark:border-emerald-800/60">
                      <ShieldCheck className="w-3 h-3" />
                      {doc.status || 'analyzed'}
                    </span>
                    <Link href={`/documents/${doc.id}`}>
                      <Button
                        onClick={() => handleSelect(doc.id)}
                        variant="outline"
                        size="sm"
                        leftIcon={<Eye className="w-3.5 h-3.5" />}
                      >
                        Inspect
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <FileUploadModal isOpen={uploadModalOpen} onClose={() => setUploadModalOpen(false)} />
    </div>
  );
}
