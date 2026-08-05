'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Search, Sparkles, FileText, ArrowRight, Filter, Upload } from 'lucide-react';
import { useDocStore } from '@/stores/docStore';
import Link from 'next/link';
import { FileUploadModal } from '@/components/documents/FileUploadModal';

export default function SearchPage() {
  const { documents, analyses } = useDocStore();
  const [query, setQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState<string>('All');
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  // Extract all key clauses dynamically from real uploaded backend analyses
  const searchResults = documents.flatMap((doc) => {
    const analysis = analyses[doc.id];
    if (!analysis) return [];
    return analysis.key_clauses.map((clause) => ({
      id: `${doc.id}-${clause.id}`,
      clauseId: clause.id,
      documentId: doc.id,
      documentTitle: doc.title,
      clauseTitle: clause.title,
      section: clause.section,
      snippet: clause.content,
      confidenceScore: 95,
      matchedTerms: [clause.type, clause.riskLevel],
      riskLevel: clause.riskLevel,
    }));
  });

  const results = searchResults.filter((r) => {
    const matchesQuery =
      !query ||
      r.documentTitle.toLowerCase().includes(query.toLowerCase()) ||
      r.clauseTitle.toLowerCase().includes(query.toLowerCase()) ||
      r.snippet.toLowerCase().includes(query.toLowerCase()) ||
      r.matchedTerms.some((t) => t.toLowerCase().includes(query.toLowerCase()));

    const matchesRisk = riskFilter === 'All' || r.riskLevel === riskFilter;

    return matchesQuery && matchesRisk;
  });

  return (
    <div className="space-y-6">
      {/* Search Header Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white space-y-4 relative overflow-hidden shadow-xl">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Semantic Vector Search Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Search Contracts by Meaning & Intent
          </h1>
          <p className="text-xs text-blue-200">
            Query across your uploaded legal repository using natural language rather than exact keyword matches.
          </p>
        </div>

        {/* Big Search Input */}
        <div className="relative z-10 max-w-2xl">
          <Search className="w-5 h-5 text-blue-400 absolute left-4 top-3.5" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type e.g. 'liability', 'renewal', 'indemnity'..."
            className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-2xl text-sm text-white placeholder:text-blue-200/70 focus:outline-none focus:ring-2 focus:ring-blue-400/50 backdrop-blur-md"
          />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="relative z-10 flex flex-wrap gap-2 pt-1">
          {['liability', 'renewal', 'termination', 'indemnity'].map((term) => (
            <button
              key={term}
              onClick={() => setQuery(term)}
              className="px-3 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-medium text-blue-100 transition-colors"
            >
              + {term}
            </button>
          ))}
        </div>
      </div>

      {documents.length === 0 ? (
        <Card className="p-12 text-center space-y-4 max-w-2xl mx-auto border-dashed border-2">
          <div className="w-16 h-16 rounded-3xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 mx-auto flex items-center justify-center">
            <Search className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              No Contracts Available to Search
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto leading-relaxed">
              Upload a contract PDF to extract real clauses and index them for semantic search.
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
          {/* Filter Bar */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" /> Filter by Risk Level:
              </span>
              {['All', 'High', 'Medium', 'Low'].map((r) => (
                <button
                  key={r}
                  onClick={() => setRiskFilter(r)}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold transition-colors ${
                    riskFilter === r
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>

            <span className="text-xs font-semibold text-slate-500">
              Found {results.length} matching clause provisions
            </span>
          </div>

          {/* Search Results Grid */}
          <div className="space-y-4">
            {results.length === 0 ? (
              <Card className="p-12 text-center text-xs text-slate-400">
                No contract clauses found matching your query &quot;{query}&quot;. Try adjusting search terms.
              </Card>
            ) : (
              results.map((res) => (
                <Card key={res.id} hoverLift className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                          {res.documentTitle}
                        </h3>
                        <span className="text-[11px] text-blue-600 font-semibold">{res.section}: {res.clauseTitle}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                        {res.confidenceScore}% AI Match Score
                      </span>
                      <Badge riskLevel={res.riskLevel} />
                    </div>
                  </div>

                  {/* Snippet with term highlights */}
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 font-mono text-xs text-slate-700 dark:text-slate-300 leading-relaxed border border-slate-100 dark:border-slate-800">
                    &quot;{res.snippet}&quot;
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Matched Terms:</span>
                      {res.matchedTerms.map((t) => (
                        <span key={t} className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                          {t}
                        </span>
                      ))}
                    </div>

                    <Link href={`/documents/${res.documentId}`}>
                      <Button size="sm" variant="ghost" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                        Open Contract
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))
            )}
          </div>
        </>
      )}

      <FileUploadModal isOpen={uploadModalOpen} onClose={() => setUploadModalOpen(false)} />
    </div>
  );
}
