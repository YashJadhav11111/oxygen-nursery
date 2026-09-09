import type { Plant, PlantQuery, RecommenderAnswers, Result } from '@/types';
import { provider } from './providerRegistry';

/**
 * All plant reads and all catalogue logic (search, filter, sort, recommend)
 * live here — not in components. Swapping the provider for a real API keeps
 * every one of these behaviours intact; if the API grows server-side filtering,
 * only this file changes.
 */

const matches = (plant: Plant, q: PlantQuery): boolean => {
  if (q.search) {
    const needle = q.search.trim().toLowerCase();
    const haystack = [plant.name, plant.botanicalName, plant.description, plant.category, ...plant.tags]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();
    if (!haystack.includes(needle)) return false;
  }
  if (q.categories?.length && !q.categories.includes(plant.category)) return false;
  if (q.availability?.length && !q.availability.includes(plant.availability)) return false;
  if (q.sunlight?.length && !q.sunlight.includes(plant.sunlight)) return false;
  if (q.water?.length && !q.water.includes(plant.water)) return false;
  if (q.careLevel?.length && !q.careLevel.includes(plant.careLevel)) return false;
  if (q.collection && !plant.collections?.includes(q.collection)) return false;
  if (q.featured && !plant.featured) return false;
  if (q.newArrival && !plant.newArrival) return false;
  return true;
};

const availabilityRank: Record<Plant['availability'], number> = {
  available: 0,
  limited: 1,
  unavailable: 2,
};

const sortPlants = (list: Plant[], sort: PlantQuery['sort'] = 'recommended'): Plant[] => {
  const sorted = [...list];
  switch (sort) {
    case 'name-asc':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case 'name-desc':
      return sorted.sort((a, b) => b.name.localeCompare(a.name));
    case 'price-asc':
      return sorted.sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity));
    case 'price-desc':
      return sorted.sort((a, b) => (b.price ?? -Infinity) - (a.price ?? -Infinity));
    case 'newest':
      return sorted.sort((a, b) => Number(Boolean(b.newArrival)) - Number(Boolean(a.newArrival)));
    case 'recommended':
    default:
      return sorted.sort((a, b) => {
        const feat = Number(Boolean(b.featured)) - Number(Boolean(a.featured));
        if (feat) return feat;
        const avail = availabilityRank[a.availability] - availabilityRank[b.availability];
        if (avail) return avail;
        return a.name.localeCompare(b.name);
      });
  }
};

export const plantService = {
  async list(query: PlantQuery = {}): Promise<Result<Plant[]>> {
    const res = await provider.getPlants();
    if (!res.ok || !res.data) return res;
    let list = res.data.filter((p) => matches(p, query));
    list = sortPlants(list, query.sort);
    if (query.limit) list = list.slice(0, query.limit);
    return { ok: true, data: list };
  },

  get(slug: string) {
    return provider.getPlant(slug);
  },

  /** Plants sharing a category, excluding the plant itself. */
  async related(plant: Plant, limit = 4): Promise<Plant[]> {
    const res = await provider.getPlants();
    if (!res.ok || !res.data) return [];
    const sameCategory = res.data.filter((p) => p.id !== plant.id && p.category === plant.category);
    const sameTags = res.data.filter(
      (p) => p.id !== plant.id && p.category !== plant.category && p.tags.some((t) => plant.tags.includes(t)),
    );
    return [...sameCategory, ...sameTags].slice(0, limit);
  },

  /** True when any plant in the catalogue carries a price — gates all price UI. */
  async pricingAvailable(): Promise<boolean> {
    const res = await provider.getPlants();
    return Boolean(res.data?.some((p) => typeof p.price === 'number'));
  },

  /**
   * "Help me choose a plant" scoring.
   * A weighted match rather than a hard filter, so the tool always has
   * something sensible to show instead of an empty result.
   */
  async recommend(answers: RecommenderAnswers, limit = 6): Promise<Plant[]> {
    const res = await provider.getPlants();
    if (!res.ok || !res.data) return [];
    const maintenanceToCare: Record<'low' | 'medium' | 'high', Plant['careLevel']> = {
      low: 'easy',
      medium: 'moderate',
      high: 'expert',
    };

    const scored = res.data.map((plant) => {
      let score = 0;
      if (answers.placement && plant.placements.includes(answers.placement)) score += 4;
      if (answers.sunlight && plant.sunlight === answers.sunlight) score += 4;
      else if (answers.sunlight === 'partial-sun' && plant.sunlight !== 'full-sun') score += 1;
      if (answers.purpose && plant.purposes.includes(answers.purpose)) score += 3;
      if (answers.maintenance) {
        const wanted = maintenanceToCare[answers.maintenance];
        if (plant.careLevel === wanted) score += 3;
        else if (answers.maintenance !== 'low' && plant.careLevel === 'easy') score += 1;
      }
      if (plant.availability === 'available') score += 1;
      if (plant.featured) score += 0.5;
      return { plant, score };
    });

    return scored
      .filter((s) => s.score > 0)
      .sort((a, b) => b.score - a.score || a.plant.name.localeCompare(b.plant.name))
      .slice(0, limit)
      .map((s) => s.plant);
  },
};

export default plantService;
