import { useEffect } from 'react';
import { siteConfig } from '../config/site';

/** Sets `document.title` to "<title> — AI Principles Review" (or just the product name). */
export function useDocumentTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} — ${siteConfig.productName}` : siteConfig.productName;
  }, [title]);
}
