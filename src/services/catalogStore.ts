import type { Plant, Result } from '@/types';
import { plants as shippedPlants } from '@/data/plants';
import { photoManifest } from '@/data/photoManifest.generated';
import storage from './storage';
import { type ImageRef, assetRef } from './images/imageStore';
import { images } from './images/imageRegistry';

const OVERLAY_KEY = 'catalog:overlay';

/**
 * ===========================================================================
 * THE CATALOGUE, PLUS WHATEVER AN ADMIN HAS CHANGED
 * ===========================================================================
 * The 32 plants the site ships with live in data/plants.ts and stay there:
 * they are content, versioned with the code. Everything an admin does — a new
 * plant, an edited description, a plant taken down — is kept separately as an
 * OVERLAY and merged on read.
 *
 * Keeping the two apart is what makes this safe to throw away. Clearing the
 * overlay returns the catalogue to exactly what the build shipped, and a real
 * backend can adopt the overlay wholesale without having to reconcile it
 * against the seed data first.
 *
 * Everything public reads through here, so an admin edit shows up in the
 * catalogue, search, filters, category counts, related plants and the detail
 * page without any of those knowing this layer exists.
 * ===========================================================================
 */

interface Overlay {
  /** Plants created through the admin, newest last. */
  added: Plant[];
  /** Field-level edits to shipped plants, keyed by slug. */
  edits: Record<string, Partial<Plant>>;
  /** Slugs of shipped plants an admin has taken off the site. */
  removed: string[];
}

const readOverlay = (): Overlay => {
  const raw = storage.get<Partial<Overlay>>(OVERLAY_KEY, {});
  return {
    added: raw.added ?? [],
    edits: raw.edits ?? {},
    removed: raw.removed ?? [],
  };
};

const writeOverlay = (overlay: Overlay): boolean => storage.set(OVERLAY_KEY, overlay);

export const slugify = (name: string): string =>
  name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

/* ------------------------------------------------------------------------ */
/* Image ordering                                                            */
/* ------------------------------------------------------------------------ */

/**
 * The refs a plant has before any admin has touched it: whatever the photo
 * manifest holds for that slug. A plant with no photographs gets an empty list,
 * which is what makes the "coming soon" state appear.
 */
export function shippedRefs(slug: string): ImageRef[] {
  return (photoManifest[slug] ?? []).map((entry, i) =>
    assetRef(`asset:${slug}:${i}`, entry.base, entry.widths, entry.alt));
}

/** The refs actually in force for a plant — the admin's order if there is one. */
export async function currentRefs(slug: string): Promise<ImageRef[]> {
  return (await images.getOrder(slug)) ?? shippedRefs(slug);
}

/**
 * Attaches resolved images to a plant.
 *
 * A plant with no images at all keeps a single placeholder entry so the card
 * and the detail page render the "photograph coming soon" state rather than an
 * empty frame.
 */
async function withImages(plant: Plant): Promise<Plant> {
  const refs = await currentRefs(plant.slug);
  const resolved = await images.resolve(refs);
  if (resolved.length > 0) return { ...plant, images: resolved };
  return {
    ...plant,
    images: [{
      plant: plant.slug,
      label: plant.name,
      alt: `${plant.name}${plant.botanicalName ? ` (${plant.botanicalName})` : ''}`,
      demo: false,
    }],
  };
}

/* ------------------------------------------------------------------------ */
/* Reads                                                                     */
/* ------------------------------------------------------------------------ */

export async function listPlants(): Promise<Plant[]> {
  const overlay = readOverlay();
  const base = shippedPlants
    .filter((p) => !overlay.removed.includes(p.slug))
    .map((p) => (overlay.edits[p.slug] ? { ...p, ...overlay.edits[p.slug] } : p));
  const merged = [...base, ...overlay.added];
  return Promise.all(merged.map(withImages));
}

