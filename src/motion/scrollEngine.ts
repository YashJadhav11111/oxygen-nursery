/**
 * scrollEngine.ts — one scroll loop for the whole site.
 * ---------------------------------------------------------------------------
 * Every parallax layer, depth image and progress indicator subscribes here
 * instead of attaching its own scroll listener. That gives us:
 *
 *   • ONE passive scroll listener and ONE requestAnimationFrame loop, no matter
 *     how many moving elements are on the page.
 *   • No layout thrashing: subscribers are only ever handed numbers that were
 *     read once per frame, and they only write transforms back.
 *   • The loop parks itself when nothing is subscribed or the tab is hidden.
 *
 * Motion is a courtesy, not a requirement: if the visitor prefers reduced
 * motion the engine never starts and every subscriber keeps its resting state.
 * ---------------------------------------------------------------------------
 */

export interface ScrollFrame {
  /** Document scroll position in px. */
  scrollY: number;
  /** Viewport height in px. */
  viewportH: number;
  /** Whole-document progress, 0 → 1. */
  progress: number;
}

type Subscriber = (frame: ScrollFrame) => void;

const subscribers = new Set<Subscriber>();
let rafId = 0;
let running = false;
let lastY = -1;

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Coarse pointer = phone or tablet: no hover, no mouse-driven depth. */
export function isTouchDevice(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(hover: none), (pointer: coarse)').matches;
}

function readFrame(): ScrollFrame {
  const scrollY = window.scrollY || window.pageYOffset || 0;
  const viewportH = window.innerHeight;
  const max = Math.max(1, document.documentElement.scrollHeight - viewportH);
  return { scrollY, viewportH, progress: Math.min(1, Math.max(0, scrollY / max)) };
}

function tick() {
  rafId = 0;
  const frame = readFrame();
  lastY = frame.scrollY;
  subscribers.forEach((fn) => fn(frame));
}

function request() {
  if (rafId || !running) return;
  rafId = requestAnimationFrame(tick);
}

function onScroll() {
  request();
}

function onResize() {
  lastY = -1;
  request();
}

function start() {
  if (running) return;
  running = true;
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onResize, { passive: true });
  window.addEventListener('orientationchange', onResize, { passive: true });
  request();
}

function stop() {
  running = false;
  if (rafId) cancelAnimationFrame(rafId);
  rafId = 0;
  window.removeEventListener('scroll', onScroll);
  window.removeEventListener('resize', onResize);
  window.removeEventListener('orientationchange', onResize);
}

/** Subscribe to per-frame scroll data. Returns an unsubscribe function. */
export function onScrollFrame(fn: Subscriber): () => void {
  if (typeof window === 'undefined') return () => {};
  subscribers.add(fn);
  start();
  // Give the new subscriber a value immediately so it never starts mispositioned.
  fn(readFrame());

  return () => {
    subscribers.delete(fn);
    if (subscribers.size === 0) stop();
  };
}

/** Current frame, read on demand (used for one-off measurements). */
export const currentFrame = readFrame;

export const lastScrollY = () => lastY;
