import { useEffect } from 'react';
import { SEO } from '@/config/businessConfig';

interface SeoOptions {
  title?: string;
  description?: string;
  /** Pass false on the home page so the site title is not doubled up. */
  appendSiteName?: boolean;
}

const setMeta = (selector: string, attr: 'name' | 'property', key: string, content: string) => {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
};

/** Per-page document title, meta description and Open Graph tags. */
export function useSeo({ title, description, appendSiteName = true }: SeoOptions) {
  useEffect(() => {
    const fullTitle = title
      ? appendSiteName
        ? SEO.titleTemplate.replace('%s', title)
        : title
      : SEO.defaultTitle;
    const desc = description ?? SEO.defaultDescription;

    document.title = fullTitle;
    setMeta('meta[name="description"]', 'name', 'description', desc);
    setMeta('meta[property="og:title"]', 'property', 'og:title', fullTitle);
    setMeta('meta[property="og:description"]', 'property', 'og:description', desc);
  }, [title, description, appendSiteName]);
}
