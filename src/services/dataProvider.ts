import type {
  Appointment, AppointmentDraft, Plant, PlantCareGuide, Project, Review, Service, Result,
} from '@/types';

/**
 * ===========================================================================
 * THE SEAM BETWEEN THE UI AND THE DATA
 * ===========================================================================
 * Every page talks to a *service* (plantService, appointmentService, …).
 * Every service talks to a *DataProvider*. Nothing in the UI touches demo data
 * or localStorage directly.
 *
 *   UI  ->  service layer  ->  DataProvider  ->  local demo data   (today)
 *   UI  ->  service layer  ->  DataProvider  ->  REST / Firebase / Supabase (later)
 *
 * To go live, write a second class that implements this interface (see
 * apiProvider.example.ts) and change ONE line in providerRegistry.ts.
 * No component, page, form or type has to change.
 * ===========================================================================
 */
export interface DataProvider {
  readonly name: string;

  /* --- Catalogue ------------------------------------------------------- */
  getPlants(): Promise<Result<Plant[]>>;
  getPlant(slug: string): Promise<Result<Plant>>;

  /* --- Content --------------------------------------------------------- */
  getServices(): Promise<Result<Service[]>>;
  getProjects(): Promise<Result<Project[]>>;
  getCareGuides(): Promise<Result<PlantCareGuide[]>>;
  getReviews(): Promise<Result<Review[]>>;

  /* --- Appointments ---------------------------------------------------- */
  createAppointment(draft: AppointmentDraft): Promise<Result<Appointment>>;
  listAppointments(): Promise<Result<Appointment[]>>;
  updateAppointment(id: string, patch: Partial<Appointment>): Promise<Result<Appointment>>;

  /* --- Admin write operations (Phase 2) -------------------------------- */
  /** Implemented by the future API provider; the local provider reports "not supported". */
  savePlant?(plant: Plant): Promise<Result<Plant>>;
  deletePlant?(id: string): Promise<Result<null>>;
  saveProject?(project: Project): Promise<Result<Project>>;
  deleteProject?(id: string): Promise<Result<null>>;
  saveCareGuide?(guide: PlantCareGuide): Promise<Result<PlantCareGuide>>;
  deleteCareGuide?(id: string): Promise<Result<null>>;
}

export const ok = <T>(data: T): Result<T> => ({ ok: true, data });
export const fail = <T>(error: string): Result<T> => ({ ok: false, error });
