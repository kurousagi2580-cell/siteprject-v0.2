// lib/comments/rate-limit.ts
type Key = string;
const WINDOW_MS = 60 * 1000; // 1分
const MAX_REQUESTS = 5;

const store = new Map<Key, number[]>();

export function isRateLimited(key: Key): boolean {
  const now = Date.now();
  const windowStart = now - WINDOW_MS;
  const arr = store.get(key) ?? [];
  const filtered = arr.filter((t) => t > windowStart);
  filtered.push(now);
  store.set(key, filtered);
  return filtered.length > MAX_REQUESTS;
}
