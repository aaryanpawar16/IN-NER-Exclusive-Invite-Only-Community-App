// ─────────────────────────────────────────────────────────────────
// Route params — typed for useLocalSearchParams
// ─────────────────────────────────────────────────────────────────

export type DirectoryDetailParams = {
  id: string;
};

export type EventDetailParams = {
  id: string;
};

export type ChatParams = {
  id: string;
};

// ─────────────────────────────────────────────────────────────────
// Tab names
// ─────────────────────────────────────────────────────────────────

export type MemberTab =
  | 'directory'
  | 'events'
  | 'messages'
  | 'invite';

export type AdminTab =
  | 'dashboard'
  | 'applications'
  | 'members';

// ─────────────────────────────────────────────────────────────────
// Deep link paths
// ─────────────────────────────────────────────────────────────────

export type AppRoute =
  | '/(auth)'
  | '/(auth)/apply'
  | '/(auth)/invite-entry'
  | '/(member)/directory'
  | `/(member)/directory/${string}`
  | '/(member)/events'
  | `/(member)/events/${string}`
  | '/(member)/messages'
  | `/(member)/messages/${string}`
  | '/(member)/invite'
  | '/(admin)/dashboard'
  | '/(admin)/applications'
  | '/(admin)/members';