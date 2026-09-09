import { Link } from 'react-router-dom';
import SectionHead from '@/components/ui/SectionHead';
import Reveal from '@/components/ui/Reveal';
import SmartImage from '@/components/ui/SmartImage';
import Icon from '@/components/ui/Icon';
import { collections } from '@/data/collections';

/** Section 11 — seasonal collections, fully data-driven from /data/collections.ts */
export function Collections() {
  return (
    <section className="section" aria-labelledby="collections-title">
      <div className="container container--wide">
        <SectionHead
          eyebrow="Curated"
          title="Seasonal Collections"
          description="Groupings that change with the season and with what is doing well in the nursery."
        />

        <div className="collection-rail rail rail--cols-3">
          {collections.map((collection, i) => (
            <Reveal key={collection.id} variant="drift-right" delay={Math.min(i, 5) * 60} className="collection-rail__item rail__item">
              <Link
                to={`/plants?collection=${collection.id}`}
                className="collection-card zoom-parent"
                style={{ ['--accent' as string]: collection.accent }}
              >
                <SmartImage image={collection.image} ratio="ratio-4-3" />
                <span className="collection-card__body">
                  <span className="collection-card__tagline">{collection.tagline}</span>
                  <span className="collection-card__name">{collection.name}</span>
                  <span className="collection-card__desc">{collection.description}</span>
                  <span className="collection-card__go">
                    View collection <Icon name="arrow-right" size={15} />
                  </span>
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Collections;
