import type { Collection } from '@/types';

/**
 * Seasonal / curated collections. Purely data-driven: add, remove or reorder
 * collections here and the Home page section and Plants page filter follow.
 * A plant joins a collection through its `collections` array.
 */
export const collections: Collection[] = [
  {
    id: 'monsoon',
    name: 'Monsoon Collection',
    tagline: 'Plants that love the rain',
    description: 'Varieties that establish quickly through the Nashik monsoon and settle in before winter.',
    image: { plant: 'neem', alt: 'Monsoon season plants', demo: false },
    accent: 'var(--forest-600)',
  },
  {
    id: 'flowering',
    name: 'Flowering Collection',
    tagline: 'Colour through the season',
    description: 'Reliable bloomers for balconies, borders and entrance beds.',
    image: { plant: 'mogra', alt: 'Flowering plant collection', demo: false },
    accent: '#C0466B',
  },
  {
    id: 'fruit',
    name: 'Fruit Plants',
    tagline: 'Grow something you can pick',
    description: 'Home-garden fruit plants selected for containers and small plots.',
    image: { plant: 'guava', alt: 'Fruit plant collection', demo: false },
    accent: '#C2662B',
  },
  {
    id: 'indoor',
    name: 'Indoor Collection',
    tagline: 'Greenery for rooms and desks',
    description: 'Shade-tolerant foliage that holds its looks indoors all year.',
    image: { plant: 'areca-palm', alt: 'Indoor plant collection', demo: false },
    accent: 'var(--forest-500)',
  },
  {
    id: 'low-maintenance',
    name: 'Low-Maintenance Plants',
    tagline: 'Hard to get wrong',
    description: 'Plants that tolerate a missed watering — good first plants and good office plants.',
    image: { plant: 'snake-plant', alt: 'Low maintenance plant collection', demo: false },
    accent: 'var(--leaf-600)',
  },
  {
    id: 'garden-trees',
    name: 'Garden Trees',
    tagline: 'Shade, structure, birds',
    description: 'Native and avenue trees for gardens, campuses and plantation projects.',
    image: { plant: 'gulmohar', alt: 'Garden tree collection', demo: false },
    accent: 'var(--forest-700)',
  },
];

export const getCollection = (id: string) => collections.find((c) => c.id === id);
