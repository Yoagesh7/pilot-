'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Search, Sparkles, FileText } from 'lucide-react';
import { INITIAL_SEARCH_RESULTS } from '@/utils/mockData';
import { Badge } from '@/components/ui/Badge';
import Link from 'next/link';

interface CommandPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandPaletteModal: React.FC<CommandPaletteModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [query, setQuery] = useState('');

  const filtered = INITIAL_SEARCH_RESULTS.filter(
    (res) =>
      res.documentTitle.toLowerCase().includes(query.toLowerCase()) ||
      res.clauseTitle.toLowerCase().includes(query.toLowerCase()) ||
      res.snippet.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="xl">
      <div className="space-y-4">
        {/* Input bar */}
        <div className="relative flex items-center border-b border-[#E6E4DF] dark:border-[#27272A] pb-3">
          <Search className="w-5 h-5 text-[#18181B] dark:text-slate-200 absolute left-2" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search contracts or ask AI e.g. 'Show contracts with automatic renewal'..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-transparent border-none focus:outline-none text-[#18181B] dark:text-slate-100 placeholder:text-slate-400 font-semibold"
          />
        </div>

        {/* Suggested Prompts */}
        {!query && (
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Suggested AI Searches
            </span>
            <div className="flex flex-wrap gap-2">
              {[
                'Contracts with automatic renewal',
                'Uncapped data breach liability',
                '30-day termination notice clauses',
                'IP assignment & AI training rights',
              ].map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => setQuery(prompt)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#EFECE6] dark:bg-[#1C1C1C] hover:bg-[#E7E4DC] dark:hover:bg-[#27272A] text-xs text-slate-700 dark:text-slate-300 font-medium transition-colors border border-[#E2DFD6] dark:border-[#27272A]"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#18181B] dark:text-slate-300" />
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        <div className="space-y-2 max-h-72 overflow-y-auto pt-2">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              No matching legal clauses found for &quot;{query}&quot;
            </div>
          ) : (
            filtered.map((res) => (
              <Link
                key={res.id}
                href={`/documents/${res.documentId}`}
                onClick={onClose}
                className="group flex items-start justify-between p-3 rounded-xl hover:bg-[#FAF9F5] dark:hover:bg-[#1C1C1C] transition-colors border border-transparent hover:border-[#E6E4DF] dark:hover:border-[#27272A]"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-[#EFECE6] dark:bg-[#1C1C1C] text-[#18181B] dark:text-slate-200 mt-0.5 border border-[#E2DFD6] dark:border-[#27272A]">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-[#18181B] dark:text-slate-100 flex items-center gap-2">
                      {res.documentTitle}
                      <span className="text-[10px] text-slate-400 font-normal">({res.section})</span>
                    </h5>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                      &quot;{res.snippet}&quot;
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1 shrink-0 ml-3">
                  <Badge riskLevel={res.riskLevel} size="sm" />
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                    {res.confidenceScore}% Match
                  </span>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </Modal>
  );
};
