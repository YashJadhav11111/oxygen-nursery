import type { Service } from '@/types';
import { servicePhotos } from './photos';

/**
 * SERVICES — descriptions are based on the gardening / landscaping scope
 * supplied for Oxygen Nursery. No third-party company details, client names or
 * personal information from any source document appear here.
 *
 * `group` drives where a service is shown:
 *   supply           -> plant & material supply
 *   gardening        -> design, build and maintenance work
 *   green-solutions  -> large-scale ecological work (Home page Section F)
 */
const baseServices: Service[] = [
  {
    id: 'plant-supply',
    slug: 'plant-supply',
    name: 'Plant Supply',
    group: 'supply',
    icon: 'leaf',
    shortDescription: 'Indoor, outdoor, flowering, fruit, ornamental and native plants supplied from our nursery.',
    description:
      'We supply plants for homes, offices, housing societies, institutions and project sites — from single indoor plants to bulk orders for landscaping and plantation work. Selection is guided by where the plant will live: light, exposure, soil and how much care it will realistically get.',
    image: { scene: 'nursery', seed: 'svc-supply', alt: 'Nursery plant supply', demo: true },
    highlights: ['Indoor and outdoor varieties', 'Native, medicinal and ornamental plants', 'Bulk supply for projects', 'Guidance on placement and care'],
    featured: true,
    bookable: true,
  },
  {
    id: 'landscape-designing',
    slug: 'landscape-designing',
    name: 'Landscape Designing & Gardening',
    group: 'gardening',
    icon: 'compass',
    shortDescription: 'Garden layouts planned around your space, soil, light and how you use the place.',
    description:
      'We plan gardens as a whole: circulation, planting beds, lawn areas, focal planting, and the practical things — where water reaches, where shade falls, where people walk. Design work covers residential gardens, society premises, farmhouses and institutional grounds.',
    image: { scene: 'landscape', seed: 'svc-landscape', alt: 'Landscape design work', demo: true },
    highlights: ['Site study and planting plan', 'Plant palette suited to the location', 'Hard and soft landscape coordination', 'Phase-wise execution'],
    featured: true,
    bookable: true,
  },
  {
    id: 'garden-development',
    slug: 'garden-development',
    name: 'Garden Development',
    group: 'gardening',
    icon: 'shovel',
    shortDescription: 'Turning bare or neglected ground into a planted, usable garden.',
    description:
      'Ground preparation, soil improvement, bed forming, planting and finishing. We take a plot from cleared ground to a planted garden, and set it up so it can be maintained without a struggle.',
    image: { scene: 'sprout', seed: 'svc-garden-dev', alt: 'Garden development work', demo: true },
    highlights: ['Soil preparation and improvement', 'Bed forming and planting', 'Pathways and edging coordination', 'Handover with a care plan'],
    featured: true,
    bookable: true,
  },
  {
    id: 'vertical-garden',
    slug: 'vertical-garden',
    name: 'Vertical / Wall Gardens',
    group: 'gardening',
    icon: 'grid',
    shortDescription: 'Green walls for entrances, balconies, offices and tight urban spaces.',
    description:
      'Where floor space is short, planting goes up. We build vertical gardens with a supporting frame, a planting system and an irrigation line, using species chosen for the light the wall actually receives.',
    image: { scene: 'vertical', seed: 'svc-vertical', alt: 'Vertical wall garden', demo: true },
    highlights: ['Indoor and outdoor green walls', 'Integrated drip irrigation', 'Species matched to wall light', 'Maintenance support'],
    featured: true,
    bookable: true,
  },
  {
    id: 'terrace-garden',
    slug: 'terrace-garden',
    name: 'Terrace Gardens',
    group: 'gardening',
    icon: 'building',
    shortDescription: 'Rooftop and terrace planting planned around load, drainage and sun.',
    description:
      'Terrace gardens need a different approach: lighter growing media, planned drainage, wind-tolerant species and containers that suit the structure. We design and build terrace gardens for homes and buildings, including seating and greenery layouts.',
    image: { scene: 'terrace', seed: 'svc-terrace', alt: 'Terrace garden', demo: true },
    highlights: ['Drainage and waterproofing coordination', 'Lightweight growing media', 'Wind and sun tolerant planting', 'Container and planter layouts'],
    featured: true,
    bookable: true,
  },
  {
    id: 'butterfly-garden',
    slug: 'butterfly-garden',
    name: 'Butterfly Gardens',
    group: 'gardening',
    icon: 'butterfly',
    shortDescription: 'Planting designed around nectar and host plants to invite butterflies.',
    description:
      'A butterfly garden is planted deliberately: nectar plants for adults, host plants for caterpillars, sunlit open patches and shelter. We plan these for schools, societies, campuses and private gardens.',
    image: { scene: 'butterfly', seed: 'svc-butterfly', alt: 'Butterfly garden planting', demo: true },
    highlights: ['Nectar and host plant pairing', 'Open sun and shelter zones', 'Suitable for schools and campuses', 'Native species preferred'],
    bookable: true,
  },
  {
    id: 'kitchen-garden',
    slug: 'kitchen-garden',
    name: 'Kitchen Gardens',
    group: 'gardening',
    icon: 'basket',
    shortDescription: 'Vegetable and herb beds for homes, terraces and society spaces.',
    description:
      'Practical growing spaces for vegetables, herbs and everyday kitchen plants — in ground beds, raised beds or containers, with a watering setup that fits the household routine.',
    image: { scene: 'kitchen', seed: 'svc-kitchen', alt: 'Kitchen garden beds', demo: true },
    highlights: ['Raised beds and container systems', 'Seasonal planting guidance', 'Herb and vegetable selection', 'Compost and soil advice'],
    bookable: true,
  },
  {
    id: 'lawn-turf',
    slug: 'lawn-turf',
    name: 'Lawn / Turf Supply & Laying',
    group: 'supply',
    icon: 'lawn',
    shortDescription: 'Turf supply, ground levelling and lawn laying with an establishment plan.',
    description:
      'Lawn work starts below the surface: levelling, drainage and a prepared bed. We supply turf and lay it, then set out the watering and mowing routine that gets it through establishment.',
    image: { scene: 'lawn', seed: 'svc-lawn', alt: 'Lawn and turf laying', demo: true },
    highlights: ['Ground levelling and preparation', 'Turf supply and laying', 'Establishment watering plan', 'Ongoing mowing and care'],
    featured: true,
    bookable: true,
  },
  {
    id: 'irrigation',
    slug: 'irrigation',
    name: 'Irrigation Systems',
    group: 'gardening',
    icon: 'droplet',
    shortDescription: 'Drip and sprinkler systems that water the garden without wasting water.',
    description:
      'We plan and install drip lines, sprinklers and automatic timers so planting gets water where and when it is needed. Sustainable watering is part of every garden we build, not an afterthought.',
    image: { scene: 'irrigation', seed: 'svc-irrigation', alt: 'Garden irrigation system', demo: true },
    highlights: ['Drip irrigation for beds and pots', 'Sprinklers for lawn areas', 'Timers and automation', 'Water-efficient layouts'],
    featured: true,
    bookable: true,
  },
  {
    id: 'garden-maintenance',
    slug: 'garden-maintenance',
    name: 'Garden Maintenance',
    group: 'gardening',
    icon: 'scissors',
    shortDescription: 'Scheduled upkeep — pruning, mowing, feeding, pest care and replanting.',
    description:
      'Gardens hold their quality through maintenance. We take on periodic upkeep: pruning and shaping, lawn mowing, weeding, feeding, pest management, seasonal replanting and irrigation checks.',
    image: { scene: 'maintenance', seed: 'svc-maintenance', alt: 'Garden maintenance work', demo: true },
    highlights: ['Periodic visit schedules', 'Pruning, mowing and weeding', 'Feeding and pest management', 'Seasonal replanting'],
    featured: true,
    bookable: true,
  },
  {
    id: 'miyawaki',
    slug: 'miyawaki-forest-plantation',
    name: 'Miyawaki Forest Plantation',
    group: 'green-solutions',
    icon: 'forest',
    shortDescription: 'Dense, multi-layered native plantations grown on small parcels of land.',
    description:
      'The Miyawaki method plants native species densely and in layers — shrub, sub-tree, tree and canopy — so the plantation closes canopy quickly and needs less intervention over time. It suits compact plots where conventional planting would take far longer to read as a forest.',
    image: { scene: 'miyawaki', seed: 'svc-miyawaki', alt: 'Miyawaki dense native plantation', demo: true },
    highlights: ['Native species selection', 'Soil preparation and mulching', 'Dense multi-layer planting', 'Establishment-phase maintenance'],
    featured: true,
    bookable: true,
  },
  {
    id: 'afforestation',
    slug: 'afforestation-ecosystem-restoration',
    name: 'Afforestation & Ecosystem Restoration',
    group: 'green-solutions',
    icon: 'seedling',
    shortDescription: 'Restoring degraded ground with native planting and long-term aftercare.',
    description:
      'Restoration work begins with the site: what the soil will support, what grew there, what water is available. We plan native planting, prepare the ground and stay with the site through the establishment years, when most plantations are won or lost.',
    image: { scene: 'miyawaki', seed: 'svc-afforestation', alt: 'Afforestation and restoration planting', demo: true },
    highlights: ['Site and soil assessment', 'Native species planting', 'Biodiversity-led plant palette', 'Aftercare through establishment'],
    bookable: true,
  },
  {
    id: 'green-belt',
    slug: 'industrial-green-belt-development',
    name: 'Industrial Green Belt Development',
    group: 'green-solutions',
    icon: 'factory',
    shortDescription: 'Green belts and buffer planting for industrial and institutional premises.',
    description:
      'Green belt planting around industrial premises uses hardy, tolerant species arranged as layered buffers along boundaries and approach roads. We handle planning, planting and the maintenance schedule that keeps the belt intact.',
    image: { scene: 'greenbelt', seed: 'svc-greenbelt', alt: 'Industrial green belt planting', demo: true },
    highlights: ['Boundary and buffer planting', 'Hardy, tolerant species', 'Avenue and approach-road planting', 'Maintenance schedules'],
    bookable: true,
  },
  {
    id: 'cultural-forest',
    slug: 'cultural-forest-development',
    name: 'Cultural Forest Development',
    group: 'green-solutions',
    icon: 'star',
    shortDescription: 'Themed plantations built around traditional plant associations.',
    description:
      'Cultural forests arrange planting around traditional themes, giving a garden both greenery and meaning. Each theme has its own plant list and layout, and works well for temples, institutions, public gardens and campuses.',
    image: { scene: 'cultural', seed: 'svc-cultural', alt: 'Cultural themed forest planting', demo: true },
    highlights: ['Themed planting layouts', 'Traditional plant associations', 'Suited to public and institutional spaces', 'Interpretation and signage support'],
    examples: ['Nakshatra Van', 'Panchavati', 'Rashi Van', 'Navgrah Van', 'Tirthankar Van', 'Charak Udyan'],
    featured: true,
    bookable: true,
  },
];

/** A real photograph replaces the scene illustration wherever one is supplied. */
const withPhotos = (list: Service[]): Service[] =>
  list.map((s) => (servicePhotos[s.id] ? { ...s, image: servicePhotos[s.id] } : s));

export const services: Service[] = withPhotos(baseServices);

export const serviceBySlug = (slug: string) => services.find((s) => s.slug === slug);
export const featuredServices = services.filter((s) => s.featured);
export const greenSolutions = services.filter((s) => s.group === 'green-solutions');

/** Options for the appointment form's service dropdown. */
export const bookableServices = [
  ...services.filter((s) => s.bookable).map((s) => s.name),
  'Other',
];
