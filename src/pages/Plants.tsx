import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import type { CategoryId, CollectionId, PlantQuery, PlantSort } from '@/types';
import PageHeader from '@/components/ui/PageHeader';
import PlantGrid from '@/components/plants/PlantGrid';
import PlantFilters from '@/components/plants/PlantFilters';
import { SkeletonGrid } from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import Icon from '@/components/ui/Icon';
import WhatsAppButton from '@/components/ui/WhatsAppButton';
import { useAsync } from '@/hooks/useAsync';
import { useSeo } from '@/hooks/useSeo';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';
import plantService from '@/services/plantService';
import { hasAnyPricing } from '@/data/plants';
import { categories } from '@/data/categories';
import { collections } from '@/data/collections';

type ListKey = 'categories' | 'availability' | 'sunlight' | 'water' | 'careLevel';

const LIST_KEYS: ListKey[] = ['categories', 'availability', 'sunlight', 'water', 'careLevel'];

const PARAM_FOR: Record<ListKey, string> = {
  categories: 'category',
  availability: 'availability',
  sunlight: 'sunlight',
  water: 'water',
  careLevel: 'care',
};

/** Sort options. Price options are filtered out when no plant carries a price. */
const ALL_SORTS: { value: PlantSort; label: string; needsPrice?: boolean }[] = [
  { value: 'recommended', label: 'Recommended' },
  { value: 'name-asc', label: 'Name A–Z' },
  { value: 'name-desc', label: 'Name Z–A' },
  { value: 'newest', label: 'New arrivals first' },
  { value: 'price-asc', label: 'Price: Low to High', needsPrice: true },
  { value: 'price-desc', label: 'Price: High to Low', needsPrice: true },
];

