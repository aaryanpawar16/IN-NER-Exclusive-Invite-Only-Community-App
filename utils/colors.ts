import { theme } from '@/constants/theme';

// ─────────────────────────────────────────────────────────────────
// Alpha
// ─────────────────────────────────────────────────────────────────

/**
 * Applies an alpha value to a hex color.
 * withAlpha("#1A1714", 0.5) → "rgba(26,23,20,0.5)"
 */
export function withAlpha(hex: string, alpha: number): string {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r},${g},${b},${alpha})`;
}

/**
 * Converts a hex color to RGB components.
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const clean  = hex.replace('#', '');
  const full   = clean.length === 3
    ? clean.split('').map(c => c + c).join('')
    : clean;

  const num = parseInt(full, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8)  & 255,
    b:  num        & 255,
  };
}

/**
 * Converts RGB to hex.
 */
export function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b]
    .map(v => Math.max(0, Math.min(255, v)).toString(16).padStart(2, '0'))
    .join('');
}

// ─────────────────────────────────────────────────────────────────
// Lightness
// ─────────────────────────────────────────────────────────────────

/**
 * Returns true if the color is perceived as "light"
 * (i.e. dark text should be used on top of it).
 */
export function isLightColor(hex: string): boolean {
  const { r, g, b } = hexToRgb(hex);
  // W3C luminance formula
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5;
}

/**
 * Returns the appropriate text color (dark or light)
 * for maximum contrast on a given background.
 */
export function getContrastText(backgroundHex: string): string {
  return isLightColor(backgroundHex)
    ? theme.colors.dark
    : theme.colors.cream;
}

/**
 * Lightens a hex color by a percentage.
 * lighten("#4A3F35", 0.2) → slightly lighter hex
 */
export function lighten(hex: string, amount: number): string {
  const { r, g, b } = hexToRgb(hex);
  return rgbToHex(
    Math.min(255, Math.round(r + (255 - r) * amount)),
    Math.min(255, Math.round(g + (255 - g) * amount)),
    Math.min(255, Math.round(b + (255 - b) * amount)),
  );
}

/**
 * Darkens a hex color by a percentage.
 */
export function darken(hex: string, amount: number): string {
  const { r, g, b } = hexToRgb(hex);
  return rgbToHex(
    Math.max(0, Math.round(r * (1 - amount))),
    Math.max(0, Math.round(g * (1 - amount))),
    Math.max(0, Math.round(b * (1 - amount))),
  );
}

// ─────────────────────────────────────────────────────────────────
// Avatar color pool
// ─────────────────────────────────────────────────────────────────

const AVATAR_POOL = [
  '#4A3F35',
  '#7A8C6E',
  '#9A7A45',
  '#B85C38',
  '#2D2926',
  '#6B5B4E',
  '#8B7355',
  '#5C6B52',
] as const;

/**
 * Returns a deterministic color from the avatar pool.
 */
export function pickAvatarColor(seed: string | number): string {
  const str  = String(seed);
  let   hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
    hash = hash & hash;
  }
  return AVATAR_POOL[Math.abs(hash) % AVATAR_POOL.length];
}

// ─────────────────────────────────────────────────────────────────
// Status → color
// ─────────────────────────────────────────────────────────────────

export function statusToColor(
  status: 'pending' | 'approved' | 'rejected' | 'active' | 'suspended',
): string {
  const map: Record<string, string> = {
    pending:   theme.colors.goldDark,
    approved:  theme.colors.sage,
    active:    theme.colors.sage,
    rejected:  theme.colors.rust,
    suspended: theme.colors.rust,
  };
  return map[status] ?? theme.colors.taupe;
}

/**
 * Returns a semi-transparent background for a status color.
 */
export function statusToBg(
  status: 'pending' | 'approved' | 'rejected' | 'active' | 'suspended',
): string {
  const map: Record<string, string> = {
    pending:   'rgba(154,122,69,0.12)',
    approved:  'rgba(122,140,110,0.12)',
    active:    'rgba(122,140,110,0.12)',
    rejected:  'rgba(184,92,56,0.10)',
    suspended: 'rgba(184,92,56,0.10)',
  };
  return map[status] ?? 'rgba(139,125,114,0.12)';
}