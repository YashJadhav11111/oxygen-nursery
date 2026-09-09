import type { LeafShape } from './leaves';

/**
 * profiles.ts — the botanical identity of every plant in the catalogue.
 * ---------------------------------------------------------------------------
 * One entry per plant, keyed by the plant's slug. Each entry describes how that
 * species actually grows: its habit, leaf morphology, colouring, variegation,
 * flowers and fruit. PlantPortrait renders from this, so no two species share a
 * picture and each one is recognisably itself.
 *
 * This is also the file to edit if a drawing looks wrong for a species — the
 * renderer needs no changes.
 * ---------------------------------------------------------------------------
 */

export type Habit =
  | 'rosette'        // leaves radiate from a ground-level centre (Aloe, Echeveria)
  | 'upright-strap'  // stiff vertical blades from the base (Snake Plant)
  | 'arching-strap'  // strap leaves that arch over (Spider Plant)
  | 'clumping-frond' // arching pinnate fronds from a clump (Areca, Bamboo Palm)
  | 'crown'          // long-stalked leaves from a central crown (Monstera, Peace Lily)
  | 'upright-stem'   // leaves borne along erect stems (ZZ, Rubber Plant)
  | 'shrub'          // branching bushy mound (Ixora, Hibiscus, Jade)
  | 'tree'           // trunk and canopy (Neem, Mango, Gulmohar)
  | 'climber'        // sprawling, trained (Bougainvillea)
  | 'trailing'       // cascading vines (Money Plant)
  | 'grass';         // dense fine tufts (Mexican Grass)

export type Variegation = 'edge-yellow' | 'centre-stripe' | 'banded' | 'mottled' | 'pale-centre' | 'speckled';

export interface FlowerSpec {
  kind: 'bracts' | 'trumpet' | 'pinwheel' | 'cluster' | 'spike' | 'spathe' | 'feathery' | 'rosette-bloom';
  color: string;
  color2?: string;
  centre?: string;
  count: number;
  size: number;
}

export interface FruitSpec {
  color: string;
  color2?: string;
  count: number;
  size: number;
  shape?: 'round' | 'drop' | 'oblong';
  crown?: boolean; // pomegranate's calyx
}

export interface BotanicalProfile {
  habit: Habit;
  shape: LeafShape;
  /** Leaf length and half-width in viewBox units (canvas is 400 × 300). */
  len: number;
  wid: number;
  count: number;
  /** Half-angle of the fan, in degrees. */
  spread: number;
  /** 0 = stiff, 1 = strongly drooping. */
  droop?: number;
  palette: { deep: string; mid: string; light: string; vein?: string };
  variegation?: Variegation;
  variegationColor?: string;
  serrated?: boolean;
  glossy?: boolean;
  compound?: { leaflets: number; leafletLen: number; leafletWid: number };
  flower?: FlowerSpec;
  fruit?: FruitSpec;
  trunk?: { height: number; width: number; color: string; branches?: boolean };
  pot?: 'terracotta' | 'nursery' | 'ceramic' | 'ground';
  /** Scene behind the plant. */
  scene?: 'studio' | 'greenhouse' | 'garden';
  note?: string;
}

const G = {
  deepForest: { deep: '#153B1E', mid: '#245C2B', light: '#3E8438' },
  darkGloss: { deep: '#10331A', mid: '#1C5024', light: '#2F7132' },
};

