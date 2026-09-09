import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import type { Plant } from '@/types';
import PageLoader from '@/components/ui/PageLoader';
import Icon from '@/components/ui/Icon';
import Lightbox from '@/components/ui/Lightbox';
import PlantGallery from '@/components/plants/PlantGallery';
import PlantGrid from '@/components/plants/PlantGrid';
import EmptyState from '@/components/ui/EmptyState';
import WhatsAppButton from '@/components/ui/WhatsAppButton';
import Reveal from '@/components/ui/Reveal';
import { useAsync } from '@/hooks/useAsync';
import { useSeo } from '@/hooks/useSeo';
import plantService from '@/services/plantService';
import { getCategoryName } from '@/data/categories';
import {
  availabilityClass, availabilityLabel, careLabel, formatPrice, sunlightLabel, waterLabel,
} from '@/lib/format';
import { CUSTOMER_SERVICE } from '@/config/businessConfig';

const placementLabels: Record<string, string> = {
  home: 'Home',
  office: 'Office',
  balcony: 'Balcony',
  terrace: 'Terrace',
  garden: 'Garden',
};

export default function PlantDetail() {
  const { slug = '' } = useParams();
  const { data: plant, loading, error } = useAsync(() => plantService.get(slug), [slug]);
  const [activeImage, setActiveImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [related, setRelated] = useState<Plant[]>([]);

  useEffect(() => setActiveImage(0), [slug]);

  useEffect(() => {
    if (!plant) return;
    let active = true;
    plantService.related(plant, 4).then((list) => active && setRelated(list));
    return () => { active = false; };
  }, [plant]);

  useSeo({
    title: plant?.name ?? 'Plant',
    description: plant
      ? `${plant.name}${plant.botanicalName ? ` (${plant.botanicalName})` : ''} — ${plant.description} Available from Oxygen Nursery, Chandshi, Nashik.`
      : undefined,
  });

  if (loading) return <PageLoader />;

  if (error || !plant) {
    return (
      <div className="section container container--narrow" style={{ paddingTop: 'calc(var(--header-h) + 3rem)' }}>
        <EmptyState
          icon="alert"
          title="We couldn't find that plant"
          message="It may have been renamed or removed from the catalogue."
          action={<Link to="/plants" className="btn btn--primary">Back to all plants</Link>}
        />
      </div>
    );
  }

  const price = formatPrice(plant.price, plant.priceUnit);
  const unavailable = plant.availability === 'unavailable';

  return (
    <>
      <div className="plant-detail">
        <div className="container container--wide">
          <nav className="crumbs crumbs--light" aria-label="Breadcrumb">
            <ol>
              <li><Link to="/">Home</Link></li>
              <li><Icon name="chevron-right" size={13} /><Link to="/plants">Plants</Link></li>
              <li>
                <Icon name="chevron-right" size={13} />
                <Link to={`/plants?category=${plant.category}`}>{getCategoryName(plant.category)}</Link>
              </li>
              <li><Icon name="chevron-right" size={13} /><span aria-current="page">{plant.name}</span></li>
            </ol>
          </nav>

          <div className="plant-detail__grid">
            {/* ----------------------------------------------------------------
               Gallery and info arrive as one composition: the plant opens
               outward first, its details follow in from the side a beat later.
               ---------------------------------------------------------------- */}
            <Reveal variant="bloom" className="plant-gallery">
              <PlantGallery
                images={plant.images}
                caption={plant.name}
                onExpand={(i) => { setActiveImage(i); setLightboxOpen(true); }}
              />
            </Reveal>

            {/* ---------------- Info ---------------- */}
            <Reveal variant="drift-right" delay={140} className="plant-info">
              <div className="plant-info__badges">
                <span className={`badge ${availabilityClass[plant.availability]}`}>
                  <span className="badge__dot" />{availabilityLabel[plant.availability]}
                </span>
                {plant.newArrival && <span className="badge badge--new">New Arrival</span>}
                <Link to={`/plants?category=${plant.category}`} className="badge badge--outline">
                  {getCategoryName(plant.category)}
                </Link>
              </div>

              <h1>{plant.name}</h1>
              {plant.botanicalName && <p className="plant-info__botanical">{plant.botanicalName}</p>}
              <p className="lede">{plant.description}</p>
              {plant.longDescription && <p>{plant.longDescription}</p>}

              {price && <p className="plant-info__price">{price}</p>}

              <ul className="spec-tiles">
                <li><span><Icon name="sun" size={19} /></span><b>Sunlight</b><em>{sunlightLabel[plant.sunlight]}</em></li>
                <li><span><Icon name="droplet" size={19} /></span><b>Watering</b><em>{waterLabel[plant.water]}</em></li>
                <li><span><Icon name="leaf" size={19} /></span><b>Care level</b><em>{careLabel[plant.careLevel]}</em></li>
                {plant.matureSize && (
                  <li><span><Icon name="tree" size={19} /></span><b>Mature size</b><em>{plant.matureSize}</em></li>
                )}
              </ul>

              <dl className="plant-specs">
                <div><dt><Icon name="layers" size={17} /> Soil</dt><dd>{plant.soil}</dd></div>
                <div>
                  <dt><Icon name="home" size={17} /> Recommended placement</dt>
                  <dd>{plant.placements.map((pl) => placementLabels[pl] ?? pl).join(', ')}</dd>
                </div>
                {plant.botanicalName && (
                  <div><dt><Icon name="sparkle" size={17} /> Botanical name</dt><dd><i>{plant.botanicalName}</i></dd></div>
                )}
              </dl>

              {unavailable && (
                <div className="notice notice--warn">
                  <Icon name="alert" size={18} />
                  <div>
                    <strong>This plant is currently unavailable.</strong>
                    <p>Ask us about availability — stock changes with the season and we can let you know when it returns.</p>
                  </div>
                </div>
              )}

              <div className="plant-info__cta">
                <WhatsAppButton
                  size="lg"
                  label={unavailable ? 'Ask us about availability' : 'Enquire on WhatsApp'}
                  context={
                    unavailable
                      ? { kind: 'plant-availability', plantName: plant.name }
                      : { kind: 'plant', plantName: plant.name }
                  }
                />
                <Link to="/book" className="btn btn--secondary btn--lg">
                  <Icon name="calendar" size={18} /> Book a Consultation
                </Link>
              </div>
              <p className="plant-info__service muted">
                <Icon name="headset" size={15} /> {CUSTOMER_SERVICE.label}
              </p>

              {plant.tags.length > 0 && (
                <ul className="plant-info__tags">
                  {plant.tags.map((tag) => (
                    <li key={tag} className="badge badge--soft">{tag.replace(/-/g, ' ')}</li>
                  ))}
                </ul>
              )}
            </Reveal>
          </div>
        </div>
      </div>

      {/* ---------------- Care instructions ---------------- */}
      {plant.careNotes && plant.careNotes.length > 0 && (
        <section className="section section--alt" aria-labelledby="plant-care-title">
          <div className="container container--wide">
            <Reveal>
              <span className="eyebrow">Plant Care</span>
              <h2 id="plant-care-title">Caring for your {plant.name}</h2>
            </Reveal>
            <div className="grid cols-3 care-notes">
              {plant.careNotes.map((note, i) => (
                <Reveal key={note} delay={i * 60}>
                  <article className="care-note">
                    <span className="care-note__num">{String(i + 1).padStart(2, '0')}</span>
                    <p>{note}</p>
                  </article>
                </Reveal>
              ))}
            </div>
            <div className="row" style={{ marginTop: 'var(--space-6)' }}>
              <Link to="/plant-care" className="link-arrow">
                Read the full plant care guide <Icon name="arrow-right" size={17} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ---------------- Related ---------------- */}
      {related.length > 0 && (
        <section className="section" aria-labelledby="related-title">
          <div className="container container--wide">
            <div className="spread section-head-row">
              <div className="section-head">
                <span className="eyebrow">You may also like</span>
                <h2 id="related-title">Related Plants</h2>
              </div>
              <Link to="/plants" className="btn btn--secondary section-head-row__action">
                View all plants <Icon name="arrow-right" size={17} />
              </Link>
            </div>
            <PlantGrid plants={related} />
          </div>
        </section>
      )}

      {lightboxOpen && (
        <Lightbox
          images={plant.images}
          index={activeImage}
          caption={`${plant.name}${plant.botanicalName ? ` — ${plant.botanicalName}` : ''}`}
          onClose={() => setLightboxOpen(false)}
          onNavigate={setActiveImage}
        />
      )}
    </>
  );
}
