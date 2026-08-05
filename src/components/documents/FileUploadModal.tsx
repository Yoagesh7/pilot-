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
        <div className="flex items-center gap-2 p-1 rounded-xl bg-[#EFECE6] dark:bg-[#181818] border border-[#E2DFD6] dark:border-[#27272A] text-xs">
          <button
            onClick={() => setActiveMode('upload')}
            className={`flex-1 py-2 px-3 rounded-lg font-bold transition-all flex items-center justify-center gap-2 ${
              activeMode === 'upload'
                ? 'bg-white dark:bg-[#141414] text-[#18181B] dark:text-white shadow-2xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload PDF File</span>
          </button>
          <button
            onClick={() => setActiveMode('json')}
            className={`flex-1 py-2 px-3 rounded-lg font-bold transition-all flex items-center justify-center gap-2 ${
              activeMode === 'json'
                ? 'bg-white dark:bg-[#141414] text-[#18181B] dark:text-white shadow-2xs'
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
                      ? 'border-[#18181B] bg-[#EFECE6]/50 dark:bg-slate-900/60 scale-[0.99]'
                      : selectedFile
                      ? 'border-emerald-600 bg-emerald-50/30 dark:bg-emerald-950/20'
                      : 'border-[#D6D3CC] dark:border-slate-700 hover:border-[#18181B] bg-[#FAF9F5] dark:bg-[#141414]'
                  }`}
                >
                  <input
                    type="file"
                    accept=".pdf,.docx,.txt"
                    onChange={(e) => e.target.files?.[0] && validateAndSetFile(e.target.files[0])}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />

                  <div className="w-12 h-12 rounded-2xl bg-[#EFECE6] dark:bg-[#27272A] flex items-center justify-center text-[#18181B] dark:text-slate-100 mb-3 shadow-2xs">
                    <Upload className="w-6 h-6" />
                  </div>

                  <h4 className="text-sm font-bold text-[#18181B] dark:text-slate-100">
                    {selectedFile ? selectedFile.name : 'Choose contract file or drag here'}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
                    Supports PDF, DOCX, and TXT files up to 25MB
                  </p>

                  {selectedFile && (
                    <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Ready to analyze ({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)
                    </div>
                  )}
                </div>

                {/* Action buttons */}
                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    onClick={handleModalClose}
                    className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-300 hover:bg-[#F0EEE8] dark:hover:bg-slate-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={!selectedFile}
                    onClick={handleStartUpload}
                    className="px-5 py-2.5 text-xs font-bold rounded-xl bg-[#18181B] dark:bg-white dark:text-[#18181B] hover:bg-black dark:hover:bg-slate-200 disabled:opacity-50 text-white shadow-2xs transition-all flex items-center gap-2"
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
                    className="absolute inset-0 rounded-full border-4 border-[#18181B]/20 dark:border-white/20 border-t-[#18181B] dark:border-t-white"
                  />
                  <FileText className="w-8 h-8 text-[#18181B] dark:text-slate-100" />
                </div>

                <div>
                  <h4 className="text-base font-bold text-[#18181B] dark:text-slate-100">
                    {uploadState.stage === 'scanning' && 'Running Virus & Malware Scan...'}
                    {uploadState.stage === 'parsing' && 'Extracting Contract Clauses & Parties...'}
                    {uploadState.stage === 'webhook' && 'Posting to SNS Workbench Webhook...'}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
                    Dispatching payload & parsing AI analysis response
                  </p>
                </div>

                <Progress value={uploadState.progress} showLabel className="max-w-xs mx-auto" />
              </div>
            )}
          </>
        )}

        {activeMode === 'json' && (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-[#18181B] dark:text-slate-200 block mb-1">
                Contract Name / Identifier
              </label>
              <input
                type="text"
                value={contractTitle}
                onChange={(e) => setContractTitle(e.target.value)}
                placeholder="e.g. Master SaaS Agreement 2026"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F5] dark:bg-[#141414] border border-[#E2DFD6] dark:border-[#27272A] text-xs font-semibold text-[#18181B] dark:text-slate-100 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#18181B] dark:text-slate-200 block mb-1">
                Paste Webhook AI Response JSON / Text
              </label>
              <textarea
                value={pastedJsonText}
                onChange={(e) => setPastedJsonText(e.target.value)}
                placeholder={`Paste output from webhook response e.g.:\n{\n  "summary": "...",\n  "risk_score": "High",\n  "key_clauses": [...]\n}`}
                rows={8}
                className="w-full p-3 rounded-xl bg-[#0A0A0A] font-mono text-xs text-emerald-400 border border-[#27272A] focus:outline-none"
              />
              <p className="text-[11px] text-slate-500 mt-1 font-medium">
                Supports raw JSON objects, array formats, markdown codeblocks (` ```json `), or plain AI text.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={handleModalClose}
                className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-300 hover:bg-[#F0EEE8] dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleImportJson}
                disabled={!pastedJsonText.trim()}
                className="px-5 py-2.5 text-xs font-bold rounded-xl bg-[#18181B] dark:bg-white dark:text-[#18181B] hover:bg-black dark:hover:bg-slate-200 disabled:opacity-50 text-white shadow-2xs transition-all flex items-center gap-2"
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
