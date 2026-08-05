'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Modal } from '@/components/ui/Modal';
import { useDocStore } from '@/stores/docStore';
import { useToast } from '@/components/ui/Toast';
import { Upload, FileText, CheckCircle2, ShieldCheck, Cpu, AlertCircle, RefreshCw, Terminal, Code } from 'lucide-react';
import { Progress } from '@/components/ui/Progress';
import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';

interface FileUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FileUploadModal: React.FC<FileUploadModalProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const [activeMode, setActiveMode] = useState<'upload' | 'json'>('upload');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [pastedJsonText, setPastedJsonText] = useState('');
  const [contractTitle, setContractTitle] = useState('Webhook Contract Analysis');
  const { uploadState, uploadDocument, importWebhookJson, resetUploadState } = useDocStore();
  const { showToast } = useToast();

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      validateAndSetFile(file);
    }
  };

  const validateAndSetFile = (file: File) => {
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    const ext = file.name.split('.').pop()?.toLowerCase();

    if (!validTypes.includes(file.type) && !['pdf', 'docx', 'txt'].includes(ext || '')) {
      showToast('Invalid File Type', 'Please upload a PDF, DOCX, or TXT document.', 'error');
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      showToast('File Too Large', 'Maximum file upload size is 25MB.', 'error');
      return;
    }

    setSelectedFile(file);
  };

  const handleStartUpload = async () => {
    if (!selectedFile) return;

    const docId = await uploadDocument(selectedFile);
    if (docId) {
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
      showToast('Backend Analysis Complete', `PDF "${selectedFile.name}" processed & returned JSON output!`, 'success');
      setTimeout(() => {
        handleModalClose();
        router.push(`/documents/${docId}`);
      }, 700);
    } else {
      showToast('Upload Failed', 'There was an error communicating with the backend pipeline.', 'error');
    }
  };

  const handleImportJson = () => {
    if (!pastedJsonText.trim()) {
      showToast('Empty Output', 'Please paste valid JSON or AI text output from your webhook.', 'error');
      return;
    }

    try {
      let parsedPayload: any;
      try {
        parsedPayload = JSON.parse(pastedJsonText);
      } catch {
        parsedPayload = pastedJsonText;
      }

      const docId = importWebhookJson(parsedPayload, contractTitle || 'Imported Webhook Contract');
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
      showToast('Webhook Output Parsed', 'Successfully parsed AI JSON payload and generated dynamic UI report!', 'success');
      setTimeout(() => {
        handleModalClose();
        router.push(`/documents/${docId}`);
      }, 700);
    } catch (err: any) {
      showToast('Parsing Failed', err?.message || 'Could not parse JSON payload.', 'error');
    }
  };

  const handleModalClose = () => {
    resetUploadState();
    setSelectedFile(null);
    setPastedJsonText('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleModalClose}
      title="Add Document Analysis"
      description="Upload a contract PDF or paste raw Webhook AI JSON output to generate real dynamic reports."
      maxWidth="lg"
    >
      <div className="space-y-4">
        {/* Mode Switcher Pills */}
        <div className="flex items-center gap-2 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-xs">
          <button
            onClick={() => setActiveMode('upload')}
            className={`flex-1 py-1.5 px-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
              activeMode === 'upload'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload PDF File</span>
          </button>
          <button
            onClick={() => setActiveMode('json')}
            className={`flex-1 py-1.5 px-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
              activeMode === 'json'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>Paste AI Webhook JSON</span>
          </button>
        </div>

        {activeMode === 'upload' && (
          <>
            {!uploadState.isUploading && uploadState.stage !== 'done' && (
              <>
                {/* Drag & Drop Box */}
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragOver(true);
                  }}
                  onDragLeave={() => setIsDragOver(false)}
                  onDrop={handleDrop}
                  className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                    isDragOver
                      ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/40 scale-[0.99]'
                      : selectedFile
                      ? 'border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/20'
                      : 'border-slate-300 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 bg-slate-50/50 dark:bg-slate-800/30'
                  }`}
                >
                  <input
                    type="file"
                    accept=".pdf,.docx,.txt"
                    onChange={(e) => e.target.files?.[0] && validateAndSetFile(e.target.files[0])}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />

                  <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-3 shadow-xs">
                    <Upload className="w-6 h-6" />
                  </div>

                  <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {selectedFile ? selectedFile.name : 'Choose contract file or drag here'}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Supports PDF, DOCX, and TXT files up to 25MB
                  </p>

                  {selectedFile && (
                    <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Ready to analyze ({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)
                    </div>
                  )}
                </div>

                {/* Action buttons */}
                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    onClick={handleModalClose}
                    className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={!selectedFile}
                    onClick={handleStartUpload}
                    className="px-5 py-2 text-xs font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white shadow-md shadow-blue-500/20 transition-all flex items-center gap-2"
                  >
                    <Cpu className="w-4 h-4" />
                    <span>Start AI Analysis</span>
                  </button>
                </div>
              </>
            )}

            {/* Upload & Webhook Progress animation state */}
            {uploadState.isUploading && (
              <div className="py-6 space-y-6 text-center">
                <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                    className="absolute inset-0 rounded-full border-4 border-blue-500/20 border-t-blue-600"
                  />
                  <FileText className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>

                <div>
                  <h4 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                    {uploadState.stage === 'scanning' && 'Running Virus & Malware Scan...'}
                    {uploadState.stage === 'parsing' && 'Extracting Contract Clauses & Parties...'}
                    {uploadState.stage === 'webhook' && 'Posting to SNS Workbench Webhook...'}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Dispatching payload & parsing AI analysis response
                  </p>
                </div>

                <Progress value={uploadState.progress} showLabel className="max-w-xs mx-auto" />

                <div className="grid grid-cols-3 gap-2 max-w-sm mx-auto pt-2 text-center text-xs">
                  <div className={`p-2 rounded-xl border ${uploadState.progress >= 25 ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                    <ShieldCheck className="w-4 h-4 mx-auto mb-1" />
                    Virus Scan
                  </div>
                  <div className={`p-2 rounded-xl border ${uploadState.progress >= 50 ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                    <FileText className="w-4 h-4 mx-auto mb-1" />
                    Parsing
                  </div>
                  <div className={`p-2 rounded-xl border ${uploadState.progress >= 75 ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                    <Cpu className="w-4 h-4 mx-auto mb-1" />
                    AI Webhook
                  </div>
                </div>
              </div>
            )}

            {/* Error State */}
            {uploadState.stage === 'error' && (
              <div className="p-6 text-center space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 mx-auto flex items-center justify-center">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <h4 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                  Processing Error
                </h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  {uploadState.errorMessage}
                </p>
                <button
                  onClick={handleStartUpload}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold"
                >
                  <RefreshCw className="w-4 h-4" />
                  Retry Upload
                </button>
              </div>
            )}
          </>
        )}

        {activeMode === 'json' && (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Contract Name / Identifier
              </label>
              <input
                type="text"
                value={contractTitle}
                onChange={(e) => setContractTitle(e.target.value)}
                placeholder="e.g. Master SaaS Agreement 2026"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Paste Webhook AI Response JSON / Text
              </label>
              <textarea
                value={pastedJsonText}
                onChange={(e) => setPastedJsonText(e.target.value)}
                placeholder={`Paste output from webhook response e.g.:\n{\n  "summary": "...",\n  "risk_score": "High",\n  "key_clauses": [...]\n}`}
                rows={8}
                className="w-full p-3 rounded-xl bg-slate-950 font-mono text-xs text-emerald-400 border border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Supports raw JSON objects, array formats, markdown codeblocks (` ```json `), or plain AI text.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={handleModalClose}
                className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleImportJson}
                disabled={!pastedJsonText.trim()}
                className="px-5 py-2 text-xs font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white shadow-md shadow-blue-500/20 transition-all flex items-center gap-2"
              >
                <Terminal className="w-4 h-4" />
                <span>Parse JSON & Generate Report</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
