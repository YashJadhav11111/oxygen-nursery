import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import Logo from './Logo';
import { navItems } from './navItems';
import Icon from '@/components/ui/Icon';
import { whatsappProps } from '@/lib/whatsapp';
import { useScrollPosition } from '@/hooks/useScrollPosition';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';
import { CUSTOMER_SERVICE, PHONE_NUMBERS } from '@/config/businessConfig';

export function Navbar() {
  const [open, setOpen] = useState(false);
  const scrolled = useScrollPosition(40);
  const { pathname } = useLocation();

  /** Only the home page has a full-bleed hero for the navbar to sit over. */
  const overlay = pathname === '/' && !scrolled && !open;

  useBodyScrollLock(open);
  useEffect(() => setOpen(false), [pathname]);

  /**
   * The active-page underline is a single element that travels between links
   * rather than one underline per link appearing and disappearing. It is
   * measured from the live DOM, so it stays correct at any font size or zoom.
   */
  const linksRef = useRef<HTMLElement>(null);
  const [indicator, setIndicator] = useState({ x: 0, w: 0, shown: false });

  const measure = useCallback(() => {
    const nav = linksRef.current;
    if (!nav) return;
    const active = nav.querySelector<HTMLElement>('.nav__link.is-active');
    if (!active) { setIndicator((i) => ({ ...i, shown: false })); return; }
    const navBox = nav.getBoundingClientRect();
    const box = active.getBoundingClientRect();
    const w = Math.max(18, box.width * 0.34);
    setIndicator({ x: box.left - navBox.left + (box.width - w) / 2, w, shown: true });
  }, []);

  useLayoutEffect(() => { measure(); }, [pathname, measure]);
  useEffect(() => {
    // Fonts landing late would otherwise leave the indicator half a word out.
    const t1 = window.setTimeout(measure, 350);
    window.addEventListener('resize', measure);
    document.fonts?.ready?.then(measure).catch(() => {});
    return () => { window.clearTimeout(t1); window.removeEventListener('resize', measure); };
  }, [measure]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <>
      <header className={`nav ${overlay ? 'nav--overlay' : 'nav--solid'} ${open ? 'nav--open' : ''}`}>
        <div className="nav__inner container container--wide">
        <Logo variant="lockup" onDark={overlay} className="nav__logo" />

        <nav className="nav__links" aria-label="Primary" ref={linksRef}>
          <span
            className="nav__indicator"
            aria-hidden="true"
            style={{
              ['--x' as string]: `${indicator.x}px`,
              ['--sx' as string]: indicator.w,
              ['--o' as string]: indicator.shown ? 1 : 0,
            }}
          />
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) => `nav__link ${isActive ? 'is-active' : ''}`}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="nav__actions">
          <a
            {...whatsappProps({ kind: 'general' })}
            className="nav__icon-btn nav__icon-btn--whatsapp"
            aria-label="Chat with Oxygen Nursery on WhatsApp"
            title="Chat on WhatsApp"
          >
            <Icon name="whatsapp" size={21} />
          </a>
          <Link to="/book" className="btn btn--primary btn--sm nav__cta">
            Book Consultation
          </Link>
          <button
            className="nav__toggle"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
          >
            <Icon name={open ? 'close' : 'menu'} size={24} />
          </button>
        </div>
        </div>
      </header>

      {/*
        The mobile menu is deliberately a SIBLING of <header>, not a child:
        the navbar uses backdrop-filter, which makes it a containing block for
        fixed-position descendants and would collapse the menu to zero height.
      */}
      <div
        id="mobile-menu"
        className={`mobile-menu ${open ? 'is-open' : ''}`}
        hidden={!open}
      >
        <div className="mobile-menu__panel">
          <Logo variant="full" linkTo="/" className="mobile-menu__logo" />

          <nav className="mobile-menu__links" aria-label="Mobile">
            {navItems.map((item, i) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) => `mobile-menu__link ${isActive ? 'is-active' : ''}`}
                style={{ ['--i' as string]: i }}
              >
                {item.label}
                <Icon name="chevron-right" size={18} />
              </NavLink>
            ))}
          </nav>

          <div className="mobile-menu__actions">
            <Link to="/book" className="btn btn--primary btn--block">
              <Icon name="calendar" size={18} /> Book Consultation
            </Link>
            <a {...whatsappProps({ kind: 'general' })} className="btn btn--whatsapp btn--block">
              <Icon name="whatsapp" size={18} /> Chat on WhatsApp
            </a>
          </div>

          <div className="mobile-menu__contact">
            <p className="eyebrow">Talk to us</p>
            {PHONE_NUMBERS.map((p) => (
              <a key={p.local} href={`tel:+${p.international}`} className="mobile-menu__phone">
                <Icon name="phone" size={16} /> {p.local}
              </a>
            ))}
            <p className="muted">{CUSTOMER_SERVICE.label}</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Navbar;
