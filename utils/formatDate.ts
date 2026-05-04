// ─────────────────────────────────────────────────────────────────
// Core formatters
// ─────────────────────────────────────────────────────────────────

/**
 * Returns a human-readable relative time string.
 * e.g. "just now", "2m", "1h", "3d", "Apr 12"
 */
export function formatRelativeTime(date: Date | string | number): string {
  const d     = new Date(date);
  const now   = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffS  = Math.floor(diffMs / 1000);
  const diffM  = Math.floor(diffS / 60);
  const diffH  = Math.floor(diffM / 60);
  const diffD  = Math.floor(diffH / 24);
  const diffW  = Math.floor(diffD / 7);

  if (diffS < 30)   return 'just now';
  if (diffS < 60)   return `${diffS}s`;
  if (diffM < 60)   return `${diffM}m`;
  if (diffH < 24)   return `${diffH}h`;
  if (diffD < 7)    return `${diffD}d`;
  if (diffW < 5)    return `${diffW}w`;

  return formatShortDate(d);
}

/**
 * Returns a short date string.
 * e.g. "Apr 12" or "Apr 12, 2024" if not current year
 */
export function formatShortDate(
  date:        Date | string | number,
  forceYear?:  boolean,
): string {
  const d          = new Date(date);
  const now        = new Date();
  const sameYear   = d.getFullYear() === now.getFullYear();
  const showYear   = forceYear || !sameYear;

  return d.toLocaleDateString('en-US', {
    month: 'short',
    day:   'numeric',
    ...(showYear ? { year: 'numeric' } : {}),
  });
}

/**
 * Returns a long date string.
 * e.g. "Saturday, April 12, 2025"
 */
export function formatLongDate(date: Date | string | number): string {
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year:    'numeric',
    month:   'long',
    day:     'numeric',
  });
}

/**
 * Returns a time string.
 * e.g. "6:30 PM"
 */
export function formatTime(date: Date | string | number): string {
  return new Date(date).toLocaleTimeString('en-US', {
    hour:   '2-digit',
    minute: '2-digit',
  });
}

/**
 * Returns date + time.
 * e.g. "Apr 12 · 6:30 PM"
 */
export function formatDateTime(date: Date | string | number): string {
  return `${formatShortDate(date)} · ${formatTime(date)}`;
}

/**
 * Returns a chat-style timestamp label.
 * e.g. "Today", "Yesterday", "Monday", "Apr 12"
 */
export function formatChatDate(date: Date | string | number): string {
  const d   = new Date(date);
  const now = new Date();

  const startOfToday     = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfYesterday = new Date(startOfToday.getTime() - 86_400_000);
  const startOfWeek      = new Date(startOfToday.getTime() - startOfToday.getDay() * 86_400_000);

  if (d >= startOfToday)     return 'Today';
  if (d >= startOfYesterday) return 'Yesterday';
  if (d >= startOfWeek) {
    return d.toLocaleDateString('en-US', { weekday: 'long' });
  }

  return formatShortDate(d);
}

/**
 * Returns a month + year label.
 * e.g. "May 2025"
 */
export function formatMonthYear(date: Date | string | number): string {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'long',
    year:  'numeric',
  });
}

/**
 * Returns just the month name.
 * e.g. "May"
 */
export function formatMonth(date: Date | string | number): string {
  return new Date(date).toLocaleDateString('en-US', { month: 'long' });
}

/**
 * Returns just the day number as a string.
 * e.g. "12"
 */
export function formatDay(date: Date | string | number): string {
  return new Date(date).getDate().toString();
}

/**
 * Returns abbreviated month.
 * e.g. "Apr"
 */
export function formatShortMonth(date: Date | string | number): string {
  return new Date(date).toLocaleDateString('en-US', { month: 'short' });
}

// ─────────────────────────────────────────────────────────────────
// Event-specific formatters
// ─────────────────────────────────────────────────────────────────

/**
 * Formats an event date for the date column badge.
 * Returns { day: "12", month: "May" }
 */
export function formatEventDate(date: Date | string | number): {
  day:   string;
  month: string;
} {
  const d = new Date(date);
  return {
    day:   d.getDate().toString(),
    month: d.toLocaleDateString('en-US', { month: 'short' }),
  };
}

/**
 * Returns true if the event date is in the past.
 */
export function isEventPast(day: string, month: string): boolean {
  const months: Record<string, number> = {
    Jan: 0, Feb: 1, Mar: 2,  Apr: 3,
    May: 4, Jun: 5, Jul: 6,  Aug: 7,
    Sep: 8, Oct: 9, Nov: 10, Dec: 11,
  };
  const now       = new Date();
  const eventDate = new Date(now.getFullYear(), months[month] ?? 0, parseInt(day));
  return eventDate < now;
}

/**
 * Returns true if the event is today.
 */
export function isEventToday(day: string, month: string): boolean {
  const months: Record<string, number> = {
    Jan: 0, Feb: 1, Mar: 2,  Apr: 3,
    May: 4, Jun: 5, Jul: 6,  Aug: 7,
    Sep: 8, Oct: 9, Nov: 10, Dec: 11,
  };
  const now       = new Date();
  const eventDate = new Date(now.getFullYear(), months[month] ?? 0, parseInt(day));
  return (
    eventDate.getDate()     === now.getDate()     &&
    eventDate.getMonth()    === now.getMonth()    &&
    eventDate.getFullYear() === now.getFullYear()
  );
}

// ─────────────────────────────────────────────────────────────────
// Membership duration
// ─────────────────────────────────────────────────────────────────

/**
 * Returns a human-readable membership duration.
 * e.g. "Member for 2 years", "Member for 8 months"
 */
export function formatMemberDuration(memberSince: string): string {
  const parts = memberSince.split(' ');
  if (parts.length < 2) return `Member since ${memberSince}`;

  const months: Record<string, number> = {
    January: 0, February: 1, March: 2,    April: 3,
    May: 4,     June: 5,     July: 6,     August: 7,
    September: 8, October: 9, November: 10, December: 11,
  };

  const month = months[parts[0]];
  const year  = parseInt(parts[1]);
  if (month === undefined || isNaN(year)) return `Member since ${memberSince}`;

  const since  = new Date(year, month, 1);
  const now    = new Date();
  const months_ = (now.getFullYear() - since.getFullYear()) * 12
    + (now.getMonth() - since.getMonth());

  if (months_ < 1)   return 'New member';
  if (months_ < 12)  return `Member for ${months_} month${months_ > 1 ? 's' : ''}`;

  const years = Math.floor(months_ / 12);
  return `Member for ${years} year${years > 1 ? 's' : ''}`;
}