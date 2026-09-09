import { useEffect, useRef, useState } from 'react';

/**
 * Scroll-triggered reveal.
 *
 * Uses a zero threshold with a small negative bottom margin rather than a
 * percentage threshold. A percentage looks tidier but quietly breaks: any block
 * taller than the viewport can never reach, say, 12% visibility, so it would
 * stay invisible forever. Triggering on first overlap — held back slightly so
 * content is not revealed while still under the fold — behaves correctly at
 * every element size.
 *
 * The observer disconnects after the first reveal, and reduced motion skips it
 * entirely, so a long page costs nothing once it has been read.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(threshold?: number) {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduced || typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: threshold ?? 0, rootMargin: '0px 0px -72px 0px' },
    );
    observer.observe(node);

    // A page restored mid-scroll (a hash link, a back navigation) can place
    // content on screen before the observer's first callback; make sure
    // anything already visible is shown rather than waiting for a scroll.
    const failsafe = window.setTimeout(() => {
      const r = node.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) {
        setVisible(true);
        observer.disconnect();
      }
    }, 600);

    return () => {
      observer.disconnect();
      window.clearTimeout(failsafe);
    };
  }, [threshold]);

  return { ref, visible };
}
