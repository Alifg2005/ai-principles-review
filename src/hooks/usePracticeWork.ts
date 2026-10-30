import { useState } from 'react';

/**
 * In-memory store for practice work, so a student's drawing or table survives moving between
 * questions and chapters. Nothing is persisted: a page reload starts clean.
 */
const store = new Map<string, unknown>();

export function usePracticeWork<T>(key: string, initial: T): [T, (next: T) => void] {
  const [value, setValue] = useState<T>(() => (store.has(key) ? (store.get(key) as T) : initial));
  const update = (next: T) => {
    store.set(key, next);
    setValue(next);
  };
  return [value, update];
}

/** Clears all stored work. */
export function resetPracticeWork() {
  store.clear();
}
