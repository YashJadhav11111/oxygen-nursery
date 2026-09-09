import { memo } from 'react';

/**
 * The hero scene, drawn as four separate depth planes rather than one picture.
 * ---------------------------------------------------------------------------
 * Splitting the scene into its own DOM layers is what makes the depth real: the
 * sky barely moves, the tree line lags, the nursery beds track the page, and the
 * foreground foliage leads it. Each plane can then be driven independently by
 * scroll and by the pointer.
 *
 * Every layer shares one viewBox and `slice` sizing so they stay registered
 * with each other at any aspect ratio.
 *
 * To use real nursery photography instead, replace HeroMid with an <img> — the
 * layering and motion continue to work unchanged.
 * ---------------------------------------------------------------------------
 */

const stage: React.CSSProperties = { width: '100%', height: '100%', display: 'block' };

const Svg = ({ children }: { children: React.ReactNode }) => (
  <svg
    viewBox="0 0 1600 900"
    preserveAspectRatio="xMidYMid slice"
    role="presentation"
    aria-hidden="true"
    focusable="false"
    style={stage}
  >
    {children}
  </svg>
);

function treeRow(y: number, scale: number, fill: string, count: number, seedOffset: number) {
  return Array.from({ length: count }).map((_, i) => {
    const x = ((i * 149 + seedOffset * 61) % 1680) - 40;
    const s = scale * (0.75 + ((i * 37) % 50) / 100);
    return (
      <g key={`${y}-${i}`} transform={`translate(${x} ${y}) scale(${s})`}>
        <rect x={-3} y={-16} width={6} height={20} fill={fill} />
        <circle cx={0} cy={-34} r={19} fill={fill} />
        <circle cx={-13} cy={-24} r={14} fill={fill} />
        <circle cx={14} cy={-25} r={13} fill={fill} />
        <circle cx={2} cy={-46} r={12} fill={fill} />
      </g>
    );
  });
}

/* ------------------------------ 1. SKY + LIGHT ---------------------------- */
export const HeroSky = memo(function HeroSky() {
  return (
    <Svg>
      <defs>
        <linearGradient id="hero-sky-g" x1="0" y1="0" x2="0.2" y2="1">
          <stop offset="0" stopColor="#07200F" />
          <stop offset="0.42" stopColor="#123A1C" />
          <stop offset="0.72" stopColor="#2A6B33" />
          <stop offset="1" stopColor="#4E9433" />
        </linearGradient>
        <radialGradient id="hero-sun-g" cx="0.74" cy="0.24" r="0.42">
          <stop offset="0" stopColor="#FFE9A8" stopOpacity="0.85" />
          <stop offset="0.45" stopColor="#EBC978" stopOpacity="0.28" />
          <stop offset="1" stopColor="#EBC978" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="1600" height="900" fill="url(#hero-sky-g)" />
      {/* Morning light, drifting very slowly across the scene */}
      <circle className="hero-sun" cx="1184" cy="216" r="470" fill="url(#hero-sun-g)" />
    </Svg>
  );
});

/* ------------------------------ 2. FAR RIDGE ------------------------------ */
export const HeroFar = memo(function HeroFar() {
  return (
    <Svg>
      <defs>
        <linearGradient id="hero-mist-g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#CFE7B4" stopOpacity="0" />
          <stop offset="1" stopColor="#CFE7B4" stopOpacity="0.32" />
        </linearGradient>
      </defs>
      <path
        d="M0 470 C 210 424, 372 486, 596 456 C 812 428, 980 480, 1180 452 C 1352 428, 1480 462, 1600 444 L1600 900 L0 900 Z"
        fill="#1B4A22" opacity="0.85"
      />
      <g opacity="0.5">{treeRow(468, 0.6, '#0E3315', 12, 1)}</g>
      <rect y="500" width="1600" height="130" fill="url(#hero-mist-g)" opacity="0.5" />
    </Svg>
  );
});

