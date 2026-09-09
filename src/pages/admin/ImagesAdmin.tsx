import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { Plant } from '@/types';
import Icon from '@/components/ui/Icon';
import SmartImage from '@/components/ui/SmartImage';
import PlantImageManager from '@/components/admin/PlantImageManager';
import * as admin from '@/services/adminService';
import { useSeo } from '@/hooks/useSeo';

/**
 * Image Management: pick a plant on the left, work on its pictures on the right.
 *
 * The chooser leads with the plants that have no photograph, since that is the
 * queue this screen exists to empty. The selected plant is kept in the URL, so
 * a link from the overview or the plant list lands directly on the right one.
 */
export default function ImagesAdmin() {
  const [params, setParams] = useSearchParams();
  const [plants, setPlants] = useState<Plant[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useSeo({ title: 'Image Management' });

  useEffect(() => {
    let active = true;
    void admin.listPlants().then((list) => {
      if (!active) return;
      setPlants(list);
      setLoading(false);
    });
    return () => { active = false; };
  }, []);

  const ordered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return plants
      .filter((p) => !q || p.name.toLowerCase().includes(q))
      .sort((a, b) => {
        const am = a.images.every((i) => !i.src) ? 0 : 1;
        const bm = b.images.every((i) => !i.src) ? 0 : 1;
        if (am !== bm) return am - bm;
        return a.name.localeCompare(b.name);
      });
  }, [plants, search]);

  const selectedSlug = params.get('plant') ?? ordered[0]?.slug ?? '';
  const selected = plants.find((p) => p.slug === selectedSlug) ?? null;
  const missingCount = plants.filter((p) => p.images.every((i) => !i.src)).length;

  return (
    <>
      <header className="admin-head">
        <div>
          <span className="eyebrow">Photographs</span>
          <h1>Image Management</h1>
          <p className="lede">
            {missingCount === 0
              ? 'Every plant has at least one photograph.'
              : `${missingCount} plant${missingCount === 1 ? '' : 's'} still waiting for a photograph.`}
          </p>
        </div>
      </header>

      {loading ? (
        <p className="muted">Loading…</p>
      ) : (
        <div className="imgpick">
          <div className="imgpick__list">
            <div className="admin-search">
              <Icon name="search" size={17} />
              <input
                className="input"
                type="search"
                placeholder="Find a plant…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Find a plant"
              />
            </div>

            <ul role="listbox" aria-label="Plants">
              {ordered.map((plant) => {
                const photos = plant.images.filter((i) => i.src).length;
                const active = plant.slug === selectedSlug;
                const first = plant.images[0];
                return (
                  <li key={plant.slug}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={active}
                      className={`imgpick__item ${active ? 'is-active' : ''}`}
                      onClick={() => setParams({ plant: plant.slug })}
                    >
                      <span className="imgpick__thumb">
                        {first && <SmartImage image={first} ratio="ratio-1-1" sizes="48px" />}
                      </span>
                      <span className="imgpick__text">
                        <strong>{plant.name}</strong>
                        <span className={photos === 0 ? 'is-warn' : ''}>
                          {photos === 0 ? 'No photograph' : `${photos} image${photos === 1 ? '' : 's'}`}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="imgpick__panel admin-card">
            {selected ? (
              <>
                <h2>{selected.name}</h2>
                {selected.botanicalName && <p className="muted"><i>{selected.botanicalName}</i></p>}
                <PlantImageManager
                  key={selected.slug}
                  slug={selected.slug}
                  plantName={selected.name}
                />
              </>
            ) : (
              <p className="muted">Choose a plant to manage its photographs.</p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
