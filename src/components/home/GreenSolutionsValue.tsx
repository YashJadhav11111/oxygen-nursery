import { Link } from 'react-router-dom';
import Reveal from '@/components/ui/Reveal';
import Icon, { type IconName } from '@/components/ui/Icon';
import SmartImage from '@/components/ui/SmartImage';
import DepthMedia from '@/components/ui/DepthMedia';
import WhatsAppButton from '@/components/ui/WhatsAppButton';

/**
 * Replaces the old placeholder-reviews section.
 * The site does not display invented customer names or testimonials. Until real
 * reviews are collected, this section makes the case in Oxygen Nursery's own
 * voice instead — which is honest, and reads better than four fake quotes.
 */

const reasons: { icon: IconName; title: string; body: string }[] = [
  {
    icon: 'compass',
    title: 'We plan before we plant',
    body: 'Light, soil, water and how the space is used decide the plant list — not what happens to be in stock that week.',
  },
  {
    icon: 'recycle',
    title: 'Native and climate-suited species',
    body: 'Plants chosen for Nashik conditions establish faster, need less water, and are still thriving in year three.',
  },
  {
    icon: 'droplet',
    title: 'Water-efficient from the start',
    body: 'Drip and sprinkler layouts are designed into the garden rather than added afterwards.',
  },
  {
    icon: 'scissors',
    title: 'We stay after the handover',
    body: 'A care plan at the end of the job, and scheduled maintenance if you want it. Establishment is where planting is won or lost.',
  },
];

export function GreenSolutionsValue() {
  return (
    <section className="section value" aria-labelledby="value-title">
      <div className="container container--wide value__grid">
        <Reveal variant="drift-left" className="value__copy">
          <span className="eyebrow">Our approach</span>
          <h2 id="value-title">Why Customers Choose Our Green Solutions</h2>
          <p className="lede">
            Anyone can put plants in the ground. What decides whether a garden is still
            worth looking at in three years is what happens before and after that.
          </p>

          <ul className="value__list">
            {reasons.map((r, i) => (
              <li key={r.title} style={{ ['--i' as string]: i }}>
                <span className="value__icon"><Icon name={r.icon} size={20} /></span>
                <div>
                  <h3>{r.title}</h3>
                  <p>{r.body}</p>
                </div>
              </li>
            ))}
          </ul>

          <div className="row value__actions">
            <Link to="/book" className="btn btn--primary">Book a Consultation</Link>
            <WhatsAppButton variant="whatsapp-outline" label="Ask us anything" />
          </div>

          <p className="value__note muted">
            <Icon name="alert" size={14} />
            We are collecting reviews from our customers and will publish them here once we
            have them. We would rather show nothing than invent them.
          </p>
        </Reveal>

        <Reveal variant="bloom" className="value__media" delay={120}>
          <DepthMedia className="value__media-main">
            <SmartImage
              image={{ scene: 'landscape', seed: 'value-main', alt: 'A planned garden with layered planting and a path', demo: true }}
              ratio="ratio-4-3"
              showDemoTag
            />
          </DepthMedia>
          <div className="value__media-sub">
            <SmartImage
              image={{ scene: 'irrigation', seed: 'value-sub', alt: 'Drip irrigation running through a planted bed', demo: true }}
              ratio="ratio-1-1"
            />
          </div>
          <div className="value__media-sub value__media-sub--two">
            <SmartImage
              image={{ scene: 'miyawaki', seed: 'value-sub2', alt: 'A dense native plantation establishing', demo: true }}
              ratio="ratio-1-1"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default GreenSolutionsValue;
