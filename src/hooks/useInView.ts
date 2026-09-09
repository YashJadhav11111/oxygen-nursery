import { useEffect, useRef, useState } from 'react';

/**
 * Mounts heavy content only once it is near the viewport.
 *
 * The botanical illustrations are inline SVG — beautiful, but a few hundred
 * nodes each. Rendering every one on a long page puts thousands of nodes in the
 * DOM before the visitor has scrolled to them, which is exactly what makes a
 * site feel slow on a mid-range phone. This mounts them just before they are
 * needed and then stops observing.
 */
export function useInView<T extends HTMLElement = HTMLDivElement>(rootMargin = '600px', skip = false) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(skip);

  useEffect(() => {
    if (skip) { setInView(true); return; }
    const node = ref.current;
    if (!node) return;
    if (typeof IntersectionObserver === 'undefined') { setInView(true); return; }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [rootMargin, skip]);

  return { ref, inView };
}
