// ─────────────────────────────────────────────────────────────────
// Status
// ─────────────────────────────────────────────────────────────────

export type InviteStatus = 'pending' | 'approved' | 'rejected' | 'expired';

// ─────────────────────────────────────────────────────────────────
// Invite record (history item)
// ─────────────────────────────────────────────────────────────────

export type InviteRecord = {
  id:      string;
  email:   string;
  date:    string;
  status:  InviteStatus;
  note?:   string;
};

// ─────────────────────────────────────────────────────────────────
// Invite stats (for invite screen summary)
// ─────────────────────────────────────────────────────────────────

export type InviteStats = {
  used:      number;
  remaining: number;
  total:     number;
  link:      string;
};

// ─────────────────────────────────────────────────────────────────
// Payloads
// ─────────────────────────────────────────────────────────────────

export type SendInvitePayload = {
  email: string;
  note?: string;
};

export type ValidateInvitePayload = {
  code: string;
};

export type ValidateInviteResponse = {
  valid:       boolean;
  inviterName?: string;
  message?:    string;
};