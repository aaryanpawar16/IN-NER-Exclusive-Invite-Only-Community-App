// ─────────────────────────────────────────────────────────────────
// Initials
// ─────────────────────────────────────────────────────────────────

/**
 * Extracts initials from a full name.
 * "Nadia Wolff"        → "NW"
 * "Soo-Jin Park"       → "SP"
 * "Rafael"             → "RA"
 * "Studio Osei Ltd"    → "SO"
 */
export function getInitials(name: string, maxLength: number = 2): string {
  if (!name.trim()) return '??';

  const words = name
    .trim()
    .split(/[\s-]+/)
    .filter(Boolean);

  if (words.length === 1) {
    return words[0].substring(0, maxLength).toUpperCase();
  }

  return words
    .slice(0, maxLength)
    .map(w => w.charAt(0))
    .join('')
    .toUpperCase();
}

/**
 * Extracts initials from a first + last name pair.
 * ("Nadia", "Wolff") → "NW"
 */
export function getInitialsFromParts(
  firstName: string,
  lastName:  string,
): string {
  const f = firstName.trim().charAt(0).toUpperCase();
  const l = lastName.trim().charAt(0).toUpperCase();
  if (!f && !l) return '??';
  if (!l)       return f + f;
  if (!f)       return l + l;
  return f + l;
}

/**
 * Returns a deterministic color from the palette
 * based on the member's name or id.
 */
const AVATAR_COLORS = [
  '#4A3F35',
  '#7A8C6E',
  '#9A7A45',
  '#B85C38',
  '#2D2926',
  '#6B5B4E',
  '#8B7355',
  '#5C6B52',
] as const;

export function getAvatarColor(seed: string | number): string {
  const str   = String(seed);
  let   hash  = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
    hash = hash & hash;
  }
  const index = Math.abs(hash) % AVATAR_COLORS.length;
  return AVATAR_COLORS[index];
}

/**
 * Returns true if a string looks like valid initials.
 * (1–3 uppercase letters)
 */
export function isValidInitials(s: string): boolean {
  return /^[A-Z]{1,3}$/.test(s);
}