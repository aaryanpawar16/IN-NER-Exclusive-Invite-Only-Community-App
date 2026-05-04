import { useState, useCallback, useMemo } from 'react';
import { useMessageStore }                 from '@/store/messageStore';
import { toast }                           from '@/components/ui';
import type { Conversation }               from '@/types/message.types';

export function useMessages() {
  const {
    conversations,
    sendMessage,
    markRead,
    addConversation,
  } = useMessageStore();

  const [activeId, setActiveId] = useState<number | null>(null);

  // ── Active conversation ──────────────────────────────────────
  const activeConversation = useMemo(
    () => conversations.find(c => c.id === activeId) ?? null,
    [conversations, activeId]
  );

  // ── Select conversation ──────────────────────────────────────
  const selectConversation = useCallback((id: number) => {
    setActiveId(id);
    markRead(id);
  }, [markRead]);

  // ── Send message ─────────────────────────────────────────────
  const handleSend = useCallback((text: string) => {
    if (!activeId) return;
    const trimmed = text.trim();
    if (!trimmed) return;
    sendMessage(activeId, trimmed);
  }, [activeId, sendMessage]);

  // ── Start new conversation ───────────────────────────────────
  const startConversation = useCallback((
    memberId:  number,
    name:      string,
    initials:  string,
    color:     string,
    online:    boolean,
  ) => {
    const existing = conversations.find(c => c.id === memberId);
    if (existing) {
      selectConversation(memberId);
      return;
    }
    addConversation({
      id:              memberId,
      name,
      initials,
      color,
      online,
      unread:          false,
      lastMessage:     '',
      lastMessageTime: 'now',
      messages:        [],
    });
    selectConversation(memberId);
  }, [conversations, addConversation, selectConversation]);

  // ── Derived ──────────────────────────────────────────────────
  const unreadCount = useMemo(
    () => conversations.filter(c => c.unread).length,
    [conversations]
  );

  const sortedConversations = useMemo(
    () => [...conversations].sort((a, b) => {
      if (a.unread && !b.unread) return -1;
      if (!a.unread && b.unread) return 1;
      return 0;
    }),
    [conversations]
  );

  return {
    // State
    conversations:       sortedConversations,
    activeId,
    activeConversation,

    // Derived
    unreadCount,
    hasUnread:           unreadCount > 0,
    isEmpty:             conversations.length === 0,

    // Actions
    selectConversation,
    handleSend,
    startConversation,
    markRead,
  } as const;
}