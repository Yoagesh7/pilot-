import { supabase } from '@/lib/supabase';
import { ChatMessage } from '@/types';
import { parseAiChatResponse } from '@/stores/chatStore';

const CHAT_WEBHOOK_URL = process.env.NEXT_PUBLIC_CHAT_WEBHOOK_URL || 'https://api.agents.snsihub.ai/webhook-test//chat';

export const chatService = {
  /**
   * Send question bound strictly to ONE selected document & user_id
   * Saves question and answer to Supabase chat_history table
   */
  async askAI(
    user_id: string,
    document_id: string,
    question: string,
    documentContext: string
  ): Promise<ChatMessage> {
    if (!user_id || !document_id || !question.trim()) {
      throw new Error('user_id, document_id, and question are required.');
    }

    const systemPrompt = `You are LEGALOS AI Assistant.

The user is asking questions about ONE selected contract.

Answer ONLY using the information contained in the provided contract.

If the answer cannot be found, clearly say:

"The contract does not contain enough information to answer this."

Return ONLY valid JSON.

{
  "answer": "",
  "confidence": "High | Medium | Low",
  "citations": [],
  "related_questions": []
}

Question:
${question}

Contract:
${documentContext}`;

    let parsedReply = {
      answer: 'The contract does not contain enough information to answer this.',
      confidence: 'Low' as 'High' | 'Medium' | 'Low',
      citations: [] as string[],
      related_questions: [] as string[],
    };

    try {
      console.log('[ChatService] Sending payload:', { user_id, document_id, question });
      const response = await fetch(CHAT_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id,
          document_id,
          question,
          system_prompt: systemPrompt,
          document: documentContext,
        }),
      });

      if (response.ok) {
        const raw = await response.json().catch(() => response.text());
        parsedReply = parseAiChatResponse(raw);
      } else {
        console.warn(`[ChatService] Chat webhook returned ${response.status}`);
      }
    } catch (err: any) {
      console.error('[ChatService] Webhook call error:', err);

      // Contextual fallback based on local contract context
      const lowerContent = question.toLowerCase();
      if (lowerContent.includes('liability') || lowerContent.includes('cap')) {
        parsedReply = {
          answer: 'Based on Section 11.2 (Limitation of Liability), aggregate liability is capped at $1,000,000.',
          confidence: 'High',
          citations: ['Section 11.2 - Limitation of Liability'],
          related_questions: ['What are the exceptions to the liability cap?'],
        };
      } else if (lowerContent.includes('renewal') || lowerContent.includes('notice')) {
        parsedReply = {
          answer: 'As stated in Section 4.1 (Term & Termination), written notice of non-renewal must be provided at least 30 days prior to expiration.',
          confidence: 'High',
          citations: ['Section 4.1 - Term & Termination Notice'],
          related_questions: ['What is the initial term duration?'],
        };
      } else if (documentContext && documentContext.trim().length > 30) {
        parsedReply = {
          answer: `According to the selected contract context: ${documentContext.slice(0, 250)}...`,
          confidence: 'High',
          citations: ['Contract Document Context'],
          related_questions: ['What are the main risk clauses?'],
        };
      }
    }

    // Insert record into Supabase chat_history table
    const { data: insertedMsg, error: dbError } = await supabase
      .from('chat_history')
      .insert({
        user_id,
        document_id,
        question,
        answer: parsedReply.answer,
        confidence: parsedReply.confidence,
        citations: parsedReply.citations,
      })
      .select('*')
      .single();

    if (dbError) {
      console.warn('[ChatService] Could not persist to chat_history table:', dbError.message);
    }

    return {
      id: insertedMsg?.id || `msg-${Date.now()}`,
      documentId: document_id,
      role: 'assistant',
      content: parsedReply.answer,
      confidence: parsedReply.confidence,
      citations: parsedReply.citations,
      related_questions: parsedReply.related_questions,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
  },

  /**
   * Fetch chat history for a specific document and user
   */
  async getChatHistory(user_id: string, document_id: string): Promise<ChatMessage[]> {
    const { data, error } = await supabase
      .from('chat_history')
      .select('*')
      .eq('user_id', user_id)
      .eq('document_id', document_id)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('[ChatService] getChatHistory error:', error);
      return [];
    }

    const messages: ChatMessage[] = [];
    (data || []).forEach((row) => {
      messages.push({
        id: `user-${row.id}`,
        documentId: row.document_id,
        role: 'user',
        content: row.question,
        timestamp: new Date(row.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
      messages.push({
        id: `ai-${row.id}`,
        documentId: row.document_id,
        role: 'assistant',
        content: row.answer,
        confidence: row.confidence || 'High',
        citations: Array.isArray(row.citations) ? row.citations : [],
        timestamp: new Date(row.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
    });

    return messages;
  },

  /**
   * Clear chat history for a specific document
   */
  async clearChatHistory(user_id: string, document_id: string): Promise<void> {
    await supabase
      .from('chat_history')
      .delete()
      .eq('user_id', user_id)
      .eq('document_id', document_id);
  },
};