export async function getPlant(slug: string): Promise<Plant | null> {
  const overlay = readOverlay();
  if (overlay.removed.includes(slug)) return null;

  const added = overlay.added.find((p) => p.slug === slug);
  if (added) return withImages(added);

  const shipped = shippedPlants.find((p) => p.slug === slug);
  if (!shipped) return null;
  const edits = overlay.edits[slug];
  return withImages(edits ? { ...shipped, ...edits } : shipped);
}

/**
 * Shipped plants an admin has taken off the website.
 *
 * They are hidden, not deleted — their records still live in data/plants.ts —
 * so the admin screens can offer to put them back.
 */
export async function listRemoved(): Promise<Plant[]> {
  const { removed } = readOverlay();
  const hidden = shippedPlants.filter((p) => removed.includes(p.slug));
  return Promise.all(hidden.map(withImages));
}

/** True when this slug is one the build shipped, so it can be reset rather than deleted. */
export const isShipped = (slug: string): boolean => shippedPlants.some((p) => p.slug === slug);

/* ------------------------------------------------------------------------ */
/* Writes                                                                    */
/* ------------------------------------------------------------------------ */

export async function savePlant(plant: Plant): Promise<Result<Plant>> {
  const overlay = readOverlay();
  const slug = plant.slug || slugify(plant.name);
  const next: Plant = { ...plant, id: plant.id || slug, slug };

  if (isShipped(slug)) {
    // Store only what differs, so a later content update to data/plants.ts
    // still reaches fields the admin never touched.
    const base = shippedPlants.find((p) => p.slug === slug)!;
    const diff: Partial<Plant> = {};
    (Object.keys(next) as (keyof Plant)[]).forEach((key) => {
      if (key === 'images') return; // images are the image store's business
      if (JSON.stringify(next[key]) !== JSON.stringify(base[key])) {
        (diff as Record<string, unknown>)[key] = next[key];
      }
    });
    overlay.edits[slug] = diff;
    overlay.removed = overlay.removed.filter((s) => s !== slug);
  } else {
    const i = overlay.added.findIndex((p) => p.slug === slug);
    const stored = { ...next, images: [] };
    if (i === -1) overlay.added.push(stored);
    else overlay.added[i] = stored;
  }

  if (!writeOverlay(overlay)) {
    return { ok: false, error: 'Could not save — browser storage is full or unavailable.' };
  }
  return { ok: true, data: await withImages(next) };
}

/** Frees a slug for a brand new plant, or reports the clash. */
export function slugAvailable(slug: string, exceptSlug?: string): boolean {
  if (slug === exceptSlug) return true;
  const overlay = readOverlay();
  return !shippedPlants.some((p) => p.slug === slug) && !overlay.added.some((p) => p.slug === slug);
}

export async function removePlant(slug: string): Promise<Result<null>> {
  const overlay = readOverlay();
  if (isShipped(slug)) {
    if (!overlay.removed.includes(slug)) overlay.removed.push(slug);
    delete overlay.edits[slug];
  } else {
    overlay.added = overlay.added.filter((p) => p.slug !== slug);
  }
  await images.resetOrder(slug);
  if (!writeOverlay(overlay)) {
    return { ok: false, error: 'Could not save — browser storage is unavailable.' };
  }
  return { ok: true, data: null };
}

/** Puts a shipped plant that was taken down back on the site. */
export async function restorePlant(slug: string): Promise<Result<null>> {
  const overlay = readOverlay();
  overlay.removed = overlay.removed.filter((s) => s !== slug);
  if (!writeOverlay(overlay)) {
    return { ok: false, error: 'Could not save — browser storage is unavailable.' };
  }
  return { ok: true, data: null };
}

/** Everything an admin has changed, for the dashboard readout. */
export function overlayStats(): { added: number; edited: number; removed: number } {
  const overlay = readOverlay();
  return {
    added: overlay.added.length,
    edited: Object.keys(overlay.edits).length,
    removed: overlay.removed.length,
  };
}

/** Discards every admin change and returns the catalogue to the shipped data. */
export function resetOverlay(): void {
  storage.remove(OVERLAY_KEY);
}
