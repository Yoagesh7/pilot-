import { create } from 'zustand';
import { ChatMessage } from '@/types';
import { chatService } from '@/services/chatService';

interface ChatState {
  messages: Record<string, ChatMessage[]>; // documentId -> messages
  isTyping: boolean;
  activeDocId: string;
  setActiveDocId: (docId: string) => void;
  fetchChatHistory: (userId: string, docId: string) => Promise<void>;
  sendMessage: (docId: string, content: string, documentContext: string, userId?: string) => Promise<void>;
  clearChat: (docId: string, userId?: string) => Promise<void>;
}

export interface AiParsedChat {
  answer: string;
  confidence: 'High' | 'Medium' | 'Low';
  citations: string[];
  related_questions: string[];
}

/**
 * Helper to unwrap nested webhook payloads
 */
function unwrapRawPayload(raw: any): any {
  if (raw === null || raw === undefined) return null;

  if (Array.isArray(raw)) {
    if (raw.length === 0) return null;
    return unwrapRawPayload(raw[0]);
  }

  if (typeof raw === 'object') {
    if (raw._responseData !== undefined) return unwrapRawPayload(raw._responseData);
    if (raw.responseData !== undefined) return unwrapRawPayload(raw.responseData);
    if (raw.data !== undefined && typeof raw.data === 'object') return unwrapRawPayload(raw.data);
    if (raw.result !== undefined && typeof raw.result === 'object') return unwrapRawPayload(raw.result);
    if (raw.output !== undefined) return unwrapRawPayload(raw.output);
    if (raw.response !== undefined) return unwrapRawPayload(raw.response);
    if (raw.message !== undefined && typeof raw.message === 'object') return unwrapRawPayload(raw.message);
    if (raw.body !== undefined && typeof raw.body === 'object') return unwrapRawPayload(raw.body);
    if (raw.json !== undefined && typeof raw.json === 'object') return unwrapRawPayload(raw.json);

    return raw;
  }

  if (typeof raw === 'string') {
    let str = raw.trim();
    if (str.startsWith('```')) {
      str = str.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
    }

    try {
      const parsed = JSON.parse(str);
      if (parsed && typeof parsed === 'object') {
        return unwrapRawPayload(parsed);
      }
    } catch {}

    const firstBrace = str.indexOf('{');
    const lastBrace = str.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace > firstBrace) {
      const candidate = str.substring(firstBrace, lastBrace + 1);
      try {
        const parsed = JSON.parse(candidate);
        if (parsed && typeof parsed === 'object') {
          return unwrapRawPayload(parsed);
        }
      } catch {}
    }

    return str;
  }

  return raw;
}

export function parseAiChatResponse(rawInput: any): AiParsedChat {
  const unwrapped = unwrapRawPayload(rawInput);

  if (!unwrapped) {
    return {
      answer: 'The contract does not contain enough information to answer this.',
      confidence: 'Low',
      citations: [],
      related_questions: [],
    };
  }

  if (typeof unwrapped === 'string') {
    const trimmed = unwrapped.trim();
    const isInfoMissing = trimmed.toLowerCase().includes('does not contain enough information');

    return {
      answer: trimmed || 'The contract does not contain enough information to answer this.',
      confidence: isInfoMissing ? 'Low' : 'High',
      citations: [],
      related_questions: [],
    };
  }

  if (typeof unwrapped === 'object') {
    let answerVal =
      unwrapped.answer ??
      unwrapped.text ??
      unwrapped.content ??
      unwrapped.message ??
      unwrapped.output ??
      unwrapped.summary ??
      unwrapped.reply ??
      unwrapped.response;

    if (typeof answerVal === 'object' && answerVal !== null) {
      answerVal = answerVal.text || answerVal.content || answerVal.answer || JSON.stringify(answerVal);
    }

    const answerStr = (typeof answerVal === 'string' && answerVal.trim())
      ? answerVal.trim()
      : JSON.stringify(unwrapped, null, 2);

    const isInfoMissing = answerStr.toLowerCase().includes('does not contain enough information');

    const rawConf = String(unwrapped.confidence || '').trim();
    let confidence: 'High' | 'Medium' | 'Low' = 'High';
    if (['High', 'Medium', 'Low'].includes(rawConf)) {
      confidence = rawConf as 'High' | 'Medium' | 'Low';
    } else if (isInfoMissing || rawConf.toLowerCase().includes('low')) {
      confidence = 'Low';
    } else if (rawConf.toLowerCase().includes('med')) {
      confidence = 'Medium';
    }

    let citations: string[] = [];
    const rawCitations = unwrapped.citations || unwrapped.sources || unwrapped.references;
    if (Array.isArray(rawCitations)) {
      citations = rawCitations
        .map((c: any) => {
          if (typeof c === 'string') return c;
          if (c && typeof c === 'object') {
            if (c.section && c.snippet) return `${c.section}: "${c.snippet}"`;
            if (c.title && c.content) return `${c.title}: "${c.content}"`;
            return JSON.stringify(c);
          }
          return String(c);
        })
        .filter(Boolean);
    }

    let related_questions: string[] = [];
    const rawQuestions =
      unwrapped.related_questions ||
      unwrapped.relatedQuestions ||
      unwrapped.suggested_questions ||
      unwrapped.follow_up;

    if (Array.isArray(rawQuestions)) {
      related_questions = rawQuestions.map((q: any) => String(q)).filter(Boolean);
    }

    return {
      answer: answerStr,
      confidence,
      citations,
      related_questions,
    };
  }

  return {
    answer: String(unwrapped),
    confidence: 'High',
    citations: [],
    related_questions: [],
  };
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: {},
  isTyping: false,
  activeDocId: '',

  setActiveDocId: (docId) => set({ activeDocId: docId }),

  fetchChatHistory: async (userId, docId) => {
    if (!userId || !docId) return;
    try {
      const history = await chatService.getChatHistory(userId, docId);
      if (history.length > 0) {
        set((state) => ({
          messages: {
            ...state.messages,
            [docId]: history,
          },
        }));
      }
    } catch (err) {
      console.warn('[ChatStore] fetchChatHistory error:', err);
    }
  },

  sendMessage: async (docId, content, documentContext, userId = 'user-auth-id') => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // 1. Append user message
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

    // 2. Call chatService with bound user_id, document_id, question
    try {
      const assistantMsg = await chatService.askAI(userId, docId, content, documentContext);

      set((state) => ({
        messages: {
          ...state.messages,
          [docId]: [...(state.messages[docId] || []), assistantMsg],
        },
        isTyping: false,
      }));
    } catch (err) {
      console.error('[ChatStore] sendMessage error:', err);
      set({ isTyping: false });
    }
  },

  clearChat: async (docId, userId = 'user-auth-id') => {
    if (userId && docId) {
      await chatService.clearChatHistory(userId, docId);
    }
    set((state) => ({
      messages: {
        ...state.messages,
        [docId]: [],
      },
    }));
  },
}));
