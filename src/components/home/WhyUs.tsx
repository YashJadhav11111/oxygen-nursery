import Reveal from '@/components/ui/Reveal';
import SectionHead from '@/components/ui/SectionHead';
import Icon, { type IconName } from '@/components/ui/Icon';
import SectionEdge from '@/components/ui/SectionEdge';

const points: { icon: IconName; title: string; body: string }[] = [
  {
    icon: 'leaf',
    title: 'Quality Plant Selection',
    body: 'Plants are chosen and grown for the conditions they will actually live in, and checked before they leave the nursery.',
  },
  {
    icon: 'compass',
    title: 'Complete Gardening Solutions',
    body: 'Design, development, planting, irrigation and maintenance handled together, rather than as disconnected jobs.',
  },
  {
    icon: 'shield',
    title: 'Professional Approach',
    body: 'Clear scope, planned execution and a handover you can follow — including what the garden needs after we leave.',
  },
  {
    icon: 'recycle',
    title: 'Sustainable Practices',
    body: 'Native and climate-suited species, water-efficient irrigation and soil that is improved rather than replaced.',
  },
  {
    icon: 'shovel',
    title: 'Garden Development',
    body: 'From bare ground to a planted, usable garden — levels, soil, beds, planting and finishing.',
  },
  {
    icon: 'headset',
    title: 'Plant Care Support',
    body: 'Guidance after the sale, a plant care library on this site, and someone reachable on WhatsApp when a plant looks unhappy.',
  },
];

export function WhyUs() {
  return (
    <section className="section section--deep why" aria-labelledby="why-title">
      <SectionEdge position="top" fill="var(--bg)" variant="hill" />
      <div className="why__pattern" aria-hidden="true" />
      <div className="container container--wide">
        <SectionHead
          center
          eyebrow="Why Oxygen Nursery"
          title="Green Begins With Us"
          description="What you can expect when you buy a plant from us or hand us a space to work on."
        />

        <div className="grid cols-3 why__grid">
          {points.map((point, i) => (
            <Reveal key={point.title} variant="unfurl" delay={Math.min(i, 5) * 75}>
              <article className="why__card">
                <span className="why__icon"><Icon name={point.icon} size={22} /></span>
                <h3>{point.title}</h3>
                <p>{point.body}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export default WhyUs;
