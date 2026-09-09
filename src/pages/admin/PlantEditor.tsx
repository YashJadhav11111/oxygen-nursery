import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import type {
  Availability, CareLevel, CategoryId, Placement, Plant, Purpose, Sunlight, WaterNeed,
} from '@/types';
import Icon from '@/components/ui/Icon';
import PlantImageManager from '@/components/admin/PlantImageManager';
import * as admin from '@/services/adminService';
import { categories } from '@/data/categories';
import { careLabel, sunlightLabel, waterLabel, availabilityLabel } from '@/lib/format';
import { useSeo } from '@/hooks/useSeo';

const AVAILABILITY: Availability[] = ['available', 'limited', 'unavailable'];
const SUNLIGHT: Sunlight[] = ['low-light', 'partial-sun', 'full-sun'];
const WATER: WaterNeed[] = ['low', 'moderate', 'high'];
const CARE: CareLevel[] = ['easy', 'moderate', 'expert'];
const PLACEMENTS: Placement[] = ['home', 'office', 'balcony', 'terrace', 'garden'];
const PURPOSES: Purpose[] = ['decorative', 'flowering', 'fruit', 'air-greenery', 'garden'];

const placementLabel: Record<Placement, string> = {
  home: 'Home', office: 'Office', balcony: 'Balcony', terrace: 'Terrace', garden: 'Garden',
};
const purposeLabel: Record<Purpose, string> = {
  decorative: 'Decorative', flowering: 'Flowering', fruit: 'Fruit',
  'air-greenery': 'Air & greenery', garden: 'Garden',
};

const blank = (): Plant => ({
  id: '', slug: '', name: '', category: 'indoor', images: [],
  description: '', availability: 'available', sunlight: 'partial-sun', water: 'moderate',
  soil: '', careLevel: 'easy', tags: [], placements: ['home'], purposes: ['decorative'],
});

/**
 * Add and edit a plant.
 *
 * A saved plant goes straight into the same catalogue the public site reads, so
 * it appears in the listing, in search, under its category filter, on its own
 * detail page and in "related plants" without anything else being touched.
 *
 * Images are handled by their own panel below the form rather than as fields:
 * they need a plant to belong to, so on a new plant that panel unlocks after
 * the first save.
 */
