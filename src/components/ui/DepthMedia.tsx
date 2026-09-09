import type { ReactNode } from 'react';
import { useScrollDepth } from '@/motion/useScrollDepth';

interface Props {
  children: ReactNode;
  className?: string;
  /** How oversized the image starts before it settles to true size. */
  from?: number;
}

/**
 * A large image that settles as it rises into the viewport: it eases down from
 * slightly oversized to true size while its corners soften and its shadow
 * deepens. Driven by scroll position rather than a timeline, so it tracks the
 * visitor's own pace and reverses cleanly when they scroll back up.
 */
export function DepthMedia({ children, className = '', from = 1.08 }: Props) {
  const ref = useScrollDepth<HTMLDivElement>(from);
  return <div ref={ref} className={`depth-media ${className}`}>{children}</div>;
}

export default DepthMedia;
