import { Link } from 'react-router-dom';
import PageHeader from '@/components/ui/PageHeader';
import SectionHead from '@/components/ui/SectionHead';
import ServiceCard from '@/components/services/ServiceCard';
import Reveal from '@/components/ui/Reveal';
import Icon, { type IconName } from '@/components/ui/Icon';
import WhatsAppButton from '@/components/ui/WhatsAppButton';
import { services } from '@/data/services';
import { useSeo } from '@/hooks/useSeo';

export default function Services() {
  useSeo({
    title: 'Gardening & Landscaping Services',
    description:
      'Landscape designing, garden development, terrace and vertical gardens, lawn laying, irrigation, garden maintenance, Miyawaki plantation and green belt development in Nashik.',
  });

  const supply = services.filter((s) => s.group === 'supply');
  const gardening = services.filter((s) => s.group === 'gardening');
  const green = services.filter((s) => s.group === 'green-solutions');

  return (
    <>
      <PageHeader
        eyebrow="What We Do"
        title="Services"
        description="Plant supply, garden design and development, and larger ecological planting — handled end to end."
        crumbs={[{ label: 'Services' }]}
        scene="landscape"
        seed="services-page"
        actions={
          <>
            <Link to="/book" className="btn btn--primary">Book a Consultation</Link>
            <WhatsAppButton variant="whatsapp-outline" label="Enquire on WhatsApp" />
          </>
        }
      />

      <section className="section" aria-labelledby="supply-title">
        <div className="container container--wide">
          <SectionHead eyebrow="Supply" title="Plants &amp; Materials" as="h2" />
          <div className="grid cols-2">
            {supply.map((service, i) => (
              <Reveal key={service.id} delay={i * 70}><ServiceCard service={service} /></Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--alt" aria-labelledby="gardening-title">
        <div className="container container--wide">
          <SectionHead
            eyebrow="Gardening"
            title="Design, Build &amp; Maintain"
            description="From the first sketch of a layout to the routine that keeps it looking right."
          />
          <div className="grid cols-3">
            {gardening.map((service, i) => (
              <Reveal key={service.id} delay={Math.min(i, 5) * 60}><ServiceCard service={service} /></Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--deep" aria-labelledby="green-title">
        <div className="container container--wide">
          <SectionHead
            eyebrow="Green Solutions"
            title="Ecological &amp; Institutional Planting"
            description="Dense native forests, restoration work, industrial green belts and themed cultural plantations."
          />
          <div className="grid cols-2">
            {green.map((service, i) => (
              <Reveal key={service.id} delay={i * 70}>
                <article className="green-card green-card--flat">
                  <span className="green-card__icon"><Icon name={service.icon as IconName} size={22} /></span>
                  <h3>{service.name}</h3>
                  <p>{service.shortDescription}</p>
                  {service.examples && (
                    <ul className="green-card__example-chips">
                      {service.examples.map((ex) => <li key={ex} className="badge badge--outline">{ex}</li>)}
                    </ul>
                  )}
                  <Link to={`/services/${service.slug}`} className="link-arrow">
                    Learn More <Icon name="arrow-right" size={16} />
                  </Link>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="process-title">
        <div className="container">
          <SectionHead
            center
            eyebrow="How It Works"
            title="Plan Your Garden"
            description="A simple, predictable path from first conversation to a planted space."
          />
          <ol className="process">
            {[
              { icon: 'headset', title: 'Talk to us', body: 'Call, message on WhatsApp or book a consultation. Tell us about the space.' },
              { icon: 'compass', title: 'Site visit & plan', body: 'We look at light, soil, water and use, then propose a planting approach.' },
              { icon: 'shovel', title: 'Execution', body: 'Ground preparation, planting, irrigation and finishing, done in agreed phases.' },
              { icon: 'scissors', title: 'Aftercare', body: 'A care plan at handover, with optional scheduled maintenance visits.' },
            ].map((step, i) => (
              <Reveal as="li" key={step.title} delay={i * 80} className="process__step">
                <span className="process__num">{i + 1}</span>
                <span className="process__icon"><Icon name={step.icon as IconName} size={20} /></span>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
