import { create } from 'zustand';
import { Document, AnalysisResult } from '@/types';
import { INITIAL_DOCUMENTS, INITIAL_ANALYSIS_RESULTS } from '@/utils/mockData';
import { documentService } from '@/services/documentService';
import { parseWebhookPayloadToAnalysis } from '@/utils/webhookParser';

interface DocState {
  documents: Document[];
  selectedDocumentId: string;
  selectedDocument: Document | null;
  analyses: Record<string, AnalysisResult>;
  loading: boolean;
  error: string | null;

  fetchDocuments: (userId: string) => Promise<void>;
  selectDocument: (id: string) => void;
  deleteDocument: (id: string, userId: string) => Promise<void>;
  uploadDocument: (file: File, userId: string) => Promise<Document>;
  importWebhookJson: (payload: any, title?: string) => string;
}

export const useDocStore = create<DocState>((set, get) => ({
  documents: INITIAL_DOCUMENTS,
  selectedDocumentId: INITIAL_DOCUMENTS[0]?.id || '',
  selectedDocument: INITIAL_DOCUMENTS[0] || null,
  analyses: INITIAL_ANALYSIS_RESULTS,
  loading: false,
  error: null,

  fetchDocuments: async (userId: string) => {
    if (!userId) return;
    try {
      set({ loading: true, error: null });
      const { documents, analyses } = await documentService.getDocuments(userId);

      const updatedDocs = documents.length > 0 ? documents : get().documents;
      const updatedAnalyses = Object.keys(analyses).length > 0 ? analyses : get().analyses;

      const currentSelectedId = get().selectedDocumentId;
      const activeDoc = updatedDocs.find((d) => d.id === currentSelectedId) || updatedDocs[0] || null;

      set({
        documents: updatedDocs,
        analyses: updatedAnalyses,
        selectedDocumentId: activeDoc?.id || '',
        selectedDocument: activeDoc,
        loading: false,
      });
    } catch (err: any) {
      console.warn('[DocStore] Falling back to default documents:', err?.message);
      set({ loading: false });
    }
  },

  selectDocument: (id: string) => {
    const doc = get().documents.find((d) => d.id === id) || null;
    set({
      selectedDocumentId: id,
      selectedDocument: doc,
    });
  },

  deleteDocument: async (id: string, userId: string) => {
    try {
      set({ loading: true });
      if (userId) {
        await documentService.deleteDocument(id, userId);
      }

      const updatedDocs = get().documents.filter((d) => d.id !== id);
      const nextActiveDoc = updatedDocs[0] || null;

      set({
        documents: updatedDocs,
        selectedDocumentId: nextActiveDoc?.id || '',
        selectedDocument: nextActiveDoc,
        loading: false,
      });
    } catch (err: any) {
      console.error('[DocStore] deleteDocument error:', err);
      set({ error: err.message, loading: false });
    }
  },

  uploadDocument: async (file: File, userId: string) => {
    set({ loading: true, error: null });
    try {
      const { document, analysis } = await documentService.uploadDocument(file, userId);

      const updatedDocs = [document, ...get().documents];
      const updatedAnalyses = { ...get().analyses, [document.id]: analysis };

      set({
        documents: updatedDocs,
        analyses: updatedAnalyses,
        selectedDocumentId: document.id,
        selectedDocument: document,
        loading: false,
      });

      return document;
    } catch (err: any) {
      console.error('[DocStore] uploadDocument error:', err);
      set({ loading: false, error: err.message });
      throw err;
    }
  },

  importWebhookJson: (payload: any, title?: string) => {
    const docId = `imported-${Date.now()}`;
    const analysis = parseWebhookPayloadToAnalysis(payload, title || 'Imported Webhook Contract');
    analysis.documentId = docId;

    const newDoc: Document = {
      id: docId,
      title: title || 'Imported Webhook Contract',
      fileName: 'webhook_payload.json',
      fileSize: JSON.stringify(payload).length,
      fileType: 'txt',
      uploadDate: new Date().toISOString().split('T')[0],
      status: 'analyzed',
      riskScore: analysis.risk_score,
      riskNumerical: analysis.riskNumerical,
      summary: analysis.summary,
      parties: analysis.parties.map((p) => p.name),
      obligationsCount: analysis.obligations?.length || 0,
      clausesCount: analysis.key_clauses?.length || 0,
      storagePath: '',
    };

    set((state) => ({
      documents: [newDoc, ...state.documents],
      analyses: { ...state.analyses, [docId]: analysis },
      selectedDocumentId: docId,
      selectedDocument: newDoc,
    }));

    return docId;
  },
}));
