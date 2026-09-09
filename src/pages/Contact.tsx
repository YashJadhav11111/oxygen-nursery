import { Link } from 'react-router-dom';
import PageHeader from '@/components/ui/PageHeader';
import Reveal from '@/components/ui/Reveal';
import Icon from '@/components/ui/Icon';
import WhatsAppButton from '@/components/ui/WhatsAppButton';
import { ADDRESS, CUSTOMER_SERVICE, GOOGLE_MAPS, PHONE_NUMBERS, BUSINESS_NAME } from '@/config/businessConfig';
import { useSeo } from '@/hooks/useSeo';

export default function Contact() {
  useSeo({
    title: 'Contact',
    description:
      'Contact Oxygen Nursery, Chandshi, Nashik, Maharashtra. Call 8888453354 or 7972453354, message on WhatsApp, or book a consultation. 24/7 customer service.',
  });

  return (
    <>
      <PageHeader
        eyebrow="Get In Touch"
        title="Talk to Our Team"
        description="Call, message on WhatsApp, or book a consultation — whichever suits you."
        crumbs={[{ label: 'Contact' }]}
        scene="landscape"
        seed="contact-page"
      />

      <section className="section">
        <div className="container container--wide contact__grid">
          <Reveal className="contact__card">
            <span className="eyebrow">Oxygen Nursery</span>
            <h2>Visit or call</h2>

            <address className="contact__details">
              <div className="contact__row">
                <span className="contact__icon"><Icon name="map-pin" size={19} /></span>
                <div>
                  <p className="contact__label">Address</p>
                  <p className="contact__value">
                    {BUSINESS_NAME}<br />
                    {ADDRESS.line1},<br />
                    {ADDRESS.city}, {ADDRESS.state}
                  </p>
                </div>
              </div>

              <div className="contact__row">
                <span className="contact__icon"><Icon name="phone" size={19} /></span>
                <div>
                  <p className="contact__label">Phone</p>
                  {PHONE_NUMBERS.map((phone) => (
                    <p className="contact__value" key={phone.local}>
                      <a href={`tel:+${phone.international}`}>{phone.local}</a>
                    </p>
                  ))}
                </div>
              </div>

              <div className="contact__row">
                <span className="contact__icon"><Icon name="headset" size={19} /></span>
                <div>
                  <p className="contact__label">Customer service</p>
                  <p className="contact__value">{CUSTOMER_SERVICE.availability}</p>
                  <p className="muted contact__note">{CUSTOMER_SERVICE.note}</p>
                </div>
              </div>
            </address>

            <div className="contact__actions">
              <a href={`tel:+${PHONE_NUMBERS[0].international}`} className="btn btn--primary">
                <Icon name="phone" size={18} /> Call
              </a>
              <WhatsAppButton label="WhatsApp" />
              <Link to="/book" className="btn btn--secondary">
                <Icon name="calendar" size={18} /> Book Appointment
              </Link>
              <a
                href={GOOGLE_MAPS.directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn--secondary"
              >
                <Icon name="map-pin" size={18} /> Get Directions
              </a>
            </div>
          </Reveal>

          <Reveal className="contact__map" delay={110}>
            {GOOGLE_MAPS.embedUrl ? (
              <iframe
                src={GOOGLE_MAPS.embedUrl}
                title={`Map showing ${BUSINESS_NAME}, ${ADDRESS.full}`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            ) : (
              /* No exact map location has been supplied yet, so rather than guess
                 coordinates we show a clear placeholder that still gets people there.
                 Add GOOGLE_MAPS.embedUrl in businessConfig.ts and the map appears. */
              <div className="map-placeholder">
                <span className="map-placeholder__pin"><Icon name="map-pin" size={26} /></span>
                <h3>{ADDRESS.full}</h3>
                <p className="muted">
                  The exact map pin is being confirmed. Directions will open a Google Maps search for
                  the nursery, or call us and we will guide you in.
                </p>
                <div className="row" style={{ justifyContent: 'center' }}>
                  <a href={GOOGLE_MAPS.directionsUrl} target="_blank" rel="noopener noreferrer" className="btn btn--secondary btn--sm">
                    Open in Google Maps
                  </a>
                  <WhatsAppButton
                    size="sm"
                    variant="whatsapp-outline"
                    label="Ask for directions"
                    context={{ kind: 'custom', message: 'Hello Oxygen Nursery, could you share the location for the nursery in Chandshi, Nashik?' }}
                  />
                </div>
              </div>
            )}
          </Reveal>
        </div>
      </section>

      <section className="section section--alt">
        <div className="container container--narrow text-center">
          <span className="eyebrow" style={{ justifyContent: 'center' }}>Prefer to plan ahead?</span>
          <h2>Book a Consultation</h2>
          <p className="lede">
            Pick a service, a date and a time that suits you. We will confirm on WhatsApp.
          </p>
          <div className="row" style={{ justifyContent: 'center', marginTop: 'var(--space-5)' }}>
            <Link to="/book" className="btn btn--primary btn--lg">Book a Consultation</Link>
          </div>
        </div>
      </section>
    </>
  );
}
