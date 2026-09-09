import { useEffect, useRef } from 'react';
import { isTouchDevice, prefersReducedMotion } from './scrollEngine';

/**
 * Gentle pointer-driven depth for a layered scene.
 *
 * Attach the returned ref to the scene container. Any descendant carrying
 * `data-depth="0.4"` is shifted by that fraction of the maximum travel, so
 * several layers move at different rates and the scene gains parallax as the
 * visitor moves the mouse across it.
 *
 * Desktop pointers only — on touch devices there is no hover to respond to, and
 * tying this to the accelerometer would be motion the visitor did not ask for.
 * The movement is eased towards its target each frame so it glides rather than
 * snapping to the cursor.
 */
export function usePointerDepth<T extends HTMLElement = HTMLDivElement>(maxShift = 16) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (prefersReducedMotion() || isTouchDevice()) return;

    // A layer with no depth would be written to every frame for no visible
    // change; skip it entirely rather than moving a full-screen plane by 0px.
    const layers = Array.from(node.querySelectorAll<HTMLElement>('[data-depth]'))
      .filter((el) => parseFloat(el.dataset.depth || '0') > 0.01);
    if (!layers.length) return;

    let targetX = 0, targetY = 0;
    let currentX = 0, currentY = 0;
    let raf = 0;
    let active = false;

    const render = () => {
      raf = 0;
      // Ease towards the pointer: a soft follow, never a hard snap.
      currentX += (targetX - currentX) * 0.075;
      currentY += (targetY - currentY) * 0.075;

      layers.forEach((layer) => {
        const depth = parseFloat(layer.dataset.depth || '0');
        const x = (currentX * maxShift * depth).toFixed(2);
        const y = (currentY * maxShift * depth * 0.6).toFixed(2);
        layer.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      });

      if (Math.abs(targetX - currentX) > 0.001 || Math.abs(targetY - currentY) > 0.001) {
        raf = requestAnimationFrame(render);
      } else {
        active = false;
      }
    };

    const kick = () => {
      if (!active) { active = true; raf = requestAnimationFrame(render); }
      else if (!raf) raf = requestAnimationFrame(render);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      const rect = node.getBoundingClientRect();
      targetX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      targetY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      kick();
    };

    const onLeave = () => { targetX = 0; targetY = 0; kick(); };

    window.addEventListener('pointermove', onMove, { passive: true });
    node.addEventListener('pointerleave', onLeave);

    return () => {
      window.removeEventListener('pointermove', onMove);
      node.removeEventListener('pointerleave', onLeave);
      if (raf) cancelAnimationFrame(raf);
      layers.forEach((l) => { l.style.transform = ''; });
    };
  }, [maxShift]);

  return ref;
}
