/**
 * ===========================================================================
 * PHOTO MANIFEST — the one file to edit when real photographs arrive
 * ===========================================================================
 * Every photograph the site ships with is listed here. A plant that appears
 * in this manifest shows its photograph everywhere it turns up — cards, detail
 * pages, galleries, related plants — with no other change anywhere in the
 * codebase.
 *
 * THREE WAYS PHOTOGRAPHS REACH THE SITE
 * --------------------------------------
 * 1. The admin Image Management screen — the normal route. Uploads go to the
 *    image store (see services/imageStore) and are merged over this manifest
 *    at runtime, so nothing here needs editing.
 *
 * 2. A bulk import from a folder of per-species subfolders:
 *        python3 scripts/import_plant_photos.py "/path/to/plant images"
 *    That writes the derivatives and regenerates photoManifest.generated.ts.
 *
 * 3. By hand, for services and projects, using the helpers below:
 *
 *      'terrace-garden': singlePhoto('services/terrace-garden', 'alt text'),
 *
 * Illustrations remain the fallback for SERVICE and PROJECT scenes if a file
 * is missing. Plants never fall back to artwork — an unphotographed plant
 * shows an explicit "Image coming soon" state instead, so a drawing is never
 * mistaken for the plant a customer would receive.
 *
 * Keep photos under roughly 250 KB each at 1400px. JPEG or WebP both work.
 * ===========================================================================
 */

import type { PlantImage } from '@/types';
import { photoManifest } from './photoManifest.generated';

/** Widths exported for each photograph. Change here if you export differently. */
const WIDTHS = [400, 800, 1400];

/**
 * Builds a responsive image entry from a base name.
 * `photo('plants/monstera-1', 'alt text')` expects:
 *   /photos/plants/monstera-1-400.jpg, -800.jpg, -1400.jpg
 */
export function photo(base: string, alt: string, ext = 'jpg'): PlantImage {
  return {
    src: `/photos/${base}-${WIDTHS[WIDTHS.length - 1]}.${ext}`,
    srcSet: WIDTHS.map((w) => `/photos/${base}-${w}.${ext} ${w}w`).join(', '),
    alt,
    demo: false,
  };
}

/** Single-size photograph, when only one file is available. */
export function singlePhoto(base: string, alt: string, ext = 'jpg'): PlantImage {
  return { src: `/photos/${base}.${ext}`, alt, demo: false };
}

/* ------------------------------------------------------------------------ */
/* PLANT PHOTOGRAPHS — keyed by plant slug                                    */
/* ------------------------------------------------------------------------ */

/**
 * Built from photoManifest.generated.ts, which scripts/import_plant_photos.py
 * writes when a batch of photographs is imported.
 *
 * The manifest records the widths that genuinely exist for each photograph
 * rather than assuming a fixed ladder, because a source image is never
 * upscaled. A 736px-wide original therefore advertises `400w, 736w` and the
 * browser stops asking for anything larger.
 */
export const plantPhotos: Record<string, PlantImage[]> = Object.fromEntries(
  Object.entries(photoManifest).map(([slug, entries]) => [
    slug,
    entries.map((e) => ({
      src: `${e.base}-${e.widths[e.widths.length - 1]}.jpg`,
      srcSet: e.widths.map((w) => `${e.base}-${w}.jpg ${w}w`).join(', '),
      alt: e.alt,
      demo: false,
    })),
  ]),
);

/* ------------------------------------------------------------------------ */
/* SERVICE PHOTOGRAPHS — keyed by service id                                  */
/* ------------------------------------------------------------------------ */
export const servicePhotos: Record<string, PlantImage> = {
  // 'terrace-garden': singlePhoto('services/terrace-garden', 'A terrace garden we built in Nashik'),
};

/* ------------------------------------------------------------------------ */
/* PROJECT PHOTOGRAPHS — keyed by project id                                  */
/* ------------------------------------------------------------------------ */
export const projectPhotos: Record<string, PlantImage[]> = {
  // 'p2': [singlePhoto('projects/terrace-1', 'Completed terrace garden, Nashik')],
};

/** True once at least one real photograph has been supplied. */
export const hasRealPhotos =
  Object.keys(plantPhotos).length > 0 ||
  Object.keys(servicePhotos).length > 0 ||
  Object.keys(projectPhotos).length > 0;
