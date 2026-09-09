import { Link } from 'react-router-dom';
import SectionHead from '@/components/ui/SectionHead';
import Reveal from '@/components/ui/Reveal';
import Icon from '@/components/ui/Icon';
import SectionEdge from '@/components/ui/SectionEdge';
import ServiceCard from '@/components/services/ServiceCard';
import { services } from '@/data/services';

export function ServicesSection() {
  const gardenServices = services.filter((s) => s.group !== 'green-solutions');

  return (
    <section className="section section--paper" aria-labelledby="services-title">
      <SectionEdge position="top" fill="var(--forest-900)" variant="ridge" />
      <div className="container container--wide">
        <div className="spread section-head-row">
          <SectionHead
            eyebrow="What We Do"
            title="Gardening &amp; Landscaping Services"
            description="Plant supply and complete garden work — designed, built and maintained."
          />
          <Link to="/services" className="btn btn--secondary section-head-row__action">
            All Services <Icon name="arrow-right" size={17} />
          </Link>
        </div>

        <div className="grid cols-3">
          {gardenServices.slice(0, 6).map((service, i) => (
            <Reveal key={service.id} delay={Math.min(i, 5) * 60}>
              <ServiceCard service={service} />
            </Reveal>
          ))}
        </div>

        <div className="service-strip">
          {gardenServices.slice(6).map((service, i) => (
            <Reveal key={service.id} delay={Math.min(i, 5) * 50}>
              <ServiceCard service={service} variant="compact" />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ServicesSection;
