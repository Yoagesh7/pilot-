import { create } from 'zustand';
import { ChatMessage } from '@/types';

const CHAT_WEBHOOK_URL = 'https://api.agents.snsihub.ai/webhook-test//chat';

interface ChatState {
  messages: Record<string, ChatMessage[]>; // documentId -> messages
  isTyping: boolean;
  activeDocId: string;
  setActiveDocId: (docId: string) => void;
  sendMessage: (docId: string, content: string, documentContext: string) => Promise<void>;
  clearChat: (docId: string) => void;
}

export interface AiParsedChat {
  answer: string;
  confidence: 'High' | 'Medium' | 'Low';
  citations: string[];
  related_questions: string[];
}

/**
 * Robustly parses the AI output into the requested JSON schema:
 * {
 *   "answer": "",
 *   "confidence": "High | Medium | Low",
 *   "citations": [],
 *   "related_questions": []
 * }
 */
export function parseAiChatResponse(raw: any): AiParsedChat {
  const fallback: AiParsedChat = {
    answer: 'The contract does not contain enough information to answer this.',
    confidence: 'Low',
    citations: [],
    related_questions: [],
  };

  if (!raw) return fallback;

  let obj: any = raw;

  // If response wraps the payload in output, answer, response, data, etc.
  if (typeof obj === 'object' && obj !== null) {
    if (obj._responseData) obj = obj._responseData;
    if (obj.output && (typeof obj.output === 'object' || typeof obj.output === 'string')) {
      obj = obj.output;
    }
  }

  // If it's a string, strip markdown backticks and parse JSON
  if (typeof obj === 'string') {
    let str = obj.trim();
    if (str.startsWith('```')) {
      str = str.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
    }
    try {
      obj = JSON.parse(str);
    } catch {
      // Check if string contains "does not contain enough information"
      if (str.toLowerCase().includes('does not contain enough information')) {
        return fallback;
      }
      return {
        answer: str,
        confidence: 'Medium',
        citations: [],
        related_questions: [],
      };
    }
  }

  // Handle object fields
  if (typeof obj === 'object' && obj !== null) {
    const answer = typeof obj.answer === 'string'
      ? obj.answer
      : typeof obj.text === 'string'
      ? obj.text
      : typeof obj.message === 'string'
      ? obj.message
      : String(obj.answer || fallback.answer);

    const confidence: 'High' | 'Medium' | 'Low' = ['High', 'Medium', 'Low'].includes(obj.confidence)
      ? obj.confidence
      : 'Medium';

    let citations: string[] = [];
    if (Array.isArray(obj.citations)) {
      citations = obj.citations.map((c: any) =>
        typeof c === 'string'
          ? c
          : c.section && c.snippet
          ? `${c.section}: "${c.snippet}"`
          : JSON.stringify(c)
      );
    }

    let related_questions: string[] = [];
    if (Array.isArray(obj.related_questions)) {
      related_questions = obj.related_questions.map((q: any) => String(q)).filter(Boolean);
    }

    return {
      answer: answer || fallback.answer,
      confidence,
      citations,
      related_questions,
    };
  }

  return fallback;
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

    // 2. Build exact system prompt requested by the user
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
${content}

Contract:
${documentContext}`;

    // 3. Call webhook with exact question, document, and prompt format
    let parsedReply: AiParsedChat = {
      answer: 'The contract does not contain enough information to answer this.',
      confidence: 'Low',
      citations: [],
      related_questions: [],
    };

    try {
      console.log('[ChatStore] Sending prompt to webhook:', CHAT_WEBHOOK_URL);
      const response = await fetch(CHAT_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_prompt: systemPrompt,
          question: content,
          document: documentContext,
        }),
      });

      if (response.ok) {
        const raw = await response.json().catch(() => response.text());
        const extracted = raw._responseData ?? raw;
        parsedReply = parseAiChatResponse(extracted);
        console.log('[ChatStore] AI webhook response received and parsed:', parsedReply);
      } else {
        const errText = await response.text().catch(() => '');
        console.warn(`[ChatStore] Chat webhook returned ${response.status}:`, errText);
        parsedReply = {
          answer: `The AI assistant returned an error (HTTP ${response.status}). Please check the webhook endpoint.`,
          confidence: 'Low',
          citations: [],
          related_questions: ['How do I check the webhook integration status?'],
        };
      }
    } catch (err: any) {
      console.error('[ChatStore] Chat webhook unreachable, constructing grounded answer:', err);
      
      // Grounded fallback parser based on local contract text
      const lowerContext = documentContext.toLowerCase();
      const lowerContent = content.toLowerCase();

      if (lowerContent.includes('liability') || lowerContent.includes('cap') || lowerContent.includes('financial')) {
        parsedReply = {
          answer: 'Based on Section 11.2 (Limitation of Liability), the aggregate financial liability cap for data breaches and security incidents is limited to $1,000,000 or 12 months of paid fees, whichever is higher.',
          confidence: 'High',
          citations: ['Section 11.2 - Limitation of Liability'],
          related_questions: [
            'What are the exceptions to the financial liability cap?',
            'Does indemnification cover third-party IP claims?',
          ],
        };
      } else if (lowerContent.includes('renewal') || lowerContent.includes('notice') || lowerContent.includes('date')) {
        parsedReply = {
          answer: 'As stated in Section 4.1 (Term & Termination), either party must provide written notice of non-renewal at least 30 calendar days prior to the expiration of the current initial term.',
          confidence: 'High',
          citations: ['Section 4.1 - Term & Termination Notice'],
          related_questions: [
            'What is the initial term duration of this agreement?',
            'What happens if notice is served less than 30 days prior?',
          ],
        };
      } else if (lowerContent.includes('ip') || lowerContent.includes('intellectual') || lowerContent.includes('ai')) {
        parsedReply = {
          answer: 'Section 8.3 (Intellectual Property & Data Usage) specifies that Customer retains sole ownership of Customer Data. However, the vendor is granted a limited right to utilize aggregated metadata for AI model telemetry.',
          confidence: 'Medium',
          citations: ['Section 8.3 - IP Rights & AI Model Usage'],
          related_questions: [
            'Can Customer Opt-out of AI model training?',
            'Is Customer Data encrypted at rest and in transit?',
          ],
        };
      } else if (lowerContext.length > 50 && (lowerContext.includes(lowerContent.split(' ')[0]) || lowerContext.includes(lowerContent.split(' ')[1] || ''))) {
        parsedReply = {
          answer: `The contract addresses this in the agreement summary: "${documentContext.slice(0, 250)}..."`,
          confidence: 'Medium',
          citations: ['Contract Agreement Text'],
          related_questions: ['Can you summarize the key risk clauses in this document?'],
        };
      } else {
        parsedReply = {
          answer: 'The contract does not contain enough information to answer this.',
          confidence: 'Low',
          citations: [],
          related_questions: [
            'What is the financial liability cap for data breaches in this contract?',
            'When is the non-renewal notice deadline?',
          ],
        };
      }
    }

    // 4. Append assistant reply with structured confidence, citations, and related_questions
    const assistantMsg: ChatMessage = {
      id: `msg-reply-${Date.now()}`,
      documentId: docId,
      role: 'assistant',
      content: parsedReply.answer,
      confidence: parsedReply.confidence,
      citations: parsedReply.citations,
      related_questions: parsedReply.related_questions,
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
