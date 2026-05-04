import AsyncStorage from '@react-native-async-storage/async-storage';

// ─────────────────────────────────────────────────────────────────
// Typed AsyncStorage wrapper
// ─────────────────────────────────────────────────────────────────

export const storage = {

  /**
   * Gets a parsed JSON value from AsyncStorage.
   * Returns null if the key doesn't exist or parsing fails.
   */
  get: async <T>(key: string): Promise<T | null> => {
    try {
      const raw = await AsyncStorage.getItem(key);
      if (raw === null) return null;
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  },

  /**
   * Serialises and stores a value in AsyncStorage.
   */
  set: async <T>(key: string, value: T): Promise<boolean> => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Removes a key from AsyncStorage.
   */
  remove: async (key: string): Promise<boolean> => {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Checks whether a key exists in AsyncStorage.
   */
  has: async (key: string): Promise<boolean> => {
    try {
      const raw = await AsyncStorage.getItem(key);
      return raw !== null;
    } catch {
      return false;
    }
  },

  /**
   * Removes multiple keys at once.
   */
  removeMany: async (keys: string[]): Promise<boolean> => {
    try {
      await AsyncStorage.multiRemove(keys);
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Clears all AsyncStorage data for this app.
   * Use with caution.
   */
  clear: async (): Promise<boolean> => {
    try {
      await AsyncStorage.clear();
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Returns all stored keys.
   */
  keys: async (): Promise<string[]> => {
    try {
      return [...(await AsyncStorage.getAllKeys())];
    } catch {
      return [];
    }
  },
};

// ─────────────────────────────────────────────────────────────────
// Namespaced storage factory
// Creates a storage interface scoped to a key prefix.
// ─────────────────────────────────────────────────────────────────

export function createNamespacedStorage(namespace: string) {
  const prefix = (key: string) => `${namespace}:${key}`;

  return {
    get:       <T>(key: string)           => storage.get<T>(prefix(key)),
    set:       <T>(key: string, value: T) => storage.set(prefix(key), value),
    remove:    (key: string)              => storage.remove(prefix(key)),
    has:       (key: string)              => storage.has(prefix(key)),
  };
}

// ─────────────────────────────────────────────────────────────────
// Storage keys
// ─────────────────────────────────────────────────────────────────

export const STORAGE_KEYS = {
  SESSION:      'inner_session',
  AUTH_USER:    'inner_auth',
  ONBOARDED:    'inner_onboarded',
  VIEW_MODE:    'inner_view_mode',
  LAST_TAB:     'inner_last_tab',
} as const;

export type StorageKey = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS];