import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';
import Icon from '@/components/ui/Icon';
import WhatsAppButton from '@/components/ui/WhatsAppButton';
import { HeroFar, HeroLeaf, HeroMid, HeroNear, HeroSky } from './HeroArt';
import { usePointerDepth } from '@/motion/usePointerDepth';
import { useParallax } from '@/motion/useParallax';
import { BUSINESS_NAME, CUSTOMER_SERVICE, TAGLINE, ADDRESS } from '@/config/businessConfig';

/**
 * A single depth plane of the hero.
 *
 * Only two of the four planes drift on scroll. The sky and the far ridge are
 * held still: moving a full-screen layer is the most expensive thing on the
 * site, and those two contribute almost nothing to the sense of depth that the
 * mid and near planes do not already carry. All four still respond to the
 * pointer, which is cheap because it only runs while the mouse is moving.
 *
 * Two transforms are layered deliberately and kept on separate elements so they
 * never fight: the outer element carries the scroll parallax, the inner one
 * carries the pointer depth. `speed` is how far the plane drifts as the page
 * scrolls; `depth` is how far it shifts as the mouse moves across the scene.
 */
function HeroPlane({ speed, depth, className = '', children }: {
  speed: number; depth: number; className?: string; children: ReactNode;
}) {
  const ref = useParallax<HTMLDivElement>({ speed, scale: 1, mobileFactor: 0.35 });
  return (
    <div className={`hero__plane ${className}`} ref={ref}>
      <div className="hero__plane-inner" data-depth={depth}>{children}</div>
    </div>
  );
}

export function Hero() {
  // The whole scene listens for the pointer; each plane responds by its depth.
  const sceneRef = usePointerDepth<HTMLDivElement>(18);

  /**
   * The sun drift and the leaf sway are continuous animations. Left alone they
   * would keep running — and keep repainting a full-screen scene — for the
   * entire length of the page. This parks them the moment the hero leaves the
   * viewport, which is the difference between a smooth page and a stuttering
   * one on a large display.
   */
  const heroRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const node = heroRef.current;
    if (!node || typeof IntersectionObserver === 'undefined') return;
    // Gated by IntersectionObserver rather than by the scroll loop: the
    // observer is driven by the frame lifecycle, so it still reports during
    // fast or programmatic scrolling where scroll events get coalesced away.
    //
    // The class is written straight to the node rather than through React
    // state, so it can never be delayed behind the scheduler. It is
    // presentation only, so the DOM is the right place for it.
    const io = new IntersectionObserver(
      ([entry]) => node.classList.toggle('is-onscreen', entry.isIntersecting),
      { rootMargin: '10% 0px' },
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  return (
    <section className="hero is-onscreen" aria-labelledby="hero-title" ref={heroRef}>
      {/* ---------- the layered scene ---------- */}
      <div className="hero__scene" ref={sceneRef} aria-hidden="true">
        <HeroPlane speed={0} depth={0} className="hero__plane--sky"><HeroSky /></HeroPlane>
        <HeroPlane speed={0} depth={0.34} className="hero__plane--far"><HeroFar /></HeroPlane>
        <HeroPlane speed={-0.055} depth={0.56} className="hero__plane--mid"><HeroMid /></HeroPlane>
        <div className="hero__scrim" />
        <HeroPlane speed={0.1} depth={0.9} className="hero__plane--near"><HeroNear /></HeroPlane>

        {/* Two leaves overhanging the very front of the frame, breathing gently */}
        <div className="hero__frond hero__frond--left" data-depth="1.5">
          <span className="hero__frond-sway"><HeroLeaf /></span>
        </div>
        <div className="hero__frond hero__frond--right" data-depth="1.8">
          <span className="hero__frond-sway hero__frond-sway--slow"><HeroLeaf mirrored /></span>
        </div>
      </div>

      {/* ---------- the message ---------- */}
      <div className="hero__inner container container--wide">
        <p className="hero__eyebrow hero__in" style={{ ['--in' as string]: 0 }}>
          <span className="hero__eyebrow-dot" aria-hidden="true" />
          {ADDRESS.line1}, {ADDRESS.city} · {CUSTOMER_SERVICE.label}
        </p>

        <h1 id="hero-title" className="hero__in" style={{ ['--in' as string]: 1 }}>{BUSINESS_NAME}</h1>
        <p className="hero__tagline hero__in" style={{ ['--in' as string]: 2 }}>{TAGLINE}</p>
        <p className="hero__support hero__in" style={{ ['--in' as string]: 3 }}>
          Quality plants, beautiful gardens and complete gardening solutions for greener,
          healthier spaces.
        </p>

        <div className="hero__actions hero__in" style={{ ['--in' as string]: 4 }}>
          <Link to="/plants" className="btn btn--light btn--lg">
            <Icon name="leaf" size={19} /> Explore Plants
          </Link>
          <Link to="/book" className="btn btn--ghost btn--lg">
            <Icon name="calendar" size={19} /> Book a Consultation
          </Link>
          <WhatsAppButton size="lg" className="hero__wa" />
        </div>

        <ul className="hero__stats hero__in" style={{ ['--in' as string]: 5 }}>
          <li className="hero__stat">
            <strong>Indoor &amp; Outdoor</strong>
            <span>Plant Selection</span>
          </li>
          <li className="hero__stat">
            <strong>Design to Maintenance</strong>
            <span>Gardening Services</span>
          </li>
          <li className="hero__stat">
            <strong>Native Plantation</strong>
            <span>Green Solutions</span>
          </li>
          <li className="hero__stat">
            <strong>{CUSTOMER_SERVICE.availability}</strong>
            <span>Customer Service</span>
          </li>
        </ul>
      </div>
    </section>
  );
}

export default Hero;
