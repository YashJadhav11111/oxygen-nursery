interface Props {
  /** Which side of the section the edge sits on. */
  position?: 'top' | 'bottom';
  /** The colour the edge paints — normally the colour of the adjoining section. */
  fill?: string;
  variant?: 'hill' | 'ridge' | 'canopy';
  flip?: boolean;
  className?: string;
}

/**
 * A soft organic boundary between sections — a low rise of ground rather than a
 * ruled line. Pure inline SVG with no animation, so it costs nothing.
 */
export function SectionEdge({ position = 'bottom', fill = 'var(--bg)', variant = 'hill', flip = false, className = '' }: Props) {
  const paths: Record<string, string> = {
    // A gentle swell of ground
    hill: 'M0,64 C 220,18 420,74 720,44 C 980,18 1160,58 1440,30 L1440,80 L0,80 Z',
    // A longer, shallower ridge
    ridge: 'M0,58 C 300,80 500,20 780,38 C 1040,54 1220,14 1440,44 L1440,80 L0,80 Z',
    // A soft scalloped canopy line
    canopy: 'M0,50 C 120,72 200,28 320,46 C 440,64 520,24 640,44 C 760,64 840,26 960,44 C 1080,62 1180,28 1300,44 C 1370,53 1410,42 1440,38 L1440,80 L0,80 Z',
  };

  return (
    <svg
      className={`edge edge--${position} ${className}`}
      viewBox="0 0 1440 80"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
      style={{
        transform: `${position === 'top' ? 'scaleY(-1)' : ''} ${flip ? 'scaleX(-1)' : ''}`.trim() || undefined,
      }}
    >
      <path d={paths[variant]} fill={fill} />
    </svg>
  );
}

export default SectionEdge;
