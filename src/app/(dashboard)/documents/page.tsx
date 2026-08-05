'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { DataTable, Column } from '@/components/ui/DataTable';
import { useDocStore } from '@/stores/docStore';
import { Document, RiskLevel } from '@/types';
import { FileText, Search, Plus, Filter, Trash2, Eye, Upload } from 'lucide-react';
import Link from 'next/link';
import { FileUploadModal } from '@/components/documents/FileUploadModal';

export default function DocumentsPage() {
  const { documents, deleteDocument } = useDocStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState<'All' | RiskLevel>('All');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  const filteredDocs = documents.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.parties.some((p) => p.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesRisk = riskFilter === 'All' || doc.riskScore === riskFilter;

    return matchesSearch && matchesRisk;
  });

  const columns: Column<Document>[] = [
    {
      key: 'title',
      header: 'Contract Document',
      render: (doc) => (
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <Link
              href={`/documents/${doc.id}`}
              className="text-xs font-semibold text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              {doc.title}
            </Link>
            <p className="text-[11px] text-slate-400 mt-0.5">{doc.fileName} • {(doc.fileSize / (1024 * 1024)).toFixed(2)} MB</p>
          </div>
        </div>
      ),
    },
    {
      key: 'parties',
      header: 'Parties Involved',
      render: (doc) => (
        <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">
          {doc.parties.join(' vs ')}
        </span>
      ),
    },
    {
      key: 'riskScore',
      header: 'AI Risk Score',
      render: (doc) => (
        <div className="flex items-center gap-2">
          <Badge riskLevel={doc.riskScore} />
          <span className="text-[11px] font-bold text-slate-500">({doc.riskNumerical}/100)</span>
        </div>
      ),
    },
    {
      key: 'uploadDate',
      header: 'Uploaded On',
      render: (doc) => (
        <span className="text-xs text-slate-500">
          {new Date(doc.uploadDate).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (doc) => (
        <div className="flex items-center gap-2">
          <Link href={`/documents/${doc.id}`}>
            <Button variant="outline" size="sm" leftIcon={<Eye className="w-3.5 h-3.5" />}>
              Inspect
            </Button>
          </Link>
          <button
            onClick={() => deleteDocument(doc.id)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
            title="Delete Document"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
            Document Repository
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage, inspect, and analyze all ingested legal agreements.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => setUploadModalOpen(true)}
            size="sm"
            leftIcon={<Upload className="w-4 h-4" />}
          >
            Upload Contract PDF
          </Button>

          <div className="flex p-1 bg-slate-200/60 dark:bg-slate-800 rounded-xl">
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                viewMode === 'table' ? 'bg-white dark:bg-slate-900 shadow-xs' : 'text-slate-500'
              }`}
            >
              Table View
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-white dark:bg-slate-900 shadow-xs' : 'text-slate-500'
              }`}
            >
              Grid View
            </button>
          </div>
        </div>
      </div>

      {documents.length === 0 ? (
        <Card className="p-12 text-center space-y-4 max-w-2xl mx-auto border-dashed border-2">
          <div className="w-16 h-16 rounded-3xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 mx-auto flex items-center justify-center">
            <FileText className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              No Legal Contracts Uploaded Yet
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto leading-relaxed">
              Upload a PDF contract file to send it to the backend endpoint. Real extracted clauses, risk analysis, and obligations will appear in your repository.
            </p>
          </div>
          <Button
            onClick={() => setUploadModalOpen(true)}
            leftIcon={<Upload className="w-4 h-4" />}
            className="mt-2"
          >
            Upload Contract PDF
          </Button>
        </Card>
      ) : (
        <>
          {/* Filter and Search Bar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            {/* Search */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search documents or parties..."
                className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>

            {/* Risk Pills */}
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
              <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" /> Filter:
              </span>
              {(['All', 'High', 'Medium', 'Low'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setRiskFilter(r)}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                    riskFilter === r
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Main Content: Table or Grid */}
          {viewMode === 'table' ? (
            <DataTable columns={columns} data={filteredDocs} emptyMessage="No contracts match your search filter." />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDocs.map((doc) => (
                <Card key={doc.id} hoverLift className="flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="p-2.5 rounded-2xl bg-blue-50 dark:bg-blue-950 text-blue-600">
                        <FileText className="w-6 h-6" />
                      </div>
                      <Badge riskLevel={doc.riskScore} />
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-snug">
                        {doc.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">{doc.summary}</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400 font-medium">
                      {doc.clausesCount} Clauses • {doc.obligationsCount} Obligations
                    </span>
                    <Link href={`/documents/${doc.id}`}>
                      <Button size="sm" variant="outline" leftIcon={<Eye className="w-3.5 h-3.5" />}>
                        Details
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      <FileUploadModal isOpen={uploadModalOpen} onClose={() => setUploadModalOpen(false)} />
    </div>
  );
}
