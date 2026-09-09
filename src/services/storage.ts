/**
 * Thin, safe wrapper over localStorage.
 * Every call is guarded so the site still works in private browsing, in SSR,
 * or when storage is full — the UI never sees an exception from here.
 */
const PREFIX = 'oxygen-nursery:';

export const storage = {
  get<T>(key: string, fallback: T): T {
    try {
      const raw = window.localStorage.getItem(PREFIX + key);
      return raw ? (JSON.parse(raw) as T) : fallback;
    } catch {
      return fallback;
    }
  },
  set<T>(key: string, value: T): boolean {
    try {
      window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  },
  remove(key: string): void {
    try {
      window.localStorage.removeItem(PREFIX + key);
    } catch {
      /* ignore */
    }
  },
};

export default storage;
