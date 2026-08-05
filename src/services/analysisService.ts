import { supabase } from '@/lib/supabase';
import { AnalysisResult } from '@/types';
import { parseWebhookPayloadToAnalysis } from '@/utils/webhookParser';

export const analysisService = {
  /**
   * Fetch full contract analysis for a specific document
   */
  async getAnalysis(document_id: string, user_id: string): Promise<AnalysisResult | null> {
    const { data: docRecord, error } = await supabase
      .from('documents')
      .select('*')
      .eq('id', document_id)
      .eq('user_id', user_id)
      .single();

    if (error || !docRecord) {
      console.warn('[AnalysisService] Document not found:', error);
      return null;
    }

    if (docRecord.analysis) {
      return docRecord.analysis as AnalysisResult;
    }

    // Fallback to text parsing
    const analysis = parseWebhookPayloadToAnalysis(docRecord.summary, docRecord.filename);
    analysis.documentId = docRecord.id;
    return analysis;
  },
};
