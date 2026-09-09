import { Link } from 'react-router-dom';
import PageHeader from '@/components/ui/PageHeader';
import SectionHead from '@/components/ui/SectionHead';
import Reveal from '@/components/ui/Reveal';
import Icon, { type IconName } from '@/components/ui/Icon';
import SceneArt from '@/components/ui/botanical/SceneArt';
import Parallax from '@/components/ui/Parallax';
import WhatsAppButton from '@/components/ui/WhatsAppButton';
import Logo from '@/components/layout/Logo';
import { ADDRESS, CUSTOMER_SERVICE, TAGLINE } from '@/config/businessConfig';
import { useSeo } from '@/hooks/useSeo';

const pillars: { icon: IconName; title: string; body: string }[] = [
  { icon: 'leaf', title: 'Quality plants', body: 'Grown and selected for the conditions they will live in, and checked before they leave the nursery.' },
  { icon: 'compass', title: 'Gardening solutions', body: 'Design, development, planting, irrigation and maintenance, taken on as one piece of work.' },
  { icon: 'shovel', title: 'Landscaping', body: 'Layouts planned around light, soil, water and how a space is actually used.' },
  { icon: 'sprout', title: 'Garden development', body: 'Bare or neglected ground turned into a planted, usable garden.' },
  { icon: 'recycle', title: 'Sustainable green spaces', body: 'Native and climate-suited species, water-efficient irrigation, soil improved rather than replaced.' },
  { icon: 'headset', title: 'Plant care', body: 'Guidance after the sale, a plant care library, and someone reachable when a plant looks unhappy.' },
  { icon: 'forest', title: 'Ecological solutions', body: 'Miyawaki plantations, restoration planting, green belts and cultural forests.' },
];

export default function About() {
  useSeo({
    title: 'About Us',
    description:
      'Oxygen Nursery brings plants, gardening and green-space solutions closer to customers in Nashik — plant supply, landscaping, garden development and ecological planting.',
  });

  return (
    <>
      <PageHeader
        eyebrow="About"
        title="About Oxygen Nursery"
        description="Plants, gardening and green-space solutions from Chandshi, Nashik."
        crumbs={[{ label: 'About' }]}
        scene="nursery"
        seed="about-page"
      />

      <section className="section">
        <div className="container container--wide about__intro">
          <Reveal>
            <span className="eyebrow">Our purpose</span>
            <h2>Every space has the potential to become greener, healthier and more beautiful.</h2>
            <p className="lede">
              Oxygen Nursery exists to bring plants, gardening and green-space solutions closer to
              the people who want them — whether that is one plant for a windowsill or a whole plot
              that needs to become a garden.
            </p>
            <p>
              We grow and supply plants, and we do the work that surrounds them: planning a layout,
              preparing ground, planting, setting up watering, and keeping the space in good
              condition afterwards. The same thinking applies at a larger scale, in dense native
              plantations, restoration planting and green belt development.
            </p>
            <p>
              Our approach favours native and climate-suited species, biodiversity, sustainable
              watering and soil that is improved rather than replaced — because those are the things
              that decide whether planting is still thriving three years later.
            </p>
          </Reveal>

          <Reveal variant="bloom" delay={120} className="about__mark">
            <div className="about__logo-plate"><Logo variant="full" linkTo={null} /></div>
            <p className="about__tagline">{TAGLINE}</p>
          </Reveal>
        </div>
      </section>

      <section className="section section--alt">
        <div className="container container--wide">
          <SectionHead
            eyebrow="What we do"
            title="Plants, Gardens and Green Spaces"
            description="Seven things we focus on, and what each one means in practice."
          />
          <div className="grid cols-3">
            {pillars.map((pillar, i) => (
              <Reveal key={pillar.title} variant="unfurl" delay={Math.min(i, 6) * 60}>
                <article className="pillar">
                  <span className="pillar__icon"><Icon name={pillar.icon} size={22} /></span>
                  <h3>{pillar.title}</h3>
                  <p>{pillar.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section about__band">
        <Parallax speed={-0.12} scale={1.16} className="about__band-art" mobileFactor={0.3}><SceneArt variant="miyawaki" seed="about-band" /></Parallax>
        <div className="about__band-scrim" aria-hidden="true" />
        <div className="container container--narrow about__band-inner">
          <Reveal>
            <span className="eyebrow">Where to find us</span>
            <h2>{ADDRESS.line1}, {ADDRESS.city}</h2>
            <p>
              The nursery is in {ADDRESS.line1}, {ADDRESS.city}, {ADDRESS.state}. Customer service is
              available {CUSTOMER_SERVICE.availability} — call or message any time, and please call
              ahead if you are planning to visit.
            </p>
            <div className="row" style={{ marginTop: 'var(--space-5)' }}>
              <Link to="/contact" className="btn btn--light">Contact &amp; directions</Link>
              <WhatsAppButton label="Message us" />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
