import type { PlantImage, Result } from '@/types';
import storage from '../storage';
import { type ImageRef, type ImageStore, assetToImage } from './imageStore';

const ORDER_KEY = 'images:order';
const DB_NAME = 'oxygen-nursery-images';
const DB_VERSION = 1;
const STORE = 'uploads';

interface UploadRecord {
  id: string;
  slug: string;
  blob: Blob;
  type: string;
  name: string;
  bytes: number;
  createdAt: string;
}

const newId = () => `img_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;

const ok = <T>(data: T): Result<T> => ({ ok: true, data });
const fail = <T>(error: string): Result<T> => ({ ok: false, error });

/**
 * ===========================================================================
 * PROTOTYPE IMAGE STORAGE — THIS BROWSER ONLY
 * ===========================================================================
 * Uploaded files are kept as blobs in IndexedDB, and the ordering that decides
 * which one is primary is kept in localStorage beside it.
 *
 * IndexedDB rather than localStorage because localStorage holds strings: a
 * photograph would have to be base64-encoded, inflating it by a third, and the
 * whole origin shares a ~5 MB budget. IndexedDB stores the blob as bytes and
 * has room for a real gallery.
 *
 * WHAT THIS MEANS IN PRACTICE. An image uploaded here is visible on this
 * browser, on this machine, and nowhere else. It is not on the website, and
 * another person opening the site will not see it. That is the honest limit of
 * a prototype with no server, and the admin UI says so on the screen rather
 * than letting someone believe they have published a photograph.
 *
 * Photographs meant for every visitor go into public/photos/plants/ at build
 * time — scripts/import_plant_photos.py does that in bulk. When a backend
 * exists, replace this class with one that uploads to object storage
 * (imageRegistry.ts, one line) and uploads become real for everyone.
 * ===========================================================================
 */
export class LocalImageStore implements ImageStore {
  readonly name = 'indexeddb-prototype';
  readonly isPrototype = true;

  private db: Promise<IDBDatabase> | null = null;
  /**
   * Object URLs are created once per record and kept for the life of the page.
   * Revoking on unmount looks tidier but breaks the common case: the same
   * photograph appears on a card, in the gallery and in the lightbox, and
   * whichever unmounts first would blank the others.
   */
  private urls = new Map<string, string>();

  private open(): Promise<IDBDatabase> {
    this.db ??= new Promise((resolve, reject) => {
      if (!('indexedDB' in globalThis)) {
        reject(new Error('This browser has no IndexedDB, so uploads cannot be stored.'));
        return;
      }
      const req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(STORE)) {
          const store = db.createObjectStore(STORE, { keyPath: 'id' });
          store.createIndex('slug', 'slug', { unique: false });
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error ?? new Error('Could not open the image store.'));
    });
    return this.db;
  }

  private async tx<T>(mode: IDBTransactionMode, run: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
    const db = await this.open();
    return new Promise<T>((resolve, reject) => {
      const transaction = db.transaction(STORE, mode);
      const request = run(transaction.objectStore(STORE));
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error ?? new Error('Image store request failed.'));
    });
  }

  /* --- ordering --------------------------------------------------------- */
  private allOrders(): Record<string, ImageRef[]> {
    return storage.get<Record<string, ImageRef[]>>(ORDER_KEY, {});
  }

  async getOrder(slug: string): Promise<ImageRef[] | null> {
    return this.allOrders()[slug] ?? null;
  }

  async setOrder(slug: string, refs: ImageRef[]): Promise<Result<ImageRef[]>> {
    const orders = this.allOrders();
    orders[slug] = refs;
    if (!storage.set(ORDER_KEY, orders)) {
      return fail<ImageRef[]>('Could not save the image order — browser storage is unavailable.');
    }
    return ok(refs);
  }

  async resetOrder(slug: string): Promise<void> {
    const orders = this.allOrders();
    delete orders[slug];
    storage.set(ORDER_KEY, orders);
  }

  /* --- uploads ---------------------------------------------------------- */
  async addUpload(slug: string, file: File, alt: string): Promise<Result<ImageRef>> {
    if (!file.type.startsWith('image/')) {
      return fail<ImageRef>(`${file.name} is not an image.`);
    }
    const record: UploadRecord = {
      id: newId(),
      slug,
      blob: file,
      type: file.type,
      name: file.name,
      bytes: file.size,
      createdAt: new Date().toISOString(),
    };
    try {
      await this.tx('readwrite', (store) => store.add(record) as IDBRequest<IDBValidKey>);
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Unknown error';
      return fail<ImageRef>(`Could not store ${file.name}: ${message}`);
    }
    return ok({ id: record.id, kind: 'upload', alt: alt || file.name });
  }

  async deleteUpload(id: string): Promise<Result<null>> {
    try {
      await this.tx('readwrite', (store) => store.delete(id) as unknown as IDBRequest<undefined>);
    } catch {
      return fail<null>('Could not delete that image.');
    }
    const url = this.urls.get(id);
    if (url) {
      URL.revokeObjectURL(url);
      this.urls.delete(id);
    }
    return ok(null);
  }

  private async urlFor(id: string): Promise<string | null> {
    const cached = this.urls.get(id);
    if (cached) return cached;
    try {
      const record = await this.tx<UploadRecord | undefined>(
        'readonly',
        (store) => store.get(id) as IDBRequest<UploadRecord | undefined>,
      );
      if (!record) return null;
      const url = URL.createObjectURL(record.blob);
      this.urls.set(id, url);
      return url;
    } catch {
      return null;
    }
  }

  /* --- resolution ------------------------------------------------------- */
  async resolve(refs: ImageRef[]): Promise<PlantImage[]> {
    const out = await Promise.all(refs.map(async (ref) => {
      if (ref.kind === 'asset') return assetToImage(ref);
      const url = await this.urlFor(ref.id);
      if (!url) return null;
      return {
        src: url,
        alt: ref.alt,
        objectPosition: ref.objectPosition,
        demo: false,
      } satisfies PlantImage;
    }));
    // A ref whose bytes have gone (cleared storage, another browser) is dropped
    // rather than rendered as a broken image.
    return out.filter((i): i is PlantImage => i !== null);
  }

  async usage(): Promise<{ count: number; bytes: number }> {
    try {
      const all = await this.tx<UploadRecord[]>(
        'readonly',
        (store) => store.getAll() as IDBRequest<UploadRecord[]>,
      );
      return { count: all.length, bytes: all.reduce((sum, r) => sum + r.bytes, 0) };
    } catch {
      return { count: 0, bytes: 0 };
    }
  }
}

export default LocalImageStore;
