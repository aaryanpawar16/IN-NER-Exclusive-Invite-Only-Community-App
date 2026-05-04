// ─────────────────────────────────────────────────────────────────
// Array utilities
// ─────────────────────────────────────────────────────────────────

/**
 * Groups an array of objects by a key.
 * groupBy([{month:"May",...},{month:"May",...},{month:"Jun",...}], "month")
 * → { May: [...], Jun: [...] }
 */
export function groupBy<T>(
  items: T[],
  key:   keyof T,
): Record<string, T[]> {
  return items.reduce<Record<string, T[]>>((acc, item) => {
    const group = String(item[key]);
    if (!acc[group]) acc[group] = [];
    acc[group].push(item);
    return acc;
  }, {});
}

/**
 * Groups an array into pairs for a 2-column grid.
 * [A, B, C, D, E] → [[A,B], [C,D], [E]]
 */
export function pairUp<T>(items: T[]): T[][] {
  const pairs: T[][] = [];
  for (let i = 0; i < items.length; i += 2) {
    pairs.push(items.slice(i, i + 2));
  }
  return pairs;
}

/**
 * Chunks an array into groups of a specified size.
 */
export function chunk<T>(items: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
}

/**
 * Returns a new array with an item toggled in/out.
 */
export function toggleItem<T>(arr: T[], item: T): T[] {
  return arr.includes(item)
    ? arr.filter(i => i !== item)
    : [...arr, item];
}

/**
 * Returns unique items from an array.
 */
export function unique<T>(arr: T[]): T[] {
  return [...new Set(arr)];
}

/**
 * Returns unique items by a key.
 */
export function uniqueBy<T>(arr: T[], key: keyof T): T[] {
  const seen = new Set<unknown>();
  return arr.filter(item => {
    const k = item[key];
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

/**
 * Sorts an array by a key, ascending.
 */
export function sortBy<T>(arr: T[], key: keyof T): T[] {
  return [...arr].sort((a, b) => {
    const va = a[key];
    const vb = b[key];
    if (va < vb) return -1;
    if (va > vb) return 1;
    return 0;
  });
}

/**
 * Sorts an array by a key, descending.
 */
export function sortByDesc<T>(arr: T[], key: keyof T): T[] {
  return sortBy(arr, key).reverse();
}

/**
 * Moves an item to the top of an array if it matches a predicate.
 */
export function bubbleToTop<T>(
  arr:       T[],
  predicate: (item: T) => boolean,
): T[] {
  const matches    = arr.filter(predicate);
  const nonMatches = arr.filter(i => !predicate(i));
  return [...matches, ...nonMatches];
}

/**
 * Returns a shallow copy with an item updated at an index.
 */
export function updateAt<T>(arr: T[], index: number, updater: (item: T) => T): T[] {
  return arr.map((item, i) => i === index ? updater(item) : item);
}

/**
 * Returns a shallow copy with an item updated by id.
 */
export function updateById<T extends { id: number | string }>(
  arr:     T[],
  id:      T['id'],
  updater: (item: T) => T,
): T[] {
  return arr.map(item => item.id === id ? updater(item) : item);
}

/**
 * Returns a random sample of n items from an array.
 */
export function sample<T>(arr: T[], n: number): T[] {
  const copy = [...arr];
  const result: T[] = [];
  for (let i = 0; i < Math.min(n, copy.length); i++) {
    const idx = Math.floor(Math.random() * (copy.length - i));
    result.push(copy[idx]);
    copy[idx] = copy[copy.length - 1 - i];
  }
  return result;
}

/**
 * Returns true if two arrays have the same items (order-insensitive).
 */
export function sameItems<T>(a: T[], b: T[]): boolean {
  if (a.length !== b.length) return false;
  const setA = new Set(a);
  return b.every(item => setA.has(item));
}