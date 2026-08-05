import { create } from 'zustand';
import { Document, AnalysisResult } from '@/types';
import { INITIAL_DOCUMENTS, INITIAL_ANALYSIS_RESULTS } from '@/utils/mockData';
import { WebhookService } from '@/services/webhookService';

interface UploadState {
  isUploading: boolean;
  progress: number;
  stage: 'idle' | 'scanning' | 'parsing' | 'webhook' | 'done' | 'error';
  errorMessage?: string;
}

interface DocState {
  documents: Document[];
  analyses: Record<string, AnalysisResult>;
  selectedDocumentId: string | null;
  uploadState: UploadState;

  // Actions
  selectDocument: (id: string | null) => void;
  deleteDocument: (id: string) => void;
  uploadDocument: (file: File) => Promise<string | null>;
  importWebhookJson: (jsonPayload: any, titleName?: string) => string;
  resetUploadState: () => void;
  getAnalysis: (docId: string) => AnalysisResult | undefined;
}

export const useDocStore = create<DocState>((set, get) => ({
  documents: INITIAL_DOCUMENTS,
  analyses: INITIAL_ANALYSIS_RESULTS,
  selectedDocumentId: null,
  uploadState: {
    isUploading: false,
    progress: 0,
    stage: 'idle',
  },

  selectDocument: (id) => set({ selectedDocumentId: id }),

  deleteDocument: (id) =>
    set((state) => {
      const nextDocs = state.documents.filter((d) => d.id !== id);
      const nextAnalyses = { ...state.analyses };
      delete nextAnalyses[id];
      return {
        documents: nextDocs,
        analyses: nextAnalyses,
        selectedDocumentId: state.selectedDocumentId === id ? (nextDocs[0]?.id || null) : state.selectedDocumentId,
      };
    }),

  resetUploadState: () =>
    set({
      uploadState: { isUploading: false, progress: 0, stage: 'idle' },
    }),

  uploadDocument: async (file: File) => {
    set({
      uploadState: { isUploading: true, progress: 10, stage: 'scanning' },
    });

    try {
      const { documentId, analysis } = await WebhookService.uploadAndTriggerWebhook(
        file,
        (stage, progress) => {
          set({ uploadState: { isUploading: true, progress, stage } });
        }
      );

      const ext = file.name.split('.').pop()?.toLowerCase();
      const fileType: 'pdf' | 'docx' | 'txt' =
        ext === 'docx' ? 'docx' : ext === 'txt' ? 'txt' : 'pdf';

      const newDoc: Document = {
        id: documentId,
        title: file.name.replace(/\.[^/.]+$/, ''),
        fileName: file.name,
        fileSize: file.size,
        fileType,
        status: 'analyzed',
        uploadDate: new Date().toISOString(),
        riskScore: analysis.risk_score,
        riskNumerical: analysis.riskNumerical,
        parties: analysis.parties.map((p) => p.name),
        summary: analysis.summary,
        obligationsCount: analysis.obligations.length,
        clausesCount: analysis.key_clauses.length,
        virusScanPassed: true,
      };

      set((state) => ({
        documents: [newDoc, ...state.documents],
        analyses: { ...state.analyses, [documentId]: analysis },
        selectedDocumentId: documentId,
        uploadState: { isUploading: false, progress: 100, stage: 'done' },
      }));

      return documentId;
    } catch (err: any) {
      set({
        uploadState: {
          isUploading: false,
          progress: 0,
          stage: 'error',
          errorMessage: err?.message || 'Failed to upload contract or contact backend endpoint.',
        },
      });
      return null;
    }
  },

  importWebhookJson: (jsonPayload: any, titleName: string = 'Raw AI Analysis Output') => {
    const analysis = WebhookService.parseRawPayload(jsonPayload, titleName);
    const documentId = analysis.documentId;

    const newDoc: Document = {
      id: documentId,
      title: titleName,
      fileName: `${titleName.toLowerCase().replace(/\s+/g, '_')}.json`,
      fileSize: JSON.stringify(jsonPayload).length,
      fileType: 'pdf',
      status: 'analyzed',
      uploadDate: new Date().toISOString(),
      riskScore: analysis.risk_score,
      riskNumerical: analysis.riskNumerical,
      parties: analysis.parties.map((p) => p.name),
      summary: analysis.summary,
      obligationsCount: analysis.obligations.length,
      clausesCount: analysis.key_clauses.length,
      virusScanPassed: true,
    };

    set((state) => ({
      documents: [newDoc, ...state.documents],
      analyses: { ...state.analyses, [documentId]: analysis },
      selectedDocumentId: documentId,
    }));

    return documentId;
  },

  getAnalysis: (docId: string) => {
    return get().analyses[docId];
  },
}));
