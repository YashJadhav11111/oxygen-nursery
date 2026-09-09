import { useEffect, useRef } from 'react';
import { isTouchDevice, onScrollFrame, prefersReducedMotion } from './scrollEngine';

interface Options {
  /**
   * How far the layer drifts relative to the scroll, as a fraction of its own
   * travel through the viewport. Negative lags behind the page (a background),
   * positive leads it (a foreground). Keep between about -0.3 and 0.3 — beyond
   * that it stops reading as depth and starts reading as seasickness.
   */
  speed?: number;
  scale?: number;
  /** How much of the effect survives on phones. 0 disables it there. */
  mobileFactor?: number;
  axis?: 'y' | 'x';
}

/**
 * Scroll parallax for a single element.
 *
 * The element's position is measured ONCE when it enters view (and again on
 * resize), not on every frame. Reading layout inside the scroll loop is what
 * turns a smooth page into a slideshow: each read after a write forces the
 * browser to re-run layout, and the cost multiplies by the number of moving
 * elements. Here each frame is pure arithmetic and a single transform write.
 */
export function useParallax<T extends HTMLElement = HTMLDivElement>({
  speed = -0.12,
  scale = 1,
  mobileFactor = 0.45,
  axis = 'y',
}: Options = {}) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (prefersReducedMotion()) return;

    const factor = isTouchDevice() ? speed * mobileFactor : speed;
    if (factor === 0) return;

    let nearViewport = false;
    let top = 0;
    let height = 0;
    const scaleSuffix = scale !== 1 ? ` scale(${scale})` : '';

    /** Measure with our own transform removed, so we read the resting position. */
    const measure = () => {
      const prev = node.style.transform;
      node.style.transform = 'none';
      const r = node.getBoundingClientRect();
      top = r.top + window.scrollY;
      height = r.height;
      node.style.transform = prev;
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        nearViewport = entry.isIntersecting;
        // Promote to its own compositor layer only while it is actually
        // moving; leaving will-change on permanently costs memory site-wide.
        node.style.willChange = nearViewport ? 'transform' : '';
        if (nearViewport) measure();
      },
      { rootMargin: '20% 0px 20% 0px' },
    );
    io.observe(node);
    measure();

    const onResize = () => measure();
    window.addEventListener('resize', onResize, { passive: true });

    const unsubscribe = onScrollFrame(({ scrollY, viewportH }) => {
      if (!nearViewport) return;
      // A second, purely arithmetic guard. IntersectionObserver callbacks are
      // async and can be starved during fast continuous scrolling, which would
      // leave a large layer being transformed long after it left the screen.
      // This costs two comparisons and is never late.
      if (top + height < scrollY - viewportH * 0.25 || top > scrollY + viewportH * 1.25) return;
      // -1 when the element sits just below the fold, +1 when just above it.
      const centre = top + height / 2 - scrollY;
      const rel = (centre - viewportH / 2) / (viewportH / 2 + height / 2);
      const shift = rel * factor * 100;
      node.style.transform =
        axis === 'y'
          ? `translate3d(0, ${shift.toFixed(1)}px, 0)${scaleSuffix}`
          : `translate3d(${shift.toFixed(1)}px, 0, 0)${scaleSuffix}`;
    });

    return () => {
      io.disconnect();
      unsubscribe();
      window.removeEventListener('resize', onResize);
      node.style.transform = '';
      node.style.willChange = '';
    };
  }, [speed, scale, mobileFactor, axis]);

  return ref;
}
