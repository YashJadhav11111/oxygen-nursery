import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from './scrollEngine';

/**
 * Toggles a class on an element while it is on screen, writing straight to the
 * DOM rather than through React state.
 *
 * This is what gates continuous animation. Anything that loops forever must
 * stop when nobody is looking at it — an off-screen animation is pure cost, and
 * on a long page there can be a lot of it. Going through React state would put
 * the toggle behind the scheduler, where fast scrolling can starve it.
 *
 * Under reduced motion the class is never added at all, so the caller's
 * animation simply never starts.
 */
export function useOnScreenClass<T extends HTMLElement = HTMLDivElement>(
  className = 'is-onscreen',
  rootMargin = '0px',
) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (prefersReducedMotion() || typeof IntersectionObserver === 'undefined') return;

    const io = new IntersectionObserver(
      ([entry]) => node.classList.toggle(className, entry.isIntersecting),
      { rootMargin },
    );
    io.observe(node);

    return () => {
      io.disconnect();
      node.classList.remove(className);
    };
  }, [className, rootMargin]);

  return ref;
}
