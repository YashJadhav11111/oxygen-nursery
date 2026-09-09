import { memo, useId } from 'react';
import { getProfile, type BotanicalProfile } from './profiles';
import { fenestrations, frondLeaflets, leafPath, veinPath } from './leaves';
import { Backdrop, Flower, Fruit, Pot } from './parts';
import { createRng, rand } from '@/lib/seed';

/**
 * NO LONGER RENDERED ON THE SITE.
 *
 * This drew a species-accurate botanical portrait for any plant, and was the
 * fallback whenever a plant had no photograph. That fallback was removed on
 * purpose: a customer looking at a nursery catalogue is judging what will
 * arrive in their pot, and a drawing quietly answers that question with
 * something that is not the plant. Plants without a photograph now show an
 * explicit "photograph coming soon" panel instead — see ui/PhotoPending.tsx.
 *
 * Nothing imports this any more, so it is tree-shaken out of the bundle. It is
 * kept in the repository because the parametric drawing system it is built on
 * (leaves.ts, profiles.ts, parts.tsx) still powers SceneArt, and because the
 * work is worth not throwing away.
 */
/**
 * PlantPortrait
 * ---------------------------------------------------------------------------
 * Draws a specific plant species from its botanical profile — its real habit,
 * leaf morphology, colouring, flowers and fruit. Every plant in the catalogue
 * gets its own portrait; no two species share a picture.
 *
 * Composition is kept inside x 96–304 and y 40–266 of the 400×300 canvas so the
 * subject survives the 4:3, 1:1 and 16:9 crops the site uses.
 *
 * `view` gives a gallery more than one angle of the same plant without
 * pretending to be a different specimen.
 * ---------------------------------------------------------------------------
 */

export type PortraitView = 'full' | 'angle' | 'detail';

interface Props {
  slug: string;
  view?: PortraitView;
  className?: string;
}

const BASE_Y = 232;
const CENTRE_X = 200;

