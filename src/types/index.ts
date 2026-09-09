/**
 * Domain models for Oxygen Nursery.
 * These shapes are what a future API / database must return. Keep them stable
 * and the UI will not need to change when the demo data is swapped for real data.
 */

export type Availability = 'available' | 'limited' | 'unavailable';
export type Sunlight = 'low-light' | 'partial-sun' | 'full-sun';
export type WaterNeed = 'low' | 'moderate' | 'high';
export type CareLevel = 'easy' | 'moderate' | 'expert';
export type Placement = 'home' | 'office' | 'balcony' | 'terrace' | 'garden';
export type Purpose = 'decorative' | 'flowering' | 'fruit' | 'air-greenery' | 'garden';

/**
 * Scene variants — illustrations of the WORK Oxygen Nursery does (a green wall,
 * a drip line, a Miyawaki plot), used for services, projects and care guides.
 * Plants themselves use their own species portrait instead; see PlantImage.plant.
 */
export type SceneVariant =
  | 'landscape' | 'terrace' | 'vertical' | 'lawn' | 'irrigation' | 'maintenance'
  | 'kitchen' | 'miyawaki' | 'greenbelt' | 'cultural' | 'butterfly' | 'nursery'
  | 'sprout' | 'soil' | 'watering' | 'sunlight' | 'pruning' | 'pests'
  | 'bare-ground' | 'bare-wall';

export interface PlantImage {
  /**
   * Real photo URL or imported asset. When present it is used and the
   * generated artwork is discarded — this is the ONLY field to fill in when
   * real Oxygen Nursery photos arrive.
   */
  src?: string;
  /** Generated scene illustration used while `src` is empty. */
  scene?: SceneVariant;
  /**
   * A plant slug. SmartImage looks the slug up in the photo manifest and shows
   * that plant's own photograph. If the plant has no photograph yet it shows
   * the explicit "photograph coming soon" state — never a drawing, so a
   * customer is never shown artwork in place of the plant they would receive.
   */
  plant?: string;
  /** Which view of the plant to draw — lets a gallery show more than one angle. */
  view?: 'full' | 'angle' | 'detail';
  /** Responsive sources for a real photograph, e.g. '/photos/x-800.jpg 800w, …'. */
  srcSet?: string;
  /** Stable seed so the same subject always draws the same illustration. */
  seed?: string;
  alt: string;
  /** true = placeholder artwork, not an Oxygen Nursery photograph. */
  demo?: boolean;
  /**
   * Name shown by the "photograph coming soon" state. Falls back to `alt`.
   */
  label?: string;
  /**
   * CSS object-position for this photograph, e.g. '50% 30%'. Cards crop to a
   * fixed ratio, so a plant sitting high or low in its frame occasionally needs
   * nudging to stay in view. Left unset for almost every image.
   */
  objectPosition?: string;
  credit?: string;
}

export interface Plant {
  id: string;
  slug: string;
  name: string;
  botanicalName?: string;
  category: CategoryId;
  images: PlantImage[];
  description: string;
  longDescription?: string;
  availability: Availability;
  sunlight: Sunlight;
  water: WaterNeed;
  soil: string;
  careLevel: CareLevel;
  /** Optional. Never display a price that is not present. */
  price?: number;
  priceUnit?: string;
  tags: string[];
  featured?: boolean;
  newArrival?: boolean;
  placements: Placement[];
  purposes: Purpose[];
  matureSize?: string;
  careNotes?: string[];
  collections?: CollectionId[];
}

export type CategoryId =
  | 'indoor'
  | 'outdoor'
  | 'flowering'
  | 'fruit'
  | 'ornamental'
  | 'trees'
  | 'shrubs'
  | 'medicinal'
  | 'succulents'
  | 'low-maintenance';

export interface Category {
  id: CategoryId;
  name: string;
  slug: string;
  description: string;
  image: PlantImage;
}

export type CollectionId =
  | 'monsoon'
  | 'flowering'
  | 'fruit'
  | 'indoor'
  | 'low-maintenance'
  | 'garden-trees';

export interface Collection {
  id: CollectionId;
  name: string;
  tagline: string;
  description: string;
  image: PlantImage;
  accent: string;
}

export type ServiceGroup = 'gardening' | 'green-solutions' | 'supply';

export interface Service {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  group: ServiceGroup;
  icon: string;
  image: PlantImage;
  highlights: string[];
  /** Extra named examples, e.g. cultural forest types. */
  examples?: string[];
  featured?: boolean;
  /** Appears in the appointment form's service dropdown. */
  bookable?: boolean;
}

export type ProjectCategoryId =
  | 'landscaping'
  | 'garden-development'
  | 'terrace-garden'
  | 'vertical-garden'
  | 'lawn'
  | 'plantation'
  | 'green-spaces';

export interface Project {
  id: string;
  slug: string;
  title: string;
  category: ProjectCategoryId;
  location?: string;
  summary: string;
  description: string;
  images: PlantImage[];
  beforeAfter?: { before: PlantImage; after: PlantImage };
  services: string[];
  /** Demo content flag — real projects will set this to false. */
  demo?: boolean;
}

export type CareCategory =
  | 'watering'
  | 'sunlight'
  | 'soil'
  | 'fertilization'
  | 'pruning'
  | 'pest-care'
  | 'indoor-care'
  | 'outdoor-care';

export interface PlantCareGuide {
  id: string;
  slug: string;
  title: string;
  coverImage: PlantImage;
  category: CareCategory;
  summary: string;
  /** Simple section blocks so guides can later come from a CMS. */
  content: { heading: string; body: string; points?: string[] }[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  readingMinutes: number;
  tags: string[];
}

export interface Review {
  id: string;
  name: string;
  rating: 1 | 2 | 3 | 4 | 5;
  review: string;
  date: string; // ISO
  verified: boolean;
  location?: string;
  /** Phase 1 reviews are illustrative placeholders, clearly labelled in the UI. */
  demo: boolean;
}

export type AppointmentStatus = 'pending' | 'confirmed' | 'rejected' | 'rescheduled' | 'completed';

export interface Appointment {
  id: string;
  name: string;
  phone: string;
  service: string;
  date: string; // yyyy-mm-dd
  time: string; // HH:mm
  message?: string;
  status: AppointmentStatus;
  createdAt: string; // ISO
}

export type AppointmentDraft = Omit<Appointment, 'id' | 'status' | 'createdAt'>;

/** Generic result envelope so the UI handles API errors the same way it handles demo data. */
export interface Result<T> {
  ok: boolean;
  data?: T;
  error?: string;
}

export interface PlantQuery {
  search?: string;
  categories?: CategoryId[];
  availability?: Availability[];
  sunlight?: Sunlight[];
  water?: WaterNeed[];
  careLevel?: CareLevel[];
  collection?: CollectionId;
  featured?: boolean;
  newArrival?: boolean;
  sort?: PlantSort;
  limit?: number;
}

export type PlantSort =
  | 'recommended'
  | 'name-asc'
  | 'name-desc'
  | 'price-asc'
  | 'price-desc'
  | 'newest';

export interface RecommenderAnswers {
  placement?: Placement;
  sunlight?: Sunlight;
  maintenance?: 'low' | 'medium' | 'high';
  purpose?: Purpose;
}
