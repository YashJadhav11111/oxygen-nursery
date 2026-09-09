import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import type { Appointment, AppointmentDraft } from '@/types';
import PageHeader from '@/components/ui/PageHeader';
import Icon from '@/components/ui/Icon';
import Reveal from '@/components/ui/Reveal';
import WhatsAppButton from '@/components/ui/WhatsAppButton';
import appointmentService, { todayISO, type ValidationErrors } from '@/services/appointmentService';
import { bookableServices } from '@/data/services';
import { CUSTOMER_SERVICE, PHONE_NUMBERS, ADDRESS } from '@/config/businessConfig';
import { formatDate, formatTime } from '@/lib/format';
import { useSeo } from '@/hooks/useSeo';

const TIME_SLOTS = [
  '08:00', '09:00', '10:00', '11:00', '12:00',
  '14:00', '15:00', '16:00', '17:00', '18:00',
];

const emptyDraft = (service: string): AppointmentDraft => ({
  name: '',
  phone: '',
  service,
  date: '',
  time: '',
  message: '',
});

export default function Book() {
  const [params] = useSearchParams();
  const preselected = params.get('service') ?? '';

  const [draft, setDraft] = useState<AppointmentDraft>(() =>
    emptyDraft(bookableServices.includes(preselected) ? preselected : ''),
  );
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState<Appointment | null>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const today = useMemo(todayISO, []);

  useSeo({
    title: 'Book a Consultation',
    description:
      'Book a gardening or landscaping consultation with Oxygen Nursery in Nashik. Choose a service, date and time — we confirm on WhatsApp.',
  });

  useEffect(() => {
    if (confirmed) successRef.current?.focus();
  }, [confirmed]);

  const update = <K extends keyof AppointmentDraft>(key: K, value: AppointmentDraft[K]) => {
    setDraft((d) => ({ ...d, [key]: value }));
    // Clear a field's error as soon as the visitor starts fixing it.
    setErrors((e) => (e[key as keyof ValidationErrors] ? { ...e, [key]: undefined } : e));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitError(null);

    const found = appointmentService.validate(draft);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      const firstKey = Object.keys(found)[0];
      document.getElementById(`field-${firstKey}`)?.focus();
      return;
    }

    setSubmitting(true);
    const result = await appointmentService.submit(draft);
    setSubmitting(false);

    if (result.ok && result.data) setConfirmed(result.data);
    else setSubmitError(result.error ?? 'We could not send your request. Please try again, or message us on WhatsApp.');
  };

  /* ----------------------------- SUCCESS ----------------------------- */
  if (confirmed) {
    return (
      <>
        <PageHeader
          eyebrow="Booking"
          title="Appointment Request Received"
          description="Thank you — we have your request and will be in touch to confirm."
          crumbs={[{ label: 'Book Consultation' }]}
          scene="sprout"
          seed="book-success"
        />

        <section className="section">
          <div className="container container--narrow">
            <div className="success" ref={successRef} tabIndex={-1} role="status">
              <span className="success__icon"><Icon name="check-circle" size={34} /></span>
              <h2>Appointment Request Received</h2>
              <p className="muted">
                Reference <strong>{confirmed.id}</strong> — please keep this handy if you call us.
              </p>

              <dl className="success__summary">
                <div><dt>Name</dt><dd>{confirmed.name}</dd></div>
                <div><dt>Phone</dt><dd>{confirmed.phone}</dd></div>
                <div><dt>Service</dt><dd>{confirmed.service}</dd></div>
                <div><dt>Preferred date</dt><dd>{formatDate(confirmed.date)}</dd></div>
                <div><dt>Preferred time</dt><dd>{formatTime(confirmed.time)}</dd></div>
                {confirmed.message && <div><dt>Requirements</dt><dd>{confirmed.message}</dd></div>}
                <div><dt>Status</dt><dd><span className="badge badge--limited"><span className="badge__dot" />Awaiting confirmation</span></dd></div>
              </dl>

              <div className="success__note">
                <Icon name="alert" size={18} />
                <p>
                  This is a request, not a confirmed booking. We will contact you on the number above
                  to confirm the slot. Customer service is available {CUSTOMER_SERVICE.availability}.
                </p>
              </div>

              <div className="success__actions">
                <WhatsAppButton
                  size="lg"
                  label="Continue on WhatsApp"
                  context={{
                    kind: 'appointment',
                    serviceName: confirmed.service,
                    date: formatDate(confirmed.date),
                    time: formatTime(confirmed.time),
                    name: confirmed.name,
                  }}
                />
                <a href={`tel:+${PHONE_NUMBERS[0].international}`} className="btn btn--secondary btn--lg">
                  <Icon name="phone" size={18} /> Call {PHONE_NUMBERS[0].local}
                </a>
              </div>

              <div className="success__after">
                <Link to="/plants" className="link-arrow">Browse plants while you wait <Icon name="arrow-right" size={16} /></Link>
                <button
                  className="link-arrow"
                  onClick={() => {
                    setConfirmed(null);
                    setDraft(emptyDraft(''));
                  }}
                >
                  Book another consultation <Icon name="arrow-right" size={16} />
                </button>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }

  /* ------------------------------ FORM ------------------------------ */
  return (
    <>
      <PageHeader
        eyebrow="Appointments"
        title="Book a Consultation"
        description="Tell us what you need and when suits you. We will confirm on WhatsApp or by phone."
        crumbs={[{ label: 'Book Consultation' }]}
        scene="terrace"
        seed="book-page"
      />

      <section className="section">
        <div className="container container--wide booking">
          <Reveal className="booking__form-wrap">
            <form className="booking__form" onSubmit={handleSubmit} noValidate>
              <h2 className="booking__form-title">Your details</h2>

              <div className="field">
                <label className="field__label" htmlFor="field-name">
                  Name <span className="field__req" aria-hidden="true">*</span>
                </label>
                <input
                  id="field-name"
                  className="input"
                  type="text"
                  autoComplete="name"
                  value={draft.name}
                  onChange={(e) => update('name', e.target.value)}
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? 'error-name' : undefined}
                  required
                />
                {errors.name && (
                  <p className="field__error" id="error-name"><Icon name="alert" size={14} /> {errors.name}</p>
                )}
              </div>

              <div className="field">
                <label className="field__label" htmlFor="field-phone">
                  Phone Number <span className="field__req" aria-hidden="true">*</span>
                </label>
                <input
                  id="field-phone"
                  className="input"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="10-digit mobile number"
                  value={draft.phone}
                  onChange={(e) => update('phone', e.target.value)}
                  aria-invalid={Boolean(errors.phone)}
                  aria-describedby={errors.phone ? 'error-phone' : 'hint-phone'}
                  required
                />
                {errors.phone ? (
                  <p className="field__error" id="error-phone"><Icon name="alert" size={14} /> {errors.phone}</p>
                ) : (
                  <p className="field__hint" id="hint-phone">We will use this to confirm your appointment.</p>
                )}
              </div>

              <div className="field">
                <label className="field__label" htmlFor="field-service">
                  Service <span className="field__req" aria-hidden="true">*</span>
                </label>
                <select
                  id="field-service"
                  className="select"
                  value={draft.service}
                  onChange={(e) => update('service', e.target.value)}
                  aria-invalid={Boolean(errors.service)}
                  aria-describedby={errors.service ? 'error-service' : undefined}
                  required
                >
                  <option value="">Choose a service…</option>
                  {bookableServices.map((service) => (
                    <option key={service} value={service}>{service}</option>
                  ))}
                </select>
                {errors.service && (
                  <p className="field__error" id="error-service"><Icon name="alert" size={14} /> {errors.service}</p>
                )}
              </div>

              <div className="booking__row">
                <div className="field">
                  <label className="field__label" htmlFor="field-date">
                    Preferred Date <span className="field__req" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="field-date"
                    className="input"
                    type="date"
                    min={today}
                    value={draft.date}
                    onChange={(e) => update('date', e.target.value)}
                    aria-invalid={Boolean(errors.date)}
                    aria-describedby={errors.date ? 'error-date' : undefined}
                    required
                  />
                  {errors.date && (
                    <p className="field__error" id="error-date"><Icon name="alert" size={14} /> {errors.date}</p>
                  )}
                </div>

                <div className="field">
                  <label className="field__label" htmlFor="field-time">
                    Preferred Time <span className="field__req" aria-hidden="true">*</span>
                  </label>
                  <select
                    id="field-time"
                    className="select"
                    value={draft.time}
                    onChange={(e) => update('time', e.target.value)}
                    aria-invalid={Boolean(errors.time)}
                    aria-describedby={errors.time ? 'error-time' : undefined}
                    required
                  >
                    <option value="">Choose a time…</option>
                    {TIME_SLOTS.map((slot) => (
                      <option key={slot} value={slot}>{formatTime(slot)}</option>
                    ))}
                  </select>
                  {errors.time && (
                    <p className="field__error" id="error-time"><Icon name="alert" size={14} /> {errors.time}</p>
                  )}
                </div>
              </div>

              <div className="field">
                <label className="field__label" htmlFor="field-message">Message / Requirements</label>
                <textarea
                  id="field-message"
                  className="textarea"
                  value={draft.message}
                  onChange={(e) => update('message', e.target.value)}
                  placeholder="Roughly how big is the space? What would you like to do with it?"
                />
                <p className="field__hint">Optional, but it helps us come prepared.</p>
              </div>

              {submitError && (
                <div className="notice notice--error" role="alert">
                  <Icon name="alert" size={18} />
                  <div>
                    <strong>{submitError}</strong>
                    <WhatsAppButton size="sm" variant="whatsapp-outline" label="Message us instead" />
                  </div>
                </div>
              )}

              <button type="submit" className="btn btn--primary btn--lg btn--block" disabled={submitting}>
                {submitting ? (
                  <><span className="spinner" aria-hidden="true" /> Sending request…</>
                ) : (
                  <><Icon name="calendar" size={19} /> Request Appointment</>
                )}
              </button>

              <p className="booking__disclaimer muted">
                Submitting sends a request. We confirm every appointment by phone or WhatsApp before
                it is booked.
              </p>
            </form>
          </Reveal>

          <Reveal className="booking__aside" delay={110}>
            <div className="booking__card">
              <h3>Rather just talk?</h3>
              <p className="muted">Message us and we will sort it out in a couple of replies.</p>
              <WhatsAppButton block label="Chat on WhatsApp" />
              {PHONE_NUMBERS.map((phone) => (
                <a key={phone.local} href={`tel:+${phone.international}`} className="booking__phone">
                  <Icon name="phone" size={17} /> {phone.local}
                  {phone.label && <span className="muted"> · {phone.label}</span>}
                </a>
              ))}
              <p className="booking__service">
                <Icon name="headset" size={16} /> {CUSTOMER_SERVICE.label}
              </p>
            </div>

            <div className="booking__card booking__card--soft">
              <h3>What happens next</h3>
              <ol className="booking__steps">
                <li><span>1</span> We receive your request.</li>
                <li><span>2</span> We call or message to confirm the slot.</li>
                <li><span>3</span> We visit the site, or advise remotely if that is enough.</li>
                <li><span>4</span> You get a plan and a clear scope before anything starts.</li>
              </ol>
              <p className="muted booking__where">
                <Icon name="map-pin" size={16} /> {ADDRESS.full}
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
