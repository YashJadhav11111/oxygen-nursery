import { useEffect, useRef, useState } from 'react';
import { isTouchDevice, prefersReducedMotion } from '@/motion/scrollEngine';

/**
 * A small seed-green dot with a soft ring following just behind it.
 *
 * The dot tracks the pointer exactly so precision is never lost; only the ring
 * lags, which is what gives the movement its weight. Over anything clickable
 * the ring opens up. It never replaces the system cursor — the real one stays
 * visible underneath, so nothing about using the site changes.
 *
 * Mounted only for mouse users who have not asked for reduced motion.
 */
export function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLSpanElement>(null);
  const dotRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (prefersReducedMotion() || isTouchDevice()) return;
    // Only switch on once we have seen a real mouse — a laptop with a
    // touchscreen should not get a cursor it never uses.
    const detect = (e: PointerEvent) => {
      if (e.pointerType === 'mouse') {
        setEnabled(true);
        window.removeEventListener('pointermove', detect);
      }
    };
    window.addEventListener('pointermove', detect, { passive: true });
    return () => window.removeEventListener('pointermove', detect);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const wrap = wrapRef.current;
    const ring = ringRef.current;
    const dot = dotRef.current;
    if (!wrap || !ring || !dot) return;

    let x = window.innerWidth / 2, y = window.innerHeight / 2;
    let rx = x, ry = y;
    let raf = 0;

    const render = () => {
      rx += (x - rx) * 0.18;
      ry += (y - ry) * 0.18;
      dot.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);

    const interactive = 'a, button, input, select, textarea, [role="button"], .chip, .recommender__option, .gallery__thumb';
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      x = e.clientX; y = e.clientY;
      wrap.classList.remove('is-hidden');
      const el = e.target as Element | null;
      wrap.classList.toggle('is-hot', Boolean(el?.closest?.(interactive)));
    };
    const onDown = () => wrap.classList.add('is-down');
    const onUp = () => wrap.classList.remove('is-down');
    const onLeave = () => wrap.classList.add('is-hidden');

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onDown, { passive: true });
    window.addEventListener('pointerup', onUp, { passive: true });
    document.addEventListener('pointerleave', onLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      document.removeEventListener('pointerleave', onLeave);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div className="cursor is-hidden" ref={wrapRef} aria-hidden="true">
      <span className="cursor__ring" ref={ringRef} />
      <span className="cursor__dot" ref={dotRef} />
    </div>
  );
}

export default Cursor;
