// ─────────────────────────────────────────────────────────────────
// Number formatting
// ─────────────────────────────────────────────────────────────────

/**
 * Formats a number with commas.
 * 1240 → "1,240"
 */
export function formatCount(n: number): string {
  return n.toLocaleString('en-US');
}

/**
 * Compact number format.
 * 1240  → "1.2k"
 * 12400 → "12k"
 * 1200000 → "1.2M"
 */
export function formatCompactCount(n: number): string {
  if (n < 1_000)        return String(n);
  if (n < 10_000)       return `${(n / 1_000).toFixed(1)}k`;
  if (n < 1_000_000)    return `${Math.floor(n / 1_000)}k`;
  return `${(n / 1_000_000).toFixed(1)}M`;
}

/**
 * Formats a percentage.
 * 12 → "12%"
 */
export function formatPercent(
  value:       number,
  decimalPlaces: number = 0,
): string {
  return `${value.toFixed(decimalPlaces)}%`;
}

// ─────────────────────────────────────────────────────────────────
// String formatting
// ─────────────────────────────────────────────────────────────────

/**
 * Truncates a string and appends an ellipsis.
 * truncate("Hello world", 7) → "Hello w…"
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.substring(0, maxLength).trimEnd() + '…';
}

/**
 * Capitalises the first letter of a string.
 * "hello world" → "Hello world"
 */
export function capitalise(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Converts a string to title case.
 * "hello world" → "Hello World"
 */
export function toTitleCase(str: string): string {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Pluralises a word based on a count.
 * pluralise(1, "member")  → "1 member"
 * pluralise(3, "member")  → "3 members"
 * pluralise(3, "match", "matches") → "3 matches"
 */
export function pluralise(
  count:    number,
  singular: string,
  plural?:  string,
): string {
  const word = count === 1
    ? singular
    : (plural ?? `${singular}s`);
  return `${formatCount(count)} ${word}`;
}

/**
 * Joins an array of strings naturally.
 * ["A", "B", "C"] → "A, B, and C"
 * ["A", "B"]      → "A and B"
 * ["A"]           → "A"
 */
export function joinNatural(items: string[]): string {
  if (items.length === 0) return '';
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  const last = items[items.length - 1];
  return `${items.slice(0, -1).join(', ')}, and ${last}`;
}

/**
 * Formats a name from parts.
 * ("Nadia", "Wolff") → "Nadia Wolff"
 */
export function formatFullName(
  firstName: string,
  lastName:  string,
): string {
  return [firstName, lastName].filter(Boolean).join(' ').trim();
}

/**
 * Returns a first name from a full name.
 * "Nadia Wolff" → "Nadia"
 */
export function getFirstName(fullName: string): string {
  return fullName.trim().split(' ')[0] ?? fullName;
}

/**
 * Strips extra whitespace from a string.
 */
export function normalise(str: string): string {
  return str.trim().replace(/\s+/g, ' ');
}

// ─────────────────────────────────────────────────────────────────
// Invite code formatting
// ─────────────────────────────────────────────────────────────────

/**
 * Normalises an invite code.
 * "JD-A9K2P" → "jd-a9k2p"
 * "JDA9K2P"  → "jda9k2-" (invalid — caller should validate)
 */
export function normaliseInviteCode(code: string): string {
  return code.trim().toLowerCase();
}

/**
 * Formats an invite link for display (strips https://).
 * "https://inner.co/invite/jd-a9k2p" → "inner.co/invite/jd-a9k2p"
 */
export function formatInviteLink(url: string): string {
  return url.replace(/^https?:\/\//, '');
}

// ─────────────────────────────────────────────────────────────────
// Tag / interest formatting
// ─────────────────────────────────────────────────────────────────

/**
 * Formats an array of tags for display.
 * ["Design", "Tech", "Art"] → "Design · Tech · Art"
 */
export function formatTags(
  tags:      string[],
  separator: string = ' · ',
): string {
  return tags.join(separator);
}

/**
 * Truncates a tag list with an overflow count.
 * (["A","B","C","D"], 2) → { visible: ["A","B"], overflow: 2 }
 */
export function truncateTags(
  tags: string[],
  max:  number,
): { visible: string[]; overflow: number } {
  return {
    visible:  tags.slice(0, max),
    overflow: Math.max(0, tags.length - max),
  };
}