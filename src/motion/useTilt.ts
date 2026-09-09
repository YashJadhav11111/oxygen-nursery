import { useEffect, useRef } from 'react';
import { isTouchDevice, prefersReducedMotion } from './scrollEngine';

/**
 * A very slight 3D tilt, as though the card were a printed plant label being
 * turned in the hand. Rotation is capped low on purpose — the brief is a
 * physical card catching the light, not a spinning object.
 *
 * Desktop pointers only. On touch the card gets a CSS press state instead.
 */
export function useTilt<T extends HTMLElement = HTMLDivElement>(maxDeg = 4.5) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (prefersReducedMotion() || isTouchDevice()) return;

    let raf = 0;
    let tx = 0, ty = 0, cx = 0, cy = 0;
    let hovering = false;

    const render = () => {
      raf = 0;
      cx += (tx - cx) * 0.16;
      cy += (ty - cy) * 0.16;
      node.style.transform =
        `perspective(900px) rotateX(${(-cy * maxDeg).toFixed(3)}deg) rotateY(${(cx * maxDeg).toFixed(3)}deg) translate3d(0,${hovering ? '-6px' : '0'},0)`;
      // The inner media drifts a touch further than the card, which is what
      // sells the sense of the image sitting behind glass.
      const media = node.querySelector<HTMLElement>('[data-tilt-media]');
      if (media) media.style.transform = `translate3d(${(cx * 8).toFixed(2)}px, ${(cy * 8).toFixed(2)}px, 0) scale(${hovering ? 1.07 : 1})`;

      if (Math.abs(tx - cx) > 0.0008 || Math.abs(ty - cy) > 0.0008) raf = requestAnimationFrame(render);
    };

    const kick = () => { if (!raf) raf = requestAnimationFrame(render); };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      const r = node.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
      kick();
    };
    const onEnter = () => { hovering = true; node.style.willChange = 'transform'; kick(); };
    const onLeave = () => { hovering = false; tx = 0; ty = 0; kick(); setTimeout(() => { node.style.willChange = ''; }, 500); };

    node.addEventListener('pointermove', onMove);
    node.addEventListener('pointerenter', onEnter);
    node.addEventListener('pointerleave', onLeave);

    return () => {
      node.removeEventListener('pointermove', onMove);
      node.removeEventListener('pointerenter', onEnter);
      node.removeEventListener('pointerleave', onLeave);
      if (raf) cancelAnimationFrame(raf);
      node.style.transform = '';
      node.style.willChange = '';
    };
  }, [maxDeg]);

  return ref;
}
