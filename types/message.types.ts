// ─────────────────────────────────────────────────────────────────
// Message
// ─────────────────────────────────────────────────────────────────

export type MessageSender = 'me' | 'them';

export type Message = {
  id?:       string;
  from:      MessageSender;
  text:      string;
  time:      string;
  status?:   MessageStatus;
  pending?:  boolean;
};

export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read' | 'failed';

// ─────────────────────────────────────────────────────────────────
// Conversation
// ─────────────────────────────────────────────────────────────────

export type Conversation = {
  id:              number;
  name:            string;
  initials:        string;
  color:           string;
  online:          boolean;
  unread:          boolean;
  lastMessage:     string;
  lastMessageTime: string;
  messages:        Message[];
};

// ─────────────────────────────────────────────────────────────────
// Lightweight preview (for conversation list items)
// ─────────────────────────────────────────────────────────────────

export type ConversationPreview = Omit<Conversation, 'messages'>;

// ─────────────────────────────────────────────────────────────────
// Payloads
// ─────────────────────────────────────────────────────────────────

export type SendMessagePayload = {
  conversationId: number;
  text:           string;
};

export type StartConversationPayload = {
  memberId:  number;
  name:      string;
  initials:  string;
  color:     string;
  online:    boolean;
};

// ─────────────────────────────────────────────────────────────────
// Paginated messages
// ─────────────────────────────────────────────────────────────────

export type MessagesPage = {
  items:    Message[];
  total:    number;
  page:     number;
  pageSize: number;
  hasMore:  boolean;
};