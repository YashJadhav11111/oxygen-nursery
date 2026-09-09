import type { ImageStore } from './imageStore';
import LocalImageStore from './localImageStore';

/**
 * ===========================================================================
 * THE ONE LINE TO CHANGE WHEN IMAGES MOVE TO CLOUD STORAGE
 * ===========================================================================
 * Today:   export const images = new LocalImageStore();
 * Later:   export const images = new CloudImageStore(import.meta.env.VITE_MEDIA_URL);
 *
 * Nothing above this file needs to change: `resolve()` is the only place a ref
 * becomes a URL, so signed URLs, a CDN prefix or a resizing service all slot in
 * behind the same interface.
 * ===========================================================================
 */
export const images: ImageStore = new LocalImageStore();

/** True while uploads live in this browser rather than on a server. */
export const isPrototypeImages = images.isPrototype;
