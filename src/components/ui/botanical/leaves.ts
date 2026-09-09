/**
 * leaves.ts — botanical form primitives
 * ---------------------------------------------------------------------------
 * Every shape is drawn pointing DOWN from the origin: the leaf base sits at
 * (0,0) and the tip at (0,len). Callers rotate the whole leaf into position,
 * so a plant's habit is expressed purely as rotation and scale.
 *
 * These are real leaf morphologies, not decoration — the shape a species gets
 * is the shape that species actually has. See profiles.ts.
 * ---------------------------------------------------------------------------
 */

export type LeafShape =
  | 'ovate'         // Rubber plant, guava, lemon — broad, widest below middle
  | 'lanceolate'    // Mango, oleander, peace lily — long and narrow
  | 'cordate'       // Money plant, peepal — heart-shaped base
  | 'strap'         // Snake plant, spider plant — near-parallel sides
  | 'fenestrated'   // Monstera — split margins and holes
  | 'lobed'         // Selloum — deeply cut margins
  | 'arrowhead'     // Syngonium
  | 'roundThick'    // Jade — succulent paddle
  | 'succulentBlade'// Aloe — thick, toothed, tapering
  | 'rosettePetal'  // Echeveria — spoon-shaped
  | 'blade'         // Grasses
  | 'obovate';      // Ixora, ficus panda — widest above middle

/** A smooth two-sided leaf outline. `bulge` moves the widest point along the length. */
function symmetric(len: number, w: number, bulge = 0.45, tip = 0.94): string {
  const b1 = len * bulge * 0.55;
  const b2 = len * (bulge + (1 - bulge) * 0.5);
  return [
    `M0 0`,
    `C ${w * 0.9} ${b1}, ${w} ${b2}, 0 ${len}`,
    `C ${-w} ${b2}, ${-w * 0.9} ${b1}, 0 0`,
    `Z`,
  ].join(' ') + (tip ? '' : '');
}

export function leafPath(shape: LeafShape, len: number, w: number): string {
  switch (shape) {
    case 'ovate':
      return symmetric(len, w, 0.38);

    case 'obovate':
      return symmetric(len, w, 0.62);

    case 'lanceolate':
      return symmetric(len, w * 0.62, 0.44);

    case 'cordate': {
      // Heart-shaped: two lobes at the base, drawn out to a drip tip.
      const l = len, x = w;
      return [
        `M0 ${l * 0.06}`,
        `C ${x * 0.62} ${-l * 0.1}, ${x * 1.15} ${l * 0.12}, ${x} ${l * 0.4}`,
        `C ${x * 0.92} ${l * 0.72}, ${x * 0.3} ${l * 0.9}, 0 ${l}`,
        `C ${-x * 0.3} ${l * 0.9}, ${-x * 0.92} ${l * 0.72}, ${-x} ${l * 0.4}`,
        `C ${-x * 1.15} ${l * 0.12}, ${-x * 0.62} ${-l * 0.1}, 0 ${l * 0.06}`,
        `Z`,
      ].join(' ');
    }

    case 'arrowhead': {
      const l = len, x = w;
      return [
        `M0 ${l * 0.02}`,
        `C ${x * 0.5} ${l * 0.05}, ${x} ${l * 0.28}, ${x * 0.92} ${l * 0.5}`,
        `C ${x * 0.8} ${l * 0.78}, ${x * 0.26} ${l * 0.92}, 0 ${l}`,
        `C ${-x * 0.26} ${l * 0.92}, ${-x * 0.8} ${l * 0.78}, ${-x * 0.92} ${l * 0.5}`,
        `C ${-x} ${l * 0.28}, ${-x * 0.5} ${l * 0.05}, 0 ${l * 0.02}`,
        `Z`,
      ].join(' ');
    }

    case 'strap': {
      // Long, near-parallel margins with a soft point — Sansevieria, Chlorophytum.
      const l = len, x = w;
      return [
        `M0 0`,
        `C ${x * 0.95} ${l * 0.14}, ${x} ${l * 0.42}, ${x * 0.72} ${l * 0.8}`,
        `C ${x * 0.5} ${l * 0.96}, ${x * 0.2} ${l}, 0 ${l}`,
        `C ${-x * 0.2} ${l}, ${-x * 0.5} ${l * 0.96}, ${-x * 0.72} ${l * 0.8}`,
        `C ${-x} ${l * 0.42}, ${-x * 0.95} ${l * 0.14}, 0 0`,
        `Z`,
      ].join(' ');
    }

    case 'blade': {
      const l = len, x = w;
      return `M0 0 C ${x} ${l * 0.3}, ${x * 0.8} ${l * 0.7}, 0 ${l} C ${-x * 0.8} ${l * 0.7}, ${-x} ${l * 0.3}, 0 0 Z`;
    }

    case 'roundThick':
      return symmetric(len, w * 0.92, 0.5);

    case 'rosettePetal': {
      // Spoon-shaped with a rounded, slightly recurved tip.
      const l = len, x = w;
      return [
        `M0 0`,
        `C ${x * 0.7} ${l * 0.3}, ${x} ${l * 0.62}, ${x * 0.62} ${l * 0.88}`,
        `C ${x * 0.36} ${l * 1.02}, ${-x * 0.36} ${l * 1.02}, ${-x * 0.62} ${l * 0.88}`,
        `C ${-x} ${l * 0.62}, ${-x * 0.7} ${l * 0.3}, 0 0`,
        `Z`,
      ].join(' ');
    }

    case 'succulentBlade': {
      // Thick tapering blade with toothed margins, as on Aloe.
      const l = len, x = w;
      const teeth: string[] = [];
      const steps = 7;
      for (let i = 1; i <= steps; i++) {
        const t = i / (steps + 1);
        const px = x * (1 - t) * 0.92;
        const py = l * t;
        teeth.push(`L ${px + x * 0.075} ${py - l * 0.015} L ${px} ${py + l * 0.03}`);
      }
      const back: string[] = [];
      for (let i = steps; i >= 1; i--) {
        const t = i / (steps + 1);
        const px = -x * (1 - t) * 0.92;
        const py = l * t;
        back.push(`L ${px - x * 0.075} ${py + l * 0.03} L ${px} ${py - l * 0.015}`);
      }
      return `M0 0 L ${x * 0.9} ${l * 0.06} ${teeth.join(' ')} L 0 ${l} ${back.join(' ')} L ${-x * 0.9} ${l * 0.06} Z`;
    }

    case 'lobed': {
      // Deeply pinnatifid margins — Thaumatophyllum / Philodendron selloum.
      const l = len, x = w;
      const cuts = 6;
      const right: string[] = [];
      for (let i = 0; i < cuts; i++) {
        const t0 = 0.1 + (i / cuts) * 0.82;
        const t1 = 0.1 + ((i + 1) / cuts) * 0.82;
        const reach = x * (1 - Math.abs(t0 - 0.45) * 0.85);
        right.push(`L ${reach} ${l * t0} L ${x * 0.2} ${l * (t0 + t1) / 2} L ${reach * 0.92} ${l * t1}`);
      }
      const left: string[] = [];
      for (let i = cuts - 1; i >= 0; i--) {
        const t0 = 0.1 + (i / cuts) * 0.82;
        const t1 = 0.1 + ((i + 1) / cuts) * 0.82;
        const reach = x * (1 - Math.abs(t0 - 0.45) * 0.85);
        left.push(`L ${-reach * 0.92} ${l * t1} L ${-x * 0.2} ${l * (t0 + t1) / 2} L ${-reach} ${l * t0}`);
      }
      return `M0 ${l * 0.04} ${right.join(' ')} L 0 ${l} ${left.join(' ')} Z`;
    }

    case 'fenestrated':
    default:
      // Monstera: broad cordate blade; the splits are cut separately (see holes()).
      return symmetric(len, w, 0.42);
  }
}

