import type { Project, ProjectCategoryId } from '@/types';
import { projectPhotos } from './photos';

export const projectCategories: { id: ProjectCategoryId | 'all'; name: string }[] = [
  { id: 'all', name: 'All Projects' },
  { id: 'landscaping', name: 'Landscaping' },
  { id: 'garden-development', name: 'Garden Development' },
  { id: 'terrace-garden', name: 'Terrace Garden' },
  { id: 'vertical-garden', name: 'Vertical Garden' },
  { id: 'lawn', name: 'Lawn' },
  { id: 'plantation', name: 'Plantation' },
  { id: 'green-spaces', name: 'Green Spaces' },
];

/**
 * DEMO PROJECTS.
 * Every entry is marked `demo: true` and is illustrative only — these are not
 * records of completed Oxygen Nursery work, and the UI labels them as samples.
 * Replace with real projects (and set demo: false) once photographs and
 * details are available. Titles deliberately describe a type of work rather
 * than naming any client.
 */
const baseProjects: Project[] = [
  {
    id: 'p1',
    slug: 'residential-garden-layout',
    title: 'Residential Garden Layout',
    category: 'landscaping',
    location: 'Nashik',
    summary: 'A front garden planned around an existing tree, with layered beds and a simple path.',
    description:
      'Sample of a residential landscaping scope: site levels reviewed, planting beds shaped around the existing canopy, a stepping-stone path set through the lawn, and a plant palette chosen so the garden reads well from the entrance and from inside the house.',
    images: [
      { scene: 'landscape', seed: 'p1-a', alt: 'Residential garden layout, planted beds and path', demo: true },
      { scene: 'lawn', seed: 'p1-b', alt: 'Lawn area with border planting', demo: true },
      { scene: 'butterfly', seed: 'p1-c', alt: 'Flowering border planting', demo: true },
    ],
    beforeAfter: {
      before: { scene: 'bare-ground', seed: 'p1-before', alt: 'Bare ground before garden development', demo: true },
      after: { scene: 'landscape', seed: 'p1-after', alt: 'The same area planted and established', demo: true },
    },
    services: ['Landscape Designing & Gardening', 'Plant Supply', 'Irrigation Systems'],
    demo: true,
  },
  {
    id: 'p2',
    slug: 'terrace-garden-setup',
    title: 'Terrace Garden Setup',
    category: 'terrace-garden',
    location: 'Nashik',
    summary: 'Rooftop planting in raised planters with drip irrigation and a seating corner.',
    description:
      'Sample terrace scope: lightweight growing media in raised planters along the parapet, wind-tolerant species, a drip line on a timer, and a shaded seating corner kept clear of planting.',
    images: [
      { scene: 'terrace', seed: 'p2-a', alt: 'Terrace garden with planters', demo: true },
      { scene: 'terrace', seed: 'p2-b', alt: 'Planter foliage detail', demo: true },
    ],
    services: ['Terrace Gardens', 'Irrigation Systems', 'Plant Supply'],
    demo: true,
  },
  {
    id: 'p3',
    slug: 'office-green-wall',
    title: 'Office Green Wall',
    category: 'vertical-garden',
    location: 'Nashik',
    summary: 'An interior vertical garden behind a reception desk, on an automated drip line.',
    description:
      'Sample vertical garden scope: a framed modular wall system, species selected for the light the wall actually receives, and an irrigation line with a drain tray and timer so upkeep stays simple.',
    images: [
      { scene: 'vertical', seed: 'p3-a', alt: 'Interior green wall', demo: true },
      { scene: 'vertical', seed: 'p3-b', alt: 'Green wall planting detail', demo: true },
    ],
    beforeAfter: {
      before: { scene: 'bare-wall', seed: 'p3-before', alt: 'Blank interior wall before installation', demo: true },
      after: { scene: 'vertical', seed: 'p3-after', alt: 'The same wall planted as a green wall', demo: true },
    },
    services: ['Vertical / Wall Gardens', 'Irrigation Systems'],
    demo: true,
  },
  {
    id: 'p4',
    slug: 'society-lawn-development',
    title: 'Society Lawn Development',
    category: 'lawn',
    location: 'Nashik',
    summary: 'Levelling, turf laying and a sprinkler layout for a shared open space.',
    description:
      'Sample lawn scope: ground cleared and levelled with fall for drainage, turf supplied and laid, sprinklers zoned to the shape of the space, and a mowing and watering routine handed over for the establishment period.',
    images: [
      { scene: 'lawn', seed: 'p4-a', alt: 'Newly laid society lawn', demo: true },
      { scene: 'landscape', seed: 'p4-b', alt: 'Lawn with boundary planting', demo: true },
    ],
    services: ['Lawn / Turf Supply & Laying', 'Irrigation Systems', 'Garden Maintenance'],
    demo: true,
  },
  {
    id: 'p5',
    slug: 'miyawaki-plantation-plot',
    title: 'Miyawaki Plantation Plot',
    category: 'plantation',
    location: 'Nashik district',
    summary: 'A dense native plantation on a compact plot, planted in layers.',
    description:
      'Sample Miyawaki scope: soil opened and amended, native species grouped across shrub, sub-tree and canopy layers at close spacing, mulched, and watered through the establishment phase until the canopy closes.',
    images: [
      { scene: 'miyawaki', seed: 'p5-a', alt: 'Dense native plantation', demo: true },
      { scene: 'sprout', seed: 'p5-b', alt: 'Young saplings after planting', demo: true },
      { scene: 'miyawaki', seed: 'p5-c', alt: 'Established plantation canopy', demo: true },
    ],
    beforeAfter: {
      before: { scene: 'bare-ground', seed: 'p5-before', alt: 'Prepared ground before plantation', demo: true },
      after: { scene: 'miyawaki', seed: 'p5-after', alt: 'The same plot after canopy closure', demo: true },
    },
    services: ['Miyawaki Forest Plantation', 'Afforestation & Ecosystem Restoration'],
    demo: true,
  },
  {
    id: 'p6',
    slug: 'industrial-green-belt',
    title: 'Industrial Green Belt',
    category: 'green-spaces',
    location: 'Nashik',
    summary: 'Layered buffer planting along a boundary and approach road.',
    description:
      'Sample green belt scope: hardy species planted in layered rows along the boundary wall, avenue trees down the approach road, and a maintenance schedule set out for the first three seasons.',
    images: [
      { scene: 'greenbelt', seed: 'p6-a', alt: 'Green belt buffer planting', demo: true },
      { scene: 'greenbelt', seed: 'p6-b', alt: 'Avenue tree planting', demo: true },
    ],
    services: ['Industrial Green Belt Development', 'Plant Supply', 'Garden Maintenance'],
    demo: true,
  },
  {
    id: 'p7',
    slug: 'kitchen-garden-beds',
    title: 'Kitchen Garden Beds',
    category: 'garden-development',
    location: 'Nashik',
    summary: 'Raised vegetable and herb beds with a simple drip layout.',
    description:
      'Sample kitchen garden scope: raised beds filled with a prepared soil mix, seasonal vegetables and herbs planted in rotation-friendly blocks, and drip lines run along each bed.',
    images: [
      { scene: 'kitchen', seed: 'p7-a', alt: 'Raised kitchen garden beds', demo: true },
      { scene: 'kitchen', seed: 'p7-b', alt: 'Kitchen garden produce plants', demo: true },
    ],
    services: ['Kitchen Gardens', 'Irrigation Systems', 'Plant Supply'],
    demo: true,
  },
  {
    id: 'p8',
    slug: 'butterfly-garden-campus',
    title: 'Campus Butterfly Garden',
    category: 'green-spaces',
    location: 'Nashik',
    summary: 'Nectar and host planting arranged in sunlit pockets with shelter.',
    description:
      'Sample butterfly garden scope: nectar plants massed in open sun, host plants grouped at the edges, water and shelter provided, and a plant list prepared so the space can be used for teaching.',
    images: [
      { scene: 'butterfly', seed: 'p8-a', alt: 'Butterfly garden nectar planting', demo: true },
      { scene: 'landscape', seed: 'p8-b', alt: 'Campus green space', demo: true },
    ],
    services: ['Butterfly Gardens', 'Landscape Designing & Gardening'],
    demo: true,
  },
  {
    id: 'p9',
    slug: 'entrance-landscaping',
    title: 'Entrance Landscaping',
    category: 'landscaping',
    location: 'Nashik',
    summary: 'Structured entrance planting with clipped forms and a colour band.',
    description:
      'Sample entrance scope: clipped ornamental forms giving structure through the year, a low colour band at the front, and uplighting positions coordinated with the electrical work.',
    images: [
      { scene: 'landscape', seed: 'p9-a', alt: 'Entrance planting with clipped shrubs', demo: true },
      { scene: 'butterfly', seed: 'p9-b', alt: 'Colour band planting at entrance', demo: true },
    ],
    services: ['Landscape Designing & Gardening', 'Plant Supply'],
    demo: true,
  },
  {
    id: 'p10',
    slug: 'balcony-garden-makeover',
    title: 'Balcony Garden Makeover',
    category: 'garden-development',
    location: 'Nashik',
    summary: 'A narrow balcony turned into a planted, usable outdoor corner.',
    description:
      'Sample balcony scope: rail planters and floor pots arranged to keep the walkway clear, species chosen for the balcony aspect, and a self-watering setup for owners who travel.',
    images: [
      { scene: 'terrace', seed: 'p10-a', alt: 'Planted balcony garden', demo: true },
      { scene: 'terrace', seed: 'p10-b', alt: 'Balcony planter detail', demo: true },
    ],
    beforeAfter: {
      before: { scene: 'bare-wall', seed: 'p10-before', alt: 'Empty balcony before planting', demo: true },
      after: { scene: 'terrace', seed: 'p10-after', alt: 'The same balcony after planting', demo: true },
    },
    services: ['Garden Development', 'Plant Supply'],
    demo: true,
  },
  {
    id: 'p11',
    slug: 'temple-cultural-forest',
    title: 'Cultural Forest Planting',
    category: 'plantation',
    location: 'Nashik district',
    summary: 'A themed plantation laid out around traditional plant associations.',
    description:
      'Sample cultural forest scope: a themed layout such as Nakshatra Van or Panchavati, with the associated species planted in a readable arrangement and space left for signage and a walking route.',
    images: [
      { scene: 'cultural', seed: 'p11-a', alt: 'Cultural forest themed planting', demo: true },
      { scene: 'cultural', seed: 'p11-b', alt: 'Native trees in themed plantation', demo: true },
    ],
    services: ['Cultural Forest Development', 'Plant Supply'],
    demo: true,
  },
  {
    id: 'p12',
    slug: 'garden-restoration',
    title: 'Neglected Garden Restoration',
    category: 'garden-development',
    location: 'Nashik',
    summary: 'An overgrown garden cleared, re-soiled and replanted.',
    description:
      'Sample restoration scope: overgrowth cleared and healthy plants retained, soil improved and re-levelled, beds reshaped, and replanting done in phases so the garden stays usable throughout.',
    images: [
      { scene: 'maintenance', seed: 'p12-a', alt: 'Restored garden planting', demo: true },
      { scene: 'landscape', seed: 'p12-b', alt: 'Garden after restoration', demo: true },
    ],
    beforeAfter: {
      before: { scene: 'maintenance', seed: 'p12-before', alt: 'Overgrown garden before restoration', demo: true },
      after: { scene: 'landscape', seed: 'p12-after', alt: 'The same garden after restoration', demo: true },
    },
    services: ['Garden Development', 'Garden Maintenance', 'Plant Supply'],
    demo: true,
  },
];

/** Real project photographs replace the illustrations, and clear the demo flag. */
export const projects: Project[] = baseProjects.map((p) =>
  projectPhotos[p.id]?.length ? { ...p, images: projectPhotos[p.id], demo: false } : p,
);

export const projectBySlug = (slug: string) => projects.find((p) => p.slug === slug);
