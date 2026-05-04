import { api, buildQuery }    from './api';
import { CONVERSATIONS }       from '@/constants/data';
import { MESSAGE_PAGE_SIZE }   from '@/constants/config';
import type {
  Conversation,
  Message,
}                              from '@/types/message.types';

// ─────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────

export type SendMessagePayload = {
  conversationId: number;
  text:           string;
};

export type MessagesPage = {
  items:      Message[];
  total:      number;
  page:       number;
  pageSize:   number;
  hasMore:    boolean;
};

export type ConversationPayload = {
  memberId:  number;
  name:      string;
  initials:  string;
  color:     string;
  online:    boolean;
};

// ─────────────────────────────────────────────────────────────────
// Messages service
// ─────────────────────────────────────────────────────────────────

export const messagesService = {

  // ── List conversations ─────────────────────────────────────
  listConversations: async (): Promise<Conversation[]> => {
    // In production:
    // const res = await api.get<Conversation[]>('/messages/conversations');
    // return res.data;

    await new Promise(res => setTimeout(res, 300));
    return [...CONVERSATIONS];
  },

  // ── Get conversation by id ─────────────────────────────────
  getConversation: async (id: number): Promise<Conversation | null> => {
    // In production:
    // const res = await api.get<Conversation>(`/messages/conversations/${id}`);
    // return res.data;

    await new Promise(res => setTimeout(res, 200));
    return CONVERSATIONS.find(c => c.id === id) ?? null;
  },

  // ── Get messages (paginated) ───────────────────────────────
  getMessages: async (
    conversationId: number,
    page:           number = 1,
  ): Promise<MessagesPage> => {
    // In production:
    // const qs = buildQuery({ page, pageSize: MESSAGE_PAGE_SIZE });
    // const res = await api.get<MessagesPage>(
    //   `/messages/conversations/${conversationId}/messages${qs}`
    // );
    // return res.data;

    await new Promise(res => setTimeout(res, 200));

    const convo    = CONVERSATIONS.find(c => c.id === conversationId);
    const messages = convo?.messages ?? [];
    const total    = messages.length;
    const start    = Math.max(0, total - page * MESSAGE_PAGE_SIZE);
    const end      = total - (page - 1) * MESSAGE_PAGE_SIZE;
    const items    = messages.slice(start, end);

    return {
      items,
      total,
      page,
      pageSize: MESSAGE_PAGE_SIZE,
      hasMore:  start > 0,
    };
  },

  // ── Send message ───────────────────────────────────────────
  send: async (payload: SendMessagePayload): Promise<Message> => {
    // In production:
    // const res = await api.post<Message>(
    //   `/messages/conversations/${payload.conversationId}/messages`,
    //   { text: payload.text }
    // );
    // return res.data;

    await new Promise(res => setTimeout(res, 150));

    return {
      from: 'me',
      text: payload.text,
      time: '',
    };
  },

  // ── Start new conversation ─────────────────────────────────
  startConversation: async (
    payload: ConversationPayload
  ): Promise<Conversation> => {
    // In production:
    // const res = await api.post<Conversation>('/messages/conversations', payload);
    // return res.data;

    await new Promise(res => setTimeout(res, 300));

    return {
      id:              payload.memberId,
      name:            payload.name,
      initials:        payload.initials,
      color:           payload.color,
      online:          payload.online,
      unread:          false,
      lastMessage:     '',
      lastMessageTime: 'now',
      messages:        [],
    };
  },

  // ── Mark conversation as read ──────────────────────────────
  markRead: async (conversationId: number): Promise<void> => {
    // In production:
    // await api.patch(`/messages/conversations/${conversationId}/read`, {});
    await new Promise(res => setTimeout(res, 100));
  },

  // ── Get unread count ───────────────────────────────────────
  getUnreadCount: async (): Promise<number> => {
    // In production:
    // const res = await api.get<{ count: number }>('/messages/unread-count');
    // return res.data.count;

    await new Promise(res => setTimeout(res, 100));
    return CONVERSATIONS.filter(c => c.unread).length;
  },
};