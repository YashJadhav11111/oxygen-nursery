import type { PlantImage, Result } from '@/types';

/**
 * ===========================================================================
 * THE SEAM BETWEEN THE UI AND IMAGE STORAGE
 * ===========================================================================
 * A plant's pictures come from two places and the difference matters:
 *
 *   'asset'   a file shipped with the site, under public/photos/plants/.
 *             It has several widths on disk, so it can be served responsively.
 *   'upload'  a file an admin added through Image Management. It lives in the
 *             browser's IndexedDB today; on a real backend it would live in
 *             object storage and this ref would hold its URL.
 *
 * A plant's *order* — which picture is primary, what the gallery shows after
 * it — is one list covering both kinds, so an admin can promote a shipped
 * photograph or push an uploaded one to the front without the two fighting.
 *
 * To move uploads to cloud storage, implement this interface against your
 * bucket and change one line in imageRegistry.ts. `resolve()` is the only
 * place that turns a ref into something an <img> can use, so a signed URL or a
 * CDN path slots in there.
 * ===========================================================================
 */

export type ImageRefKind = 'asset' | 'upload';

export interface ImageRef {
  /** Stable within a plant. */
  id: string;
  kind: ImageRefKind;
  /** asset: path prefix under /photos, e.g. '/photos/plants/neem/1'. */
  base?: string;
  /** asset: widths that exist on disk for that prefix. */
  widths?: number[];
  alt: string;
  /**
   * CSS object-position, when a photograph needs to sit off-centre to keep the
   * plant in frame at the card's crop. Left unset for almost everything.
   */
  objectPosition?: string;
}

export interface ImageStore {
  readonly name: string;
  /** True while uploaded files live in this browser rather than on a server. */
  readonly isPrototype: boolean;

  /**
   * The ordered refs for a plant. The first is the primary image.
   * Returns null when the plant has never been touched by an admin, so the
   * caller can fall back to whatever the build shipped.
   */
  getOrder(slug: string): Promise<ImageRef[] | null>;

  /** Replaces the whole ordered list — used by reorder, set-primary and remove. */
  setOrder(slug: string, refs: ImageRef[]): Promise<Result<ImageRef[]>>;

  /** Stores an uploaded file and returns its ref. Does not change the order. */
  addUpload(slug: string, file: File, alt: string): Promise<Result<ImageRef>>;

  /** Deletes an uploaded file's bytes. Asset refs are ignored — they are build output. */
  deleteUpload(id: string): Promise<Result<null>>;

  /** Forgets an admin's ordering for a plant, restoring what the build shipped. */
  resetOrder(slug: string): Promise<void>;

  /**
   * Turns refs into renderable images. Uploads become object URLs, which are
   * cached for the life of the page — see the implementation for why they are
   * not revoked eagerly.
   */
  resolve(refs: ImageRef[]): Promise<PlantImage[]>;

  /** Rough byte total of stored uploads, for the admin storage readout. */
  usage(): Promise<{ count: number; bytes: number }>;
}

/** Builds a ref for a photograph that ships with the site. */
export const assetRef = (
  id: string,
  base: string,
  widths: number[],
  alt: string,
  objectPosition?: string,
): ImageRef => ({ id, kind: 'asset', base, widths, alt, objectPosition });

/** Turns an asset ref into a responsive PlantImage. */
export const assetToImage = (ref: ImageRef): PlantImage => {
  const widths = ref.widths?.length ? ref.widths : [800];
  return {
    src: `${ref.base}-${widths[widths.length - 1]}.jpg`,
    srcSet: widths.map((w) => `${ref.base}-${w}.jpg ${w}w`).join(', '),
    alt: ref.alt,
    objectPosition: ref.objectPosition,
    demo: false,
  };
};
