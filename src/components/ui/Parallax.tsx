import type { ReactNode } from 'react';
import { useParallax } from '@/motion/useParallax';

interface Props {
  children: ReactNode;
  /** Negative lags behind the page (background), positive leads it (foreground). */
  speed?: number;
  scale?: number;
  className?: string;
  /** How much of the effect survives on phones. 0 disables it there. */
  mobileFactor?: number;
}

/**
 * A layer that drifts against the scroll to create depth.
 * Backgrounds take a small negative speed, foreground botanicals a small
 * positive one. Everything stays well under the threshold where parallax stops
 * feeling like depth and starts feeling like motion sickness.
 */
export function Parallax({ children, speed = -0.12, scale = 1.12, className = '', mobileFactor = 0.4 }: Props) {
  const ref = useParallax<HTMLDivElement>({ speed, scale, mobileFactor });
  return <div ref={ref} className={`parallax ${className}`}>{children}</div>;
}

export default Parallax;
