import type { ElementType, ReactNode } from 'react';
import { useReveal } from '@/hooks/useReveal';

export type RevealVariant =
  | 'rise'        // lifts into place — the default
  | 'unfurl'      // opens from its base, like a new leaf
  | 'drift-left'  // arrives from the left
  | 'drift-right' // arrives from the right
  | 'settle'      // eases down from above
  | 'bloom'       // opens outward from its centre
  | 'sweep'       // uncovers itself left to right
  | 'grow';       // a rule extending

interface Props {
  children: ReactNode;
  as?: ElementType;
  /** Which way the content settles in. Vary by section, not by element. */
  variant?: RevealVariant;
  delay?: number;
  className?: string;
  /** Fraction of the element that must be visible before it plays. */
  threshold?: number;
  style?: React.CSSProperties;
}

/**
 * Scroll-triggered entrance.
 *
 * Reveals are composed at the section level rather than sprinkled on every
 * element: a heading and its supporting text arrive together, a grid arrives as
 * a short sequence. The observer disconnects after the first play, so a long
 * page costs nothing once it has been read.
 *
 * Honours prefers-reduced-motion by showing content immediately.
 */
export function Reveal({
  children, as: Tag = 'div', variant = 'rise', delay = 0, className = '', threshold, style,
}: Props) {
  const { ref, visible } = useReveal<HTMLDivElement>(threshold);
  return (
    <Tag
      ref={ref}
      className={`reveal reveal--${variant} ${visible ? 'is-visible' : ''} ${className}`}
      style={{ ...style, ['--reveal-delay' as string]: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}

export default Reveal;
