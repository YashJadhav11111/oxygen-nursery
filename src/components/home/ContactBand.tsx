import { Link } from 'react-router-dom';
import Icon from '@/components/ui/Icon';
import Reveal from '@/components/ui/Reveal';
import WhatsAppButton from '@/components/ui/WhatsAppButton';
import SceneArt from '@/components/ui/botanical/SceneArt';
import Parallax from '@/components/ui/Parallax';
import SectionEdge from '@/components/ui/SectionEdge';
import { ADDRESS, CUSTOMER_SERVICE, PHONE_NUMBERS } from '@/config/businessConfig';

export function ContactBand() {
  return (
    <section className="section contact-band" aria-labelledby="contact-band-title">
      <SectionEdge position="top" fill="var(--bg-alt)" variant="hill" />
      <Parallax speed={-0.12} scale={1.16} className="contact-band__art" mobileFactor={0.3}>
        <SceneArt variant="nursery" seed="contact-band" />
      </Parallax>
      <div className="contact-band__scrim" aria-hidden="true" />

      <div className="container contact-band__inner">
        <Reveal>
          <span className="eyebrow">Let’s Grow Something Beautiful</span>
          <h2 id="contact-band-title">Greener Spaces Start Here</h2>
          <p>
            Tell us about your space — a balcony, a terrace, a garden or a plot — and we will
            suggest what will work. Customer service is available {CUSTOMER_SERVICE.availability}.
          </p>

          <div className="row contact-band__actions">
            <Link to="/book" className="btn btn--light btn--lg">
              <Icon name="calendar" size={19} /> Book a Consultation
            </Link>
            <WhatsAppButton size="lg" label="Chat on WhatsApp" />
          </div>

          <ul className="contact-band__details">
            <li>
              <Icon name="map-pin" size={18} />
              <span>{ADDRESS.full}</span>
            </li>
            {PHONE_NUMBERS.map((p) => (
              <li key={p.local}>
                <Icon name="phone" size={18} />
                <a href={`tel:+${p.international}`}>{p.local}</a>
              </li>
            ))}
            <li>
              <Icon name="headset" size={18} />
              <span>{CUSTOMER_SERVICE.label}</span>
            </li>
          </ul>
        </Reveal>
      </div>
    </section>
  );
}

export default ContactBand;
