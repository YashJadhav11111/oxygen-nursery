import type { ReactNode } from 'react';
import { useOnScreenClass } from '@/motion/useOnScreenClass';

interface Props {
  children: ReactNode;
  className?: string;
}

/**
 * Wraps an illustration that should breathe.
 *
 * The same restraint applies as with SmartImage's `alive` prop: this is for the
 * one or two compositions on a page that carry it, never for a grid. The breath
 * only runs while the artwork is on screen, and not at all under reduced motion.
 */
export function LiveArt({ children, className = '' }: Props) {
  const ref = useOnScreenClass<HTMLDivElement>('is-onscreen');
  return (
    <div ref={ref} className={`media__art media__art--alive ${className}`}>
      {children}
    </div>
  );
}

export default LiveArt;
