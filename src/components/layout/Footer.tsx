import { Link } from 'react-router-dom';
import Logo from './Logo';
import Icon from '@/components/ui/Icon';
import { navItems } from './navItems';
import { ADDRESS, BUSINESS_NAME, CUSTOMER_SERVICE, PHONE_NUMBERS, SOCIAL_LINKS, TAGLINE } from '@/config/businessConfig';
import { whatsappProps } from '@/lib/whatsapp';

const footerServices = [
  { label: 'Plant Supply', to: '/services/plant-supply' },
  { label: 'Landscaping', to: '/services/landscape-designing' },
  { label: 'Garden Development', to: '/services/garden-development' },
  { label: 'Terrace Gardens', to: '/services/terrace-garden' },
  { label: 'Vertical Gardens', to: '/services/vertical-garden' },
  { label: 'Garden Maintenance', to: '/services/garden-maintenance' },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container container--wide">
        <div className="footer__top">
          <div className="footer__brand">
            <span className="footer__logo-plate">
              <Logo variant="full" linkTo="/" />
            </span>
            <p className="footer__tagline">{TAGLINE}</p>
            <p className="footer__blurb">
              Plants, gardening and green-space solutions from our nursery in Chandshi, Nashik.
            </p>
            <div className="footer__social" aria-label="Social media">
              {SOCIAL_LINKS.map((s) =>
                s.url ? (
                  <a
                    key={s.name}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer__social-link"
                    aria-label={s.name}
                  >
                    <Icon name={s.icon as 'instagram'} size={18} />
                  </a>
                ) : (
                  <span
                    key={s.name}
                    className="footer__social-link is-disabled"
                    aria-disabled="true"
                    title={`${s.name} — link coming soon`}
                  >
                    <Icon name={s.icon as 'instagram'} size={18} />
                    <span className="sr-only">{s.name} — link coming soon</span>
                  </span>
                ),
              )}
            </div>
          </div>

          <nav className="footer__col" aria-label="Quick links">
            <h3 className="footer__heading">Quick Links</h3>
            <ul>
              {navItems.map((item) => (
                <li key={item.to}>
                  <Link to={item.to}>{item.label}</Link>
                </li>
              ))}
              <li><Link to="/book">Book Consultation</Link></li>
            </ul>
          </nav>

          <nav className="footer__col" aria-label="Services">
            <h3 className="footer__heading">Services</h3>
            <ul>
              {footerServices.map((s) => (
                <li key={s.to}>
                  <Link to={s.to}>{s.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="footer__col footer__col--contact">
            <h3 className="footer__heading">Contact</h3>
            <address>
              <p className="footer__address">
                <Icon name="map-pin" size={17} />
                <span>{ADDRESS.line1},<br />{ADDRESS.city}, {ADDRESS.state}</span>
              </p>
              {PHONE_NUMBERS.map((p) => (
                <a key={p.local} href={`tel:+${p.international}`} className="footer__contact-link">
                  <Icon name="phone" size={17} /> {p.local}
                </a>
              ))}
              <a {...whatsappProps({ kind: 'general' })} className="footer__contact-link">
                <Icon name="whatsapp" size={17} /> WhatsApp
              </a>
            </address>
            <p className="footer__service-badge">
              <Icon name="headset" size={17} />
              {CUSTOMER_SERVICE.label}
            </p>
          </div>
        </div>

        <div className="footer__bottom">
          <p>© {year} {BUSINESS_NAME}. All rights reserved.</p>
          <p className="footer__note">
            Website prototype. Service and project artwork is illustrative; plants without a
            photograph say so rather than showing a stand-in.
          </p>
          {/* Staff entry point. Deliberately quiet — customers never need it. */}
          <Link to="/login" className="footer__staff">Staff login</Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
