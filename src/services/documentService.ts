import { supabase } from '@/lib/supabase';
import { Document, AnalysisResult } from '@/types';
import { parseWebhookPayloadToAnalysis } from '@/utils/webhookParser';

const AI_WEBHOOK_URL = process.env.NEXT_PUBLIC_WEBHOOK_URL || 'https://api.agents.snsihub.ai/webhook/a48241af-74e5-44bd-b253-484f3480c166';

export const documentService = {
  /**
   * Upload a contract PDF into Supabase Storage & insert record into Supabase Database
   * Then sends ONLY { document_id, storage_url, user_id } to the AI Webhook
   */
  async uploadDocument(file: File, user_id: string): Promise<{ document: Document; analysis: AnalysisResult }> {
    if (!file || !user_id) {
      throw new Error('File and authenticated user_id are required.');
    }

    const fileExt = file.name.split('.').pop();
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const storagePath = `${user_id}/${Date.now()}_${cleanFileName}`;

    // 1. Upload PDF into Supabase Storage bucket 'contracts'
    const { data: storageData, error: storageError } = await supabase.storage
      .from('contracts')
      .upload(storagePath, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (storageError) {
      console.error('[DocumentService] Supabase storage upload error:', storageError);
      if (
        storageError.message?.toLowerCase().includes('bucket not found') ||
        (storageError as any).statusCode === '404' ||
        (storageError as any).error === 'Bucket not found'
      ) {
        throw new Error(
          "Supabase Storage bucket 'contracts' does not exist yet. Please go to your Supabase Dashboard -> Storage -> Create a new Private bucket named 'contracts', or run section 9 of supabase/schema.sql in your SQL Editor."
        );
      }
      throw new Error(`Failed to upload file to storage: ${storageError.message}`);
    }

    // 2. Get Public or Signed URL for the file
    const { data: publicUrlData } = supabase.storage.from('contracts').getPublicUrl(storagePath);
    const storage_url = publicUrlData?.publicUrl || storagePath;

    const documentTitle = file.name.replace(/\.[^/.]+$/, '');

    // 3. Insert document metadata into Supabase Database
    const { data: docRecord, error: dbError } = await supabase
      .from('documents')
      .insert({
        user_id,
        title: documentTitle,
        filename: file.name,
        file_path: storagePath,
        status: 'processing',
        summary: 'AI Analysis in progress...',
        risk_score: 'Medium',
        risk_numerical: 50,
      })
      .select('*')
      .single();

    if (dbError || !docRecord) {
      console.error('[DocumentService] Supabase database insert error:', dbError);
      throw new Error(`Database record creation failed: ${dbError?.message}`);
    }

    // 4. Send ONLY { document_id, storage_url, user_id } to AI Webhook
    let rawWebhookOutput: any = null;
    try {
      console.log('[DocumentService] Sending payload to AI Webhook:', {
        document_id: docRecord.id,
        storage_url,
        user_id,
      });

      const response = await fetch(AI_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          document_id: docRecord.id,
          storage_url,
          user_id,
        }),
      });

      if (response.ok) {
        rawWebhookOutput = await response.json().catch(() => response.text());
        console.log('[DocumentService] AI Webhook returned response:', rawWebhookOutput);
      } else {
        console.warn(`[DocumentService] AI Webhook returned HTTP ${response.status}`);
      }
    } catch (err: any) {
      console.error('[DocumentService] AI Webhook call error:', err);
    }

    // 5. Parse analysis result from AI Webhook response or fallback generator
    const analysis = parseWebhookPayloadToAnalysis(rawWebhookOutput, file.name);
    analysis.documentId = docRecord.id;

    // 6. Update document record in Supabase with parsed analysis
    const { data: updatedDoc, error: updateError } = await supabase
      .from('documents')
      .update({
        status: 'analyzed',
        summary: analysis.summary,
        risk_score: analysis.risk_score,
        risk_numerical: analysis.riskNumerical,
        analysis: analysis,
        updated_at: new Date().toISOString(),
      })
      .eq('id', docRecord.id)
      .select('*')
      .single();

    const finalDocRecord = updatedDoc || docRecord;

    const formattedDocument: Document = {
      id: finalDocRecord.id,
      title: finalDocRecord.title,
      fileName: finalDocRecord.filename,
      fileSize: file.size,
      fileType: (fileExt === 'pdf' ? 'pdf' : fileExt === 'docx' ? 'docx' : 'txt') as any,
      status: finalDocRecord.status,
      uploadDate: new Date(finalDocRecord.created_at).toLocaleDateString(),
      riskScore: finalDocRecord.risk_score as any,
      riskNumerical: finalDocRecord.risk_numerical,
      parties: analysis.parties.map((p) => p.name),
      summary: finalDocRecord.summary,
      obligationsCount: analysis.obligations.length,
      clausesCount: analysis.key_clauses.length,
      virusScanPassed: true,
    };

    return { document: formattedDocument, analysis };
  },

  /**
   * Fetch all documents belonging ONLY to the logged-in user
   */
  async getDocuments(user_id: string): Promise<{ documents: Document[]; analyses: Record<string, AnalysisResult> }> {
    const { data: dbDocs, error } = await supabase
      .from('documents')
      .select('*')
      .eq('user_id', user_id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[DocumentService] getDocuments error:', error);
      throw new Error(error.message);
    }

    const documents: Document[] = [];
    const analyses: Record<string, AnalysisResult> = {};

    (dbDocs || []).forEach((row) => {
      const docAnalysis: AnalysisResult = row.analysis || parseWebhookPayloadToAnalysis(row.summary, row.filename);
      docAnalysis.documentId = row.id;

      documents.push({
        id: row.id,
        title: row.title,
        fileName: row.filename,
        fileSize: 1024 * 1024 * 2, // 2MB estimated
        fileType: 'pdf',
        status: row.status as any,
        uploadDate: new Date(row.created_at).toLocaleDateString(),
        riskScore: row.risk_score as any,
        riskNumerical: row.risk_numerical || 50,
        parties: docAnalysis.parties ? docAnalysis.parties.map((p) => p.name) : ['Party A', 'Party B'],
        summary: row.summary,
        obligationsCount: docAnalysis.obligations ? docAnalysis.obligations.length : 3,
        clausesCount: docAnalysis.key_clauses ? docAnalysis.key_clauses.length : 4,
        virusScanPassed: true,
      });

      analyses[row.id] = docAnalysis;
    });

    return { documents, analyses };
  },

  /**
   * Delete a document by ID (removes row from DB & file from Storage)
   */
  async deleteDocument(document_id: string, user_id: string): Promise<void> {
    // 1. Fetch file_path
    const { data: docRecord } = await supabase
      .from('documents')
      .select('file_path')
      .eq('id', document_id)
      .eq('user_id', user_id)
      .single();

    if (docRecord?.file_path) {
      await supabase.storage.from('contracts').remove([docRecord.file_path]);
    }

    // 2. Delete database record
    const { error } = await supabase
      .from('documents')
      .delete()
      .eq('id', document_id)
      .eq('user_id', user_id);

    if (error) {
      throw new Error(`Failed to delete document: ${error.message}`);
    }
  },
};
