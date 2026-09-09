import type { Category, CategoryId } from '@/types';

/**
 * Plant categories. Each one is illustrated by a representative species from
 * the catalogue, so the card shows a real example of what is inside it.
 *
 * Plant categories. `id` is used in URLs (/plants?category=indoor) and in the
 * Plant.category field — keep the ids stable if you rename the display names.
 */
export const categories: Category[] = [
  {
    id: 'indoor',
    name: 'Indoor Plants',
    slug: 'indoor',
    description: 'Foliage that thrives in living rooms, offices and shaded corners.',
    image: { plant: 'monstera-deliciosa', alt: 'Indoor foliage plants', demo: false },
  },
  {
    id: 'outdoor',
    name: 'Outdoor Plants',
    slug: 'outdoor',
    description: 'Sun-loving plants for balconies, terraces and open gardens.',
    image: { plant: 'bougainvillea', alt: 'Outdoor garden plants', demo: false },
  },
  {
    id: 'flowering',
    name: 'Flowering Plants',
    slug: 'flowering',
    description: 'Seasonal and year-round bloomers that bring colour to a space.',
    image: { plant: 'mogra', alt: 'Flowering plants in bloom', demo: false },
  },
  {
    id: 'fruit',
    name: 'Fruit Plants',
    slug: 'fruit',
    description: 'Grafted and seedling fruit plants suited to home gardens.',
    image: { plant: 'alphonso-mango', alt: 'Fruit bearing plants', demo: false },
  },
  {
    id: 'ornamental',
    name: 'Ornamental Plants',
    slug: 'ornamental',
    description: 'Shapely, decorative plants for landscape and entrance planting.',
    image: { plant: 'ficus-panda', alt: 'Ornamental landscape plants', demo: false },
  },
  {
    id: 'trees',
    name: 'Trees',
    slug: 'trees',
    description: 'Native and avenue trees for gardens, campuses and plantations.',
    image: { plant: 'gulmohar', alt: 'Garden and avenue trees', demo: false },
  },
  {
    id: 'shrubs',
    name: 'Shrubs',
    slug: 'shrubs',
    description: 'Hedging and mass-planting shrubs that hold their form.',
    image: { plant: 'duranta-golden', alt: 'Hedging shrubs', demo: false },
  },
  {
    id: 'medicinal',
    name: 'Medicinal Plants',
    slug: 'medicinal',
    description: 'Traditional herb and medicinal garden plants.',
    image: { plant: 'neem', alt: 'Medicinal herb plants', demo: false },
  },
  {
    id: 'succulents',
    name: 'Succulents',
    slug: 'succulents',
    description: 'Compact, drought-tolerant plants for desks and sunny sills.',
    image: { plant: 'echeveria', alt: 'Succulent rosettes', demo: false },
  },
  {
    id: 'low-maintenance',
    name: 'Low Maintenance Plants',
    slug: 'low-maintenance',
    description: 'Forgiving plants for busy homes, offices and first-time growers.',
    image: { plant: 'snake-plant', alt: 'Low maintenance plants', demo: false },
  },
];

export const categoryMap: Record<CategoryId, Category> = categories.reduce(
  (acc, c) => ({ ...acc, [c.id]: c }),
  {} as Record<CategoryId, Category>,
);

export const getCategoryName = (id: CategoryId) => categoryMap[id]?.name ?? id;
