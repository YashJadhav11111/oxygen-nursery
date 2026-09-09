import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Plant } from '@/types';
import Icon from '@/components/ui/Icon';
import SmartImage from '@/components/ui/SmartImage';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import * as admin from '@/services/adminService';
import { categories, getCategoryName } from '@/data/categories';
import { availabilityClass, availabilityLabel } from '@/lib/format';
import { useSeo } from '@/hooks/useSeo';

type Filter = 'all' | 'no-photo' | 'added' | 'hidden';

/**
 * The list every other plant screen starts from.
 *
 * Sorted with the plants that need attention first — anything without a
 * photograph — because that is what someone opens this screen to fix.
 */
export default function PlantsAdmin() {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [hidden, setHidden] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>('all');
  const [filter, setFilter] = useState<Filter>('all');
  const [pendingDelete, setPendingDelete] = useState<Plant | null>(null);
  const [flash, setFlash] = useState<string | null>(null);

  useSeo({ title: 'Plant Management' });

  const load = useCallback(async () => {
    setLoading(true);
    const [live, removed] = await Promise.all([admin.listPlants(), admin.listRemoved()]);
    setPlants(live);
    setHidden(removed);
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    const source = filter === 'hidden' ? hidden : plants;
    return source
      .filter((p) => {
        if (q && !`${p.name} ${p.botanicalName ?? ''}`.toLowerCase().includes(q)) return false;
        if (category !== 'all' && p.category !== category) return false;
        if (filter === 'no-photo') return p.images.every((i) => !i.src);
        if (filter === 'added') return !admin.isShipped(p.slug);
        return true;
      })
      .sort((a, b) => {
        const aMissing = a.images.every((i) => !i.src) ? 0 : 1;
        const bMissing = b.images.every((i) => !i.src) ? 0 : 1;
        if (aMissing !== bMissing) return aMissing - bMissing;
        return a.name.localeCompare(b.name);
      });
  }, [plants, hidden, search, category, filter]);

  const restore = async (plant: Plant) => {
    const result = await admin.restorePlant(plant.slug);
    setFlash(result.ok
      ? `${plant.name} is back on the website.`
      : result.error ?? 'Could not restore that plant.');
    await load();
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    const target = pendingDelete;
    setPendingDelete(null);
    const result = await admin.removePlant(target.slug);
    setFlash(result.ok
      ? `${target.name} has been taken off the website.`
      : result.error ?? 'Could not remove that plant.');
    await load();
  };

  return (
    <>
      <header className="admin-head">
        <div>
          <span className="eyebrow">Catalogue</span>
          <h1>Plant Management</h1>
          <p className="lede">{plants.length} plants on the website.</p>
        </div>
        <Link to="/admin/plants/new" className="btn btn--primary">
          <Icon name="sprout" size={18} /> Add a plant
        </Link>
      </header>

      {flash && (
        <p className="admin-flash" role="status">
          <Icon name="check-circle" size={16} /> {flash}
          <button type="button" onClick={() => setFlash(null)} aria-label="Dismiss">
            <Icon name="close" size={15} />
          </button>
        </p>
      )}

      <div className="admin-toolbar">
        <div className="admin-search">
          <Icon name="search" size={17} />
          <input
            className="input"
            type="search"
            placeholder="Search plants…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search plants"
          />
        </div>

        <select
          className="select"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          aria-label="Filter by category"
        >
          <option value="all">All categories</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>

        <div className="admin-segment" role="group" aria-label="Filter plants">
          {([
            ['all', 'All'],
            ['no-photo', 'No photo'],
            ['added', 'Added here'],
            ['hidden', `Hidden (${hidden.length})`],
          ] as [Filter, string][]).map(([value, label]) => (
            <button
              key={value}
              type="button"
              className={filter === value ? 'is-active' : ''}
              onClick={() => setFilter(value)}
              aria-pressed={filter === value}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="muted">Loading the catalogue…</p>
      ) : visible.length === 0 ? (
        <p className="muted">No plants match that.</p>
      ) : (
        <div className="admin-table" role="table" aria-label="Plants">
          <div className="admin-table__head" role="row">
            <span role="columnheader">Plant</span>
            <span role="columnheader">Category</span>
            <span role="columnheader">Availability</span>
            <span role="columnheader">Images</span>
            <span role="columnheader"><span className="sr-only">Actions</span></span>
          </div>

          {visible.map((plant) => {
            const photos = plant.images.filter((i) => i.src).length;
            const first = plant.images[0];
            return (
              <div className="admin-table__row" role="row" key={plant.slug}>
                <div className="admin-row__plant" role="cell">
                  <span className="admin-row__thumb">
                    {first && <SmartImage image={first} ratio="ratio-1-1" sizes="64px" />}
                  </span>
                  <span>
                    <strong>{plant.name}</strong>
                    {plant.botanicalName && <em>{plant.botanicalName}</em>}
                    {!admin.isShipped(plant.slug) && <span className="badge badge--new">Added here</span>}
                  </span>
                </div>

                <span role="cell" className="admin-row__muted">{getCategoryName(plant.category)}</span>

                <span role="cell">
                  <span className={`badge ${availabilityClass[plant.availability]}`}>
                    {availabilityLabel[plant.availability]}
                  </span>
                </span>

                <span role="cell" className="admin-row__muted">
                  {photos === 0
                    ? <span className="admin-row__warn"><Icon name="alert" size={14} /> None</span>
                    : `${photos} photo${photos === 1 ? '' : 's'}`}
                </span>

                <span role="cell" className="admin-row__actions">
                  {filter === 'hidden' ? (
                    <button
                      type="button"
                      className="btn btn--primary btn--sm"
                      onClick={() => void restore(plant)}
                    >
                      <Icon name="check" size={15} /> Put back
                    </button>
                  ) : (
                    <>
                      <Link to={`/admin/images?plant=${plant.slug}`} className="btn btn--secondary btn--sm">
                        <Icon name="layers" size={15} /> Images
                      </Link>
                      <Link to={`/admin/plants/${plant.slug}/edit`} className="btn btn--secondary btn--sm">
                        Edit
                      </Link>
                      <button
                        type="button"
                        className="btn btn--danger btn--sm"
                        onClick={() => setPendingDelete(plant)}
                      >
                        Remove
                      </button>
                    </>
                  )}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {hidden.length > 0 && filter !== 'hidden' && (
        <p className="admin-note">
          <Icon name="alert" size={15} /> {hidden.length} plant
          {hidden.length === 1 ? ' is' : 's are'} hidden from the website. A plant that
          shipped with the site is never deleted —{' '}
          <button type="button" className="linkish" onClick={() => setFilter('hidden')}>
            see the hidden plants
          </button>{' '}
          to put one back.
        </p>
      )}

      <ConfirmDialog
        open={pendingDelete !== null}
        title={`Take ${pendingDelete?.name ?? 'this plant'} off the website?`}
        body={
          pendingDelete && admin.isShipped(pendingDelete.slug)
            ? 'It disappears from the catalogue, search and every category. Because it shipped with the site, its record is kept and it can be restored later.'
            : 'This plant was added here, so removing it deletes its record. Its uploaded images are deleted too.'
        }
        confirmLabel="Remove from website"
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </>
  );
}
