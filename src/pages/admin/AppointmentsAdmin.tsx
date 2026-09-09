import { useCallback, useEffect, useState } from 'react';
import type { Appointment, AppointmentStatus } from '@/types';
import Icon from '@/components/ui/Icon';
import appointmentService from '@/services/appointmentService';
import { whatsappProps } from '@/lib/whatsapp';
import { useSeo } from '@/hooks/useSeo';

const STATUS_LABEL: Record<AppointmentStatus, string> = {
  pending: 'Awaiting reply',
  confirmed: 'Confirmed',
  rescheduled: 'Rescheduled',
  completed: 'Completed',
  rejected: 'Declined',
};

const STATUS_CLASS: Record<AppointmentStatus, string> = {
  pending: 'badge--limited',
  confirmed: 'badge--available',
  rescheduled: 'badge--limited',
  completed: 'badge--soft',
  rejected: 'badge--unavailable',
};

/** The statuses worth filtering by; the rest are reachable from a row. */
const FILTERS = ['all', 'pending', 'confirmed', 'completed', 'rejected'] as const;

const formatDate = (iso: string): string => {
  const d = new Date(`${iso}T00:00:00`);
  return Number.isNaN(d.getTime())
    ? iso
    : d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

/**
 * Consultation requests, newest first.
 *
 * Replying happens on WhatsApp, because that is where these conversations
 * already are — so each row offers a message pre-filled with the request's own
 * details rather than asking someone to retype them.
 */
export default function AppointmentsAdmin() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<AppointmentStatus | 'all'>('all');

  useSeo({ title: 'Appointments' });

  const load = useCallback(async () => {
    const result = await appointmentService.list();
    setAppointments(
      [...(result.data ?? [])].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    );
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  const setStatus = async (id: string, status: AppointmentStatus) => {
    await appointmentService.update(id, { status });
    await load();
  };

  const visible = filter === 'all'
    ? appointments
    : appointments.filter((a) => a.status === filter);

  return (
    <>
      <header className="admin-head">
        <div>
          <span className="eyebrow">Enquiries</span>
          <h1>Appointments</h1>
          <p className="lede">
            {appointments.length === 0
              ? 'No consultation requests yet.'
              : `${appointments.filter((a) => a.status === 'pending').length} of ${appointments.length} still to answer.`}
          </p>
        </div>
      </header>

      {appointments.length > 0 && (
        <div className="admin-segment" role="group" aria-label="Filter appointments">
          {FILTERS.map((value) => (
            <button
              key={value}
              type="button"
              className={filter === value ? 'is-active' : ''}
              onClick={() => setFilter(value)}
              aria-pressed={filter === value}
            >
              {value === 'all' ? 'All' : STATUS_LABEL[value]}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <p className="muted">Loading…</p>
      ) : visible.length === 0 ? (
        <div className="admin-card">
          <p className="muted">
            <Icon name="calendar" size={16} />{' '}
            {appointments.length === 0
              ? 'Requests booked through the website will appear here.'
              : 'Nothing under that filter.'}
          </p>
        </div>
      ) : (
        <div className="admin-cards">
          {visible.map((a) => (
            <article key={a.id} className="admin-card appt">
              <div className="appt__head">
                <div>
                  <h2>{a.name}</h2>
                  <p className="muted">{a.service}</p>
                </div>
                <span className={`badge ${STATUS_CLASS[a.status]}`}>{STATUS_LABEL[a.status]}</span>
              </div>

              <dl className="appt__facts">
                <div><dt>Preferred</dt><dd>{formatDate(a.date)} at {a.time}</dd></div>
                <div><dt>Phone</dt><dd><a href={`tel:${a.phone}`}>{a.phone}</a></dd></div>
                <div><dt>Requested</dt><dd>{new Date(a.createdAt).toLocaleString('en-IN')}</dd></div>
              </dl>

              {a.message && <p className="appt__message">“{a.message}”</p>}

              <div className="appt__actions">
                <a
                  {...whatsappProps({
                    kind: 'custom',
                    message: `Hello ${a.name}, this is Oxygen Nursery about your ${a.service} consultation request for ${formatDate(a.date)} at ${a.time}.`,
                  })}
                  className="btn btn--whatsapp btn--sm"
                >
                  <Icon name="whatsapp" size={16} /> Reply on WhatsApp
                </a>
                {a.status !== 'confirmed' && (
                  <button
                    type="button" className="btn btn--secondary btn--sm"
                    onClick={() => void setStatus(a.id, 'confirmed')}
                  >
                    <Icon name="check" size={15} /> Mark confirmed
                  </button>
                )}
                {a.status !== 'completed' && (
                  <button
                    type="button" className="btn btn--secondary btn--sm"
                    onClick={() => void setStatus(a.id, 'completed')}
                  >
                    Mark completed
                  </button>
                )}
                {a.status !== 'rejected' && (
                  <button
                    type="button" className="btn btn--secondary btn--sm"
                    onClick={() => void setStatus(a.id, 'rejected')}
                  >
                    Decline
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
