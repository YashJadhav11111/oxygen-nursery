import type { CareCategory, PlantCareGuide } from '@/types';

export const careCategories: { id: CareCategory; name: string; icon: string; blurb: string }[] = [
  { id: 'watering', name: 'Watering', icon: 'droplet', blurb: 'How much, how often, and how to tell.' },
  { id: 'sunlight', name: 'Sunlight', icon: 'sun', blurb: 'Reading the light your space actually gets.' },
  { id: 'soil', name: 'Soil', icon: 'layers', blurb: 'Mixes, drainage and repotting.' },
  { id: 'fertilization', name: 'Fertilization', icon: 'sparkle', blurb: 'Feeding without overdoing it.' },
  { id: 'pruning', name: 'Pruning', icon: 'scissors', blurb: 'Shaping, thinning and when to stop.' },
  { id: 'pest-care', name: 'Pest Care', icon: 'bug', blurb: 'Spotting common problems early.' },
  { id: 'indoor-care', name: 'Indoor Plant Care', icon: 'home', blurb: 'Keeping plants happy inside.' },
  { id: 'outdoor-care', name: 'Outdoor Plant Care', icon: 'tree', blurb: 'Seasons, sun and open ground.' },
];

/**
 * PLANT CARE LIBRARY.
 * Guides are general horticultural practice written in plain language. They
 * make no medical or scientific claims. The structure (title / cover / category
 * / summary / content blocks / difficulty / tags) is CMS-ready — add as many
 * guides as needed here, or fetch them from an API via careService.ts.
 */
