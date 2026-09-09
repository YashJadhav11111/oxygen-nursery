import { memo, useId } from 'react';
import { createRng, rand } from '@/lib/seed';
import type { SceneVariant } from '@/types';

/**
 * SceneArt — illustrations of the WORK, not of plants.
 * ---------------------------------------------------------------------------
 * Each scene depicts what that service or project actually involves: a green
 * wall shows a planted wall, irrigation shows drip line and emitters, a
 * Miyawaki plot shows dense mulched saplings. No scene is reused for unrelated
 * work.
 *
 * Replace with real project photography by setting `src` on the image entry —
 * see SmartImage.
 * ---------------------------------------------------------------------------
 */

/** How much each scene is zoomed to fill the frame. 1 = composed to fit already. */
const FILL: Partial<Record<SceneVariant, number>> = {
  vertical: 1,
  'bare-wall': 1,
  pests: 1,
  sunlight: 1.05,
  terrace: 1.06,
  lawn: 1.14,
  nursery: 1.12,
  landscape: 1.26,
  greenbelt: 1.24,
  maintenance: 1.24,
  butterfly: 1.3,
  kitchen: 1.32,
  irrigation: 1.38,
  sprout: 1.36,
  cultural: 1.36,
  soil: 1.2,
  watering: 1.24,
  pruning: 1.2,
  miyawaki: 1.48,
  'bare-ground': 1.34,
};

const LEAF = ['#1E5726', '#2A6E30', '#3E8C3A', '#4C9520', '#5FAC26', '#7BC23F'];

/* ------------------------------- primitives -------------------------------- */

function Tree({ x, y, s = 1, dark = '#17441E', light = '#3E8C3A' }: { x: number; y: number; s?: number; dark?: string; light?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={-2.6} y={-15} width={5.2} height={18} rx={2} fill="#5C3A1E" />
      <circle cy={-28} r={15} fill={dark} />
      <circle cx={-10} cy={-20} r={11} fill={light} opacity={0.92} />
      <circle cx={11} cy={-21} r={10} fill={light} opacity={0.8} />
      <circle cx={2} cy={-36} r={9.5} fill={light} opacity={0.72} />
    </g>
  );
}

function Sapling({ x, y, s = 1, tone = '#3E8C3A' }: { x: number; y: number; s?: number; tone?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M0 0 V-16" stroke="#5C7A3A" strokeWidth={1.8} strokeLinecap="round" />
      <ellipse cx={-5} cy={-14} rx={5.5} ry={3.4} fill={tone} transform="rotate(-28 -5 -14)" />
      <ellipse cx={5} cy={-18} rx={5.5} ry={3.4} fill={tone} transform="rotate(28 5 -18)" />
      <ellipse cx={0} cy={-23} rx={4.6} ry={3} fill={tone} />
    </g>
  );
}

function Shrub({ x, y, r = 16, tone = '#2A6E30', tone2 = '#4C9520' }: { x: number; y: number; r?: number; tone?: string; tone2?: string }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <ellipse cy={2} rx={r * 1.1} ry={r * 0.28} fill="#14301A" opacity="0.18" />
      <circle cy={-r * 0.5} r={r} fill={tone} />
      <circle cx={-r * 0.5} cy={-r * 0.2} r={r * 0.66} fill={tone2} opacity="0.85" />
      <circle cx={r * 0.52} cy={-r * 0.3} r={r * 0.6} fill={tone2} opacity="0.7" />
    </g>
  );
}

function Sky({ uid, warm = false }: { uid: string; warm?: boolean }) {
  return <rect width="400" height="300" fill={`url(#${warm ? 'skyw' : 'sky'}-${uid})`} />;
}

/* --------------------------------- scenes ---------------------------------- */

