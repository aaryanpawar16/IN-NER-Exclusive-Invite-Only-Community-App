import { create }            from 'zustand';
import { messagesService }   from '@/services/messages.service';
import { CONVERSATIONS }      from '@/constants/data';
import type {
  Conversation,
  Message,
}                            from '@/types/message.types';

// ─────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────

type MessageState = {
  conversations:   Conversation[];
  activeId:        number | null;
  isLoading:       boolean;
  isSending:       boolean;
  isTyping:        boolean;
  error:           string | null;
};

type MessageActions = {
  fetchConversations:  ()                              => Promise<void>;
  sendMessage:         (convoId: number, text: string) => Promise<void>;
  markRead:            (convoId: number)               => void;
  addConversation:     (convo: Conversation)           => void;
  setActiveId:         (id: number | null)             => void;
  setTyping:           (v: boolean)                    => void;
  clearError:          ()                              => void;
};

type MessageStore = MessageState & MessageActions;

// ─────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────

function formatTime(): string {
  return new Date().toLocaleTimeString('en-US', {
    hour:   '2-digit',
    minute: '2-digit',
  });
}

function updateConvo(
  conversations: Conversation[],
  id:            number,
  updater:       (c: Conversation) => Conversation,
): Conversation[] {
  return conversations.map(c => c.id === id ? updater(c) : c);
}

// ─────────────────────────────────────────────────────────────────
// Store
// ─────────────────────────────────────────────────────────────────

export const useMessageStore = create<MessageStore>((set, get) => ({
  // ── State ─────────────────────────────────────────────────
  conversations: CONVERSATIONS,
  activeId:      null,
  isLoading:     false,
  isSending:     false,
  isTyping:      false,
  error:         null,

  // ── Fetch conversations ───────────────────────────────────
  fetchConversations: async () => {
    set({ isLoading: true, error: null });
    try {
      const convos = await messagesService.listConversations();
      set({ conversations: convos, isLoading: false });
    } catch (err: any) {
      set({
        isLoading: false,
        error:     err?.message ?? 'Failed to load messages',
      });
    }
  },

  // ── Send message (optimistic) ─────────────────────────────
  sendMessage: async (convoId: number, text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const newMessage: Message = {
      from: 'me',
      text: trimmed,
      time: '',
    };

    // Optimistic update
    set(prev => ({
      conversations: updateConvo(prev.conversations, convoId, c => ({
        ...c,
        messages:        [...c.messages, newMessage],
        lastMessage:     trimmed,
        lastMessageTime: 'now',
      })),
      isSending: true,
    }));

    try {
      await messagesService.send({ conversationId: convoId, text: trimmed });
      set({ isSending: false });
    } catch (err: any) {
      // Rollback
      set(prev => ({
        conversations: updateConvo(prev.conversations, convoId, c => ({
          ...c,
          messages: c.messages.filter(m => m !== newMessage),
        })),
        isSending: false,
        error:     err?.message ?? 'Failed to send message',
      }));
    }
  },

  // ── Mark conversation read ────────────────────────────────
  markRead: (convoId: number) => {
    set(prev => ({
      conversations: updateConvo(prev.conversations, convoId, c => ({
        ...c,
        unread: false,
      })),
    }));
    // Fire-and-forget
    messagesService.markRead(convoId).catch(() => {});
  },

  // ── Add new conversation ──────────────────────────────────
  addConversation: (convo: Conversation) => {
    const exists = get().conversations.some(c => c.id === convo.id);
    if (exists) return;
    set(prev => ({
      conversations: [convo, ...prev.conversations],
    }));
  },

  // ── Setters ───────────────────────────────────────────────
  setActiveId: (id)  => set({ activeId: id }),
  setTyping:   (v)   => set({ isTyping: v }),
  clearError:  ()    => set({ error: null }),
}));

// ─────────────────────────────────────────────────────────────────
// Selectors
// ─────────────────────────────────────────────────────────────────

export const selectConversations = (s: MessageStore) =>
  [...s.conversations].sort((a, b) => {
    if (a.unread && !b.unread) return -1;
    if (!a.unread && b.unread) return 1;
    return 0;
  });

export const selectConversationById = (id: number) =>
  (s: MessageStore) => s.conversations.find(c => c.id === id) ?? null;

export const selectUnreadCount = (s: MessageStore) =>
  s.conversations.filter(c => c.unread).length;

export const selectActiveConversation = (s: MessageStore) =>
  s.conversations.find(c => c.id === s.activeId) ?? null;