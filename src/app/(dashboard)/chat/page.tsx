'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useDocStore } from '@/stores/docStore';
import { useChatStore } from '@/stores/chatStore';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { MessageSquare, Send, Sparkles, FileText, Trash2, Bot, User as UserIcon, Bookmark, ChevronRight, Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileUploadModal } from '@/components/documents/FileUploadModal';

export default function ChatPage() {
  const { documents, selectedDocumentId, selectDocument, analyses } = useDocStore();
  const { messages, isTyping, activeDocId, setActiveDocId, sendMessage, clearChat } = useChatStore();

  const [inputQuery, setInputQuery] = useState('');
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeDoc = documents.find((d) => d.id === activeDocId) || documents[0];
  const activeAnalysis = activeDoc ? analyses[activeDoc.id] : undefined;
  const currentMessages = activeDoc ? (messages[activeDoc.id] || []) : [];

  // Build document context: prefer full OCR text, fall back to JSON-stringified clauses + summary
  const documentContext = activeDoc && activeAnalysis
    ? (activeAnalysis.ocrText && activeAnalysis.ocrText !== activeAnalysis.summary
        ? activeAnalysis.ocrText
        : [
            `Contract: ${activeDoc.title}`,
            `Summary: ${activeAnalysis.summary}`,
            `Risk Score: ${activeAnalysis.risk_score} (${activeAnalysis.riskNumerical}/100)`,
            `Parties: ${activeAnalysis.parties.map(p => `${p.name} (${p.role})`).join(', ')}`,
            `Key Clauses:\n${activeAnalysis.key_clauses.map(c => `  - ${c.section} ${c.title}: ${c.content}`).join('\n')}`,
            `Missing Clauses:\n${activeAnalysis.missing_clauses.map(m => `  - ${m.title}: ${m.description}`).join('\n')}`,
            `Obligations:\n${activeAnalysis.obligations.map(o => `  - [${o.party}] ${o.description}`).join('\n')}`,
          ].join('\n\n')
      )
    : '';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentMessages, isTyping]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputQuery.trim() || isTyping || !activeDoc) return;

    const q = inputQuery;
    setInputQuery('');
    await sendMessage(activeDoc.id, q, documentContext);
  };

  const suggestedPrompts = [
    'What is our financial liability cap for data breaches in this contract?',
    'When is the non-renewal notice deadline?',
    'Explain the intellectual property rights and AI training terms.',
    'Draft a protective amendment clause for key obligations.',
  ];

  if (documents.length === 0 || !activeDoc) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-blue-600" /> Interactive AI Copilot
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Query clauses, analyze risks, and request automated redlines on your uploaded contracts.
          </p>
        </div>

        <Card className="p-12 text-center space-y-4 max-w-2xl mx-auto border-dashed border-2">
          <div className="w-16 h-16 rounded-3xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 mx-auto flex items-center justify-center">
            <Bot className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              No Document Selected for Chat
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto leading-relaxed">
              Upload a PDF contract to enable AI chat context. You can ask specific questions about indemnity, SLAs, and liability clauses.
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

        <FileUploadModal isOpen={uploadModalOpen} onClose={() => setUploadModalOpen(false)} />
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col lg:flex-row gap-6">
      {/* Sidebar: Contract Selector & Prompts */}
      <div className="w-full lg:w-80 shrink-0 space-y-4 flex flex-col">
        {/* Active Contract Selector Card */}
        <Card className="space-y-3">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Selected Contract Context
          </label>
          <select
            value={activeDoc.id}
            onChange={(e) => {
              setActiveDocId(e.target.value);
              selectDocument(e.target.value);
            }}
            className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          >
            {documents.map((d) => (
              <option key={d.id} value={d.id}>
                {d.title}
              </option>
            ))}
          </select>

          <div className="p-3 rounded-xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/40 text-xs space-y-1">
            <div className="flex items-center gap-1.5 text-blue-700 dark:text-blue-300 font-bold">
              <FileText className="w-4 h-4" />
              <span>{activeDoc.title}</span>
            </div>
            <p className="text-[11px] text-slate-500 line-clamp-2">{activeDoc.summary}</p>
          </div>
        </Card>

        {/* Suggested Prompts Pill Container */}
        <Card className="flex-1 space-y-3 overflow-y-auto">
          <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-blue-600" /> Suggested Legal Prompts
          </h4>
          <div className="space-y-2">
            {suggestedPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setInputQuery(prompt);
                }}
                className="w-full text-left p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-blue-50 dark:hover:bg-blue-950 text-xs text-slate-700 dark:text-slate-300 transition-colors border border-slate-100 dark:border-slate-800 flex items-center justify-between group"
              >
                <span>{prompt}</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 shrink-0 ml-2" />
              </button>
            ))}
          </div>
        </Card>
      </div>

      {/* Main Chat Workspace */}
      <Card className="flex-1 flex flex-col h-full p-0 overflow-hidden border border-slate-200 dark:border-slate-800">
        {/* Chat Workspace Header */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                LEGALOS AI Assistant
              </h3>
              <p className="text-[11px] text-slate-400">
                Contextually bound to <span className="font-semibold">{activeDoc.fileName}</span>
              </p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => clearChat(activeDoc.id)}
            leftIcon={<Trash2 className="w-3.5 h-3.5 text-slate-400" />}
          >
            Clear History
          </Button>
        </div>

        {/* Message History Feed */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
          <AnimatePresence initial={false}>
            {currentMessages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div className={`max-w-2xl space-y-2 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`p-4 rounded-2xl text-xs leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-blue-600 text-white rounded-br-xs shadow-md shadow-blue-500/15'
                        : 'bg-slate-100 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 rounded-bl-xs border border-slate-200/60 dark:border-slate-700/60'
                    }`}
                  >
                    {msg.content}

                    {/* Citations Pill Box */}
                    {msg.citations && msg.citations.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-slate-200/60 dark:border-slate-700/60 space-y-1.5">
                        <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider flex items-center gap-1">
                          <Bookmark className="w-3 h-3" /> Citations & Sources:
                        </span>
                        {msg.citations.map((cite, idx) => (
                          <div
                            key={idx}
                            className="p-2 rounded-xl bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-700 dark:text-slate-300"
                          >
                            <span className="font-bold text-blue-600 mr-1.5">{cite.section}:</span>
                            &quot;{cite.snippet}&quot;
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <span className="text-[10px] text-slate-400 block px-1">
                    {msg.timestamp}
                  </span>
                </div>

                {msg.role === 'user' && (
                  <Avatar name="Sarah Jenkins" size="sm" className="mt-0.5" />
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing Indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 text-xs text-slate-400"
            >
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="flex gap-1 p-3 rounded-2xl bg-slate-100 dark:bg-slate-800">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce delay-100" />
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce delay-200" />
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-2">
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder={`Ask anything about ${activeDoc.title}...`}
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
          <Button
            type="submit"
            disabled={!inputQuery.trim() || isTyping}
            isLoading={isTyping}
            leftIcon={<Send className="w-4 h-4" />}
          >
            Ask AI
          </Button>
        </form>
      </Card>

      <FileUploadModal isOpen={uploadModalOpen} onClose={() => setUploadModalOpen(false)} />
    </div>
  );
}
