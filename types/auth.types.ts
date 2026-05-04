// ─────────────────────────────────────────────────────────────────
// Roles
// ─────────────────────────────────────────────────────────────────

export type UserRole = 'member' | 'admin';

// ─────────────────────────────────────────────────────────────────
// User
// ─────────────────────────────────────────────────────────────────

export type User = {
  id:          string;
  firstName:   string;
  lastName:    string;
  email:       string;
  role:        UserRole;
  initials:    string;
  color:       string;
  city:        string;
  inviteCode:  string;
  memberSince: string;
  online:      boolean;
};

// ─────────────────────────────────────────────────────────────────
// Auth payloads
// ─────────────────────────────────────────────────────────────────

export type LoginWithInvitePayload = {
  inviteCode: string;
};

export type LoginResponse = {
  user:  User;
  token: string;
};

export type SessionResponse = {
  user:  User;
  token: string;
};

// ─────────────────────────────────────────────────────────────────
// Auth state shape (used by authStore)
// ─────────────────────────────────────────────────────────────────

export type AuthStatus =
  | 'idle'
  | 'restoring'
  | 'authenticated'
  | 'unauthenticated'
  | 'loading'
  | 'error';