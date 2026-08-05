import { create } from 'zustand';
import { ChatMessage, Citation } from '@/types';

const CHAT_WEBHOOK_URL = 'https://api.agents.snsihub.ai/webhook-test//chat';

interface ChatState {
  messages: Record<string, ChatMessage[]>; // documentId -> messages
  isTyping: boolean;
  activeDocId: string;
  setActiveDocId: (docId: string) => void;
  sendMessage: (docId: string, content: string, documentContext: string) => Promise<void>;
  clearChat: (docId: string) => void;
}

/**
 * Parse the AI response from the chat webhook.
 * The webhook may return: string | { output } | { answer } | { message } | { response } | array
 */
function extractReplyText(raw: any): string {
  if (!raw) return 'No response received from AI assistant.';

  // Plain string
  if (typeof raw === 'string') {
    const trimmed = raw.trim();
    if (trimmed) return trimmed;
  }

  // Array — take first element
  if (Array.isArray(raw) && raw.length > 0) {
    return extractReplyText(raw[0]);
  }

  // Object — try common fields
  if (typeof raw === 'object') {
    const val =
      raw.output ??
      raw.answer ??
      raw.message ??
      raw.response ??
      raw.text ??
      raw.content ??
      raw.reply ??
      raw.result;
    if (val) return extractReplyText(val);

    // Last resort — stringify
    return JSON.stringify(raw, null, 2);
  }

  return String(raw);
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: {},
  isTyping: false,
  activeDocId: '',

  setActiveDocId: (docId) => set({ activeDocId: docId }),

  sendMessage: async (docId, content, documentContext) => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // 1. Append user message immediately
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      documentId: docId,
      role: 'user',
      content,
      timestamp,
    };

    set((state) => ({
      messages: {
        ...state.messages,
        [docId]: [...(state.messages[docId] || []), userMsg],
      },
      isTyping: true,
    }));

    // 2. Call real chat webhook
    let replyText = '';
    try {
      console.log('[ChatStore] Sending to chat webhook:', CHAT_WEBHOOK_URL);
      const response = await fetch(CHAT_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: content,
          document: documentContext,
        }),
      });

      if (response.ok) {
        const raw = await response.json().catch(() => response.text());
        replyText = extractReplyText(raw);
        console.log('[ChatStore] AI webhook response received:', raw);
      } else {
        const errText = await response.text().catch(() => '');
        console.warn(`[ChatStore] Chat webhook returned ${response.status}:`, errText);
        replyText = `The AI assistant returned an error (HTTP ${response.status}). Please check the webhook endpoint and try again.`;
      }
    } catch (err: any) {
      console.error('[ChatStore] Chat webhook unreachable:', err);
      replyText = `Unable to reach the AI chat endpoint. Please verify network connectivity and the webhook URL. (${err?.message || 'Network error'})`;
    }

    // 3. Append assistant reply
    const assistantMsg: ChatMessage = {
      id: `msg-reply-${Date.now()}`,
      documentId: docId,
      role: 'assistant',
      content: replyText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    set((state) => ({
      messages: {
        ...state.messages,
        [docId]: [...(state.messages[docId] || []), assistantMsg],
      },
      isTyping: false,
    }));
  },

  clearChat: (docId) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [docId]: [],
      },
    })),
}));
