import type { Availability, CareLevel, Sunlight, WaterNeed } from '@/types';

export const availabilityLabel: Record<Availability, string> = {
  available: 'Available',
  limited: 'Limited Stock',
  unavailable: 'Currently Unavailable',
};

export const availabilityClass: Record<Availability, string> = {
  available: 'badge--available',
  limited: 'badge--limited',
  unavailable: 'badge--unavailable',
};

export const sunlightLabel: Record<Sunlight, string> = {
  'low-light': 'Low Light',
  'partial-sun': 'Partial Sun',
  'full-sun': 'Full Sun',
};

export const waterLabel: Record<WaterNeed, string> = {
  low: 'Low Water',
  moderate: 'Moderate Water',
  high: 'High Water',
};

export const careLabel: Record<CareLevel, string> = {
  easy: 'Easy Care',
  moderate: 'Moderate Care',
  expert: 'Expert Care',
};

export const formatDate = (iso: string): string => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
};

export const formatTime = (hhmm: string): string => {
  const [h, m] = hhmm.split(':').map(Number);
  if (Number.isNaN(h)) return hhmm;
  const period = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${hour}:${String(m ?? 0).padStart(2, '0')} ${period}`;
};

/** Prices are only ever shown when the data actually carries one. */
export const formatPrice = (price?: number, unit?: string): string | null => {
  if (typeof price !== 'number') return null;
  const value = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);
  return unit ? `${value} ${unit}` : value;
};
