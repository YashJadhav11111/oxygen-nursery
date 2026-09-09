import type { Review } from '@/types';

/**
 * REVIEWS — NOT CURRENTLY DISPLAYED ANYWHERE ON THE SITE.
 *
 * The website does not show invented customer names or testimonials. The home
 * page shows "Why Customers Choose Our Green Solutions" in Oxygen Nursery's own
 * voice instead. Once real reviews are collected, replace the entries below
 * (set demo: false) and render them — the Review type and contentService.reviews()
 * are already in place.
 *
 * Placeholder content, clearly labelled as such.
 * These are NOT real customer reviews and are not presented as real anywhere
 * on the site. Replace with genuine reviews (set demo: false, verified where
 * confirmed) or connect the Google Business reviews API via reviewService.ts.
 */
export const reviews: Review[] = [
  {
    id: 'r1',
    name: 'Sample Review',
    rating: 5,
    review:
      'Placeholder text showing how a customer review will appear. Real reviews will replace this once they are collected.',
    date: '2026-01-12',
    verified: false,
    location: 'Nashik',
    demo: true,
  },
  {
    id: 'r2',
    name: 'Sample Review',
    rating: 5,
    review:
      'Placeholder review copy demonstrating a longer entry, so the layout can be checked with two or three lines of text in place.',
    date: '2026-02-04',
    verified: false,
    location: 'Nashik',
    demo: true,
  },
  {
    id: 'r3',
    name: 'Sample Review',
    rating: 4,
    review: 'Placeholder review copy for a shorter entry.',
    date: '2026-02-19',
    verified: false,
    location: 'Nashik',
    demo: true,
  },
  {
    id: 'r4',
    name: 'Sample Review',
    rating: 5,
    review:
      'Placeholder text used to check the reviews carousel on mobile and desktop. It will be replaced with a real customer comment.',
    date: '2026-03-02',
    verified: false,
    location: 'Nashik',
    demo: true,
  },
];

export const hasRealReviews = reviews.some((r) => !r.demo);
