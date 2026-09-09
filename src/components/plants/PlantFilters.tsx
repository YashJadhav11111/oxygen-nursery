import type { Availability, CareLevel, PlantQuery, Sunlight, WaterNeed } from '@/types';
import { categories } from '@/data/categories';
import { collections } from '@/data/collections';
import Icon from '@/components/ui/Icon';
import { availabilityLabel, careLabel, sunlightLabel, waterLabel } from '@/lib/format';

interface Props {
  query: PlantQuery;
  onToggle: <K extends 'categories' | 'availability' | 'sunlight' | 'water' | 'careLevel'>(
    key: K,
    value: NonNullable<PlantQuery[K]>[number],
  ) => void;
  onSetCollection: (id: string | undefined) => void;
  onClear: () => void;
  resultCount: number;
  /** Price filters only render when the catalogue actually carries prices. */
  showPrice: boolean;
  onClose?: () => void;
}

interface GroupProps<T extends string> {
  label: string;
  options: { value: T; label: string }[];
  selected: T[] | undefined;
  onToggle: (value: T) => void;
}

function FilterGroup<T extends string>({ label, options, selected, onToggle }: GroupProps<T>) {
  return (
    <fieldset className="filters__group">
      <legend className="filters__legend">{label}</legend>
      <div className="filters__options">
        {options.map((option) => {
          const checked = selected?.includes(option.value) ?? false;
          return (
            <label key={option.value} className={`filters__check ${checked ? 'is-checked' : ''}`}>
              <input
                type="checkbox"
                checked={checked}
                onChange={() => onToggle(option.value)}
              />
              <span className="filters__box" aria-hidden="true"><Icon name="check" size={12} /></span>
              <span>{option.label}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

export function PlantFilters({ query, onToggle, onSetCollection, onClear, resultCount, showPrice, onClose }: Props) {
  const activeCount =
    (query.categories?.length ?? 0) +
    (query.availability?.length ?? 0) +
    (query.sunlight?.length ?? 0) +
    (query.water?.length ?? 0) +
    (query.careLevel?.length ?? 0) +
    (query.collection ? 1 : 0);

  return (
    <aside className="filters" aria-label="Plant filters">
      <div className="filters__head">
        <h2 className="filters__title">
          <Icon name="sliders" size={18} /> Filters
          {activeCount > 0 && <span className="filters__count">{activeCount}</span>}
        </h2>
        {onClose && (
          <button className="filters__close" onClick={onClose} aria-label="Close filters">
            <Icon name="close" size={20} />
          </button>
        )}
      </div>

      <p className="filters__results muted">{resultCount} {resultCount === 1 ? 'plant' : 'plants'}</p>

      <fieldset className="filters__group">
        <legend className="filters__legend">Collection</legend>
        <div className="filters__options filters__options--pills">
          <button
            className="chip chip--sm"
            aria-pressed={!query.collection}
            onClick={() => onSetCollection(undefined)}
          >
            All
          </button>
          {collections.map((collection) => (
            <button
              key={collection.id}
              className="chip chip--sm"
              aria-pressed={query.collection === collection.id}
              onClick={() => onSetCollection(query.collection === collection.id ? undefined : collection.id)}
            >
              {collection.name}
            </button>
          ))}
        </div>
      </fieldset>

      <FilterGroup
        label="Category"
        options={categories.map((c) => ({ value: c.id, label: c.name }))}
        selected={query.categories}
        onToggle={(value) => onToggle('categories', value)}
      />

      <FilterGroup<Availability>
        label="Availability"
        options={(['available', 'limited', 'unavailable'] as Availability[]).map((v) => ({
          value: v,
          label: availabilityLabel[v],
        }))}
        selected={query.availability}
        onToggle={(value) => onToggle('availability', value)}
      />

      <FilterGroup<Sunlight>
        label="Sunlight"
        options={(['low-light', 'partial-sun', 'full-sun'] as Sunlight[]).map((v) => ({
          value: v,
          label: sunlightLabel[v],
        }))}
        selected={query.sunlight}
        onToggle={(value) => onToggle('sunlight', value)}
      />

      <FilterGroup<WaterNeed>
        label="Water Requirement"
        options={(['low', 'moderate', 'high'] as WaterNeed[]).map((v) => ({
          value: v,
          label: waterLabel[v],
        }))}
        selected={query.water}
        onToggle={(value) => onToggle('water', value)}
      />

      <FilterGroup<CareLevel>
        label="Care Level"
        options={(['easy', 'moderate', 'expert'] as CareLevel[]).map((v) => ({
          value: v,
          label: careLabel[v],
        }))}
        selected={query.careLevel}
        onToggle={(value) => onToggle('careLevel', value)}
      />

      {/* Price filtering appears only once plant data carries prices. */}
      {showPrice && (
        <fieldset className="filters__group">
          <legend className="filters__legend">Price</legend>
          <p className="field__hint">Use the sort options to order by price.</p>
        </fieldset>
      )}

      <button className="btn btn--secondary btn--block" onClick={onClear} disabled={activeCount === 0}>
        Clear all filters
      </button>
    </aside>
  );
}

export default PlantFilters;
