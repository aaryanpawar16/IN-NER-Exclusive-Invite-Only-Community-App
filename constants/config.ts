// ── API ────────────────────────────────────────────────────────────
export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ?? 'https://api.inner.co/v1';

export const API_TIMEOUT_MS = 10_000;

// ── Auth ───────────────────────────────────────────────────────────
export const SESSION_KEY       = 'inner_session';
// Allow both member codes (xx-xxxxx) and admin codes (ad-xxxxx)
export const INVITE_CODE_REGEX = /^[a-z]{2}-[a-z0-9]{3,7}$/;

// ── App ────────────────────────────────────────────────────────────
export const APP_NAME              = 'INNER';
export const APP_VERSION           = '1.0.0';
export const MAX_INVITES_PER_YEAR  = 3;
export const APPLICATION_REVIEW_DAYS = 14;
export const ACCEPTANCE_RATE_PCT   = 12;

// ── Messages ───────────────────────────────────────────────────────
export const MAX_MESSAGE_LENGTH    = 2000;
export const MESSAGE_PAGE_SIZE     = 40;
export const TYPING_DEBOUNCE_MS    = 600;
export const TYPING_TIMEOUT_MS     = 3000;

// ── Directory ──────────────────────────────────────────────────────
export const DIRECTORY_PAGE_SIZE   = 20;

// ── Events ─────────────────────────────────────────────────────────
export const EVENTS_PAGE_SIZE      = 15;

// ── Invite ─────────────────────────────────────────────────────────
export const INVITE_BASE_URL       = 'https://inner.co/invite';

// ── Feature flags ──────────────────────────────────────────────────
export const FEATURES = {
  messaging:        true,
  events:           true,
  invites:          true,
  adminDashboard:   true,
  pushNotifications: false,
  darkMode:         false,
} as const;

// ── Regex ──────────────────────────────────────────────────────────
export const REGEX = {
  email:      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  inviteCode: INVITE_CODE_REGEX,
  url:        /^https?:\/\/.+/,
} as const;