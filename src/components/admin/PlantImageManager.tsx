import { useCallback, useEffect, useRef, useState } from 'react';
import Icon from '@/components/ui/Icon';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import PhotoPending from '@/components/ui/PhotoPending';
import * as admin from '@/services/adminService';
import type { ImageSlot } from '@/services/adminService';

interface Props {
  slug: string;
  plantName: string;
}

/** Roughly what a 1400px photograph should weigh. Larger still works, just slower. */
const SIZE_ADVICE = 500 * 1024;

/**
 * Managing one plant's photographs: which is primary, what order the gallery
 * runs in, and adding or removing pictures.
 *
 * The first tile is the primary image and is labelled as such, because that is
 * the one decision with visible consequences everywhere else — it is what the
 * catalogue card, the search results and the page hero all show.
 *
 * Files chosen here are previewed before anything is stored, so a wrong file
 * can be dropped without a round trip.
 */
export function PlantImageManager({ slug, plantName }: Props) {
  const [slots, setSlots] = useState<ImageSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [staged, setStaged] = useState<{ file: File; url: string }[]>([]);
  const [pendingRemove, setPendingRemove] = useState<ImageSlot | null>(null);
  const [confirmRestore, setConfirmRestore] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setSlots(await admin.getImageSlots(slug));
    setLoading(false);
  }, [slug]);

  useEffect(() => { void load(); }, [load]);

  // Preview URLs are released when a file is dropped or committed. This is the
  // last resort, on unmount only — depending on `staged` here would revoke the
  // existing previews every time another file was added to the list.
  const stagedRef = useRef(staged);
  stagedRef.current = staged;
  useEffect(() => () => stagedRef.current.forEach((s) => URL.revokeObjectURL(s.url)), []);

  const apply = async (run: Promise<{ ok: boolean; data?: ImageSlot[]; error?: string }>) => {
    setBusy(true);
    setError(null);
    const result = await run;
    setBusy(false);
    if (result.data) setSlots(result.data);
    if (!result.ok) setError(result.error ?? 'That did not work.');
  };

  const onChoose = (files: FileList | null) => {
    if (!files?.length) return;
    const picked = Array.from(files).filter((f) => f.type.startsWith('image/'));
    const rejected = Array.from(files).length - picked.length;
    if (rejected > 0) setError(`${rejected} file${rejected === 1 ? '' : 's'} skipped — only images can be added.`);
    setStaged((prev) => [...prev, ...picked.map((file) => ({ file, url: URL.createObjectURL(file) }))]);
    if (inputRef.current) inputRef.current.value = '';
  };

  const dropStaged = (index: number) => {
    setStaged((prev) => {
      const target = prev[index];
      if (target) URL.revokeObjectURL(target.url);
      return prev.filter((_, i) => i !== index);
    });
  };

  const commitStaged = async () => {
    if (staged.length === 0) return;
    const files = staged.map((s) => s.file);
    await apply(admin.uploadImages(slug, files, (_file, i) =>
      `${plantName} — photograph ${slots.length + i + 1}`));
    staged.forEach((s) => URL.revokeObjectURL(s.url));
    setStaged([]);
  };

  const oversized = staged.filter((s) => s.file.size > SIZE_ADVICE);

  return (
    <div className="imgman">
      {loading ? (
        <p className="muted">Loading images…</p>
      ) : (
        <>
          {slots.length === 0 ? (
            <div className="imgman__empty">
              <span className="imgman__empty-art">
                <PhotoPending label={plantName} />
              </span>
              <div>
                <strong>No photographs yet</strong>
                <p className="muted">
                  Until one is added, the website shows this “photograph coming soon” panel
                  on {plantName}'s card and page — never a drawing standing in for the plant.
                </p>
              </div>
            </div>
          ) : (
            <ol className="imgman__grid">
              {slots.map((slot, i) => (
                <li key={slot.ref.id} className={`imgman__tile ${i === 0 ? 'is-primary' : ''}`}>
                  <div className="imgman__frame">
                    {slot.image?.src ? (
                      <img
                        src={slot.image.src}
                        srcSet={slot.image.srcSet}
                        sizes="220px"
                        alt={slot.ref.alt}
                        loading="lazy"
                        style={{ objectPosition: slot.image.objectPosition }}
                      />
                    ) : (
                      <span className="imgman__missing">
                        <Icon name="alert" size={20} /> File missing
                      </span>
                    )}
                    {i === 0 && <span className="imgman__flag">Primary</span>}
                    <span className={`imgman__origin ${slot.shipped ? '' : 'is-upload'}`}>
                      {slot.shipped ? 'Shipped with site' : 'Uploaded here'}
                    </span>
                  </div>

                  <div className="imgman__tools">
                    <button
                      type="button" className="btn btn--secondary btn--sm"
                      disabled={busy || i === 0}
                      onClick={() => void apply(admin.setPrimary(slug, slot.ref.id))}
                    >
                      Make primary
                    </button>
                    <span className="imgman__move">
                      <button
                        type="button" aria-label="Move earlier" disabled={busy || i === 0}
                        onClick={() => void apply(admin.moveImage(slug, slot.ref.id, -1))}
                      >
                        <Icon name="chevron-left" size={16} />
                      </button>
                      <button
                        type="button" aria-label="Move later" disabled={busy || i === slots.length - 1}
                        onClick={() => void apply(admin.moveImage(slug, slot.ref.id, 1))}
                      >
                        <Icon name="chevron-right" size={16} />
                      </button>
                    </span>
                    <button
                      type="button" className="btn btn--danger btn--sm" disabled={busy}
                      onClick={() => setPendingRemove(slot)}
                    >
                      Remove
                    </button>
                  </div>

                  <label className="imgman__alt">
                    <span>Description for screen readers</span>
                    <input
                      className="input"
                      defaultValue={slot.ref.alt}
                      onBlur={(e) => {
                        if (e.target.value !== slot.ref.alt) {
                          void apply(admin.setAlt(slug, slot.ref.id, e.target.value));
                        }
                      }}
                    />
                  </label>

                  <label className="imgman__alt">
                    <span>Crop position</span>
                    <select
                      className="select"
                      value={slot.ref.objectPosition ?? 'center'}
                      onChange={(e) => void apply(admin.setObjectPosition(
                        slug,
                        slot.ref.id,
                        e.target.value === 'center' ? undefined : e.target.value,
                      ))}
                    >
                      <option value="center">Centre (default)</option>
                      <option value="50% 20%">Favour the top</option>
                      <option value="50% 80%">Favour the bottom</option>
                      <option value="20% 50%">Favour the left</option>
                      <option value="80% 50%">Favour the right</option>
                    </select>
                  </label>
                </li>
              ))}
            </ol>
          )}

          {/* ---------------- Adding ---------------- */}
          <div className="imgman__add">
            <input
              ref={inputRef}
              id={`upload-${slug}`}
              type="file"
              accept="image/*"
              multiple
              className="sr-only"
              onChange={(e) => onChoose(e.target.files)}
            />
            <label htmlFor={`upload-${slug}`} className="btn btn--secondary">
              <Icon name="layers" size={17} /> Choose photographs…
            </label>
            {/* Only offered where there is something to restore to: a plant added
                through the admin never shipped with photographs. */}
            {admin.shippedCount(slug) > 0
              && (slots.some((s) => !s.shipped) || slots.length !== admin.shippedCount(slug)) ? (
              <button
                type="button" className="btn btn--secondary btn--sm" disabled={busy}
                onClick={() => setConfirmRestore(true)}
              >
                Restore shipped images
              </button>
            ) : null}
          </div>

          {staged.length > 0 && (
            <div className="imgman__staged">
              <h3>Ready to add — check these first</h3>
              <ul>
                {staged.map((s, i) => (
                  <li key={s.url}>
                    <img src={s.url} alt="" />
                    <div>
                      <strong>{s.file.name}</strong>
                      <span className={s.file.size > SIZE_ADVICE ? 'is-warn' : ''}>
                        {Math.round(s.file.size / 1024)} KB
                      </span>
                    </div>
                    <button type="button" onClick={() => dropStaged(i)} aria-label={`Remove ${s.file.name}`}>
                      <Icon name="close" size={16} />
                    </button>
                  </li>
                ))}
              </ul>
              {oversized.length > 0 && (
                <p className="admin-note admin-note--quiet">
                  <Icon name="alert" size={15} />
                  {oversized.length === 1 ? 'One file is' : `${oversized.length} files are`} over
                  500 KB. They will still work, but resizing to about 1400px wide keeps the
                  site fast on a phone.
                </p>
              )}
              <div className="imgman__staged-actions">
                <button
                  type="button" className="btn btn--primary" disabled={busy}
                  onClick={() => void commitStaged()}
                >
                  {busy ? 'Adding…' : `Add ${staged.length} image${staged.length === 1 ? '' : 's'}`}
                </button>
                <button
                  type="button" className="btn btn--secondary"
                  onClick={() => { staged.forEach((s) => URL.revokeObjectURL(s.url)); setStaged([]); }}
                >
                  Discard
                </button>
              </div>
            </div>
          )}

          {error && (
            <p className="field__error" role="alert"><Icon name="alert" size={15} /> {error}</p>
          )}
        </>
      )}

      <ConfirmDialog
        open={pendingRemove !== null}
        title="Remove this image?"
        body={pendingRemove?.shipped
          ? 'It is only taken off this plant. The file stays in the build, so "Restore shipped images" brings it back.'
          : 'This image was uploaded here, so removing it deletes it for good.'}
        confirmLabel="Remove image"
        onConfirm={() => {
          const target = pendingRemove;
          setPendingRemove(null);
          if (target) void apply(admin.removeImage(slug, target.ref.id));
        }}
        onCancel={() => setPendingRemove(null)}
      />

      <ConfirmDialog
        open={confirmRestore}
        destructive={false}
        title="Restore the shipped images?"
        body="This plant goes back to the photographs and order the website was built with. Anything uploaded here is removed from the plant, though the files themselves are kept."
        confirmLabel="Restore"
        onConfirm={() => {
          setConfirmRestore(false);
          setBusy(true);
          void admin.restoreShippedImages(slug).then((next) => { setSlots(next); setBusy(false); });
        }}
        onCancel={() => setConfirmRestore(false)}
      />
    </div>
  );
}

export default PlantImageManager;
