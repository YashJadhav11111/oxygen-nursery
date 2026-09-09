import { memo, useId } from 'react';
import type { ArtVariant } from '@/types';
import { createRng, rand, pick } from '@/lib/seed';

/**
 * BotanicalArt
 * ---------------------------------------------------------------------------
 * Generated botanical illustrations used as DEMO imagery throughout Phase 1.
 * Every composition is deterministic for a given `seed`, drawn in the Oxygen
 * Nursery brand greens, and is pure inline SVG — so it never fails to load,
 * costs no network request, and is never mistaken for a real nursery photo.
 *
 * To use a real photograph instead, set `src` on the PlantImage — SmartImage
 * will prefer it and this artwork is not rendered.
 * ---------------------------------------------------------------------------
 */

const GREENS = ['#1E5726', '#2A6E30', '#3E8C3A', '#4C9520', '#5FAC26', '#7BC23F', '#6FB05F'];
const DEEP = ['#0B2A12', '#113418', '#17441E'];

interface Props {
  variant?: ArtVariant;
  seed?: string;
  className?: string;
}

function leafPath(len: number, width: number) {
  return `M0 0 C ${width} ${len * 0.26}, ${width} ${len * 0.74}, 0 ${len} C ${-width} ${len * 0.74}, ${-width} ${len * 0.26}, 0 0 Z`;
}

