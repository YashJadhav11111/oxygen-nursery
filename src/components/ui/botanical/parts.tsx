import type { FlowerSpec, FruitSpec } from './profiles';

/**
 * parts.tsx — reusable botanical furniture: pots, flowers, fruit, backdrops.
 * Kept separate from the plant renderer so a pot or a bloom can be corrected
 * once and every species that uses it improves.
 */

/* ------------------------------- BACKDROPS -------------------------------- */

export function Backdrop({ scene, uid }: { scene: 'studio' | 'greenhouse' | 'garden'; uid: string }) {
  if (scene === 'garden') {
    return (
      <>
        <rect width="400" height="300" fill={`url(#bg-${uid})`} />
        {/* Soft out-of-focus planting behind the subject */}
        <g>
          {[[46, 196, 52], [112, 174, 40], [318, 188, 56], [252, 168, 36], [376, 172, 36]].map(([cx, cy, r], i) => (
            <circle key={i} cx={cx} cy={cy} r={r} fill={`url(#bokeh-${uid})`} opacity={i % 2 ? 0.5 : 0.36} />
          ))}
        </g>
        <path d="M0 244 C 110 232, 300 236, 400 228 L400 300 L0 300 Z" fill="#40682F" opacity="0.34" />
        <path d="M0 262 C 120 252, 290 256, 400 250 L400 300 L0 300 Z" fill="#33562A" opacity="0.4" />
      </>
    );
  }
  if (scene === 'greenhouse') {
    return (
      <>
        <rect width="400" height="300" fill={`url(#bg-${uid})`} />
        <g opacity="0.16" stroke="#1B4520" strokeWidth="2">
          {[52, 122, 192, 262, 332].map((x) => <path key={x} d={`M${x} 0 V300`} />)}
          <path d="M0 96 H400" /><path d="M0 186 H400" />
        </g>
        <g>
          {[[62, 214, 44], [154, 198, 34], [286, 208, 46], [352, 194, 32]].map(([cx, cy, r], i) => (
            <circle key={i} cx={cx} cy={cy} r={r} fill={`url(#bokeh-${uid})`} opacity={i % 2 ? 0.42 : 0.3} />
          ))}
        </g>
        <path d="M0 250 H400 V300 H0 Z" fill="#C9C0A6" opacity="0.5" />
      </>
    );
  }
  return (
    <>
      <rect width="400" height="300" fill={`url(#bg-${uid})`} />
      {/* Studio sweep: the surface the pot stands on */}
      <path d="M0 236 C 120 226, 280 226, 400 234 L400 300 L0 300 Z" fill="#E6E0CE" opacity="0.75" />
      <ellipse cx="200" cy="248" rx="190" ry="26" fill="#D8D2BC" opacity="0.5" />
    </>
  );
}

/* ---------------------------------- POTS ---------------------------------- */

export function Pot({ kind, uid, cx = 200, top = 232, width = 76 }: {
  kind: 'terracotta' | 'nursery' | 'ceramic' | 'ground';
  uid: string; cx?: number; top?: number; width?: number;
}) {
  if (kind === 'ground') {
    return (
      <g>
        <ellipse cx={cx} cy={top + 22} rx={width * 0.95} ry={12} fill="#4A3722" opacity="0.5" />
        <path
          d={`M${cx - width} ${top + 22} C ${cx - width * 0.5} ${top + 10}, ${cx + width * 0.5} ${top + 10}, ${cx + width} ${top + 22} C ${cx + width * 0.5} ${top + 32}, ${cx - width * 0.5} ${top + 32}, ${cx - width} ${top + 22} Z`}
          fill="#5B4429"
        />
      </g>
    );
  }
  const h = kind === 'nursery' ? 50 : 46;
  const taper = kind === 'nursery' ? 0.74 : 0.68;
  const fill = `url(#pot-${kind}-${uid})`;
  const rim = kind === 'terracotta' ? '#B46B45' : kind === 'nursery' ? '#2E3330' : '#E8E3D6';
  return (
    <g>
      {/* Soil surface */}
      <ellipse cx={cx} cy={top + 4} rx={width * 0.5} ry={9} fill="#4A3720" />
      <ellipse cx={cx} cy={top + 3} rx={width * 0.44} ry={7} fill="#5C4527" opacity="0.85" />
      {/* Body */}
      <path
        d={`M${cx - width * 0.5} ${top + 4} L${cx - width * 0.5 * taper} ${top + h} Q ${cx} ${top + h + 9}, ${cx + width * 0.5 * taper} ${top + h} L${cx + width * 0.5} ${top + 4} Z`}
        fill={fill}
      />
      {/* Rim */}
      <path
        d={`M${cx - width * 0.54} ${top - 4} L${cx + width * 0.54} ${top - 4} L${cx + width * 0.5} ${top + 8} L${cx - width * 0.5} ${top + 8} Z`}
        fill={rim}
      />
      <ellipse cx={cx} cy={top - 4} rx={width * 0.54} ry={9} fill={rim} />
      <ellipse cx={cx} cy={top - 4} rx={width * 0.46} ry={7} fill="#3E2E1B" opacity="0.55" />
      {/* Light from the upper left */}
      <path
        d={`M${cx - width * 0.44} ${top + 8} L${cx - width * 0.44 * taper} ${top + h - 3} L${cx - width * 0.26} ${top + h - 2} L${cx - width * 0.3} ${top + 8} Z`}
        fill="#FFFFFF" opacity="0.16"
      />
    </g>
  );
}