/* --------------------------- 3. NURSERY MIDGROUND ------------------------- */
export const HeroMid = memo(function HeroMid() {
  return (
    <Svg>
      <path
        d="M0 560 C 240 522, 420 588, 660 560 C 880 534, 1060 586, 1290 560 C 1430 544, 1520 570, 1600 556 L1600 900 L0 900 Z"
        fill="#245C29"
      />
      <g opacity="0.75">{treeRow(558, 0.95, '#153F1B', 11, 3)}</g>

      {/* Rows of stock running back into the scene */}
      <path d="M0 664 C 260 632, 500 690, 760 664 C 1010 640, 1240 686, 1600 654 L1600 900 L0 900 Z" fill="#2E7433" />
      <g opacity="0.22" stroke="#0B2A12" strokeWidth="3">
        {Array.from({ length: 7 }).map((_, i) => (
          <path key={i} d={`M${-120 + i * 260} 900 C ${140 + i * 240} 810, ${380 + i * 210} 736, ${520 + i * 200} 684`} fill="none" />
        ))}
      </g>
      <g opacity="0.9">
        {Array.from({ length: 26 }).map((_, i) => {
          const x = ((i * 83) % 1660) - 30;
          const y = 700 + ((i * 47) % 150);
          const r = 10 + ((i * 13) % 16);
          return <circle key={i} cx={x} cy={y} r={r} fill={i % 3 === 0 ? '#3E8C3A' : '#215C27'} opacity={0.75} />;
        })}
      </g>
    </Svg>
  );
});

/* --------------------------- 4. FOREGROUND FOLIAGE ------------------------ */
export const HeroNear = memo(function HeroNear() {
  return (
    <Svg>
      <defs>
        <linearGradient id="hero-front-g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0C2C13" />
          <stop offset="1" stopColor="#061A0A" />
        </linearGradient>
      </defs>
      {/* Planting crowding into the bottom corners, close to the viewer */}
      <g fill="url(#hero-front-g)">
        <path d="M-40 900 C 40 800, 120 742, 250 716 C 190 780, 176 840, 186 900 Z" />
        <path d="M120 900 C 150 806, 230 744, 344 720 C 286 786, 262 848, 268 900 Z" opacity="0.9" />
        <path d="M1660 900 C 1560 812, 1470 758, 1330 736 C 1398 796, 1424 848, 1418 900 Z" />
        <path d="M1490 900 C 1452 810, 1370 754, 1250 736 C 1316 798, 1340 850, 1338 900 Z" opacity="0.9" />
      </g>
      {/* Two big leaves just entering frame, catching a little light */}
      <g fill="#0B2A12" opacity="0.34">
        <path d="M1480 300 C 1400 336, 1352 424, 1372 512 C 1462 500, 1534 428, 1546 336 C 1530 310, 1508 298, 1480 300 Z" />
        <path d="M96 168 C 30 208, -2 292, 20 368 C 100 350, 158 282, 164 200 C 148 178, 124 166, 96 168 Z" />
      </g>
    </Svg>
  );
});

/** A large leaf silhouette that overhangs the very front of the frame. */
export const HeroLeaf = memo(function HeroLeaf({ mirrored = false }: { mirrored?: boolean }) {
  return (
    <svg viewBox="0 0 420 520" aria-hidden="true" focusable="false" style={{ width: '100%', height: 'auto', display: 'block', transform: mirrored ? 'scaleX(-1)' : undefined }}>
      <defs>
        <linearGradient id={`heroleaf-${mirrored ? 'b' : 'a'}`} x1="0.15" y1="0" x2="0.85" y2="1">
          <stop offset="0" stopColor="#1E4A26" />
          <stop offset="0.5" stopColor="#102E17" />
          <stop offset="1" stopColor="#05170A" />
        </linearGradient>
      </defs>
      <path
        d="M210 8 C 344 74, 412 232, 386 386 C 372 470, 320 512, 210 512 C 100 512, 48 470, 34 386 C 8 232, 76 74, 210 8 Z"
        fill={`url(#heroleaf-${mirrored ? 'b' : 'a'})`}
        stroke="rgba(150, 200, 120, 0.22)"
        strokeWidth="2"
      />
      <path d="M210 24 V500" stroke="rgba(255,255,255,0.09)" strokeWidth="4" strokeLinecap="round" />
      {[
        [120, 150], [180, 110], [244, 130], [300, 178], [340, 240],
      ].map(([y, reach], i) => (
        <g key={i} stroke="rgba(255,255,255,0.06)" strokeWidth="3" fill="none" strokeLinecap="round">
          <path d={`M210 ${y + 60} Q ${210 + reach * 0.5} ${y + 70}, ${210 + reach} ${y}`} />
          <path d={`M210 ${y + 60} Q ${210 - reach * 0.5} ${y + 70}, ${210 - reach} ${y}`} />
        </g>
      ))}
    </svg>
  );
});