function Leaf({
  x, y, rot, len, width, fill, opacity = 1, veins = true, veinColor = 'rgba(255,255,255,0.34)',
}: {
  x: number; y: number; rot: number; len: number; width: number;
  fill: string; opacity?: number; veins?: boolean; veinColor?: string;
}) {
  const ribs = [0.26, 0.44, 0.62, 0.78];
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`} opacity={opacity}>
      <path d={leafPath(len, width)} fill={fill} />
      {veins && (
        <g stroke={veinColor} strokeWidth={Math.max(0.8, len * 0.012)} strokeLinecap="round" fill="none">
          <path d={`M0 ${len * 0.06} L0 ${len * 0.94}`} />
          {ribs.map((t, i) => (
            <g key={i}>
              <path d={`M0 ${len * t} Q ${width * 0.42} ${len * (t + 0.02)}, ${width * 0.62} ${len * (t - 0.08)}`} />
              <path d={`M0 ${len * t} Q ${-width * 0.42} ${len * (t + 0.02)}, ${-width * 0.62} ${len * (t - 0.08)}`} />
            </g>
          ))}
        </g>
      )}
    </g>
  );
}

function Bloom({ x, y, r, petals, color, core }: { x: number; y: number; r: number; petals: number; color: string; core: string }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      {Array.from({ length: petals }).map((_, i) => (
        <ellipse
          key={i}
          rx={r * 0.42}
          ry={r}
          cy={-r * 0.72}
          fill={color}
          opacity={0.94}
          transform={`rotate(${(360 / petals) * i})`}
        />
      ))}
      <circle r={r * 0.34} fill={core} />
    </g>
  );
}

function Hills({ tones }: { tones: string[] }) {
  return (
    <>
      <path d="M0 214 C 70 190, 130 224, 196 208 C 262 192, 330 216, 400 200 L400 300 L0 300 Z" fill={tones[0]} opacity={0.9} />
      <path d="M0 240 C 90 222, 150 252, 226 238 C 300 224, 350 246, 400 236 L400 300 L0 300 Z" fill={tones[1]} />
      <path d="M0 268 C 110 254, 190 278, 268 266 C 330 256, 366 272, 400 266 L400 300 L0 300 Z" fill={tones[2]} />
    </>
  );
}

function MiniTree({ x, y, s, dark, light }: { x: number; y: number; s: number; dark: string; light: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={-2} y={-14} width={4} height={16} rx={1.6} fill="#5C3A1E" />
      <circle cx={0} cy={-26} r={14} fill={dark} />
      <circle cx={-9} cy={-19} r={10} fill={light} opacity={0.92} />
      <circle cx={10} cy={-20} r={9.5} fill={light} opacity={0.8} />
      <circle cx={2} cy={-33} r={9} fill={light} opacity={0.7} />
    </g>
  );
}

function BotanicalArtBase({ variant = 'foliage', seed = 'oxygen-nursery', className }: Props) {
  const uid = useId().replace(/:/g, '');
  const rng = createRng(`${variant}::${seed}`);
  const bgTop = variant === 'landscape' || variant === 'lawn' || variant === 'forest' || variant === 'terrace' ? '#E8F1DC' : '#F3F0E6';
  const bgBottom = '#DCE9CE';
  const tint = pick(rng, GREENS);

  const content = (() => {
    switch (variant) {
      case 'palm': {
        const fronds = 9;
        return (
          <g>
            {Array.from({ length: fronds }).map((_, i) => {
              const spread = -78 + (156 / (fronds - 1)) * i;
              const len = rand(rng, 150, 215);
              return (
                <Leaf
                  key={i}
                  x={200}
                  y={296}
                  rot={spread + 180}
                  len={len}
                  width={rand(rng, 14, 24)}
                  fill={GREENS[i % GREENS.length]}
                  opacity={0.93}
                />
              );
            })}
            <ellipse cx={200} cy={298} rx={34} ry={10} fill={DEEP[0]} opacity={0.35} />
          </g>
        );
      }
      case 'succulent': {
        const rings = [
          { n: 9, len: 96, w: 34, c: GREENS[1] },
          { n: 7, len: 68, w: 27, c: GREENS[3] },
          { n: 5, len: 44, w: 20, c: GREENS[5] },
        ];
        return (
          <g>
            {rings.map((ring, ri) =>
              Array.from({ length: ring.n }).map((_, i) => (
                <Leaf
                  key={`${ri}-${i}`}
                  x={200}
                  y={158}
                  rot={(360 / ring.n) * i + ri * 17}
                  len={ring.len}
                  width={ring.w}
                  fill={ring.c}
                  opacity={0.96}
                  veinColor="rgba(255,255,255,0.28)"
                />
              )),
            )}
            <circle cx={200} cy={158} r={9} fill={GREENS[6]} />
          </g>
        );
      }
      case 'flowering': {
        return (
          <g>
            {Array.from({ length: 7 }).map((_, i) => (
              <Leaf
                key={i}
                x={200}
                y={300}
                rot={180 + rand(rng, -74, 74)}
                len={rand(rng, 120, 195)}
                width={rand(rng, 34, 54)}
                fill={GREENS[(i + 1) % GREENS.length]}
                opacity={0.9}
              />
            ))}
            {Array.from({ length: 5 }).map((_, i) => (
              <Bloom
                key={i}
                x={rand(rng, 62, 338)}
                y={rand(rng, 74, 178)}
                r={rand(rng, 13, 22)}
                petals={Math.round(rand(rng, 5, 8))}
                color={pick(rng, ['#E8748C', '#F0A93C', '#E4586F', '#F2C14E', '#D9528B'])}
                core={'#8C5A17'}
              />
            ))}
          </g>
        );
      }
      case 'fruit': {
        return (
          <g>
            {Array.from({ length: 7 }).map((_, i) => (
              <Leaf
                key={i}
                x={200}
                y={300}
                rot={180 + rand(rng, -80, 80)}
                len={rand(rng, 118, 190)}
                width={rand(rng, 30, 48)}
                fill={GREENS[i % GREENS.length]}
                opacity={0.92}
              />
            ))}
            {Array.from({ length: 4 }).map((_, i) => {
              const fx = rand(rng, 78, 322);
              const fy = rand(rng, 96, 176);
              const fr = rand(rng, 15, 23);
              return (
                <g key={i}>
                  <path d={`M${fx} ${fy - fr} L${fx} ${fy - fr - 12}`} stroke="#5C3A1E" strokeWidth={2.6} strokeLinecap="round" />
                  <circle cx={fx} cy={fy} r={fr} fill={pick(rng, ['#E0642F', '#D8912A', '#C6402F', '#E39A2B'])} />
                  <circle cx={fx - fr * 0.3} cy={fy - fr * 0.32} r={fr * 0.26} fill="rgba(255,255,255,0.42)" />
                </g>
              );
            })}
          </g>
        );
      }
      case 'tree': {
        return (
          <g>
            <path d="M196 300 L196 176 Q188 150 174 136 M204 300 L204 168 Q214 146 230 132" stroke="#5C3A1E" strokeWidth={9} fill="none" strokeLinecap="round" />
            <rect x={190} y={196} width={20} height={104} rx={4} fill="#5C3A1E" />
            {Array.from({ length: 16 }).map((_, i) => (
              <circle
                key={i}
                cx={200 + rand(rng, -96, 96)}
                cy={rand(rng, 52, 158)}
                r={rand(rng, 22, 44)}
                fill={GREENS[i % GREENS.length]}
                opacity={rand(rng, 0.62, 0.95)}
              />
            ))}
            <ellipse cx={200} cy={298} rx={72} ry={11} fill={DEEP[0]} opacity={0.22} />
          </g>
        );
      }
      case 'shrub': {
        return (
          <g>
            {Array.from({ length: 22 }).map((_, i) => (
              <circle
                key={i}
                cx={200 + rand(rng, -122, 122)}
                cy={rand(rng, 120, 268)}
                r={rand(rng, 20, 42)}
                fill={GREENS[i % GREENS.length]}
                opacity={rand(rng, 0.55, 0.92)}
              />
            ))}
            {Array.from({ length: 5 }).map((_, i) => (
              <Leaf key={i} x={rand(rng, 80, 320)} y={rand(rng, 96, 150)} rot={rand(rng, 140, 220)} len={rand(rng, 46, 74)} width={rand(rng, 14, 22)} fill={GREENS[5]} />
            ))}
          </g>
        );
      }
      case 'landscape': {
        return (
          <g>
            <circle cx={318} cy={62} r={30} fill="#F3D479" opacity={0.75} />
            <Hills tones={[GREENS[5], GREENS[2], GREENS[0]]} />
            <path d="M150 300 C 178 258, 196 236, 214 214 L246 214 C 226 240, 208 266, 198 300 Z" fill="#E4DCC6" opacity={0.9} />
            {[[52, 236, 1], [98, 250, 0.8], [330, 244, 1.1], [286, 232, 0.75]].map(([x, y, s], i) => (
              <MiniTree key={i} x={x} y={y} s={s} dark={DEEP[1]} light={GREENS[3]} />
            ))}
            {Array.from({ length: 9 }).map((_, i) => (
              <Bloom key={i} x={rand(rng, 24, 380)} y={rand(rng, 262, 292)} r={rand(rng, 4, 7)} petals={5} color={pick(rng, ['#F2C14E', '#E8748C', '#F0A93C'])} core="#8C5A17" />
            ))}
          </g>
        );
      }
      case 'terrace': {
        return (
          <g>
            <rect x={0} y={0} width={400} height={300} fill="none" />
            <circle cx={70} cy={54} r={26} fill="#F3D479" opacity={0.6} />
            <rect x={0} y={214} width={400} height={86} fill="#DED6C2" />
            <rect x={0} y={206} width={400} height={10} fill="#C9C0A9" />
            {[36, 148, 260].map((x, gi) => (
              <g key={gi}>
                <rect x={x} y={168} width={104} height={44} rx={7} fill="#B5804C" />
                <rect x={x} y={168} width={104} height={9} rx={4} fill="#9A6538" />
                {Array.from({ length: 5 }).map((_, i) => (
                  <Leaf key={i} x={x + 16 + i * 18} y={168} rot={180 + rand(rng, -34, 34)} len={rand(rng, 46, 84)} width={rand(rng, 13, 22)} fill={GREENS[(i + gi) % GREENS.length]} />
                ))}
              </g>
            ))}
            <g stroke="#9AA39A" strokeWidth={3.5} strokeLinecap="round">
              <path d="M0 118 H400" />
              {Array.from({ length: 11 }).map((_, i) => <path key={i} d={`M${18 + i * 37} 118 V206`} />)}
            </g>
          </g>
        );
      }
      case 'vertical': {
        const cols = 6;
        const rows = 4;
        return (
          <g>
            <rect x={0} y={0} width={400} height={300} fill="#E7E2D2" />
            {Array.from({ length: rows }).map((_, r) =>
              Array.from({ length: cols }).map((_, c) => {
                const x = 18 + c * 62;
                const y = 22 + r * 68;
                return (
                  <g key={`${r}-${c}`}>
                    <rect x={x} y={y} width={54} height={58} rx={9} fill="#FFFFFF" opacity={0.55} />
                    {Array.from({ length: 4 }).map((_, i) => (
                      <Leaf
                        key={i}
                        x={x + 27}
                        y={y + 54}
                        rot={180 + rand(rng, -58, 58)}
                        len={rand(rng, 26, 48)}
                        width={rand(rng, 9, 15)}
                        fill={GREENS[(r + c + i) % GREENS.length]}
                        veins={false}
                      />
                    ))}
                  </g>
                );
              }),
            )}
          </g>
        );
      }
      case 'lawn': {
        return (
          <g>
            <rect x={0} y={0} width={400} height={300} fill="#DCEACB" />
            <path d="M0 150 C 90 128, 150 168, 240 148 C 310 132, 356 152, 400 142 L400 300 L0 300 Z" fill={GREENS[4]} />
            {Array.from({ length: 9 }).map((_, i) => (
              <path key={i} d={`M${-40 + i * 52} 300 L${20 + i * 52} 152 L${52 + i * 52} 152 L${-4 + i * 52} 300 Z`} fill="#FFFFFF" opacity={i % 2 ? 0.14 : 0.05} />
            ))}
            <path d="M0 150 C 90 128, 150 168, 240 148 C 310 132, 356 152, 400 142" stroke={DEEP[2]} strokeWidth={3} fill="none" opacity={0.5} />
            {[[36, 148, 0.9], [120, 140, 0.7], [300, 146, 1], [360, 140, 0.8]].map(([x, y, s], i) => (
              <MiniTree key={i} x={x} y={y} s={s} dark={DEEP[1]} light={GREENS[2]} />
            ))}
          </g>
        );
      }
      case 'forest': {
        return (
          <g>
            {[0, 1, 2].map((layer) => (
              <g key={layer} opacity={0.55 + layer * 0.22}>
                {Array.from({ length: 12 }).map((_, i) => (
                  <MiniTree
                    key={i}
                    x={rand(rng, -10, 410)}
                    y={168 + layer * 46 + rand(rng, -8, 8)}
                    s={0.8 + layer * 0.45}
                    dark={DEEP[Math.min(2, 2 - layer)]}
                    light={GREENS[layer + 1]}
                  />
                ))}
              </g>
            ))}
            <rect x={0} y={286} width={400} height={14} fill={DEEP[0]} opacity={0.5} />
          </g>
        );
      }
      case 'sprout': {
        return (
          <g>
            <path d="M0 236 C 100 214, 300 214, 400 236 L400 300 L0 300 Z" fill="#6B4A2A" />
            <path d="M0 250 C 120 232, 280 232, 400 250 L400 300 L0 300 Z" fill="#5C3A1E" />
            <path d="M200 244 V150" stroke={GREENS[2]} strokeWidth={5} strokeLinecap="round" fill="none" />
            <Leaf x={200} y={168} rot={-118} len={78} width={30} fill={GREENS[3]} />
            <Leaf x={200} y={186} rot={118} len={66} width={26} fill={GREENS[4]} />
            <Leaf x={200} y={150} rot={186} len={44} width={17} fill={GREENS[5]} />
            <circle cx={318} cy={62} r={26} fill="#F3D479" opacity={0.6} />
          </g>
        );
      }
      case 'foliage':
      default: {
        return (
          <g>
            {Array.from({ length: 4 }).map((_, i) => (
              <Leaf key={`bg${i}`} x={rand(rng, 40, 360)} y={rand(rng, -20, 40)} rot={rand(rng, 150, 210)} len={rand(rng, 110, 170)} width={rand(rng, 40, 62)} fill={GREENS[0]} opacity={0.22} veins={false} />
            ))}
            {Array.from({ length: 7 }).map((_, i) => (
              <Leaf
                key={i}
                x={200 + rand(rng, -46, 46)}
                y={300}
                rot={180 + rand(rng, -82, 82)}
                len={rand(rng, 130, 218)}
                width={rand(rng, 42, 70)}
                fill={GREENS[i % GREENS.length]}
                opacity={0.94}
              />
            ))}
            <ellipse cx={200} cy={299} rx={58} ry={9} fill={DEEP[0]} opacity={0.25} />
          </g>
        );
      }
    }
  })();

  return (
    <svg
      className={className}
      viewBox="0 0 400 300"
      preserveAspectRatio="xMidYMid slice"
      role="presentation"
      aria-hidden="true"
      focusable="false"
      style={{ width: '100%', height: '100%', display: 'block' }}
    >
      <defs>
        <linearGradient id={`bg-${uid}`} x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0" stopColor={bgTop} />
          <stop offset="1" stopColor={bgBottom} />
        </linearGradient>
        <radialGradient id={`glow-${uid}`} cx="0.72" cy="0.16" r="0.8">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.72" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="400" height="300" fill={`url(#bg-${uid})`} />
      <rect width="400" height="300" fill={`url(#glow-${uid})`} />
      {content}
      <rect width="400" height="300" fill={tint} opacity={0.04} />
    </svg>
  );
}

export const BotanicalArt = memo(BotanicalArtBase);
export default BotanicalArt;
