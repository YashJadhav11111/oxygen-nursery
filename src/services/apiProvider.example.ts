/* eslint-disable */
/**
 * ===========================================================================
 * TEMPLATE — Phase 2 REST / Firebase / Supabase provider
 * ===========================================================================
 * This file is NOT imported anywhere and is not part of the build (it is a
 * `.example.ts` reference). It shows exactly what has to be written to move
 * off demo data.
 *
 * Steps to go live:
 *   1. Copy this file to `apiProvider.ts` and fill in the endpoints.
 *   2. Set VITE_API_URL in a .env file.
 *   3. In providerRegistry.ts:  export const provider = new ApiDataProvider();
 *
 * That is the whole migration. No page, component, form or type changes.
 * ===========================================================================
 *
 * import type { DataProvider } from './dataProvider';
 * import { ok, fail } from './dataProvider';
 * import type { Appointment, AppointmentDraft, Plant, Result } from '@/types';
 *
 * export class ApiDataProvider implements DataProvider {
 *   readonly name = 'api';
 *   constructor(private baseUrl = import.meta.env.VITE_API_URL as string) {}
 *
 *   private async request<T>(path: string, init?: RequestInit): Promise<Result<T>> {
 *     try {
 *       const res = await fetch(`${this.baseUrl}${path}`, {
 *         headers: { 'Content-Type': 'application/json' },
 *         ...init,
 *       });
 *       if (!res.ok) return fail<T>(`Request failed (${res.status})`);
 *       return ok((await res.json()) as T);
 *     } catch (e) {
 *       return fail<T>('Network error. Please try again.');
 *     }
 *   }
 *
 *   getPlants()            { return this.request<Plant[]>('/plants'); }
 *   getPlant(slug: string) { return this.request<Plant>(`/plants/${slug}`); }
 *   getServices()          { return this.request<Service[]>('/services'); }
 *   getProjects()          { return this.request<Project[]>('/projects'); }
 *   getCareGuides()        { return this.request<PlantCareGuide[]>('/care-guides'); }
 *   getReviews()           { return this.request<Review[]>('/reviews'); }
 *
 *   createAppointment(draft: AppointmentDraft) {
 *     return this.request<Appointment>('/appointments', {
 *       method: 'POST',
 *       body: JSON.stringify(draft),
 *     });
 *   }
 *   listAppointments() { return this.request<Appointment[]>('/appointments'); }
 *   updateAppointment(id: string, patch: Partial<Appointment>) {
 *     return this.request<Appointment>(`/appointments/${id}`, {
 *       method: 'PATCH',
 *       body: JSON.stringify(patch),
 *     });
 *   }
 *
 *   // Admin dashboard writes (Phase 2)
 *   savePlant(plant: Plant)  { return this.request<Plant>('/admin/plants', { method: 'PUT', body: JSON.stringify(plant) }); }
 *   deletePlant(id: string)  { return this.request<null>(`/admin/plants/${id}`, { method: 'DELETE' }); }
 * }
 */
export {};
