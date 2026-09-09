import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import type { CareCategory } from '@/types';
import PageHeader from '@/components/ui/PageHeader';
import SmartImage from '@/components/ui/SmartImage';
import Reveal from '@/components/ui/Reveal';
import Icon from '@/components/ui/Icon';
import EmptyState from '@/components/ui/EmptyState';
import WhatsAppButton from '@/components/ui/WhatsAppButton';
import { careCategories, plantCareGuides } from '@/data/plantCare';
import { useSeo } from '@/hooks/useSeo';

export default function PlantCare() {
  const [params, setParams] = useSearchParams();
  const topic = params.get('topic') as CareCategory | null;

  useSeo({
    title: 'Plant Care Guide',
    description:
      'Practical plant care guides from Oxygen Nursery — watering, sunlight, soil, feeding, pruning, pest care and seasonal care for indoor and outdoor plants.',
  });

  const guides = useMemo(
    () => (topic ? plantCareGuides.filter((g) => g.category === topic) : plantCareGuides),
    [topic],
  );

  const setTopic = (value: CareCategory | null) => {
    const next = new URLSearchParams(params);
    if (value) next.set('topic', value);
    else next.delete('topic');
    setParams(next);
  };

  return (
    <>
      <PageHeader
        eyebrow="Plant Care"
        title="Learn How To Care For Your Plants"
        description="Short, practical guides written for real homes and gardens. No jargon, no unsupported claims."
        crumbs={[{ label: 'Plant Care' }]}
        scene="sprout"
        seed="care-page"
      />

      <section className="section section--tight">
        <div className="container container--wide">
          <div className="filter-row" role="group" aria-label="Filter guides by topic">
            <button className="chip" aria-pressed={!topic} onClick={() => setTopic(null)}>
              All topics
            </button>
            {careCategories.map((category) => (
              <button
                key={category.id}
                className="chip"
                aria-pressed={topic === category.id}
                onClick={() => setTopic(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>

          {guides.length === 0 ? (
            <EmptyState
              icon="leaf"
              title="No guides on this topic yet"
              message="We are adding to the library. In the meantime, ask us directly — we are happy to help."
              action={
                <>
                  <button className="btn btn--secondary" onClick={() => setTopic(null)}>Show all guides</button>
                  <WhatsAppButton label="Ask a plant care question" />
                </>
              }
            />
          ) : (
            <div className="grid cols-3">
              {guides.map((guide, i) => (
                <Reveal key={guide.id} delay={Math.min(i, 5) * 60}>
                  <article className="guide-card card card--hover">
                    <Link to={`/plant-care/${guide.slug}`} className="guide-card__link">
                      <SmartImage image={guide.coverImage} ratio="ratio-16-9" />
                      <div className="card__body">
                        <div className="guide-card__meta">
                          <span className="badge badge--soft">
                            {careCategories.find((c) => c.id === guide.category)?.name}
                          </span>
                          <span className="muted">
                            <Icon name="clock" size={14} /> {guide.readingMinutes} min read
                          </span>
                        </div>
                        <h2 className="guide-card__title">{guide.title}</h2>
                        <p className="muted">{guide.summary}</p>
                        <span className="link-arrow">Read guide <Icon name="arrow-right" size={16} /></span>
                      </div>
                    </Link>
                  </article>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="section section--alt">
        <div className="container container--narrow text-center">
          <span className="eyebrow" style={{ justifyContent: 'center' }}>Talk to our team</span>
          <h2>Still not sure what your plant needs?</h2>
          <p className="lede">
            Send us a photograph on WhatsApp. It is usually quicker than reading three articles.
          </p>
          <div className="row" style={{ justifyContent: 'center', marginTop: 'var(--space-5)' }}>
            <WhatsAppButton size="lg" label="Ask a plant care question" />
            <Link to="/plants" className="btn btn--secondary btn--lg">Browse plants</Link>
          </div>
        </div>
      </section>
    </>
  );
}
