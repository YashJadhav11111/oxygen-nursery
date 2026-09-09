import { Link } from 'react-router-dom';
import SectionHead from '@/components/ui/SectionHead';
import Reveal from '@/components/ui/Reveal';
import Icon, { type IconName } from '@/components/ui/Icon';
import SceneArt from '@/components/ui/botanical/SceneArt';
import Parallax from '@/components/ui/Parallax';
import SectionEdge from '@/components/ui/SectionEdge';
import { greenSolutions } from '@/data/services';
import { whatsappProps } from '@/lib/whatsapp';

/** Section F — the larger ecological work, given its own visual treatment. */
export function GreenSolutions() {
  return (
    <section className="section green-solutions" aria-labelledby="green-title">
      <SectionEdge position="top" fill="var(--surface)" variant="canopy" />
      <Parallax speed={-0.14} scale={1.18} className="green-solutions__art" mobileFactor={0.3}>
        <SceneArt variant="miyawaki" seed="green-solutions-band" />
      </Parallax>
      <div className="green-solutions__scrim" aria-hidden="true" />

      <div className="container container--wide green-solutions__inner">
        <SectionHead
          eyebrow="Green Solutions"
          title="Planting at the Scale of a Landscape"
          description="Beyond gardens, we take on ecological and institutional planting — dense native forests, restoration, green belts and themed cultural plantations."
        />

        <div className="green-grid">
          {greenSolutions.map((service, i) => (
            <Reveal key={service.id} variant="drift-left" delay={i * 90}>
              <article className="green-card">
                <span className="green-card__icon"><Icon name={service.icon as IconName} size={22} /></span>
                <h3>{service.name}</h3>
                <p>{service.description}</p>

                {service.examples && (
                  <div className="green-card__examples">
                    <p className="green-card__examples-label">Themes we develop</p>
                    <ul>
                      {service.examples.map((ex) => (
                        <li key={ex}><Icon name="star" size={13} /> {ex}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="green-card__actions">
                  <Link to={`/services/${service.slug}`} className="link-arrow">
                    Learn More <Icon name="arrow-right" size={16} />
                  </Link>
                  <a
                    {...whatsappProps({ kind: 'service', serviceName: service.name })}
                    className="link-arrow link-arrow--wa"
                  >
                    <Icon name="whatsapp" size={16} /> Enquire
                  </a>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export default GreenSolutions;
