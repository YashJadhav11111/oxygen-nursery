import { useEffect, useRef } from 'react';
import { onScrollFrame, prefersReducedMotion } from './scrollEngine';

/**
 * Cinematic scroll depth for a large image.
 *
 * As the block rises through the viewport it settles: the picture eases from
 * slightly oversized to true size, its corners soften and its shadow deepens.
 * Driven by scroll position rather than a timeline, so it follows the visitor's
 * own pace and reverses cleanly.
 *
 * Geometry is measured on entry and on resize, never inside the scroll loop.
 * The scale updates every frame because it is composited; the radius and shadow
 * are quantised because they repaint.
 */
export function useScrollDepth<T extends HTMLElement = HTMLDivElement>(from = 1.08) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (prefersReducedMotion()) {
      node.style.setProperty('--depth-scale', '1');
      node.style.setProperty('--depth-progress', '1');
      return;
    }

    let near = false;
    let top = 0;
    let lastStep = -1;
    const inner = node.firstElementChild as HTMLElement | null;

    const measure = () => { top = node.getBoundingClientRect().top + window.scrollY; };

    const io = new IntersectionObserver(([e]) => {
      near = e.isIntersecting;
      if (inner) inner.style.willChange = near ? 'transform' : '';
      if (near) measure();
    }, { rootMargin: '25% 0px 25% 0px' });
    io.observe(node);
    measure();

    const onResize = () => measure();
    window.addEventListener('resize', onResize, { passive: true });

    const unsubscribe = onScrollFrame(({ scrollY, viewportH }) => {
      if (!near) return;
      const relTop = top - scrollY;
      // 0 while still below the fold → 1 once the block has risen into place.
      const t = Math.min(1, Math.max(0, 1 - (relTop - viewportH * 0.18) / (viewportH * 0.82)));
      const eased = 1 - Math.pow(1 - t, 3);
      // Scaling re-rasterises the layer, so the scale is quantised too: 24
      // steps across the whole travel is imperceptible (roughly 0.003 of scale
      // per step) but costs a fraction of the paint work of a fresh value on
      // every single frame.
      const stepped = Math.round(eased * 24) / 24;
      if (stepped === lastStep) return;
      lastStep = stepped;
      node.style.setProperty('--depth-progress', stepped.toFixed(3));
      node.style.setProperty('--depth-scale', (from - (from - 1) * stepped).toFixed(4));
    });

    return () => {
      io.disconnect();
      unsubscribe();
      window.removeEventListener('resize', onResize);
    };
  }, [from]);

  return ref;
}