function PlantPortraitBase({ slug, view = 'full', className }: Props) {
  const uid = useId().replace(/:/g, '');
  const p = getProfile(slug);
  const rng = createRng(`${slug}::${view}`);
  const { deep, mid, light, vein } = p.palette;

  /* View framing: 'detail' zooms in, 'angle' turns the plant slightly. */
  const zoom = view === 'detail' ? 1.42 : 1;
  const tilt = view === 'angle' ? -7 : 0;
  const potKind = p.pot ?? 'nursery';

  /* --------------------------- one leaf, with depth -------------------------- */
  const renderLeaf = (
    key: string, x: number, y: number, rot: number, len: number, wid: number,
    depth: number, opts: { showVeins?: boolean; scaleX?: number } = {},
  ) => {
    const d = leafPath(p.shape, len, wid);
    const fill = depth < 0.34 ? `url(#lf-back-${uid})` : depth > 0.72 ? `url(#lf-front-${uid})` : `url(#lf-mid-${uid})`;
    const isFen = p.shape === 'fenestrated';
    const fen = isFen ? fenestrations(len, wid) : null;

    return (
      <g key={key} transform={`translate(${x} ${y}) rotate(${rot}) scale(${opts.scaleX ?? 1} 1)`}>
        {fen ? (
          <>
            {/* Monstera splits and holes are cut out with a mask, so the gaps
                show the background rather than painting over the blade. */}
            <defs>
              <mask id={`fen-${uid}-${key}`} maskUnits="userSpaceOnUse" x={-wid * 1.4} y={-len * 0.2} width={wid * 2.8} height={len * 1.4}>
                <path d={d} fill="#fff" />
                <path d={fen.splits} fill="#000" />
                {fen.holes.map((h, i) => <path key={i} d={h} fill="#000" />)}
              </mask>
            </defs>
            <path d={d} fill={fill} mask={`url(#fen-${uid}-${key})`} />
          </>
        ) : (
          <path d={d} fill={fill} />
        )}
        {p.variegation === 'centre-stripe' && (
          <path d={leafPath(p.shape, len * 0.95, wid * 0.34)} fill={p.variegationColor ?? '#F0F3D2'} opacity="0.9" />
        )}
        {p.variegation === 'pale-centre' && (
          <path d={leafPath(p.shape, len * 0.7, wid * 0.42)} transform={`translate(0 ${len * 0.13})`} fill={p.variegationColor ?? '#E2EEC4'} opacity="0.6" />
        )}
        {p.variegation === 'edge-yellow' && (
          <path d={d} fill="none" stroke={p.variegationColor ?? '#C9B24A'} strokeWidth={wid * 0.16} />
        )}
        {p.variegation === 'banded' && (
          <g opacity="0.3">
            {Array.from({ length: 7 }).map((_, i) => {
              const t = 0.1 + i * 0.12;
              return (
                <path
                  key={i}
                  d={`M ${-wid * 0.72} ${len * t} Q 0 ${len * (t + 0.045)}, ${wid * 0.72} ${len * t}`}
                  stroke={p.variegationColor ?? '#A8BE72'} strokeWidth={len * 0.014} fill="none" strokeLinecap="round"
                />
              );
            })}
          </g>
        )}
        {p.variegation === 'mottled' && (
          <g opacity="0.4" fill={p.variegationColor ?? '#D8E4A4'}>
            <ellipse cx={wid * 0.3} cy={len * 0.38} rx={wid * 0.26} ry={len * 0.14} transform={`rotate(18 ${wid * 0.3} ${len * 0.38})`} />
            <ellipse cx={-wid * 0.34} cy={len * 0.6} rx={wid * 0.2} ry={len * 0.1} transform={`rotate(-14 ${-wid * 0.34} ${len * 0.6})`} />
          </g>
        )}
        {p.variegation === 'speckled' && (
          <g opacity="0.55" fill={p.variegationColor ?? 'rgba(255,255,255,0.5)'}>
            {Array.from({ length: 6 }).map((_, i) => (
              <ellipse key={i} cx={(i % 2 ? 1 : -1) * wid * 0.28} cy={len * (0.18 + i * 0.13)} rx={wid * 0.12} ry={len * 0.022} />
            ))}
          </g>
        )}
        {p.serrated && (
          <path d={d} fill="none" stroke={deep} strokeWidth={wid * 0.09} strokeDasharray={`${wid * 0.18} ${wid * 0.16}`} opacity="0.5" />
        )}
        {opts.showVeins !== false && (
          <path d={veinPath(len, wid, p.shape === 'lanceolate' ? 7 : 5)} stroke={vein ?? 'rgba(255,255,255,0.16)'} strokeWidth={Math.max(0.6, len * 0.011)} fill="none" strokeLinecap="round" />
        )}
        {p.glossy && (
          <ellipse cx={-wid * 0.26} cy={len * 0.3} rx={wid * 0.2} ry={len * 0.13} fill="#FFFFFF" opacity="0.14" transform={`rotate(-12 ${-wid * 0.26} ${len * 0.3})`} />
        )}
      </g>
    );
  };

  /* ------------------------ a pinnate frond (palms, neem) ------------------- */
  const renderFrond = (key: string, x: number, y: number, rot: number, len: number, depth: number, c: NonNullable<BotanicalProfile['compound']>) => {
    const { rachis, blades } = frondLeaflets(len, c.leaflets, c.leafletLen, c.leafletWid, p.droop ?? 0.24);
    const fill = depth < 0.4 ? `url(#lf-back-${uid})` : depth > 0.74 ? `url(#lf-front-${uid})` : `url(#lf-mid-${uid})`;
    return (
      <g key={key} transform={`translate(${x} ${y}) rotate(${rot})`}>
        <path d={rachis} stroke={mid} strokeWidth={2.4} fill="none" strokeLinecap="round" />
        {blades.map((b, i) => (
          <g key={i} transform={`translate(${b.x} ${b.y}) rotate(${b.rot})`}>
            <path d={b.d} fill={fill} />
            {p.serrated && <path d={b.d} fill="none" stroke={deep} strokeWidth={0.7} opacity="0.55" />}
          </g>
        ))}
      </g>
    );
  };

  /* --------------------- a soft mass of foliage behind ---------------------- */
  /** A soft, edge-fading mass of foliage that gives the canopy depth without
      drawing hundreds of leaves — and without a visible hard-edged blob. */
  const canopyMass = (cx: number, cy: number, rx: number, ry: number, key: string) => (
    <g key={key}>
      <ellipse cx={cx} cy={cy} rx={rx * 1.06} ry={ry * 1.04} fill={`url(#mass-${uid})`} />
      <ellipse cx={cx - rx * 0.3} cy={cy + ry * 0.2} rx={rx * 0.62} ry={ry * 0.7} fill={`url(#mass-${uid})`} opacity="0.7" />
    </g>
  );

  /* ------------------------------ habit layouts ----------------------------- */
  const plant: JSX.Element[] = [];
  const flowerSlots: { x: number; y: number; rot: number }[] = [];
  const fruitSlots: { x: number; y: number }[] = [];

  /** Fan ordering: draw outer leaves first so the centre sits on top. */
  const fanOrder = Array.from({ length: p.count }, (_, i) => i)
    .sort((a, b) => Math.abs(b - (p.count - 1) / 2) - Math.abs(a - (p.count - 1) / 2));

  switch (p.habit) {
    case 'crown': {
      fanOrder.forEach((i, order) => {
        const t = p.count === 1 ? 0.5 : i / (p.count - 1);
        const angle = -p.spread + t * p.spread * 2;
        const depth = order / p.count;
        const len = p.len * rand(rng, 0.88, 1.06);
        // Stagger the stalk lengths so leaves sit at different radii and fan
        // out, rather than all bunching at one distance from the crown.
        const stalk = len * (i % 2 === 0 ? 0.78 : 0.56);
        const rad = ((angle - 90) * Math.PI) / 180;
        const ax = CENTRE_X + Math.cos(rad) * stalk;
        const ay = BASE_Y + 4 + Math.sin(rad) * stalk * 0.92;
        plant.push(
          <path
            key={`s${i}`}
            d={`M${CENTRE_X} ${BASE_Y + 10} Q ${CENTRE_X + (ax - CENTRE_X) * 0.35} ${(BASE_Y + ay) / 2 - 6}, ${ax} ${ay}`}
            stroke={depth > 0.6 ? mid : deep} strokeWidth={3.2} fill="none" strokeLinecap="round"
          />,
        );
        plant.push(
          renderLeaf(
            `l${i}`, ax, ay,
            // Keep the blade closer to upright than its stalk so the crown fans
            // open instead of closing into a symmetrical dome.
            180 + angle * (0.72 + (p.droop ?? 0.2) * 0.45) + rand(rng, -6, 6),
            len * (i % 2 === 0 ? 0.94 : 1), p.wid, depth,
          ),
        );
      });
      if (p.flower) {
        for (let f = 0; f < p.flower.count; f++) {
          const a = (-26 + (f / Math.max(1, p.flower.count - 1)) * 52) * (p.flower.count > 1 ? 1 : 0);
          const rad = ((a - 90) * Math.PI) / 180;
          const fx = CENTRE_X + Math.cos(rad) * p.len * 0.5;
          const fy = BASE_Y + 4 + Math.sin(rad) * p.len * 0.62;
          plant.push(
            <path key={`fs${f}`} d={`M${CENTRE_X} ${BASE_Y + 8} Q ${(CENTRE_X + fx) / 2} ${(BASE_Y + fy) / 2}, ${fx} ${fy}`} stroke={mid} strokeWidth={2.4} fill="none" strokeLinecap="round" />,
          );
          flowerSlots.push({ x: fx, y: fy, rot: a * 0.3 });
        }
      }
      break;
    }

    case 'upright-strap':
    case 'arching-strap': {
      const arch = p.habit === 'arching-strap';
      fanOrder.forEach((i, order) => {
        const t = p.count === 1 ? 0.5 : i / (p.count - 1);
        const angle = -p.spread + t * p.spread * 2;
        const depth = order / p.count;
        const len = p.len * rand(rng, arch ? 0.72 : 0.86, 1.08);
        const bend = arch ? angle * 0.6 : 0;
        plant.push(
          renderLeaf(`l${i}`, CENTRE_X + angle * (arch ? 0.3 : 0.55), BASE_Y + 6, 180 + angle + bend, len, p.wid, depth, { showVeins: !arch }),
        );
        if (arch && i % 4 === 1) {
          const rad = ((angle + bend - 90) * Math.PI) / 180;
          const tx = CENTRE_X + Math.cos(rad) * len * 0.9;
          const ty = BASE_Y + 6 + Math.sin(rad) * len * 0.9;
          plant.push(
            <g key={`p${i}`}>
              <path d={`M${CENTRE_X} ${BASE_Y}    Q ${(CENTRE_X + tx) / 2} ${ty + 20}, ${tx} ${ty + 30}`} stroke={mid} strokeWidth={1.6} fill="none" />
              {Array.from({ length: 5 }).map((_, k) => (
                <path key={k} transform={`translate(${tx} ${ty + 30}) rotate(${-50 + k * 25})`} d={leafPath('strap', 19, 3.2)} fill={light} />
              ))}
            </g>,
          );
        }
      });
      break;
    }

    case 'clumping-frond': {
      const c = p.compound ?? { leaflets: 11, leafletLen: 30, leafletWid: 5 };
      fanOrder.forEach((i, order) => {
        const t = p.count === 1 ? 0.5 : i / (p.count - 1);
        const angle = -p.spread + t * p.spread * 2;
        const depth = order / p.count;
        const len = p.len * rand(rng, 0.84, 1.04);
        plant.push(
          <path key={`c${i}`} d={`M${CENTRE_X + angle * 0.16} ${BASE_Y + 8} Q ${CENTRE_X + angle * 0.4} ${BASE_Y - len * 0.2}, ${CENTRE_X + angle * 0.62} ${BASE_Y - len * 0.34}`} stroke="#7E9A55" strokeWidth={2.8} fill="none" strokeLinecap="round" />,
        );
        plant.push(renderFrond(`f${i}`, CENTRE_X + angle * 0.62, BASE_Y - len * 0.32, 170 + angle, len, depth, c));
      });
      break;
    }

    case 'upright-stem': {
      // Compound plants (ZZ) carry many leaflets on several stems; simple-leaved
      // plants (Rubber Plant) carry a few big leaves on one or two stems.
      const stems = p.compound ? Math.max(3, Math.round(p.count / 2)) : 2;
      for (let s2 = 0; s2 < stems; s2++) {
        const angle = -p.spread + (s2 / Math.max(1, stems - 1)) * p.spread * 2;
        const depth = s2 / Math.max(1, stems - 1);
        const pairs = p.compound?.leaflets ?? Math.max(3, Math.round(p.count / 2));
        const h = p.compound ? 150 * rand(rng, 0.84, 1.02) : 128 * rand(rng, 0.86, 1.04);
        const topX = CENTRE_X + angle * 1.15;
        const topY = BASE_Y - h;
        plant.push(
          <path key={`st${s2}`} d={`M${CENTRE_X + angle * 0.2} ${BASE_Y + 6} Q ${CENTRE_X + angle * 0.7} ${BASE_Y - h * 0.6}, ${topX} ${topY}`} stroke={depth > 0.5 ? mid : deep} strokeWidth={4.2} fill="none" strokeLinecap="round" />,
        );
        for (let k = 0; k < pairs; k++) {
          const t = 0.2 + (k / pairs) * 0.8;
          const bx = CENTRE_X + angle * 0.2;
          const lx = (1 - t) * (1 - t) * bx + 2 * (1 - t) * t * (CENTRE_X + angle * 0.7) + t * t * topX;
          const ly = (1 - t) * (1 - t) * (BASE_Y + 6) + 2 * (1 - t) * t * (BASE_Y - h * 0.6) + t * t * topY;
          const size = (p.compound?.leafletLen ?? p.len) * (1.05 - t * 0.32);
          const wd = (p.compound?.leafletWid ?? p.wid) * (1.05 - t * 0.28);
          plant.push(renderLeaf(`ll${s2}-${k}-r`, lx, ly, 112 - t * 22, size, wd, depth));
          plant.push(renderLeaf(`ll${s2}-${k}-l`, lx, ly, -112 + t * 22, size, wd, depth));
        }
      }
      break;
    }

    case 'rosette': {
      const cy = BASE_Y - 48;
      plant.push(
        <g key="ros" transform={`translate(${CENTRE_X} ${cy}) scale(1 0.78)`}>
          {Array.from({ length: p.count }).map((_, i) => {
            const angle = (360 / p.count) * i + rand(rng, -7, 7);
            const ring = i % 3;
            const len = p.len * (ring === 0 ? 1.12 : ring === 1 ? 0.76 : 0.46);
            const depth = ring === 0 ? 0.25 : ring === 1 ? 0.6 : 0.95;
            return (
              <g key={i} transform={`rotate(${angle})`}>
                {renderLeaf(`r${i}`, 0, 0, 0, len, p.wid * (ring === 0 ? 1 : 0.86), depth, { showVeins: false })}
              </g>
            );
          })}
          <circle r={p.wid * 0.4} fill={light} opacity="0.95" />
        </g>,
      );
      break;
    }

    case 'shrub':
    case 'tree': {
      const isTree = p.habit === 'tree';
      const trunk = p.trunk ?? (isTree
        ? { height: 84, width: 18, color: '#6B5138', branches: true }
        : { height: 34, width: 11, color: '#7E6244', branches: true });

      if (isTree) {
        plant.push(
          <g key="trunk">
            <path
              d={`M${CENTRE_X - trunk.width * 0.62} ${BASE_Y + 12} C ${CENTRE_X - trunk.width * 0.4} ${BASE_Y - trunk.height * 0.4}, ${CENTRE_X - trunk.width * 0.3} ${BASE_Y - trunk.height * 0.7}, ${CENTRE_X - trunk.width * 0.22} ${BASE_Y - trunk.height} L${CENTRE_X + trunk.width * 0.22} ${BASE_Y - trunk.height} C ${CENTRE_X + trunk.width * 0.3} ${BASE_Y - trunk.height * 0.7}, ${CENTRE_X + trunk.width * 0.4} ${BASE_Y - trunk.height * 0.4}, ${CENTRE_X + trunk.width * 0.62} ${BASE_Y + 12} Z`}
              fill={`url(#bark-${uid})`}
            />
            <g stroke={trunk.color} strokeWidth={trunk.width * 0.36} strokeLinecap="round" fill="none">
              <path d={`M${CENTRE_X} ${BASE_Y - trunk.height * 0.88} Q ${CENTRE_X - 34} ${BASE_Y - trunk.height - 18}, ${CENTRE_X - 58} ${BASE_Y - trunk.height - 34}`} />
              <path d={`M${CENTRE_X} ${BASE_Y - trunk.height * 0.96} Q ${CENTRE_X + 36} ${BASE_Y - trunk.height - 20}, ${CENTRE_X + 60} ${BASE_Y - trunk.height - 32}`} />
            </g>
          </g>,
        );
      } else if (trunk.height > 12) {
        plant.push(
          <g key="stems" stroke={trunk.color} strokeWidth={trunk.width * 0.5} strokeLinecap="round" fill="none">
            <path d={`M${CENTRE_X} ${BASE_Y + 8} L${CENTRE_X} ${BASE_Y - trunk.height}`} />
            <path d={`M${CENTRE_X} ${BASE_Y - trunk.height * 0.5} L${CENTRE_X - 26} ${BASE_Y - trunk.height - 16}`} />
            <path d={`M${CENTRE_X} ${BASE_Y - trunk.height * 0.68} L${CENTRE_X + 28} ${BASE_Y - trunk.height - 14}`} />
          </g>,
        );
      }

      const cy = BASE_Y - trunk.height - (isTree ? 46 : 36);
      const rx = isTree ? 100 : 88;
      const ry = isTree ? 50 : 52;
      plant.push(canopyMass(CENTRE_X, cy, rx * 0.9, ry * 0.92, 'mass'));

      const c = p.compound;
      const items = Array.from({ length: p.count }, (_, i) => i);
      // Back half first, front half last, so the canopy has depth.
      const placed = items.map(() => {
        const a = rand(rng, 0, Math.PI * 2);
        const r = Math.sqrt(rng());
        return { x: CENTRE_X + Math.cos(a) * rx * r, y: cy + Math.sin(a) * ry * r };
      }).sort((m, n) => m.y - n.y);

      placed.forEach((pos, i) => {
        const depth = i / placed.length;
        if (c) plant.push(renderFrond(`tf${i}`, pos.x, pos.y, 180 + rand(rng, -72, 72), p.len * rand(rng, 0.74, 1), depth, c));
        else {
          const swing = 88 - (p.droop ?? 0) * 42; // drooping foliage hangs closer to vertical
          plant.push(renderLeaf(`tl${i}`, pos.x, pos.y, 180 + rand(rng, -swing, swing), p.len * rand(rng, 0.84, 1.1), p.wid, depth));
        }
      });

      // Flowers and fruit ride on the outer, better-lit part of the canopy.
      const outer = placed.filter((pos) => Math.abs(pos.x - CENTRE_X) > rx * 0.2 || pos.y < cy);
      for (let i = 0; i < outer.length; i += Math.max(2, Math.floor(outer.length / 8))) {
        flowerSlots.push({ x: outer[i].x, y: outer[i].y - 4, rot: rand(rng, -14, 14) });
        fruitSlots.push({ x: outer[i].x, y: outer[i].y + 12 });
      }
      break;
    }

    case 'climber': {
      const canes = 4;
      for (let ci = 0; ci < canes; ci++) {
        const x0 = CENTRE_X - 44 + ci * 29;
        const sway = rand(rng, -30, 30);
        const topY = 76 + ci * 8;
        plant.push(
          <path key={`cn${ci}`} d={`M${x0} ${BASE_Y + 10} C ${x0 + sway} ${BASE_Y - 66}, ${x0 - sway} ${topY + 62}, ${x0 + sway * 1.1} ${topY}`} stroke="#6E5A3A" strokeWidth={3.2} fill="none" strokeLinecap="round" />,
        );
        const per = Math.round(p.count / canes);
        for (let k = 0; k < per; k++) {
          const t = 0.08 + (k / per) * 0.88;
          const lx = x0 + sway * (1 - t) * 1.05 + rand(rng, -13, 13);
          const ly = BASE_Y + 10 - (BASE_Y + 10 - topY) * t;
          plant.push(renderLeaf(`cl${ci}-${k}`, lx, ly, 180 + rand(rng, -70, 70), p.len, p.wid, 0.4 + t * 0.5));
          if (k % 2 === 0) flowerSlots.push({ x: lx + rand(rng, -12, 12), y: ly - 6, rot: rand(rng, -22, 22) });
        }
      }
      break;
    }

    case 'trailing': {
      // A potted plant with an upright crown and vines draping over the rim —
      // how a pothos actually sits on a nursery bench.
      const rimY = BASE_Y + 6;
      const vines = 4;
      for (let v = 0; v < vines; v++) {
        const dir = v % 2 === 0 ? -1 : 1;
        const reach = 74 + Math.floor(v / 2) * 30;
        const x0 = CENTRE_X + dir * 26;
        const endX = CENTRE_X + dir * reach;
        const endY = 268 + Math.floor(v / 2) * 12;
        plant.push(
          <path
            key={`v${v}`}
            d={`M${x0} ${rimY} C ${x0 + dir * 26} ${rimY + 16}, ${endX - dir * 14} ${endY - 22}, ${endX} ${endY}`}
            stroke={deep} strokeWidth={2.2} fill="none" strokeLinecap="round"
          />,
        );
        const per = Math.max(3, Math.round(p.count / (vines * 2)));
        for (let k = 0; k < per; k++) {
          const t = 0.16 + (k / per) * 0.84;
          const lx = (1 - t) * (1 - t) * x0 + 2 * (1 - t) * t * (x0 + dir * 26) + t * t * endX;
          const ly = (1 - t) * (1 - t) * rimY + 2 * (1 - t) * t * (rimY + 16) + t * t * endY;
          plant.push(renderLeaf(`tv${v}-${k}`, lx, ly, 180 + dir * rand(rng, 10, 54), p.len * (1.02 - t * 0.22), p.wid * (1.02 - t * 0.2), 0.4 + t * 0.55));
        }
      }
      // Upright crown above the pot
      const crown = Math.round(p.count / 2);
      for (let i = 0; i < crown; i++) {
        const angle = -56 + (i / Math.max(1, crown - 1)) * 112;
        const rad = ((angle - 90) * Math.PI) / 180;
        plant.push(
          renderLeaf(
            `tc${i}`,
            CENTRE_X + Math.cos(rad) * p.len * 0.86,
            BASE_Y - 6 + Math.sin(rad) * p.len * 0.92,
            180 + angle * 0.7 + rand(rng, -8, 8),
            p.len * rand(rng, 0.9, 1.1), p.wid, 0.5 + (i % 2) * 0.4,
          ),
        );
      }
      break;
    }

    case 'grass': {
      const clumps = 3;
      for (let cI = 0; cI < clumps; cI++) {
        const cx = CENTRE_X - 66 + cI * 66;
        const per = Math.round(p.count / clumps);
        for (let i = 0; i < per; i++) {
          const angle = -p.spread + (i / per) * p.spread * 2 + rand(rng, -6, 6);
          const len = p.len * rand(rng, 0.6, 1.06);
          plant.push(renderLeaf(`g${cI}-${i}`, cx + rand(rng, -10, 10), BASE_Y + 10, 180 + angle * 1.35, len, p.wid, i / per, { showVeins: false }));
        }
      }
      break;
    }
  }

  /* --------------------------------- extras --------------------------------- */
  const flowers = p.flower
    ? flowerSlots.slice(0, p.flower.count).map((s, i) => (
        <Flower key={`fl${i}`} spec={p.flower!} x={s.x} y={s.y} rot={s.rot} scale={rand(rng, 0.86, 1.12)} />
      ))
    : null;

  const fruits = p.fruit
    ? fruitSlots.slice(0, p.fruit.count).map((s, i) => (
        <Fruit key={`fr${i}`} spec={p.fruit!} x={s.x} y={s.y} uid={uid} i={i} />
      ))
    : null;

  const potted = potKind !== 'ground';

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
        <linearGradient id={`bg-${uid}`} x1="0.1" y1="0" x2="0.6" y2="1">
          <stop offset="0" stopColor={p.scene === 'garden' ? '#DCE9C8' : p.scene === 'greenhouse' ? '#E4EDD6' : '#F5F2E7'} />
          <stop offset="1" stopColor={p.scene === 'garden' ? '#B9D3A4' : p.scene === 'greenhouse' ? '#C6DBB2' : '#E3DECC'} />
        </linearGradient>
        <linearGradient id={`cut-${uid}`} x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0" stopColor={p.scene === 'garden' ? '#CFE0BC' : '#EFEBDD'} />
          <stop offset="1" stopColor={p.scene === 'garden' ? '#B9D3A4' : '#E3DECC'} />
        </linearGradient>

        <linearGradient id={`lf-back-${uid}`} x1="0" y1="0" x2="0.25" y2="1">
          <stop offset="0" stopColor={deep} /><stop offset="1" stopColor={mid} />
        </linearGradient>
        <linearGradient id={`lf-mid-${uid}`} x1="0" y1="0" x2="0.25" y2="1">
          <stop offset="0" stopColor={mid} /><stop offset="1" stopColor={light} />
        </linearGradient>
        <linearGradient id={`lf-front-${uid}`} x1="0" y1="0" x2="0.25" y2="1">
          <stop offset="0" stopColor={mid} /><stop offset="0.55" stopColor={light} /><stop offset="1" stopColor={light} />
        </linearGradient>

        <linearGradient id={`bark-${uid}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#8A7355" /><stop offset="0.45" stopColor={p.trunk?.color ?? '#6B5138'} /><stop offset="1" stopColor="#4C3A28" />
        </linearGradient>
        <linearGradient id={`pot-terracotta-${uid}`} x1="0" y1="0" x2="1" y2="0.3">
          <stop offset="0" stopColor="#C88055" /><stop offset="0.5" stopColor="#B46B45" /><stop offset="1" stopColor="#8A4E32" />
        </linearGradient>
        <linearGradient id={`pot-nursery-${uid}`} x1="0" y1="0" x2="1" y2="0.3">
          <stop offset="0" stopColor="#4A5450" /><stop offset="0.5" stopColor="#333B37" /><stop offset="1" stopColor="#202623" />
        </linearGradient>
        <linearGradient id={`pot-ceramic-${uid}`} x1="0" y1="0" x2="1" y2="0.3">
          <stop offset="0" stopColor="#FBF9F2" /><stop offset="0.55" stopColor="#EDE8DA" /><stop offset="1" stopColor="#CFC8B4" />
        </linearGradient>
        <radialGradient id={`fruit-${uid}`} cx="0.36" cy="0.32" r="0.78">
          <stop offset="0" stopColor={p.fruit?.color2 ?? p.fruit?.color ?? '#E2A62E'} />
          <stop offset="1" stopColor={p.fruit?.color ?? '#D2542A'} />
        </radialGradient>

        <radialGradient id={`mass-${uid}`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor={deep} stopOpacity="0.5" />
          <stop offset="0.62" stopColor={deep} stopOpacity="0.34" />
          <stop offset="1" stopColor={deep} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`bokeh-${uid}`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#3E7A34" stopOpacity="0.85" />
          <stop offset="0.55" stopColor="#356B2E" stopOpacity="0.45" />
          <stop offset="1" stopColor="#2C5F2A" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`key-${uid}`} cx="0.24" cy="0.16" r="0.72">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.3" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`vig-${uid}`} cx="0.5" cy="0.46" r="0.78">
          <stop offset="0.55" stopColor="#000000" stopOpacity="0" />
          <stop offset="1" stopColor="#14301A" stopOpacity="0.2" />
        </radialGradient>
      </defs>

      <Backdrop scene={p.scene ?? 'studio'} uid={uid} />

      <g transform={`translate(${CENTRE_X} ${BASE_Y}) rotate(${tilt}) scale(${zoom}) translate(${-CENTRE_X} ${-BASE_Y})`}>
        {/* Contact shadow sits under whatever the plant actually stands in */}
        <ellipse cx={CENTRE_X} cy={BASE_Y + (potted ? 54 : 24)} rx={potted ? 62 : 96} ry={11} fill="#1B3A20" opacity="0.2" />
        {plant}
        {potted && <Pot kind={potKind} uid={uid} top={BASE_Y + 2} width={76} />}
        {flowers}
        {fruits}
      </g>

      {/* Consistent key light from the upper left, then a soft vignette */}
      <rect width="400" height="300" fill={`url(#key-${uid})`} />
      <rect width="400" height="300" fill={`url(#vig-${uid})`} />
    </svg>
  );
}

export const PlantPortrait = memo(PlantPortraitBase);
export default PlantPortrait;
