import type { Plant, PlantImage, Result } from '@/types';
import * as catalog from './catalogStore';
import { type ImageRef } from './images/imageStore';
import { images } from './images/imageRegistry';

/**
 * What the admin screens call.
 *
 * The dashboard never touches localStorage, IndexedDB or the data files
 * directly — it goes through here, and this goes through the same seams the
 * public site uses. So the day a backend arrives, the admin UI moves across
 * with it for free.
 */

export interface ImageSlot {
  ref: ImageRef;
  /** null when the stored bytes have gone — the slot still shows, so it can be removed. */
  image: PlantImage | null;
  /** True for a photograph that ships with the site rather than an upload. */
  shipped: boolean;
}

/**
 * Every image a plant has, in the order it is shown. The first is primary.
 *
 * Resolved one ref at a time rather than in a batch, because `resolve()`
 * silently drops a ref whose bytes have gone and this screen needs to show that
 * slot as missing rather than quietly renumbering the gallery.
 */
export async function getImageSlots(slug: string): Promise<ImageSlot[]> {
  const refs = await catalog.currentRefs(slug);
  return Promise.all(refs.map(async (ref) => ({
    ref,
    image: (await images.resolve([ref]))[0] ?? null,
    shipped: ref.kind === 'asset',
  })));
}

async function persist(slug: string, refs: ImageRef[]): Promise<Result<ImageSlot[]>> {
  const saved = await images.setOrder(slug, refs);
  if (!saved.ok) return { ok: false, error: saved.error };
  return { ok: true, data: await getImageSlots(slug) };
}

/** Adds files to the end of a plant's gallery. */
export async function uploadImages(
  slug: string,
  files: File[],
  altFor: (file: File, index: number) => string,
): Promise<Result<ImageSlot[]>> {
  const refs = [...(await catalog.currentRefs(slug))];
  const problems: string[] = [];

  for (const [i, file] of files.entries()) {
    const added = await images.addUpload(slug, file, altFor(file, i));
    if (added.ok && added.data) refs.push(added.data);
    else problems.push(added.error ?? `Could not store ${file.name}.`);
  }

  const result = await persist(slug, refs);
  if (!result.ok) return result;
  if (problems.length > 0) return { ok: false, error: problems.join(' ') };
  return result;
}

/** Moves an image to the front, making it the card and hero image. */
export async function setPrimary(slug: string, refId: string): Promise<Result<ImageSlot[]>> {
  const refs = await catalog.currentRefs(slug);
  const target = refs.find((r) => r.id === refId);
  if (!target) return { ok: false, error: 'That image is no longer there.' };
  return persist(slug, [target, ...refs.filter((r) => r.id !== refId)]);
}

/** Moves an image one place earlier or later in the gallery. */
export async function moveImage(
  slug: string,
  refId: string,
  direction: -1 | 1,
): Promise<Result<ImageSlot[]>> {
  const refs = [...(await catalog.currentRefs(slug))];
  const i = refs.findIndex((r) => r.id === refId);
  const j = i + direction;
  if (i === -1 || j < 0 || j >= refs.length) {
    return { ok: false, error: 'That image cannot move any further.' };
  }
  [refs[i], refs[j]] = [refs[j], refs[i]];
  return persist(slug, refs);
}

/**
 * Removes an image from a plant.
 *
 * An upload is deleted outright; its bytes are gone. A photograph that ships
 * with the site is only taken out of this plant's list — the file stays in the
 * build, so "Restore shipped images" can bring it back.
 */
export async function removeImage(slug: string, refId: string): Promise<Result<ImageSlot[]>> {
  const refs = await catalog.currentRefs(slug);
  const target = refs.find((r) => r.id === refId);
  if (!target) return { ok: false, error: 'That image is no longer there.' };
  if (target.kind === 'upload') await images.deleteUpload(target.id);
  return persist(slug, refs.filter((r) => r.id !== refId));
}

/** Replaces one image's alt text. */
export async function setAlt(slug: string, refId: string, alt: string): Promise<Result<ImageSlot[]>> {
  const refs = await catalog.currentRefs(slug);
  return persist(slug, refs.map((r) => (r.id === refId ? { ...r, alt } : r)));
}

/** Nudges a photograph's crop, for a plant that sits high or low in its frame. */
export async function setObjectPosition(
  slug: string,
  refId: string,
  objectPosition: string | undefined,
): Promise<Result<ImageSlot[]>> {
  const refs = await catalog.currentRefs(slug);
  return persist(slug, refs.map((r) => (r.id === refId ? { ...r, objectPosition } : r)));
}

/** Throws away the admin's ordering and goes back to the photographs the build shipped. */
export async function restoreShippedImages(slug: string): Promise<ImageSlot[]> {
  await images.resetOrder(slug);
  return getImageSlots(slug);
}

export const savePlant = (plant: Plant) => catalog.savePlant(plant);
export const removePlant = (slug: string) => catalog.removePlant(slug);
export const restorePlant = (slug: string) => catalog.restorePlant(slug);
export const listPlants = () => catalog.listPlants();
export const listRemoved = () => catalog.listRemoved();
/** How many photographs the build shipped for a plant — used to offer "restore". */
export const shippedCount = (slug: string) => catalog.shippedRefs(slug).length;
export const getPlant = (slug: string) => catalog.getPlant(slug);
export const slugify = catalog.slugify;
export const slugAvailable = catalog.slugAvailable;
export const isShipped = catalog.isShipped;
export const overlayStats = catalog.overlayStats;
export const storageUsage = () => images.usage();