export default function Plants() {
  const [params, setParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState(params.get('q') ?? '');
  const [drawerOpen, setDrawerOpen] = useState(false);
  useBodyScrollLock(drawerOpen);

  const sortOptions = useMemo(() => ALL_SORTS.filter((s) => !s.needsPrice || hasAnyPricing), []);

  /** The URL is the source of truth, so filters are shareable and survive a reload. */
  const query = useMemo<PlantQuery>(() => {
    const readList = (key: string) => {
      const values = params.getAll(key).flatMap((v) => v.split(',')).filter(Boolean);
      return values.length ? values : undefined;
    };
    return {
      search: params.get('q') ?? undefined,
      categories: readList('category') as CategoryId[] | undefined,
      availability: readList('availability') as PlantQuery['availability'],
      sunlight: readList('sunlight') as PlantQuery['sunlight'],
      water: readList('water') as PlantQuery['water'],
      careLevel: readList('care') as PlantQuery['careLevel'],
      collection: (params.get('collection') as CollectionId) ?? undefined,
      newArrival: params.get('new') === 'true' || undefined,
      sort: (params.get('sort') as PlantSort) ?? 'recommended',
    };
  }, [params]);

  const { data, loading, error } = useAsync(() => plantService.list(query), [JSON.stringify(query)]);

  /** Debounced search — the input stays responsive, the URL updates after a pause. */
  useEffect(() => {
    const id = window.setTimeout(() => {
      const next = new URLSearchParams(params);
      if (searchInput.trim()) next.set('q', searchInput.trim());
      else next.delete('q');
      if (next.toString() !== params.toString()) setParams(next, { replace: true });
    }, 280);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  const toggleValue = useCallback(
    (key: ListKey, value: string) => {
      const param = PARAM_FOR[key];
      const next = new URLSearchParams(params);
      const current = next.getAll(param).flatMap((v) => v.split(',')).filter(Boolean);
      const updated = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
      next.delete(param);
      if (updated.length) next.set(param, updated.join(','));
      setParams(next);
    },
    [params, setParams],
  );

  const setCollection = useCallback(
    (id: string | undefined) => {
      const next = new URLSearchParams(params);
      if (id) next.set('collection', id);
      else next.delete('collection');
      setParams(next);
    },
    [params, setParams],
  );

  const setSort = useCallback(
    (value: string) => {
      const next = new URLSearchParams(params);
      if (value === 'recommended') next.delete('sort');
      else next.set('sort', value);
      setParams(next);
    },
    [params, setParams],
  );

  const clearAll = useCallback(() => {
    setSearchInput('');
    setParams(new URLSearchParams());
  }, [setParams]);

  const activeChips = useMemo(() => {
    const chips: { label: string; onRemove: () => void }[] = [];
    LIST_KEYS.forEach((key) => {
      (query[key] as string[] | undefined)?.forEach((value) => {
        const label =
          key === 'categories'
            ? categories.find((c) => c.id === value)?.name ?? value
            : value.replace(/-/g, ' ');
        chips.push({ label, onRemove: () => toggleValue(key, value) });
      });
    });
    if (query.collection) {
      const name = collections.find((c) => c.id === query.collection)?.name ?? query.collection;
      chips.push({ label: name, onRemove: () => setCollection(undefined) });
    }
    if (query.newArrival) {
      chips.push({
        label: 'New arrivals',
        onRemove: () => {
          const next = new URLSearchParams(params);
          next.delete('new');
          setParams(next);
        },
      });
    }
    return chips;
  }, [query, toggleValue, setCollection, params, setParams]);

  const activeCategory = query.categories?.length === 1
    ? categories.find((c) => c.id === query.categories?.[0])
    : undefined;

  useSeo({
    title: activeCategory ? `${activeCategory.name}` : 'Plants',
    description: activeCategory
      ? `${activeCategory.description} Browse ${activeCategory.name.toLowerCase()} at Oxygen Nursery, Chandshi, Nashik.`
      : 'Browse the Oxygen Nursery plant catalogue — indoor, outdoor, flowering, fruit, ornamental, medicinal plants, trees, shrubs and succulents in Nashik.',
  });

  const count = data?.length ?? 0;

  return (
    <>
      <PageHeader
        eyebrow="The Catalogue"
        title={activeCategory ? activeCategory.name : 'Our Plants'}
        description={
          activeCategory
            ? activeCategory.description
            : 'Search the nursery, filter by what your space can offer, and enquire on WhatsApp about anything you like.'
        }
        crumbs={[{ label: 'Plants' }]}
        scene="nursery"
        seed="plants-page"
      />

      <section className="section section--tight">
        <div className="container container--wide">
          <div className="catalog">
            <div className="catalog__sidebar">
              <PlantFilters
                query={query}
                onToggle={(key, value) => toggleValue(key, value as string)}
                onSetCollection={setCollection}
                onClear={clearAll}
                resultCount={count}
                showPrice={hasAnyPricing}
              />
            </div>

            <div className="catalog__main">
              <div className="catalog__toolbar">
                <div className="search">
                  <Icon name="search" size={18} />
                  <input
                    type="search"
                    className="search__input"
                    placeholder="Search plants..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    aria-label="Search plants by name, botanical name or tag"
                  />
                  {searchInput && (
                    <button className="search__clear" onClick={() => setSearchInput('')} aria-label="Clear search">
                      <Icon name="close" size={16} />
                    </button>
                  )}
                </div>

                <div className="catalog__toolbar-actions">
                  <button className="btn btn--secondary btn--sm catalog__filter-btn" onClick={() => setDrawerOpen(true)}>
                    <Icon name="sliders" size={16} /> Filters
                    {activeChips.length > 0 && <span className="filters__count">{activeChips.length}</span>}
                  </button>

                  <label className="sort">
                    <span className="sr-only">Sort plants</span>
                    <select
                      className="select sort__select"
                      value={query.sort ?? 'recommended'}
                      onChange={(e) => setSort(e.target.value)}
                    >
                      {sortOptions.map((option) => (
                        <option key={option.value} value={option.value}>Sort: {option.label}</option>
                      ))}
                    </select>
                  </label>
                </div>
              </div>

              <div className="catalog__quick" role="group" aria-label="Quick category filters">
                <button
                  className="chip chip--sm"
                  aria-pressed={!query.categories?.length}
                  onClick={() => {
                    const next = new URLSearchParams(params);
                    next.delete('category');
                    setParams(next);
                  }}
                >
                  All plants
                </button>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    className="chip chip--sm"
                    aria-pressed={query.categories?.includes(category.id) ?? false}
                    onClick={() => toggleValue('categories', category.id)}
                  >
                    {category.name}
                  </button>
                ))}
              </div>

              {activeChips.length > 0 && (
                <div className="active-filters" aria-live="polite">
                  {activeChips.map((chip) => (
                    <button key={chip.label} className="active-filters__chip" onClick={chip.onRemove}>
                      {chip.label} <Icon name="close" size={13} />
                    </button>
                  ))}
                  <button className="active-filters__clear" onClick={clearAll}>Clear all</button>
                </div>
              )}

              <div className="catalog__results" aria-live="polite" aria-busy={loading}>
                {loading && <SkeletonGrid count={8} className="cols-3" />}

                {error && !loading && (
                  <EmptyState
                    icon="alert"
                    title="We couldn't load the catalogue"
                    message={error}
                    action={<button className="btn btn--primary" onClick={() => window.location.reload()}>Try again</button>}
                  />
                )}

                {!loading && !error && count === 0 && (
                  <EmptyState
                    icon="search"
                    title="No plants match your current filters."
                    message="Try removing a filter, or ask us — we may have something similar in the nursery."
                    action={
                      <>
                        <button className="btn btn--secondary" onClick={clearAll}>Clear Filters</button>
                        <WhatsAppButton
                          label="Ask us what's available"
                          context={{
                            kind: 'custom',
                            message: 'Hello Oxygen Nursery, I could not find what I was looking for on your website. Could you help me choose a plant?',
                          }}
                        />
                      </>
                    }
                  />
                )}

                {!loading && !error && count > 0 && (
                  <>
                    <p className="catalog__count muted">
                      Showing {count} {count === 1 ? 'plant' : 'plants'}
                    </p>
                    <PlantGrid plants={data ?? []} columns="cols-3" />
                  </>
                )}
              </div>

              <div className="catalog__help">
                <div>
                  <h2>Need help choosing?</h2>
                  <p className="muted">Answer four quick questions and we will suggest plants that suit your space.</p>
                </div>
                <Link to="/#help-me-choose" className="btn btn--primary">
                  Help me choose <Icon name="arrow-right" size={17} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile filter drawer */}
      {drawerOpen && (
        <div className="filter-drawer" role="dialog" aria-modal="true" aria-label="Plant filters">
          <div className="filter-drawer__backdrop" onClick={() => setDrawerOpen(false)} />
          <div className="filter-drawer__panel">
            <PlantFilters
              query={query}
              onToggle={(key, value) => toggleValue(key, value as string)}
              onSetCollection={setCollection}
              onClear={clearAll}
              resultCount={count}
              showPrice={hasAnyPricing}
              onClose={() => setDrawerOpen(false)}
            />
            <div className="filter-drawer__footer">
              <button className="btn btn--primary btn--block" onClick={() => setDrawerOpen(false)}>
                Show {count} {count === 1 ? 'plant' : 'plants'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