export const botanicalProfiles: Record<string, BotanicalProfile> = {
  /* ------------------------------ INDOOR FOLIAGE ------------------------------ */
  'monstera-deliciosa': {
    habit: 'crown', shape: 'fenestrated', len: 118, wid: 62, count: 7, spread: 58, droop: 0.25,
    palette: { ...G.deepForest, vein: 'rgba(255,255,255,0.22)' }, glossy: true,
    pot: 'terracotta', scene: 'studio',
    note: 'Broad cordate blades with margin splits and oval fenestrations.',
  },
  'snake-plant': {
    habit: 'upright-strap', shape: 'strap', len: 168, wid: 13, count: 8, spread: 30, droop: 0.04,
    palette: { deep: '#1B4526', mid: '#2C6631', light: '#4C8B3C' },
    variegation: 'banded', variegationColor: '#A8BE72', pot: 'ceramic', scene: 'studio',
    note: 'Stiff upright blades with pale cross-banding and a yellow margin.',
  },
  'areca-palm': {
    habit: 'clumping-frond', shape: 'lanceolate', len: 150, wid: 8, count: 8, spread: 58, droop: 0.5,
    palette: { deep: '#3B7A2A', mid: '#5A9B33', light: '#84BC4C' },
    compound: { leaflets: 13, leafletLen: 34, leafletWid: 4.6 },
    pot: 'nursery', scene: 'greenhouse',
    note: 'Yellow-green arching pinnate fronds in a clump.',
  },
  'money-plant': {
    habit: 'trailing', shape: 'cordate', len: 44, wid: 27, count: 22, spread: 78, droop: 0.7,
    palette: { deep: '#256B2A', mid: '#3C8A33', light: '#63AB45' },
    variegation: 'mottled', variegationColor: '#D8E4A4', glossy: true,
    pot: 'ceramic', scene: 'studio',
    note: 'Trailing vines of heart-shaped leaves with cream mottling.',
  },
  'zz-plant': {
    habit: 'upright-stem', shape: 'ovate', len: 30, wid: 15, count: 6, spread: 40, droop: 0.12,
    palette: { ...G.darkGloss }, glossy: true,
    compound: { leaflets: 6, leafletLen: 40, leafletWid: 16 },
    pot: 'ceramic', scene: 'studio',
    note: 'Erect stems lined with thick, very glossy dark leaflets.',
  },
  'peace-lily': {
    habit: 'crown', shape: 'lanceolate', len: 105, wid: 27, count: 9, spread: 48, droop: 0.3,
    palette: { deep: '#164A22', mid: '#25682C', light: '#3C8A38', vein: 'rgba(255,255,255,0.18)' },
    glossy: true,
    flower: { kind: 'spathe', color: '#F7F6EE', centre: '#D9D08A', count: 3, size: 26 },
    pot: 'ceramic', scene: 'studio',
    note: 'Dark ribbed leaves with white spathes on slender stalks.',
  },
  'rubber-plant': {
    habit: 'upright-stem', shape: 'ovate', len: 62, wid: 29, count: 7, spread: 46, droop: 0.2,
    palette: { deep: '#12301A', mid: '#1E4A22', light: '#33682C', vein: 'rgba(180,90,70,0.5)' },
    glossy: true, pot: 'terracotta', scene: 'studio',
    note: 'Thick lacquered oval leaves with a reddish midrib.',
  },
  'syngonium': {
    habit: 'crown', shape: 'arrowhead', len: 68, wid: 32, count: 8, spread: 70, droop: 0.34,
    palette: { deep: '#2A6630', mid: '#3F8837', light: '#68AC49' },
    variegation: 'pale-centre', variegationColor: '#DCEBBE', glossy: true,
    pot: 'ceramic', scene: 'studio',
    note: 'Arrowhead leaves with a pale centre.',
  },
  'spider-plant': {
    habit: 'arching-strap', shape: 'strap', len: 96, wid: 9, count: 16, spread: 78, droop: 0.72,
    palette: { deep: '#2C7031', mid: '#448F38', light: '#6EAF4B' },
    variegation: 'centre-stripe', variegationColor: '#F0F3D2',
    pot: 'ceramic', scene: 'studio',
    note: 'Arching cream-striped straps with plantlets on runners.',
  },
  'bamboo-palm': {
    habit: 'clumping-frond', shape: 'lanceolate', len: 128, wid: 8, count: 8, spread: 44, droop: 0.34,
    palette: { deep: '#245A26', mid: '#377B2F', light: '#57A03E' },
    compound: { leaflets: 9, leafletLen: 32, leafletWid: 5.4 },
    trunk: { height: 0, width: 0, color: '#7E9A55' },
    pot: 'nursery', scene: 'greenhouse',
    note: 'Slender green canes carrying narrow pinnate fronds.',
  },
  'selloum': {
    habit: 'crown', shape: 'lobed', len: 112, wid: 58, count: 7, spread: 60, droop: 0.28,
    palette: { deep: '#1A4A22', mid: '#2A6A2E', light: '#42883A' },
    pot: 'nursery', scene: 'garden',
    note: 'Very large deeply pinnatifid leaves on long stalks.',
  },
  'anthurium': {
    habit: 'crown', shape: 'cordate', len: 82, wid: 42, count: 8, spread: 62, droop: 0.28,
    palette: { ...G.darkGloss, vein: 'rgba(255,255,255,0.16)' }, glossy: true,
    flower: { kind: 'spathe', color: '#C4243A', centre: '#EFD98C', count: 3, size: 30 },
    pot: 'ceramic', scene: 'studio',
    note: 'Glossy heart-shaped leaves with waxy scarlet spathes.',
  },

  /* ------------------------------- SUCCULENTS -------------------------------- */
  'aloe-vera': {
    habit: 'rosette', shape: 'succulentBlade', len: 120, wid: 34, count: 9, spread: 180, droop: 0.16,
    palette: { deep: '#3F6540', mid: '#5C8552', light: '#84A96C' },
    variegation: 'speckled', variegationColor: 'rgba(255,255,255,0.5)',
    pot: 'terracotta', scene: 'studio',
    note: 'Thick grey-green toothed blades in an open rosette.',
  },
  'echeveria': {
    habit: 'rosette', shape: 'rosettePetal', len: 72, wid: 32, count: 13, spread: 180,
    palette: { deep: '#5E8570', mid: '#87A98C', light: '#B4C9AC' },
    variegation: 'speckled', variegationColor: 'rgba(214,140,150,0.55)',
    pot: 'terracotta', scene: 'studio',
    note: 'Tight powder-blue rosette with blushed tips.',
  },
  'jade-plant': {
    habit: 'shrub', shape: 'roundThick', len: 30, wid: 17, count: 30, spread: 70,
    palette: { deep: '#2C6633', mid: '#3F8340', light: '#5FA352' },
    glossy: true, trunk: { height: 42, width: 11, color: '#8A6440', branches: true },
    pot: 'terracotta', scene: 'studio',
    note: 'Woody stems with paired thick round leaves, red-rimmed.',
  },

  /* ------------------------------- FLOWERING --------------------------------- */
  bougainvillea: {
    habit: 'climber', shape: 'ovate', len: 26, wid: 14, count: 30, spread: 84,
    palette: { deep: '#2A6330', mid: '#3E8038', light: '#5FA047' },
    flower: { kind: 'bracts', color: '#C2185B', color2: '#E1568C', centre: '#F4E9C2', count: 16, size: 17 },
    pot: 'ground', scene: 'garden',
    note: 'Sprawling canes with papery magenta bracts in threes.',
  },
  hibiscus: {
    habit: 'shrub', shape: 'ovate', len: 30, wid: 19, count: 34, spread: 76,
    palette: { deep: '#1E5726', mid: '#2F7431', light: '#4C9440' }, serrated: true,
    flower: { kind: 'trumpet', color: '#D3302F', color2: '#EE6B4E', centre: '#F2C744', count: 5, size: 23 },
    pot: 'ground', scene: 'garden',
    note: 'Toothed leaves with large five-petalled blooms and a long staminal column.',
  },
  mogra: {
    habit: 'shrub', shape: 'ovate', len: 22, wid: 15, count: 40, spread: 76,
    palette: { deep: '#194B22', mid: '#2A6B2C', light: '#428838' }, glossy: true,
    flower: { kind: 'pinwheel', color: '#FCFBF3', centre: '#EFE3AE', count: 11, size: 14 },
    pot: 'terracotta', scene: 'garden',
    note: 'Glossy dark leaves with small white pinwheel jasmine flowers.',
  },
  ixora: {
    habit: 'shrub', shape: 'obovate', len: 32, wid: 14, count: 38, spread: 72,
    palette: { deep: '#17491F', mid: '#276829', light: '#3C8635' }, glossy: true,
    flower: { kind: 'cluster', color: '#D8442A', color2: '#EE7A45', centre: '#F6D77E', count: 5, size: 24 },
    pot: 'ground', scene: 'garden',
    note: 'Dense domed heads of small tubular scarlet flowers.',
  },
  'nerium-oleander': {
    habit: 'shrub', shape: 'lanceolate', len: 46, wid: 12, count: 34, spread: 62,
    palette: { deep: '#1D4F2A', mid: '#2C6C32', light: '#478A3D' },
    flower: { kind: 'rosette-bloom', color: '#E4859F', color2: '#F2AFC0', centre: '#F6E3A8', count: 6, size: 20 },
    pot: 'ground', scene: 'garden',
    note: 'Whorled narrow leathery leaves with soft pink flower clusters.',
  },
  gulmohar: {
    habit: 'tree', shape: 'lanceolate', len: 44, wid: 4, count: 14, spread: 78,
    palette: { deep: '#2B6A2C', mid: '#438A34', light: '#6DAE49' },
    compound: { leaflets: 14, leafletLen: 12, leafletWid: 2.6 },
    flower: { kind: 'rosette-bloom', color: '#D8392B', color2: '#F0663A', centre: '#F6DE9A', count: 9, size: 17 },
    trunk: { height: 96, width: 17, color: '#6B5138', branches: true },
    pot: 'ground', scene: 'garden',
    note: 'Fine bipinnate foliage with scarlet flowers across a broad canopy.',
  },

  /* --------------------------------- FRUIT ----------------------------------- */
  'alphonso-mango': {
    habit: 'tree', shape: 'lanceolate', len: 58, wid: 15, count: 54, spread: 80, droop: 0.55,
    palette: { deep: '#173F1E', mid: '#255C26', light: '#3C7C31' }, glossy: true,
    fruit: { color: '#E2A62E', color2: '#D2542A', count: 4, size: 17, shape: 'drop' },
    trunk: { height: 82, width: 19, color: '#5E4630', branches: true },
    pot: 'ground', scene: 'garden',
    note: 'Long drooping lanceolate leaves with blushed yellow fruit.',
  },
  guava: {
    habit: 'tree', shape: 'ovate', len: 46, wid: 21, count: 30, spread: 78,
    palette: { deep: '#28632A', mid: '#3D8033', light: '#63A346', vein: 'rgba(255,255,255,0.24)' },
    fruit: { color: '#C6D06B', color2: '#DCE29A', count: 4, size: 17, shape: 'round' },
    trunk: { height: 64, width: 16, color: '#8A7355', branches: true },
    pot: 'ground', scene: 'garden',
    note: 'Opposite oval leaves with strongly marked veins and pale round fruit.',
  },
  lemon: {
    habit: 'shrub', shape: 'ovate', len: 34, wid: 17, count: 36, spread: 76,
    palette: { deep: '#1B5223', mid: '#2C6F2E', light: '#489038' }, glossy: true,
    fruit: { color: '#EFC340', color2: '#F6DE7C', count: 5, size: 14, shape: 'oblong' },
    trunk: { height: 46, width: 13, color: '#7A6547', branches: true },
    pot: 'terracotta', scene: 'garden',
    note: 'Glossy citrus foliage carrying bright yellow fruit.',
  },
  pomegranate: {
    habit: 'shrub', shape: 'lanceolate', len: 26, wid: 7, count: 46, spread: 74,
    palette: { deep: '#25602A', mid: '#3A7F33', light: '#5FA046' }, glossy: true,
    fruit: { color: '#BC3B2C', color2: '#DC6A45', count: 4, size: 16, shape: 'round', crown: true },
    trunk: { height: 48, width: 12, color: '#7E6244', branches: true },
    pot: 'ground', scene: 'garden',
    note: 'Small glossy leaves with crowned red fruit.',
  },

  /* -------------------------------- MEDICINAL -------------------------------- */
  tulsi: {
    habit: 'shrub', shape: 'ovate', len: 24, wid: 12, count: 34, spread: 68,
    palette: { deep: '#2A5B32', mid: '#3E7A38', light: '#5E9A4C' }, serrated: true,
    flower: { kind: 'spike', color: '#8E6FA8', color2: '#B99AC9', count: 5, size: 30 },
    pot: 'terracotta', scene: 'garden',
    note: 'Opposite toothed leaves with slender purple flower spikes.',
  },
  'curry-leaf': {
    habit: 'shrub', shape: 'lanceolate', len: 52, wid: 6, count: 12, spread: 72, droop: 0.2,
    palette: { deep: '#1B4E23', mid: '#2B6C2C', light: '#438B37' }, glossy: true,
    compound: { leaflets: 7, leafletLen: 21, leafletWid: 5.6 },
    pot: 'nursery', scene: 'garden',
    note: 'Pinnate sprays of small aromatic leaflets.',
  },

  /* ---------------------------------- TREES ---------------------------------- */
  neem: {
    habit: 'tree', shape: 'lanceolate', len: 62, wid: 6, count: 16, spread: 82, droop: 0.3,
    palette: { deep: '#20551F', mid: '#337429', light: '#55993B' }, serrated: true,
    compound: { leaflets: 11, leafletLen: 19, leafletWid: 5 },
    trunk: { height: 86, width: 18, color: '#6B5A42', branches: true },
    pot: 'ground', scene: 'garden',
    note: 'Pinnate leaves of curved, toothed leaflets on a spreading tree.',
  },
  peepal: {
    habit: 'tree', shape: 'cordate', len: 46, wid: 30, count: 30, spread: 84, droop: 0.35,
    palette: { deep: '#256428', mid: '#3A8433', light: '#63A848', vein: 'rgba(255,255,255,0.22)' },
    trunk: { height: 92, width: 22, color: '#7B6A50', branches: true },
    pot: 'ground', scene: 'garden',
    note: 'Heart-shaped leaves drawn out into a long drip tip.',
  },

  /* -------------------------------- ORNAMENTAL ------------------------------- */
  'ficus-panda': {
    habit: 'shrub', shape: 'obovate', len: 21, wid: 11, count: 52, spread: 88,
    palette: { deep: '#194A20', mid: '#296A28', light: '#3F8834' }, glossy: true,
    trunk: { height: 40, width: 12, color: '#8B7458' },
    pot: 'nursery', scene: 'garden',
    note: 'Dense small glossy leaves clipped to a tight ball.',
  },
  'duranta-golden': {
    habit: 'shrub', shape: 'obovate', len: 20, wid: 10, count: 56, spread: 88,
    palette: { deep: '#8A8F2C', mid: '#B4B840', light: '#D6D566' },
    trunk: { height: 30, width: 10, color: '#7A6A44', branches: true },
    pot: 'ground', scene: 'garden',
    note: 'Bright golden foliage clipped as a hedge block.',
  },
  'mexican-grass': {
    habit: 'grass', shape: 'blade', len: 62, wid: 3.4, count: 56, spread: 62, droop: 0.55,
    palette: { deep: '#1F5427', mid: '#2F7130', light: '#4C9040' },
    pot: 'ground', scene: 'garden',
    note: 'Fine dark grass in dense mounded tufts.',
  },
};

/** Fallback for any plant added later without a profile yet. */
export const defaultProfile: BotanicalProfile = {
  habit: 'crown', shape: 'ovate', len: 88, wid: 36, count: 7, spread: 62, droop: 0.3,
  palette: { deep: '#1D5226', mid: '#2E7135', light: '#4E9642' },
  pot: 'nursery', scene: 'studio',
};

export const getProfile = (slug: string): BotanicalProfile => botanicalProfiles[slug] ?? defaultProfile;