/** Margin splits and oval perforations that make a Monstera read as a Monstera. */
export function fenestrations(len: number, w: number): { splits: string; holes: string[] } {
  const splits: string[] = [];
  for (let i = 0; i < 4; i++) {
    const t = 0.24 + i * 0.17;
    const depth = w * (0.72 - i * 0.06);
    splits.push(
      `M ${w * 1.05} ${len * t} L ${depth * 0.24} ${len * (t + 0.035)} L ${w * 1.05} ${len * (t + 0.085)} Z`,
      `M ${-w * 1.05} ${len * (t + 0.05)} L ${-depth * 0.24} ${len * (t + 0.085)} L ${-w * 1.05} ${len * (t + 0.135)} Z`,
    );
  }
  const holes: string[] = [];
  for (let i = 0; i < 3; i++) {
    const t = 0.3 + i * 0.16;
    holes.push(
      `M ${w * 0.3} ${len * t} a ${w * 0.11} ${len * 0.032} 0 1 0 0.1 0 Z`,
      `M ${-w * 0.34} ${len * (t + 0.07)} a ${w * 0.1} ${len * 0.028} 0 1 0 0.1 0 Z`,
    );
  }
  return { splits: splits.join(' '), holes };
}

/** Midrib plus secondary veins, scaled to the leaf. */
export function veinPath(len: number, w: number, pairs = 5, sweep = 0.55): string {
  const parts = [`M0 ${len * 0.05} L0 ${len * 0.93}`];
  for (let i = 1; i <= pairs; i++) {
    const t = 0.16 + (i / (pairs + 1)) * 0.72;
    const reach = w * sweep * (1 - Math.abs(t - 0.5) * 0.5);
    parts.push(`M0 ${len * t} Q ${reach * 0.7} ${len * (t + 0.03)}, ${reach} ${len * (t - 0.055)}`);
    parts.push(`M0 ${len * t} Q ${-reach * 0.7} ${len * (t + 0.03)}, ${-reach} ${len * (t - 0.055)}`);
  }
  return parts.join(' ');
}

/** A pinnate (feather) frond: central rachis with paired leaflets. Areca, neem, curry leaf. */
export function frondLeaflets(
  len: number,
  leaflets: number,
  leafletLen: number,
  leafletWid: number,
  curve = 0.22,
): { rachis: string; blades: { d: string; x: number; y: number; rot: number }[] } {
  const bow = len * curve;
  const rachis = `M0 0 Q ${bow * 0.45} ${len * 0.55}, ${bow} ${len}`;
  const blades: { d: string; x: number; y: number; rot: number }[] = [];
  for (let i = 0; i < leaflets; i++) {
    const t = 0.1 + (i / leaflets) * 0.86;
    // Position along the quadratic rachis
    const x = 2 * (1 - t) * t * (bow * 0.45) + t * t * bow;
    const y = len * t;
    const taper = 1 - Math.pow(Math.abs(t - 0.42) * 1.5, 1.7);
    const l = leafletLen * Math.max(0.32, taper);
    const wd = leafletWid * Math.max(0.4, taper);
    blades.push({ d: leafPath('lanceolate', l, wd), x, y, rot: 68 - t * 26 });
    blades.push({ d: leafPath('lanceolate', l, wd), x, y, rot: -68 + t * 26 });
  }
  return { rachis, blades };
}