export default function PlantEditor() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const isNew = !slug;

  const [plant, setPlant] = useState<Plant>(blank());
  const [tagText, setTagText] = useState('');
  const [careText, setCareText] = useState('');
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  useSeo({ title: isNew ? 'Add Plant' : `Edit ${plant.name || 'plant'}` });

  useEffect(() => {
    if (isNew) return;
    let active = true;
    void (async () => {
      const found = await admin.getPlant(slug);
      if (!active) return;
      if (!found) { setNotFound(true); setLoading(false); return; }
      setPlant(found);
      setTagText(found.tags.join(', '));
      setCareText((found.careNotes ?? []).join('\n'));
      setLoading(false);
    })();
    return () => { active = false; };
  }, [slug, isNew]);

  const derivedSlug = useMemo(
    () => (isNew ? admin.slugify(plant.name) : plant.slug),
    [isNew, plant.name, plant.slug],
  );

  const set = <K extends keyof Plant>(key: K, value: Plant[K]) =>
    setPlant((p) => ({ ...p, [key]: value }));

  const toggle = <T,>(list: T[], value: T): T[] =>
    list.includes(value) ? list.filter((v) => v !== value) : [...list, value];

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!plant.name.trim()) return setError('A plant needs a name.');
    if (!plant.description.trim()) return setError('A short description is what shows on the card — please add one.');
    if (!plant.soil.trim()) return setError('Please say what soil this plant wants.');
    if (plant.placements.length === 0) return setError('Choose at least one placement.');
    if (isNew && !admin.slugAvailable(derivedSlug)) {
      return setError(`There is already a plant at “${derivedSlug}”. Try a different name.`);
    }

    setSaving(true);
    const result = await admin.savePlant({
      ...plant,
      name: plant.name.trim(),
      slug: derivedSlug,
      id: plant.id || derivedSlug,
      tags: tagText.split(',').map((t) => t.trim()).filter(Boolean),
      careNotes: careText.split('\n').map((t) => t.trim()).filter(Boolean),
    });
    setSaving(false);

    if (!result.ok) return setError(result.error ?? 'Could not save.');
    setSaved(`Saved. ${plant.name} is live on the website.`);
    if (isNew) navigate(`/admin/plants/${derivedSlug}/edit`, { replace: true });
    else if (result.data) setPlant(result.data);
    return undefined;
  };

  if (loading) return <p className="muted">Loading…</p>;

  if (notFound) {
    return (
      <div className="admin-card">
        <h1>That plant is not here</h1>
        <p className="muted">It may have been removed.</p>
        <Link to="/admin/plants" className="btn btn--primary">Back to plants</Link>
      </div>
    );
  }

  return (
    <>
      <header className="admin-head">
        <div>
          <span className="eyebrow">
            <Link to="/admin/plants">Plants</Link> / {isNew ? 'New' : plant.name}
          </span>
          <h1>{isNew ? 'Add a plant' : `Edit ${plant.name}`}</h1>
          {!isNew && (
            <p className="lede">
              <Link to={`/plants/${plant.slug}`} className="link-arrow" target="_blank" rel="noreferrer">
                View on the website <Icon name="arrow-right" size={15} />
              </Link>
            </p>
          )}
        </div>
      </header>

      {saved && (
        <p className="admin-flash" role="status">
          <Icon name="check-circle" size={16} /> {saved}
          <button type="button" onClick={() => setSaved(null)} aria-label="Dismiss">
            <Icon name="close" size={15} />
          </button>
        </p>
      )}

      <form className="admin-form" onSubmit={onSubmit} noValidate>
        <section className="admin-card">
          <h2>The basics</h2>

          <div className="admin-form__row">
            <div className="field">
              <label className="field__label" htmlFor="p-name">
                Plant name <span className="field__req" aria-hidden="true">*</span>
              </label>
              <input
                id="p-name" className="input" value={plant.name}
                onChange={(e) => set('name', e.target.value)} required
              />
              {isNew && derivedSlug && (
                <p className="field__hint">Web address: /plants/{derivedSlug}</p>
              )}
            </div>

            <div className="field">
              <label className="field__label" htmlFor="p-botanical">Botanical name</label>
              <input
                id="p-botanical" className="input" value={plant.botanicalName ?? ''}
                onChange={(e) => set('botanicalName', e.target.value || undefined)}
                placeholder="Dypsis lutescens"
              />
            </div>
          </div>

          <div className="admin-form__row">
            <div className="field">
              <label className="field__label" htmlFor="p-category">Category</label>
              <select
                id="p-category" className="select" value={plant.category}
                onChange={(e) => set('category', e.target.value as CategoryId)}
              >
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            <div className="field">
              <label className="field__label" htmlFor="p-availability">Availability</label>
              <select
                id="p-availability" className="select" value={plant.availability}
                onChange={(e) => set('availability', e.target.value as Availability)}
              >
                {AVAILABILITY.map((a) => (
                  <option key={a} value={a}>{availabilityLabel[a]}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="field">
            <label className="field__label" htmlFor="p-description">
              Short description <span className="field__req" aria-hidden="true">*</span>
            </label>
            <textarea
              id="p-description" className="textarea" rows={2} value={plant.description}
              onChange={(e) => set('description', e.target.value)}
              placeholder="One or two lines — this is what shows on the plant card."
              required
            />
          </div>

          <div className="field">
            <label className="field__label" htmlFor="p-long">Full description</label>
            <textarea
              id="p-long" className="textarea" rows={4} value={plant.longDescription ?? ''}
              onChange={(e) => set('longDescription', e.target.value || undefined)}
              placeholder="The longer paragraph on the plant's own page."
            />
          </div>
        </section>

        <section className="admin-card">
          <h2>Growing it</h2>

          <div className="admin-form__row admin-form__row--three">
            <div className="field">
              <label className="field__label" htmlFor="p-sun">Light</label>
              <select
                id="p-sun" className="select" value={plant.sunlight}
                onChange={(e) => set('sunlight', e.target.value as Sunlight)}
              >
                {SUNLIGHT.map((s) => <option key={s} value={s}>{sunlightLabel[s]}</option>)}
              </select>
            </div>

            <div className="field">
              <label className="field__label" htmlFor="p-water">Water</label>
              <select
                id="p-water" className="select" value={plant.water}
                onChange={(e) => set('water', e.target.value as WaterNeed)}
              >
                {WATER.map((w) => <option key={w} value={w}>{waterLabel[w]}</option>)}
              </select>
            </div>

            <div className="field">
              <label className="field__label" htmlFor="p-care">Care level</label>
              <select
                id="p-care" className="select" value={plant.careLevel}
                onChange={(e) => set('careLevel', e.target.value as CareLevel)}
              >
                {CARE.map((c) => <option key={c} value={c}>{careLabel[c]}</option>)}
              </select>
            </div>
          </div>

          <div className="admin-form__row">
            <div className="field">
              <label className="field__label" htmlFor="p-soil">
                Soil <span className="field__req" aria-hidden="true">*</span>
              </label>
              <input
                id="p-soil" className="input" value={plant.soil}
                onChange={(e) => set('soil', e.target.value)}
                placeholder="Well-drained potting mix with compost"
                required
              />
            </div>

            <div className="field">
              <label className="field__label" htmlFor="p-size">Mature size</label>
              <input
                id="p-size" className="input" value={plant.matureSize ?? ''}
                onChange={(e) => set('matureSize', e.target.value || undefined)}
                placeholder="1.5 – 2 m indoors"
              />
            </div>
          </div>

          <fieldset className="admin-fieldset">
            <legend>Suits</legend>
            <div className="admin-checks">
              {PLACEMENTS.map((p) => (
                <label key={p} className={`admin-check ${plant.placements.includes(p) ? 'is-on' : ''}`}>
                  <input
                    type="checkbox"
                    checked={plant.placements.includes(p)}
                    onChange={() => set('placements', toggle(plant.placements, p))}
                  />
                  {placementLabel[p]}
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="admin-fieldset">
            <legend>Bought for</legend>
            <div className="admin-checks">
              {PURPOSES.map((p) => (
                <label key={p} className={`admin-check ${plant.purposes.includes(p) ? 'is-on' : ''}`}>
                  <input
                    type="checkbox"
                    checked={plant.purposes.includes(p)}
                    onChange={() => set('purposes', toggle(plant.purposes, p))}
                  />
                  {purposeLabel[p]}
                </label>
              ))}
            </div>
          </fieldset>

          <div className="field">
            <label className="field__label" htmlFor="p-tags">Tags</label>
            <input
              id="p-tags" className="input" value={tagText}
              onChange={(e) => setTagText(e.target.value)}
              placeholder="air-purifying, low-maintenance, gifting"
            />
            <p className="field__hint">Separated by commas. Tags are searchable.</p>
          </div>

          <div className="field">
            <label className="field__label" htmlFor="p-carenotes">Care notes</label>
            <textarea
              id="p-carenotes" className="textarea" rows={4} value={careText}
              onChange={(e) => setCareText(e.target.value)}
              placeholder={'One note per line.\nWater when the top inch of soil is dry.\nWipe the leaves monthly.'}
            />
            <p className="field__hint">One per line. They become the numbered care cards on the plant page.</p>
          </div>

          <div className="admin-form__row">
            <label className="admin-check admin-check--wide">
              <input
                type="checkbox" checked={Boolean(plant.featured)}
                onChange={(e) => set('featured', e.target.checked || undefined)}
              />
              Feature on the homepage
            </label>
            <label className="admin-check admin-check--wide">
              <input
                type="checkbox" checked={Boolean(plant.newArrival)}
                onChange={(e) => set('newArrival', e.target.checked || undefined)}
              />
              Mark as a new arrival
            </label>
          </div>

          <p className="admin-note admin-note--quiet">
            <Icon name="alert" size={15} />
            There is no price field on purpose. The site never shows a price it was not
            given, so plants are enquiry-only until real pricing is supplied.
          </p>
        </section>

        {error && (
          <p className="field__error" role="alert"><Icon name="alert" size={15} /> {error}</p>
        )}

        <div className="admin-form__actions">
          <button type="submit" className="btn btn--primary btn--lg" disabled={saving}>
            {saving ? 'Saving…' : isNew ? 'Create plant' : 'Save changes'}
          </button>
          <Link to="/admin/plants" className="btn btn--secondary btn--lg">Cancel</Link>
        </div>
      </form>

      <section className="admin-card">
        <h2>Images</h2>
        {isNew ? (
          <p className="muted">
            <Icon name="alert" size={15} /> Create the plant first, then its photographs can
            be added here.
          </p>
        ) : (
          <PlantImageManager slug={plant.slug} plantName={plant.name} />
        )}
      </section>
    </>
  );
}
