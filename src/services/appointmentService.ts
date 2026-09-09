import type { Appointment, AppointmentDraft, Result } from '@/types';
import { provider } from './providerRegistry';

export interface ValidationErrors {
  name?: string;
  phone?: string;
  service?: string;
  date?: string;
  time?: string;
}

/** Today's date as yyyy-mm-dd in the visitor's own timezone (not UTC). */
export const todayISO = (): string => {
  const d = new Date();
  const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
};

/** Accepts Indian mobile numbers with or without +91 / 0 prefix and spacing. */
export const isValidIndianPhone = (raw: string): boolean => {
  const digits = raw.replace(/[\s\-()]/g, '').replace(/^\+?91/, '').replace(/^0/, '');
  return /^[6-9]\d{9}$/.test(digits);
};

export const validateAppointment = (draft: Partial<AppointmentDraft>): ValidationErrors => {
  const errors: ValidationErrors = {};

  if (!draft.name?.trim()) errors.name = 'Please enter your name.';
  else if (draft.name.trim().length < 2) errors.name = 'Please enter your full name.';

  if (!draft.phone?.trim()) errors.phone = 'Please enter a phone number we can reach you on.';
  else if (!isValidIndianPhone(draft.phone)) errors.phone = 'Enter a valid 10-digit mobile number.';

  if (!draft.service) errors.service = 'Please choose a service.';

  if (!draft.date) errors.date = 'Please choose a preferred date.';
  else if (draft.date < todayISO()) errors.date = 'Please choose today or a later date.';

  if (!draft.time) errors.time = 'Please choose a preferred time.';

  return errors;
};

/**
 * Appointment handling sits entirely behind this service.
 * Phase 1 persists to localStorage through the local provider; Phase 2 will
 * POST to a real backend. The booking page calls `submit()` either way and
 * never knows the difference.
 */
export const appointmentService = {
  validate: validateAppointment,

  async submit(draft: AppointmentDraft): Promise<Result<Appointment>> {
    const errors = validateAppointment(draft);
    if (Object.keys(errors).length) {
      return { ok: false, error: 'Please correct the highlighted fields.' };
    }
    return provider.createAppointment({
      ...draft,
      name: draft.name.trim(),
      phone: draft.phone.trim(),
      message: draft.message?.trim() || undefined,
    });
  },

  list() {
    return provider.listAppointments();
  },

  /** Used by the future admin dashboard: confirm / reject / reschedule. */
  update(id: string, patch: Partial<Appointment>) {
    return provider.updateAppointment(id, patch);
  },
};

export default appointmentService;
