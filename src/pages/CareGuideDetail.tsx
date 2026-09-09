import { Link, useParams } from 'react-router-dom';
import PageHeader from '@/components/ui/PageHeader';
import EmptyState from '@/components/ui/EmptyState';
import Icon from '@/components/ui/Icon';
import SmartImage from '@/components/ui/SmartImage';
import DepthMedia from '@/components/ui/DepthMedia';
import WhatsAppButton from '@/components/ui/WhatsAppButton';
import Reveal from '@/components/ui/Reveal';
import { careCategories, guideBySlug, plantCareGuides } from '@/data/plantCare';
import { useSeo } from '@/hooks/useSeo';

export default function CareGuideDetail() {
  const { slug = '' } = useParams();
  const guide = guideBySlug(slug);

  useSeo({ title: guide?.title ?? 'Plant Care Guide', description: guide?.summary });

  if (!guide) {
    return (
      <div className="section container container--narrow" style={{ paddingTop: 'calc(var(--header-h) + 3rem)' }}>
        <EmptyState
          icon="alert"
          title="We couldn't find that guide"
          action={<Link to="/plant-care" className="btn btn--primary">Back to plant care</Link>}
        />
      </div>
    );
  }

  const categoryName = careCategories.find((c) => c.id === guide.category)?.name ?? guide.category;
  const more = plantCareGuides.filter((g) => g.id !== guide.id).slice(0, 3);

  return (
    <>
      <PageHeader
        eyebrow={categoryName}
        title={guide.title}
        description={guide.summary}
        crumbs={[{ label: 'Plant Care', to: '/plant-care' }, { label: guide.title }]}
        scene={guide.coverImage.scene}
        seed={guide.coverImage.seed}
      />

      <article className="section">
        <div className="container container--narrow">
          <div className="guide-meta">
            <span className="badge badge--soft">{categoryName}</span>
            <span className="badge badge--outline">{guide.difficulty}</span>
            <span className="muted"><Icon name="clock" size={14} /> {guide.readingMinutes} min read</span>
          </div>

          {/* The guide's cover uncovers itself through a mask as it arrives. */}
          <Reveal variant="sweep">
            <DepthMedia className="guide-hero">
              <SmartImage image={guide.coverImage} ratio="ratio-16-9" showDemoTag />
            </DepthMedia>
          </Reveal>

          <div className="prose">
            {guide.content.map((block, i) => (
              <Reveal key={block.heading} delay={i * 50}>
                <h2>{block.heading}</h2>
                <p>{block.body}</p>
                {block.points && (
                  <ul className="tick-list">
                    {block.points.map((point) => (
                      <li key={point}><Icon name="check" size={16} /> {point}</li>
                    ))}
                  </ul>
                )}
              </Reveal>
            ))}
          </div>

          <div className="guide-cta">
            <div>
              <h3>Have a question about your own plant?</h3>
              <p className="muted">Send us a photo — we will tell you what we would do.</p>
            </div>
            <WhatsAppButton
              label="Ask on WhatsApp"
              context={{ kind: 'care', guideTitle: guide.title }}
            />
          </div>

          <ul className="guide-tags">
            {guide.tags.map((tag) => <li key={tag} className="badge badge--soft">{tag}</li>)}
          </ul>
        </div>
      </article>

      {more.length > 0 && (
        <section className="section section--alt">
          <div className="container container--wide">
            <div className="section-head">
              <span className="eyebrow">Keep reading</span>
              <h2>More plant care guides</h2>
            </div>
            <div className="grid cols-3">
              {more.map((g) => (
                <article key={g.id} className="guide-card card card--hover">
                  <Link to={`/plant-care/${g.slug}`} className="guide-card__link">
                    <SmartImage image={g.coverImage} ratio="ratio-16-9" />
                    <div className="card__body">
                      <h3 className="guide-card__title">{g.title}</h3>
                      <p className="muted">{g.summary}</p>
                      <span className="link-arrow">Read guide <Icon name="arrow-right" size={16} /></span>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