/* -------------------------------- FLOWERS --------------------------------- */

export function Flower({ spec, x, y, rot = 0, scale = 1 }: {
  spec: FlowerSpec; x: number; y: number; rot?: number; scale?: number;
}) {
  const s = spec.size * scale;
  const t = `translate(${x} ${y}) rotate(${rot})`;

  switch (spec.kind) {
    case 'spathe':
      return (
        <g transform={t}>
          <path d={`M0 0 C ${s * 0.78} ${-s * 0.4}, ${s * 0.62} ${-s * 1.3}, 0 ${-s * 1.5} C ${-s * 0.62} ${-s * 1.3}, ${-s * 0.78} ${-s * 0.4}, 0 0 Z`} fill={spec.color} />
          <path d={`M0 0 C ${s * 0.4} ${-s * 0.35}, ${s * 0.3} ${-s * 1.05}, 0 ${-s * 1.2}`} fill="none" stroke="rgba(0,0,0,0.09)" strokeWidth={s * 0.05} />
          <path d={`M ${-s * 0.06} ${-s * 0.62} q ${s * 0.06} ${-s * 0.5}, ${s * 0.12} 0 z`} fill={spec.centre ?? '#E4D89A'} />
          <rect x={-s * 0.055} y={-s * 1.16} width={s * 0.11} height={s * 0.7} rx={s * 0.055} fill={spec.centre ?? '#E4D89A'} />
        </g>
      );

    case 'trumpet':
      return (
        <g transform={t}>
          {Array.from({ length: 5 }).map((_, i) => (
            <path
              key={i}
              transform={`rotate(${(360 / 5) * i})`}
              d={`M0 0 C ${s * 0.52} ${-s * 0.2}, ${s * 0.62} ${-s * 0.86}, 0 ${-s} C ${-s * 0.62} ${-s * 0.86}, ${-s * 0.52} ${-s * 0.2}, 0 0 Z`}
              fill={i % 2 ? spec.color2 ?? spec.color : spec.color}
            />
          ))}
          <circle r={s * 0.2} fill={spec.color2 ?? spec.color} opacity="0.85" />
          <path d={`M0 0 L ${s * 0.22} ${-s * 0.32}`} stroke={spec.centre ?? '#F2C744'} strokeWidth={s * 0.06} strokeLinecap="round" />
          <circle cx={s * 0.22} cy={-s * 0.32} r={s * 0.08} fill={spec.centre ?? '#F2C744'} />
        </g>
      );

    case 'pinwheel':
      return (
        <g transform={t}>
          {Array.from({ length: 7 }).map((_, i) => (
            <ellipse key={i} transform={`rotate(${(360 / 7) * i})`} rx={s * 0.24} ry={s * 0.46} cy={-s * 0.4} fill={spec.color} />
          ))}
          <circle r={s * 0.16} fill={spec.centre ?? '#EFE3AE'} />
        </g>
      );

    case 'rosette-bloom':
      return (
        <g transform={t}>
          {Array.from({ length: 5 }).map((_, i) => (
            <ellipse key={i} transform={`rotate(${(360 / 5) * i + 12})`} rx={s * 0.34} ry={s * 0.52} cy={-s * 0.42} fill={i % 2 ? spec.color2 ?? spec.color : spec.color} />
          ))}
          <circle r={s * 0.17} fill={spec.centre ?? '#F6E3A8'} />
        </g>
      );

    case 'cluster':
      return (
        <g transform={t}>
          <circle r={s * 0.62} fill={spec.color} opacity="0.28" />
          {Array.from({ length: 14 }).map((_, i) => {
            const a = (i / 14) * Math.PI * 2;
            const rr = s * (i % 3 === 0 ? 0.2 : 0.42);
            return (
              <g key={i} transform={`translate(${Math.cos(a) * rr} ${Math.sin(a) * rr * 0.8})`}>
                {Array.from({ length: 4 }).map((_, j) => (
                  <ellipse key={j} transform={`rotate(${90 * j})`} rx={s * 0.07} ry={s * 0.13} cy={-s * 0.1} fill={j % 2 ? spec.color2 ?? spec.color : spec.color} />
                ))}
                <circle r={s * 0.045} fill={spec.centre ?? '#F6D77E'} />
              </g>
            );
          })}
        </g>
      );

    case 'bracts':
      // Bougainvillea: three papery bracts around a tiny white floret.
      return (
        <g transform={t}>
          {Array.from({ length: 3 }).map((_, i) => (
            <path
              key={i}
              transform={`rotate(${120 * i + 18})`}
              d={`M0 0 L ${s * 0.52} ${-s * 0.42} L ${s * 0.2} ${-s} L ${-s * 0.16} ${-s * 0.86} Z`}
              fill={i === 1 ? spec.color2 ?? spec.color : spec.color}
              opacity={0.94}
            />
          ))}
          <circle r={s * 0.11} fill={spec.centre ?? '#F4E9C2'} />
        </g>
      );

    case 'spike':
      return (
        <g transform={t}>
          <path d={`M0 0 V ${-s}`} stroke="#4E7A3E" strokeWidth={s * 0.06} />
          {Array.from({ length: 7 }).map((_, i) => {
            const yy = -s * (0.14 + i * 0.12);
            const rr = s * (0.14 - i * 0.012);
            return (
              <g key={i}>
                <circle cx={-rr} cy={yy} r={rr * 0.6} fill={i % 2 ? spec.color2 ?? spec.color : spec.color} />
                <circle cx={rr} cy={yy - s * 0.04} r={rr * 0.6} fill={spec.color} />
              </g>
            );
          })}
        </g>
      );

    default:
      return null;
  }
}

