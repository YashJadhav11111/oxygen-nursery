import type {
  Appointment, AppointmentDraft, Plant, PlantCareGuide, Project, Review, Service, Result,
} from '@/types';
import * as catalog from './catalogStore';
import { services } from '@/data/services';
import { projects } from '@/data/projects';
import { plantCareGuides } from '@/data/plantCare';
import { reviews } from '@/data/reviews';
import storage from './storage';
import { type DataProvider, ok, fail } from './dataProvider';

const APPOINTMENTS_KEY = 'appointments';

/** Small artificial delay so loading states are real and get exercised. */
const latency = (ms = 180) => new Promise((r) => setTimeout(r, ms));

const newId = () =>
  `apt_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`.toUpperCase();

/**
 * Phase 1 provider: reads the demo data files and persists appointments to
 * localStorage. It implements exactly the same interface the future API
 * provider will, so swapping it out changes nothing above this layer.
 */
export class LocalDataProvider implements DataProvider {
  readonly name = 'local-demo';

  /**
   * The catalogue comes from catalogStore, not straight from the data file, so
   * that anything an admin has added or edited is already folded in by the time
   * the public pages see it — search, filters and related plants included.
   */
  async getPlants(): Promise<Result<Plant[]>> {
    await latency();
    return ok(await catalog.listPlants());
  }

  async getPlant(slug: string): Promise<Result<Plant>> {
    await latency(120);
    const plant = await catalog.getPlant(slug);
    return plant ? ok(plant) : fail<Plant>('Plant not found');
  }

  async getServices(): Promise<Result<Service[]>> {
    await latency(80);
    return ok(services);
  }

  async getProjects(): Promise<Result<Project[]>> {
    await latency(80);
    return ok(projects);
  }

  async getCareGuides(): Promise<Result<PlantCareGuide[]>> {
    await latency(80);
    return ok(plantCareGuides);
  }

  async getReviews(): Promise<Result<Review[]>> {
    await latency(80);
    return ok(reviews);
  }

  async createAppointment(draft: AppointmentDraft): Promise<Result<Appointment>> {
    await latency(420);
    const appointment: Appointment = {
      ...draft,
      id: newId(),
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    const all = storage.get<Appointment[]>(APPOINTMENTS_KEY, []);
    const saved = storage.set(APPOINTMENTS_KEY, [appointment, ...all]);
    if (!saved) {
      // Storage unavailable (private mode / quota). The request is still valid —
      // the customer continues on WhatsApp — so this is not treated as a failure.
      return ok(appointment);
    }
    return ok(appointment);
  }

  async listAppointments(): Promise<Result<Appointment[]>> {
    await latency(60);
    return ok(storage.get<Appointment[]>(APPOINTMENTS_KEY, []));
  }

  async updateAppointment(id: string, patch: Partial<Appointment>): Promise<Result<Appointment>> {
    await latency(60);
    const all = storage.get<Appointment[]>(APPOINTMENTS_KEY, []);
    const idx = all.findIndex((a) => a.id === id);
    if (idx === -1) return fail<Appointment>('Appointment not found');
    const updated = { ...all[idx], ...patch, id: all[idx].id };
    all[idx] = updated;
    storage.set(APPOINTMENTS_KEY, all);
    return ok(updated);
  }

  /* --- Admin writes ------------------------------------------------------ */
  // These are optional on the interface precisely so a read-only provider can
  // leave them out. This one implements them against the catalogue overlay.

  async savePlant(plant: Plant): Promise<Result<Plant>> {
    await latency(120);
    return catalog.savePlant(plant);
  }

  async deletePlant(slug: string): Promise<Result<null>> {
    await latency(120);
    return catalog.removePlant(slug);
  }
}

export default LocalDataProvider;
