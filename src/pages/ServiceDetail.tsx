import { Link, useParams } from 'react-router-dom';
import PageHeader from '@/components/ui/PageHeader';
import EmptyState from '@/components/ui/EmptyState';
import Icon, { type IconName } from '@/components/ui/Icon';
import SmartImage from '@/components/ui/SmartImage';
import DepthMedia from '@/components/ui/DepthMedia';
import Reveal from '@/components/ui/Reveal';
import ServiceCard from '@/components/services/ServiceCard';
import WhatsAppButton from '@/components/ui/WhatsAppButton';
import { serviceBySlug, services } from '@/data/services';
import { projects } from '@/data/projects';
import ProjectGallery from '@/components/projects/ProjectGallery';
import { useSeo } from '@/hooks/useSeo';

export default function ServiceDetail() {
  const { slug = '' } = useParams();
  const service = serviceBySlug(slug);

  useSeo({
    title: service?.name ?? 'Service',
    description: service?.shortDescription,
  });

  if (!service) {
    return (
      <div className="section container container--narrow" style={{ paddingTop: 'calc(var(--header-h) + 3rem)' }}>
        <EmptyState
          icon="alert"
          title="We couldn't find that service"
          action={<Link to="/services" className="btn btn--primary">See all services</Link>}
        />
      </div>
    );
  }

  const relatedProjects = projects.filter((p) => p.services.includes(service.name));
  const otherServices = services.filter((s) => s.id !== service.id && s.group === service.group).slice(0, 3);

  return (
    <>
      <PageHeader
        eyebrow="Service"
        title={service.name}
        description={service.shortDescription}
        crumbs={[{ label: 'Services', to: '/services' }, { label: service.name }]}
        scene={service.image.scene}
        seed={service.image.seed}
        actions={
          <>
            <Link to={`/book?service=${encodeURIComponent(service.name)}`} className="btn btn--primary">
              <Icon name="calendar" size={18} /> Book a Consultation
            </Link>
            <WhatsAppButton
              variant="light"
              label="Enquire on WhatsApp"
              context={{ kind: 'service', serviceName: service.name }}
            />
          </>
        }
      />

      <section className="section">
        <div className="container container--wide service-detail">
          <Reveal variant="drift-left" className="service-detail__body">
            <span className="eyebrow"><Icon name={service.icon as IconName} size={15} /> What this covers</span>
            <h2>{service.name}</h2>
            <p className="lede">{service.description}</p>

            <h3>What's included</h3>
            <ul className="tick-list">
              {service.highlights.map((h) => (
                <li key={h}><Icon name="check" size={16} /> {h}</li>
              ))}
            </ul>

            {service.examples && (
              <>
                <h3>Themes we develop</h3>
                <ul className="tick-list tick-list--star">
                  {service.examples.map((ex) => (
                    <li key={ex}><Icon name="star" size={15} /> {ex}</li>
                  ))}
                </ul>
              </>
            )}

            <div className="service-detail__cta">
              <Link to={`/book?service=${encodeURIComponent(service.name)}`} className="btn btn--primary btn--lg">
                Book a Consultation
              </Link>
              <WhatsAppButton
                size="lg"
                variant="whatsapp-outline"
                label="Ask a question"
                context={{ kind: 'service', serviceName: service.name }}
              />
            </div>
          </Reveal>

          <Reveal variant="rise" className="service-detail__aside" delay={100}>
            {/* The one large image on this page uncovers itself rather than
                fading in — a mask opening left to right. */}
            <Reveal variant="sweep" delay={220}>
              <DepthMedia className="service-detail__image">
                <SmartImage image={service.image} ratio="ratio-4-3" showDemoTag />
              </DepthMedia>
            </Reveal>
            <div className="service-detail__card">
              <h3>Not sure where to start?</h3>
              <p className="muted">
                Send us a photograph of the space on WhatsApp and we will tell you what is realistic.
              </p>
              <WhatsAppButton
                block
                label="Send a photo on WhatsApp"
                context={{
                  kind: 'custom',
                  message: `Hello Oxygen Nursery, I would like to enquire about ${service.name}. I am sending a photo of the space.`,
                }}
              />
            </div>
          </Reveal>
        </div>
      </section>

      {relatedProjects.length > 0 && (
        <section className="section section--alt" aria-labelledby="service-projects">
          <div className="container container--wide">
            <div className="section-head">
              <span className="eyebrow">Sample Work</span>
              <h2 id="service-projects">Projects involving {service.name}</h2>
            </div>
            <ProjectGallery projects={relatedProjects} showFilters={false} />
          </div>
        </section>
      )}

      {otherServices.length > 0 && (
        <section className="section">
          <div className="container container--wide">
            <div className="section-head">
              <span className="eyebrow">Related</span>
              <h2>Other services</h2>
            </div>
            <div className="grid cols-3">
              {otherServices.map((s) => <ServiceCard key={s.id} service={s} />)}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