export const plantCareGuides: PlantCareGuide[] = [
  {
    id: 'g1',
    slug: 'how-to-water-indoor-plants',
    title: 'How to Water Indoor Plants',
    category: 'watering',
    difficulty: 'beginner',
    readingMinutes: 4,
    coverImage: { scene: 'watering', seed: 'guide-water', alt: 'Watering an indoor plant', demo: true },
    summary: 'More indoor plants are lost to too much water than to too little. Here is how to judge it.',
    tags: ['indoor', 'watering', 'beginner'],
    content: [
      {
        heading: 'Check the soil, not the calendar',
        body: 'A fixed weekly schedule ignores the things that actually matter — pot size, light, season and how warm the room is. Push a finger about three to four centimetres into the soil. If it feels dry at that depth, water. If it is still damp, wait.',
      },
      {
        heading: 'Water thoroughly, then let it drain',
        body: 'When you do water, water properly: keep going until it runs from the drainage hole, then tip away whatever collects in the saucer. Light sprinkles only wet the top layer and leave the deeper roots dry.',
        points: [
          'Use a pot with a drainage hole.',
          'Never leave the pot standing in water.',
          'Room-temperature water is easier on the roots than very cold water.',
        ],
      },
      {
        heading: 'Adjust with the season',
        body: 'Most indoor plants slow down in cooler months and need noticeably less water. Watch the plant rather than the routine — and when in doubt with a low-water plant such as a snake plant or ZZ plant, wait another few days.',
      },
    ],
  },
  {
    id: 'g2',
    slug: 'understanding-sunlight-requirements',
    title: 'Understanding Sunlight Requirements',
    category: 'sunlight',
    difficulty: 'beginner',
    readingMinutes: 5,
    coverImage: { scene: 'sunlight', seed: 'guide-sun', alt: 'Plant in bright indirect light', demo: true },
    summary: 'What "full sun", "partial sun" and "low light" mean in a real house.',
    tags: ['sunlight', 'placement', 'beginner'],
    content: [
      {
        heading: 'The three broad bands',
        body: 'Full sun means roughly six hours or more of direct sunlight — an open terrace or a south or west facing balcony. Partial sun is a few hours of direct light or a full day of bright indirect light near a window. Low light is a room with daylight but no direct beam reaching the plant.',
      },
      {
        heading: 'Test your own space',
        body: 'Stand where the plant will go at mid-morning and again mid-afternoon and note whether sunlight falls on that spot, and for how long. That simple observation is more reliable than a label.',
        points: [
          'Glass and mosquito mesh cut light more than people expect.',
          'A metre back from a window can be a different light band entirely.',
          'Rotate pots every few weeks so growth stays even.',
        ],
      },
      {
        heading: 'Signs the light is wrong',
        body: 'Long, stretched stems with widely spaced leaves usually mean not enough light. Pale, bleached or scorched patches on leaves usually mean too much direct sun. Move the plant gradually rather than all at once.',
      },
    ],
  },
  {
    id: 'g3',
    slug: 'basic-plant-pruning',
    title: 'Basic Plant Pruning',
    category: 'pruning',
    difficulty: 'intermediate',
    readingMinutes: 5,
    coverImage: { scene: 'pruning', seed: 'guide-prune', alt: 'Pruning a garden shrub', demo: true },
    summary: 'Cutting back is how you keep a plant dense, healthy and the shape you want.',
    tags: ['pruning', 'outdoor', 'maintenance'],
    content: [
      {
        heading: 'Start with the three Ds',
        body: 'Before shaping anything, remove what is dead, damaged or diseased. That alone improves airflow and the look of most plants, and it carries no risk of cutting away next season’s growth.',
      },
      {
        heading: 'Cut in the right place',
        body: 'Make cuts just above a growth node or an outward-facing bud, at a slight angle. Use clean, sharp secateurs — a crushed stem takes far longer to heal than a clean cut.',
        points: [
          'Wipe blades between plants.',
          'Never remove more than about a third of a plant at one time.',
          'Step back often; it is easy to over-cut one side.',
        ],
      },
      {
        heading: 'Timing depends on flowering',
        body: 'Plants that flower on new growth, such as hibiscus and bougainvillea, respond well to pruning after a flowering flush. For most hedging and foliage plants, light regular trimming keeps a better shape than one hard annual cut.',
      },
    ],
  },
  {
    id: 'g4',
    slug: 'choosing-the-right-soil',
    title: 'Choosing the Right Soil',
    category: 'soil',
    difficulty: 'beginner',
    readingMinutes: 4,
    coverImage: { scene: 'soil', seed: 'guide-soil', alt: 'Potting mix and soil', demo: true },
    summary: 'A good mix holds enough moisture to feed the plant and drains the rest away.',
    tags: ['soil', 'potting', 'beginner'],
    content: [
      {
        heading: 'Garden soil alone is rarely right for pots',
        body: 'Dug soil compacts in a container, holds water at the base and leaves roots short of air. A potting mix combines something to hold moisture, something to add structure and something to drain.',
      },
      {
        heading: 'A general-purpose starting point',
        body: 'For most indoor and balcony plants, a mix of garden soil, compost and coco peat with a handful of coarse sand or perlite works well. Succulents and cacti want more grit and less organic matter; moisture-loving plants want the opposite.',
        points: [
          'Every pot needs a drainage hole.',
          'Refresh the top few centimetres of mix each year.',
          'Repot when roots circle the base or water runs straight through.',
        ],
      },
      {
        heading: 'Improving ground soil',
        body: 'In open ground, work compost into the planting area rather than only into the planting hole — roots that hit a wall of hard soil at the edge of a rich pocket tend to circle instead of spreading.',
      },
    ],
  },
  {
    id: 'g5',
    slug: 'beginner-plant-care',
    title: 'Beginner Plant Care',
    category: 'indoor-care',
    difficulty: 'beginner',
    readingMinutes: 6,
    coverImage: { scene: 'nursery', seed: 'guide-beginner', alt: 'A beginner-friendly indoor plant', demo: true },
    summary: 'Five habits that keep a first plant alive — and which plants forgive the most.',
    tags: ['beginner', 'indoor', 'routine'],
    content: [
      {
        heading: 'Choose a forgiving plant first',
        body: 'Snake plant, money plant, ZZ plant, jade and spider plant all tolerate irregular care and a range of light. Start with one of these, learn its rhythm, then add something more demanding.',
      },
      {
        heading: 'Put the plant where it suits, not where it looks best',
        body: 'Placement decides most of the outcome. A plant in the wrong light will struggle no matter how carefully you water it. If a corner has no daylight at all, use a low-light species or rotate plants in and out.',
      },
      {
        heading: 'Build a short weekly routine',
        body: 'Once a week, check the soil, look under a few leaves, and turn the pot. That is enough to catch nearly every common problem early.',
        points: [
          'Check soil moisture before watering, every time.',
          'Dust the leaves once a month.',
          'Feed lightly during the growing season, not in the cold months.',
          'Repot when the plant outgrows its container.',
        ],
      },
    ],
  },
  {
    id: 'g6',
    slug: 'feeding-your-plants',
    title: 'Feeding Your Plants',
    category: 'fertilization',
    difficulty: 'intermediate',
    readingMinutes: 4,
    coverImage: { scene: 'soil', seed: 'guide-feed', alt: 'Adding compost to a plant', demo: true },
    summary: 'Little and often during growth beats a heavy dose once a year.',
    tags: ['fertiliser', 'compost', 'growth'],
    content: [
      {
        heading: 'Feed when the plant is growing',
        body: 'Fertiliser is useful only while a plant is actively putting out new growth. Feeding a dormant or stressed plant does not help and can burn the roots.',
      },
      {
        heading: 'Organic matter first',
        body: 'Compost, vermicompost and well-rotted manure improve the soil itself as well as feeding the plant. In pots, top-dressing with compost every couple of months suits most plants.',
        points: [
          'Water before and after applying any fertiliser.',
          'Follow the dilution on the pack — more is not better.',
          'A white crust on the soil surface can indicate over-feeding.',
        ],
      },
      {
        heading: 'When to hold back',
        body: 'Skip feeding for several weeks after repotting, while a plant is recovering from pest damage, or during the coldest part of the year when growth has slowed.',
      },
    ],
  },
  {
    id: 'g7',
    slug: 'common-plant-pests',
    title: 'Spotting Common Plant Pests',
    category: 'pest-care',
    difficulty: 'intermediate',
    readingMinutes: 5,
    coverImage: { scene: 'pests', seed: 'guide-pest', alt: 'Inspecting a leaf for pests', demo: true },
    summary: 'Most infestations are easy to handle if you find them in the first week.',
    tags: ['pests', 'maintenance', 'indoor', 'outdoor'],
    content: [
      {
        heading: 'Look under the leaves',
        body: 'Almost everything starts on the underside of leaves and at the growing tips. A weekly glance there catches problems while they are still a handful of insects.',
      },
      {
        heading: 'What you are likely to see',
        body: 'Fine webbing and stippled leaves suggest spider mites. Sticky residue with clusters of small insects suggests aphids or mealybugs. Small flies around the soil usually mean the mix is staying too wet.',
        points: [
          'Isolate an affected plant from the rest.',
          'Wipe or hose off light infestations before reaching for anything else.',
          'Neem-based sprays are a common first response for soft-bodied pests.',
          'Let the soil dry out more between waterings if fungus gnats appear.',
        ],
      },
      {
        heading: 'Prevention is mostly airflow and restraint',
        body: 'Crowded plants, constantly wet soil and still air create most pest problems. Space plants out, water only when needed, and remove fallen leaves from the pot surface.',
      },
    ],
  },
  {
    id: 'g8',
    slug: 'outdoor-plant-care-through-the-year',
    title: 'Outdoor Plant Care Through the Year',
    category: 'outdoor-care',
    difficulty: 'intermediate',
    readingMinutes: 6,
    coverImage: { scene: 'landscape', seed: 'guide-outdoor', alt: 'Outdoor garden through the seasons', demo: true },
    summary: 'What a garden needs from you in the monsoon, the cool months and the hot season.',
    tags: ['outdoor', 'seasonal', 'garden'],
    content: [
      {
        heading: 'Monsoon: plant, but watch the drainage',
        body: 'The rains are the best planting window of the year — young plants establish with far less watering. The risk is standing water, so check that beds and pots drain and lift containers off flat surfaces.',
      },
      {
        heading: 'Cool months: shape and feed',
        body: 'Growth slows, which makes this a good time for structural pruning, adding compost and planning changes to the layout. Water less often than you did through the hot season.',
      },
      {
        heading: 'Hot season: water deeply and mulch',
        body: 'Deep, less frequent watering encourages roots downward; frequent light watering keeps them at the surface where it is hottest. A layer of mulch over the soil makes a large difference to how long moisture lasts.',
        points: [
          'Water early morning or evening, not in the midday heat.',
          'Mulch beds and large pots.',
          'Move sensitive potted plants into afternoon shade.',
        ],
      },
    ],
  },
];

export const guideBySlug = (slug: string) => plantCareGuides.find((g) => g.slug === slug);
