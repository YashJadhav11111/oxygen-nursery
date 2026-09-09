import { useEffect, useRef } from 'react';
import { onScrollFrame, prefersReducedMotion } from '@/motion/scrollEngine';

/**
 * A thin vine that draws itself across the top of the page as you read.
 * Written straight to a CSS variable from the shared scroll loop, so it costs
 * no re-renders. Hidden entirely under reduced motion.
 */
export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || prefersReducedMotion()) return;
    return onScrollFrame(({ progress }) => {
      node.style.setProperty('--progress', progress.toFixed(4));
    });
  }, []);

  return (
    <div className="scroll-progress" ref={ref} aria-hidden="true">
      <div className="scroll-progress__line" />
      <span className="scroll-progress__tip" />
    </div>
  );
}

export default ScrollProgress;