function SceneArtBase({ variant, seed = 'scene', className }: { variant: SceneVariant; seed?: string; className?: string }) {
  const uid = useId().replace(/:/g, '');
  const rng = createRng(`${variant}::${seed}`);

  const body = (() => {
    switch (variant) {
      /* ------------------------- LANDSCAPE DESIGN ------------------------- */
      case 'landscape':
        return (
          <>
            <Sky uid={uid} />
            <path d="M0 150 C 90 138, 190 158, 280 146 C 340 138, 372 148, 400 142 L400 300 L0 300 Z" fill="#2C5F2A" opacity="0.35" />
            {/* Lawn */}
            <path d="M0 196 C 120 178, 250 206, 400 186 L400 300 L0 300 Z" fill="#4E9433" />
            <path d="M0 196 C 120 178, 250 206, 400 186" stroke="#2C5F2A" strokeWidth="2.5" fill="none" opacity="0.4" />
            {/* Curving path */}
            <path d="M126 300 C 158 258, 196 232, 244 214 L292 220 C 232 244, 190 266, 172 300 Z" fill="#E2DAC4" />
            <path d="M126 300 C 158 258, 196 232, 244 214" stroke="#C9BF9F" strokeWidth="2" fill="none" />
            {/* Planting beds */}
            <ellipse cx={72} cy={236} rx={62} ry={20} fill="#5C4527" opacity="0.55" />
            <ellipse cx={330} cy={246} rx={62} ry={20} fill="#5C4527" opacity="0.55" />
            {[40, 72, 104].map((x, i) => <Shrub key={i} x={x} y={238} r={15 + i * 2} />)}
            {[300, 332, 364].map((x, i) => <Shrub key={i} x={x} y={248} r={16 - i} tone="#1E5726" tone2="#5FAC26" />)}
            {[[38, 190, 0.9], [92, 182, 0.75], [318, 188, 1], [372, 182, 0.8]].map(([x, y, s], i) => (
              <Tree key={i} x={x} y={y} s={s} />
            ))}
            {Array.from({ length: 10 }).map((_, i) => (
              <circle key={i} cx={rand(rng, 20, 380)} cy={rand(rng, 250, 288)} r={rand(rng, 2, 3.6)} fill={['#F2C14E', '#E8748C', '#F0A93C'][i % 3]} />
            ))}
          </>
        );

      /* ---------------------------- TERRACE ------------------------------- */
      case 'terrace':
        return (
          <>
            <Sky uid={uid} warm />
            {/* City skyline hint */}
            <g opacity="0.16" fill="#17441E">
              <rect x={16} y={92} width={38} height={72} /><rect x={62} y={112} width={28} height={52} />
              <rect x={306} y={100} width={34} height={64} /><rect x={348} y={120} width={30} height={44} />
            </g>
            {/* Deck */}
            <rect y={196} width="400" height="104" fill="#D9CDB4" />
            <g stroke="#C2B394" strokeWidth="2" opacity="0.8">
              {[210, 228, 246, 264, 282].map((y) => <path key={y} d={`M0 ${y} H400`} />)}
            </g>
            {/* Railing */}
            <g stroke="#8E9A8C" strokeWidth="3.4" strokeLinecap="round">
              <path d="M0 158 H400" />
              {Array.from({ length: 12 }).map((_, i) => <path key={i} d={`M${14 + i * 34} 158 V196`} />)}
            </g>
            {/* Planters */}
            {[[24, 0], [150, 1], [276, 2]].map(([x, gi]) => (
              <g key={gi}>
                <rect x={x} y={172} width={102} height={40} rx={6} fill="#B5804C" />
                <rect x={x} y={172} width={102} height={8} rx={4} fill="#9A6538" />
                {Array.from({ length: 6 }).map((_, i) => (
                  <ellipse key={i} cx={x + 14 + i * 15} cy={162} rx={7} ry={14} fill={LEAF[(i + gi) % LEAF.length]} transform={`rotate(${-24 + i * 10} ${x + 14 + i * 15} 162)`} />
                ))}
              </g>
            ))}
            {/* Seating */}
            <g fill="#7E6244" opacity="0.9">
              <rect x={158} y={238} width={84} height={9} rx={4} />
              <rect x={166} y={247} width={7} height={26} rx={3} /><rect x={227} y={247} width={7} height={26} rx={3} />
            </g>
          </>
        );

      /* --------------------------- VERTICAL WALL --------------------------- */
      case 'vertical': {
        const cols = 7, rows = 5;
        return (
          <>
            <rect width="400" height="300" fill="#E7E2D2" />
            <rect x={18} y={16} width={364} height={252} rx={8} fill="#CFC7B2" />
            <rect x={24} y={22} width={352} height={240} rx={6} fill="#3B5A32" />
            {Array.from({ length: rows }).map((_, r) =>
              Array.from({ length: cols }).map((_, c) => {
                const x = 30 + c * 49;
                const y = 28 + r * 47;
                return (
                  <g key={`${r}-${c}`}>
                    <rect x={x} y={y} width={44} height={42} rx={6} fill="#2E4A28" opacity="0.6" />
                    {Array.from({ length: 5 }).map((_, i) => (
                      <ellipse
                        key={i}
                        cx={x + 8 + i * 7}
                        cy={y + 30 - (i % 2) * 8}
                        rx={7.5} ry={4.6}
                        fill={LEAF[(r + c + i) % LEAF.length]}
                        transform={`rotate(${-40 + i * 20} ${x + 8 + i * 7} ${y + 30 - (i % 2) * 8})`}
                      />
                    ))}
                  </g>
                );
              }),
            )}
            {/* Drip line down the wall */}
            <g stroke="#2B3A2B" strokeWidth="2" opacity="0.5">
              {[54, 152, 250, 348].map((x) => <path key={x} d={`M${x} 22 V262`} />)}
            </g>
            <rect y={268} width="400" height="32" fill="#D2C9B2" />
          </>
        );
      }

      /* ------------------------------- LAWN -------------------------------- */
      case 'lawn':
        return (
          <>
            <Sky uid={uid} />
            <path d="M0 148 C 110 132, 250 158, 400 138 L400 300 L0 300 Z" fill="#4E9433" />
            {Array.from({ length: 10 }).map((_, i) => (
              <path key={i} d={`M${-50 + i * 50} 300 L${34 + i * 46} 146 L${64 + i * 46} 146 L${-16 + i * 50} 300 Z`} fill="#FFFFFF" opacity={i % 2 ? 0.13 : 0.04} />
            ))}
            <path d="M0 148 C 110 132, 250 158, 400 138" stroke="#2C5F2A" strokeWidth="3" fill="none" opacity="0.45" />
            {[[30, 146, 0.85], [88, 138, 0.7], [312, 144, 1], [368, 136, 0.8]].map(([x, y, s], i) => <Tree key={i} x={x} y={y} s={s} />)}
            {/* Freshly cut edge */}
            <path d="M0 268 C 130 258, 280 272, 400 262" stroke="#2C5F2A" strokeWidth="2" fill="none" opacity="0.3" />
          </>
        );

      /* ---------------------------- IRRIGATION ----------------------------- */
      case 'irrigation':
        return (
          <>
            <Sky uid={uid} />
            <path d="M0 156 C 120 144, 260 166, 400 148 L400 300 L0 300 Z" fill="#3E7A34" opacity="0.5" />
            {/* Prepared bed */}
            <path d="M0 208 C 130 194, 270 216, 400 200 L400 300 L0 300 Z" fill="#5C4527" />
            <path d="M0 226 C 130 214, 270 234, 400 220 L400 300 L0 300 Z" fill="#6B5233" opacity="0.7" />
            {/* Drip lines with emitters */}
            {[236, 262, 288].map((y, li) => (
              <g key={li}>
                <path d={`M0 ${y} C 120 ${y - 8}, 270 ${y + 6}, 400 ${y - 4}`} stroke="#26332A" strokeWidth="4.5" fill="none" strokeLinecap="round" />
                {Array.from({ length: 7 }).map((_, i) => {
                  const x = 26 + i * 56;
                  const yy = y - 6 + Math.sin(i) * 3;
                  return (
                    <g key={i}>
                      <circle cx={x} cy={yy} r={4} fill="#39493B" />
                      {/* Emitter, stream and drop. The drop is given a class and
                          a staggered delay so the line can be made to actually
                          run when someone engages with the irrigation service. */}
                      <path
                        className="scene-stream"
                        d={`M${x} ${yy + 5} q 0 6, 0 8`}
                        stroke="#6FB6D8" strokeWidth="2.4" strokeLinecap="round" opacity="0.9"
                        style={{ ['--drip' as string]: `${(i % 4) * 0.32}s` }}
                      />
                      <circle
                        className="scene-drop"
                        cx={x} cy={yy + 15} r={2.6} fill="#6FB6D8" opacity="0.8"
                        style={{ ['--drip' as string]: `${(i % 4) * 0.32}s` }}
                      />
                    </g>
                  );
                })}
              </g>
            ))}
            {/* Young planting along the bed */}
            {Array.from({ length: 7 }).map((_, i) => <Sapling key={i} x={26 + i * 56} y={232} s={0.9} tone={LEAF[i % LEAF.length]} />)}
          </>
        );

      /* --------------------------- MAINTENANCE ----------------------------- */
      case 'maintenance':
        return (
          <>
            <Sky uid={uid} />
            <path d="M0 176 C 120 162, 260 184, 400 168 L400 300 L0 300 Z" fill="#4E9433" />
            {/* Clipped hedge, half-trimmed to show the work */}
            <rect x={28} y={168} width={150} height={64} rx={8} fill="#1E5726" />
            <rect x={28} y={168} width={150} height={12} rx={6} fill="#3E8C3A" />
            <path d="M182 172 C 196 158, 212 176, 226 162 C 240 150, 254 174, 268 164 L268 232 L182 232 Z" fill="#2A6E30" />
            {/* Shears */}
            <g transform="translate(288 176) rotate(-18)">
              <path d="M0 0 L34 -26 M0 10 L34 36" stroke="#8E9A8C" strokeWidth="5" strokeLinecap="round" />
              <path d="M0 0 L-20 6 M0 10 L-20 4" stroke="#7A5230" strokeWidth="6" strokeLinecap="round" />
              <circle cx={0} cy={5} r={3.4} fill="#5C6660" />
            </g>
            {/* Clippings */}
            {Array.from({ length: 12 }).map((_, i) => (
              <ellipse key={i} cx={rand(rng, 190, 300)} cy={rand(rng, 240, 288)} rx={5} ry={2.6} fill={LEAF[i % LEAF.length]} transform={`rotate(${rand(rng, -60, 60)} ${200 + i * 8} ${250 + i * 3})`} opacity="0.85" />
            ))}
            <Shrub x={340} y={244} r={26} />
          </>
        );

      /* -------------------------- KITCHEN GARDEN --------------------------- */
      case 'kitchen':
        return (
          <>
            <Sky uid={uid} />
            <path d="M0 168 C 120 156, 260 176, 400 160 L400 300 L0 300 Z" fill="#4E9433" opacity="0.5" />
            {[0, 1].map((row) => {
              const y = 196 + row * 62;
              return (
                <g key={row}>
                  <rect x={20 + row * 10} y={y} width={360 - row * 20} height={48} rx={5} fill="#7A5230" />
                  <rect x={20 + row * 10} y={y} width={360 - row * 20} height={9} rx={4} fill="#95693D" />
                  <rect x={26 + row * 10} y={y + 9} width={348 - row * 20} height={14} fill="#4E3A22" />
                  {Array.from({ length: 8 }).map((_, i) => {
                    const x = 42 + row * 10 + i * 42;
                    return (
                      <g key={i}>
                        {Array.from({ length: 5 }).map((_, k) => (
                          <ellipse key={k} cx={x + (k - 2) * 5} cy={y + 2 - Math.abs(k - 2) * 3} rx={6} ry={10} fill={LEAF[(i + k) % LEAF.length]} transform={`rotate(${(k - 2) * 22} ${x + (k - 2) * 5} ${y + 2})`} />
                        ))}
                        {i % 3 === 0 && <circle cx={x} cy={y - 6} r={4.6} fill="#D2542A" />}
                        {i % 3 === 1 && <circle cx={x + 4} cy={y - 4} r={4} fill="#E0A02E" />}
                      </g>
                    );
                  })}
                </g>
              );
            })}
          </>
        );

      /* --------------------------- MIYAWAKI PLOT --------------------------- */
      case 'miyawaki':
        return (
          <>
            <Sky uid={uid} />
            <path d="M0 152 C 120 142, 260 162, 400 146 L400 300 L0 300 Z" fill="#2C5F2A" opacity="0.4" />
            {/* Mulched plot */}
            <path d="M0 186 C 120 176, 270 194, 400 180 L400 300 L0 300 Z" fill="#6B5233" />
            <g opacity="0.35">
              {Array.from({ length: 40 }).map((_, i) => (
                <ellipse key={i} cx={rand(rng, 0, 400)} cy={rand(rng, 196, 296)} rx={rand(rng, 4, 9)} ry={2} fill="#8A6B45" transform={`rotate(${rand(rng, -40, 40)} 200 240)`} />
              ))}
            </g>
            {/* Dense multi-layer native planting on a close grid */}
            {[0, 1, 2, 3].map((row) =>
              Array.from({ length: 9 - row }).map((_, i) => {
                const y = 206 + row * 26;
                const x = 22 + i * (400 / (9 - row)) + row * 10;
                return <Sapling key={`${row}-${i}`} x={x} y={y} s={0.8 + row * 0.28} tone={LEAF[(row + i) % LEAF.length]} />;
              }),
            )}
          </>
        );

      /* -------------------------- GREEN BELT ------------------------------- */
      case 'greenbelt':
        return (
          <>
            <Sky uid={uid} />
            {/* Industrial boundary behind the planting */}
            <g opacity="0.28" fill="#4A5450">
              <rect x={0} y={104} width={92} height={62} /><rect x={104} y={122} width={70} height={44} />
              <rect x={250} y={112} width={84} height={54} /><rect x={344} y={128} width={56} height={38} />
              <path d="M28 104 V82 h14 v22" />
            </g>
            <rect y={162} width="400" height="14" fill="#9AA39A" opacity="0.5" />
            {/* Layered buffer rows */}
            {[[196, 0.72, 0.5], [222, 0.95, 0.75], [252, 1.2, 1]].map(([y, s, op], row) => (
              <g key={row} opacity={op as number}>
                {Array.from({ length: row === 2 ? 6 : 8 }).map((_, i) => (
                  <Tree key={i} x={16 + i * (400 / (row === 2 ? 6 : 8)) + row * 12} y={y as number} s={s as number} dark={row === 0 ? '#17441E' : '#1E5726'} light={LEAF[(row + i) % LEAF.length]} />
                ))}
              </g>
            ))}
            {/* Approach road */}
            <path d="M0 292 C 120 284, 280 296, 400 286 L400 300 L0 300 Z" fill="#8A8A82" opacity="0.5" />
          </>
        );

      /* ------------------------- CULTURAL FOREST --------------------------- */
      case 'cultural':
        return (
          <>
            <Sky uid={uid} warm />
            <path d="M0 158 C 120 146, 260 168, 400 150 L400 300 L0 300 Z" fill="#2C5F2A" opacity="0.4" />
            <path d="M0 200 C 130 188, 270 208, 400 194 L400 300 L0 300 Z" fill="#4E9433" />
            {/* Walking route through the grove */}
            <path d="M174 300 C 186 262, 196 236, 206 214 L238 214 C 224 240, 212 266, 206 300 Z" fill="#E2DAC4" opacity="0.9" />
            {/* Grove arranged around the path */}
            {[[24, 240, 1.15], [70, 224, 0.95], [116, 244, 1.05], [150, 220, 0.85], [274, 226, 1], [312, 246, 1.2], [352, 228, 0.95], [386, 244, 1.1], [58, 200, 0.7], [330, 202, 0.72]].map(([x, y, s], i) => (
              <Tree key={i} x={x} y={y} s={s} light={LEAF[i % LEAF.length]} />
            ))}
            {/* Interpretation marker */}
            <g transform="translate(258 214)">
              <rect x={-2.5} y={-4} width={5} height={26} fill="#7A5230" />
              <rect x={-20} y={-26} width={40} height={24} rx={4} fill="#F2EADA" stroke="#B5804C" strokeWidth="1.6" />
              <path d="M-12 -18 h24 M-12 -12 h18 M-12 -7 h20" stroke="#8A7355" strokeWidth="1.6" strokeLinecap="round" />
            </g>
          </>
        );

      /* --------------------------- BUTTERFLY ------------------------------- */
      case 'butterfly':
        return (
          <>
            <Sky uid={uid} warm />
            <path d="M0 176 C 120 164, 260 186, 400 170 L400 300 L0 300 Z" fill="#4E9433" />
            {/* Nectar planting in drifts */}
            {Array.from({ length: 34 }).map((_, i) => {
              const x = rand(rng, 10, 390);
              const y = rand(rng, 200, 292);
              const c = ['#E8748C', '#F2C14E', '#D9528B', '#F0A93C', '#B978C4'][i % 5];
              return (
                <g key={i}>
                  <path d={`M${x} ${y} V${y - 14}`} stroke="#2C5F2A" strokeWidth="1.8" />
                  {Array.from({ length: 5 }).map((_, k) => (
                    <ellipse key={k} cx={x} cy={y - 18} rx={2.4} ry={4.4} fill={c} transform={`rotate(${k * 72} ${x} ${y - 14})`} />
                  ))}
                  <circle cx={x} cy={y - 14} r={1.8} fill="#F6E3A8" />
                </g>
              );
            })}
            {/* Butterflies */}
            {[[92, 132, 1], [232, 106, 0.8], [306, 150, 0.9]].map(([x, y, s], i) => (
              <g key={i} transform={`translate(${x} ${y}) scale(${s})`}>
                <path d="M0 0 C -16 -14, -22 4, -4 8 Z" fill={['#E58A2E', '#C2185B', '#3F7BC4'][i]} />
                <path d="M0 0 C 16 -14, 22 4, 4 8 Z" fill={['#F0A93C', '#E1568C', '#5A96D8'][i]} />
                <path d="M0 -3 V9" stroke="#2B2118" strokeWidth="2" strokeLinecap="round" />
                <path d="M0 -3 l-5 -6 M0 -3 l5 -6" stroke="#2B2118" strokeWidth="1.4" strokeLinecap="round" />
              </g>
            ))}
          </>
        );

      /* ------------------------- NURSERY / SUPPLY -------------------------- */
      case 'nursery':
        return (
          <>
            <rect width="400" height="300" fill={`url(#sky-${uid})`} />
            <g opacity="0.16" stroke="#1B4520" strokeWidth="2">
              {[60, 140, 220, 300, 380].map((x) => <path key={x} d={`M${x} 0 V180`} />)}
              <path d="M0 60 H400" /><path d="M0 120 H400" />
            </g>
            {/* Benches of potted stock, receding */}
            {[[188, 0.75, 0.65], [226, 0.95, 0.85], [272, 1.18, 1]].map(([y, s, op], row) => (
              <g key={row} opacity={op as number}>
                <rect y={(y as number) + 6} width="400" height="7" fill="#9A8A6C" />
                {Array.from({ length: row === 2 ? 7 : 10 }).map((_, i) => {
                  const x = 24 + i * (400 / (row === 2 ? 7 : 10));
                  const sc = s as number;
                  return (
                    <g key={i} transform={`translate(${x} ${y as number}) scale(${sc})`}>
                      <path d="M-9 0 L-7 14 h14 L9 0 Z" fill={i % 3 === 0 ? '#B46B45' : '#333B37'} />
                      {Array.from({ length: 4 }).map((_, k) => (
                        <ellipse key={k} cx={(k - 1.5) * 5} cy={-8 - Math.abs(k - 1.5) * 2} rx={5} ry={9} fill={LEAF[(i + k) % LEAF.length]} transform={`rotate(${(k - 1.5) * 24} ${(k - 1.5) * 5} -8)`} />
                      ))}
                    </g>
                  );
                })}
              </g>
            ))}
          </>
        );

      /* ----------------------- PLANT-CARE GUIDE SCENES --------------------- */
      case 'watering':
        return (
          <>
            <Sky uid={uid} />
            <path d="M0 214 C 130 202, 270 222, 400 208 L400 300 L0 300 Z" fill="#5C4527" />
            <g transform="translate(196 190)">
              <path d="M-30 0 h44 a10 10 0 0 1 10 10 v22 a10 10 0 0 1 -10 10 h-44 a10 10 0 0 1 -10 -10 v-22 a10 10 0 0 1 10 -10 z" fill="#8E9A8C" />
              <path d="M-38 6 L-72 -12 l-6 8 L-40 20 Z" fill="#8E9A8C" />
              <path d="M14 0 q 18 -14, 26 6" stroke="#8E9A8C" strokeWidth="5" fill="none" strokeLinecap="round" />
            </g>
            {Array.from({ length: 9 }).map((_, i) => (
              <circle key={i} cx={120 - i * 5 + rand(rng, -4, 4)} cy={196 + i * 9} r={2.6} fill="#6FB6D8" opacity={0.9 - i * 0.06} />
            ))}
            {Array.from({ length: 4 }).map((_, i) => (
              <g key={i} transform={`translate(${80 + i * 12} ${228})`}>
                <path d="M0 0 V-22" stroke="#2C5F2A" strokeWidth="2.4" strokeLinecap="round" />
                <ellipse cx={-6} cy={-20} rx={7} ry={4} fill={LEAF[i % LEAF.length]} transform="rotate(-30 -6 -20)" />
                <ellipse cx={6} cy={-25} rx={7} ry={4} fill={LEAF[(i + 2) % LEAF.length]} transform="rotate(30 6 -25)" />
              </g>
            ))}
          </>
        );

      case 'sunlight':
        return (
          <>
            <Sky uid={uid} warm />
            <circle cx={306} cy={72} r={44} fill="#F3D479" opacity="0.55" />
            <circle cx={306} cy={72} r={24} fill="#F6E3A8" opacity="0.75" />
            <g stroke="#F3D479" strokeWidth="3" strokeLinecap="round" opacity="0.5">
              {Array.from({ length: 8 }).map((_, i) => (
                <path key={i} transform={`rotate(${i * 45} 306 72)`} d="M306 12 V-2" />
              ))}
            </g>
            {/* Light falling across a windowsill */}
            <path d="M0 300 L110 138 h96 L110 300 Z" fill="#F6E3A8" opacity="0.28" />
            <rect y={236} width="400" height="64" fill="#DED6C2" />
            <rect y={230} width="400" height="8" fill="#C9C0A9" />
            {[86, 168, 262].map((x, i) => (
              <g key={i} transform={`translate(${x} 232)`}>
                <path d="M-14 0 L-11 22 h22 L14 0 Z" fill={i === 1 ? '#B46B45' : '#EDE8DA'} />
                {Array.from({ length: 5 }).map((_, k) => (
                  <ellipse key={k} cx={(k - 2) * 6} cy={-14 - Math.abs(k - 2) * 3} rx={6} ry={12} fill={LEAF[(i + k) % LEAF.length]} transform={`rotate(${(k - 2) * 20} ${(k - 2) * 6} -14)`} />
                ))}
              </g>
            ))}
          </>
        );

      case 'soil':
        return (
          <>
            <Sky uid={uid} />
            {/* A cut through the soil profile */}
            <rect y={150} width="400" height="150" fill="#6B5233" />
            <path d="M0 150 C 120 140, 270 160, 400 146 L400 190 C 270 202, 120 184, 0 194 Z" fill="#8A6B45" />
            <path d="M0 194 C 120 184, 270 202, 400 190 L400 232 C 270 244, 120 226, 0 236 Z" fill="#6B5233" />
            <g opacity="0.5">
              {Array.from({ length: 30 }).map((_, i) => (
                <circle key={i} cx={rand(rng, 0, 400)} cy={rand(rng, 200, 292)} r={rand(rng, 1.6, 4)} fill="#A9895E" />
              ))}
            </g>
            {/* Roots */}
            <g stroke="#C9B48E" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.8">
              <path d="M200 150 V236 M200 176 q -26 14, -40 34 M200 196 q 28 12, 42 32 M200 214 q -18 12, -26 28" />
            </g>
            <g transform="translate(200 150)">
              <path d="M0 0 V-34" stroke="#2C5F2A" strokeWidth="3.4" strokeLinecap="round" />
              <ellipse cx={-12} cy={-30} rx={13} ry={7} fill="#3E8C3A" transform="rotate(-28 -12 -30)" />
              <ellipse cx={12} cy={-38} rx={13} ry={7} fill="#5FAC26" transform="rotate(28 12 -38)" />
            </g>
          </>
        );

      case 'pruning':
        return (
          <>
            <Sky uid={uid} />
            <path d="M0 200 C 130 188, 270 208, 400 194 L400 300 L0 300 Z" fill="#4E9433" opacity="0.6" />
            <g transform="translate(150 210)">
              <path d="M0 80 V-26" stroke="#6B5138" strokeWidth="9" strokeLinecap="round" />
              <path d="M0 8 L-46 -30 M0 -6 L44 -40 M0 -22 L-34 -60" stroke="#6B5138" strokeWidth="5.5" strokeLinecap="round" />
              {[[-46, -30], [44, -40], [-34, -60], [0, -26]].map(([x, y], i) => (
                <circle key={i} cx={x} cy={y} r={17} fill={LEAF[i % 3]} opacity="0.92" />
              ))}
            </g>
            {/* Secateurs mid-cut */}
            <g transform="translate(250 168) rotate(24)">
              <path d="M0 0 L30 -20 M0 9 L30 30" stroke="#8E9A8C" strokeWidth="5.5" strokeLinecap="round" />
              <path d="M0 0 L-24 8 M0 9 L-24 3" stroke="#B5804C" strokeWidth="7" strokeLinecap="round" />
              <circle cx={1} cy={4.5} r={3.6} fill="#5C6660" />
            </g>
            {Array.from({ length: 7 }).map((_, i) => (
              <ellipse key={i} cx={rand(rng, 210, 300)} cy={rand(rng, 240, 286)} rx={6} ry={3} fill={LEAF[i % LEAF.length]} transform={`rotate(${rand(rng, -50, 50)} 250 260)`} />
            ))}
          </>
        );

      case 'pests':
        return (
          <>
            <Sky uid={uid} />
            {/* A single leaf, examined closely */}
            <g transform="translate(200 150) rotate(14)">
              <path d="M0 -110 C 80 -60, 84 60, 0 112 C -84 60, -80 -60, 0 -110 Z" fill="#2A6E30" />
              <path d="M0 -104 V106" stroke="rgba(255,255,255,0.24)" strokeWidth="3" strokeLinecap="round" />
              {Array.from({ length: 6 }).map((_, i) => {
                const y = -78 + i * 32;
                return (
                  <g key={i} stroke="rgba(255,255,255,0.18)" strokeWidth="2.2" fill="none" strokeLinecap="round">
                    <path d={`M0 ${y} Q 34 ${y + 8}, 52 ${y - 12}`} />
                    <path d={`M0 ${y} Q -34 ${y + 8}, -52 ${y - 12}`} />
                  </g>
                );
              })}
              {/* Damage and a few insects */}
              <circle cx={-26} cy={12} r={9} fill="#8A6B45" opacity="0.55" />
              <circle cx={18} cy={-34} r={6} fill="#8A6B45" opacity="0.5" />
              {[[30, 30], [-14, -52], [8, 62]].map(([x, y], i) => (
                <g key={i} transform={`translate(${x} ${y})`}>
                  <ellipse rx={5} ry={3.4} fill="#7E5A2E" />
                  <circle cx={-4.6} cy={-1} r={2} fill="#5C4527" />
                </g>
              ))}
            </g>
            {/* Magnifier */}
            <g transform="translate(276 96)">
              <circle r={40} fill="#FFFFFF" opacity="0.18" stroke="#8E9A8C" strokeWidth="6" />
              <path d="M28 28 L58 58" stroke="#7A5230" strokeWidth="9" strokeLinecap="round" />
            </g>
          </>
        );

      /* ---------------------- "BEFORE" STATES ------------------------------ */
      case 'bare-ground':
        return (
          <>
            <Sky uid={uid} />
            <path d="M0 172 C 120 162, 260 180, 400 166 L400 300 L0 300 Z" fill="#8A7355" opacity="0.5" />
            <path d="M0 200 C 130 190, 270 210, 400 196 L400 300 L0 300 Z" fill="#6B5233" />
            <path d="M0 232 C 130 224, 270 240, 400 228 L400 300 L0 300 Z" fill="#7A6242" opacity="0.7" />
            <g opacity="0.4">
              {Array.from({ length: 26 }).map((_, i) => (
                <ellipse key={i} cx={rand(rng, 0, 400)} cy={rand(rng, 208, 292)} rx={rand(rng, 3, 8)} ry={rand(rng, 1.5, 3)} fill="#5C4527" />
              ))}
            </g>
            {/* A few surviving weeds — the state a plot is usually handed over in */}
            {Array.from({ length: 5 }).map((_, i) => (
              <g key={i} transform={`translate(${rand(rng, 40, 360)} ${rand(rng, 236, 284)})`}>
                <path d="M0 0 V-12" stroke="#7E8A52" strokeWidth="1.6" strokeLinecap="round" />
                <ellipse cx={-4} cy={-11} rx={4} ry={2} fill="#8A9A5A" transform="rotate(-30 -4 -11)" />
                <ellipse cx={4} cy={-13} rx={4} ry={2} fill="#7E8A52" transform="rotate(30 4 -13)" />
              </g>
            ))}
          </>
        );

      case 'bare-wall':
        return (
          <>
            <rect width="400" height="300" fill="#E7E2D2" />
            <rect x={18} y={16} width={364} height={252} rx={8} fill="#DCD5C2" />
            <rect x={24} y={22} width={352} height={240} rx={6} fill="#CFC7B2" />
            <g opacity="0.3" stroke="#B8AE96" strokeWidth="1.6">
              {[70, 118, 166, 214, 262].map((y) => <path key={y} d={`M24 ${y} H376`} />)}
              {[112, 200, 288].map((x) => <path key={x} d={`M${x} 22 V262`} />)}
            </g>
            <rect y={268} width="400" height="32" fill="#D2C9B2" />
            <ellipse cx={200} cy={272} rx={150} ry={8} fill="#B8AE96" opacity="0.4" />
          </>
        );

      case 'sprout':
      default:
        return (
          <>
            <Sky uid={uid} />
            <path d="M0 214 C 120 202, 280 222, 400 208 L400 300 L0 300 Z" fill="#6B4A2A" />
            <path d="M0 232 C 120 222, 280 240, 400 228 L400 300 L0 300 Z" fill="#5C3A1E" />
            {[54, 106, 158, 210, 262, 314, 366].map((x, i) => (
              <g key={i} transform={`translate(${x} ${228 - (i % 2) * 6}) scale(${i % 3 === 1 ? 1.15 : 0.88})`}>
                <path d="M0 0 V-42" stroke="#3E8C3A" strokeWidth="4" strokeLinecap="round" />
                <ellipse cx={-16} cy={-36} rx={17} ry={9} fill="#4C9520" transform="rotate(-28 -16 -36)" />
                <ellipse cx={16} cy={-44} rx={17} ry={9} fill="#5FAC26" transform="rotate(28 16 -44)" />
                <ellipse cx={0} cy={-54} rx={11} ry={7} fill="#7BC23F" />
              </g>
            ))}
            <circle cx={318} cy={62} r={30} fill="#F3D479" opacity="0.5" />
          </>
        );
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
        <linearGradient id={`sky-${uid}`} x1="0" y1="0" x2="0.2" y2="1">
          <stop offset="0" stopColor="#DCEAD0" /><stop offset="1" stopColor="#B7D2A4" />
        </linearGradient>
        <linearGradient id={`skyw-${uid}`} x1="0" y1="0" x2="0.2" y2="1">
          <stop offset="0" stopColor="#F0EBD6" /><stop offset="0.55" stopColor="#DDE7C6" /><stop offset="1" stopColor="#BCD5A6" />
        </linearGradient>
        <radialGradient id={`vig-${uid}`} cx="0.5" cy="0.45" r="0.78">
          <stop offset="0.55" stopColor="#000000" stopOpacity="0" />
          <stop offset="1" stopColor="#14301A" stopOpacity="0.22" />
        </radialGradient>
      </defs>
      {/* Scenes are composed on a 400×300 stage, then pushed in so the subject
          fills the frame instead of floating under a wide empty sky. Wall-type
          scenes already fill it, so they are left alone. */}
      <g transform={`translate(200 300) scale(${FILL[variant] ?? 1.3}) translate(-200 -300)`}>
        {body}
      </g>
      <rect width="400" height="300" fill={`url(#vig-${uid})`} />
    </svg>
  );
}

export type { SceneVariant };
export const SceneArt = memo(SceneArtBase);
export default SceneArt;