/* --------------------------------- FRUIT ---------------------------------- */

export function Fruit({ spec, x, y, uid, i = 0 }: { spec: FruitSpec; x: number; y: number; uid: string; i?: number }) {
  const r = spec.size;
  const grad = `url(#fruit-${uid})`;
  const stem = <path d={`M${x} ${y - r * 0.92} L${x - r * 0.1} ${y - r * 1.5}`} stroke="#5C4527" strokeWidth={r * 0.14} strokeLinecap="round" />;

  if (spec.shape === 'drop') {
    // Mango: asymmetric, slightly beaked
    return (
      <g>
        {stem}
        <path
          d={`M${x} ${y - r} C ${x + r * 1.05} ${y - r * 0.75}, ${x + r * 1.1} ${y + r * 0.5}, ${x + r * 0.1} ${y + r} C ${x - r * 0.95} ${y + r * 0.55}, ${x - r * 0.95} ${y - r * 0.6}, ${x} ${y - r} Z`}
          fill={grad}
        />
        <ellipse cx={x - r * 0.3} cy={y - r * 0.32} rx={r * 0.24} ry={r * 0.16} fill="#FFFFFF" opacity="0.34" transform={`rotate(-24 ${x - r * 0.3} ${y - r * 0.32})`} />
      </g>
    );
  }
  if (spec.shape === 'oblong') {
    return (
      <g>
        {stem}
        <ellipse cx={x} cy={y} rx={r * 0.78} ry={r} fill={grad} transform={`rotate(${(i % 2 ? 12 : -10)} ${x} ${y})`} />
        <path d={`M${x} ${y + r * 0.96} l0 ${r * 0.2}`} stroke={spec.color2 ?? spec.color} strokeWidth={r * 0.16} strokeLinecap="round" />
        <ellipse cx={x - r * 0.26} cy={y - r * 0.34} rx={r * 0.2} ry={r * 0.14} fill="#FFFFFF" opacity="0.36" />
      </g>
    );
  }
  return (
    <g>
      {stem}
      <circle cx={x} cy={y} r={r} fill={grad} />
      {spec.crown && (
        <g fill={spec.color}>
          {Array.from({ length: 5 }).map((_, k) => (
            <path key={k} transform={`translate(${x} ${y - r * 0.96}) rotate(${-40 + k * 20})`} d={`M0 0 L ${r * 0.1} ${-r * 0.34} L ${r * 0.2} 0 Z`} />
          ))}
        </g>
      )}
      <ellipse cx={x - r * 0.32} cy={y - r * 0.34} rx={r * 0.24} ry={r * 0.16} fill="#FFFFFF" opacity="0.32" transform={`rotate(-28 ${x - r * 0.32} ${y - r * 0.34})`} />
    </g>
  );
}
