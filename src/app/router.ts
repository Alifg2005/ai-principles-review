import { useSyncExternalStore } from 'react';

/**
 * Minimal History-API router. The app has three views, so a routing library
 * would be unnecessary weight. vercel.json rewrites unknown paths to index.html.
 */
const NAVIGATE_EVENT = 'mindlab:navigate';

function subscribe(callback: () => void) {
  window.addEventListener('popstate', callback);
  window.addEventListener(NAVIGATE_EVENT, callback);
  return () => {
    window.removeEventListener('popstate', callback);
    window.removeEventListener(NAVIGATE_EVENT, callback);
  };
}

const getPathname = () => window.location.pathname;

export function usePathname(): string {
  return useSyncExternalStore(subscribe, getPathname, () => '/');
}

export function navigate(to: string) {
  const [path = '/', hash] = to.split('#');
  if (path !== window.location.pathname) {
    window.history.pushState(null, '', to);
    window.dispatchEvent(new Event(NAVIGATE_EVENT));
    if (!hash) window.scrollTo({ top: 0 });
  }
  if (hash) {
    // Wait a frame so the target page has rendered before scrolling to it.
    requestAnimationFrame(() => document.getElementById(hash)?.scrollIntoView({ block: 'start' }));
  }
}

export type Route = { name: 'home' } | { name: 'chapter'; chapterId: string } | { name: 'not-found' };

export function matchRoute(pathname: string): Route {
  const clean = pathname.replace(/\/+$/, '') || '/';
  if (clean === '/') return { name: 'home' };
  const match = /^\/chapters\/([^/]+)$/.exec(clean);
  if (match?.[1]) return { name: 'chapter', chapterId: decodeURIComponent(match[1]) };
  return { name: 'not-found' };
}

export const chapterPath = (id: string) => `/chapters/${encodeURIComponent(id)}`;
