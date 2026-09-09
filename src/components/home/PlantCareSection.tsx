import { Link } from 'react-router-dom';
import SectionHead from '@/components/ui/SectionHead';
import Reveal from '@/components/ui/Reveal';
import Icon, { type IconName } from '@/components/ui/Icon';
import { careCategories } from '@/data/plantCare';

export function PlantCareSection() {
  return (
    <section className="section" aria-labelledby="care-title">
      <div className="container container--wide">
        <SectionHead
          center
          eyebrow="Plant Care"
          title="Learn How To Care For Your Plants"
          description="Short, practical guides written for real homes and gardens — not laboratory conditions."
        />

        <div className="care-grid">
          {careCategories.map((category, i) => (
            <Reveal key={category.id} variant="bloom" delay={Math.min(i, 7) * 48}>
              <Link to={`/plant-care?topic=${category.id}`} className="care-card">
                <span className="care-card__icon"><Icon name={category.icon as IconName} size={22} /></span>
                <span className="care-card__name">{category.name}</span>
                <span className="care-card__blurb">{category.blurb}</span>
              </Link>
            </Reveal>
          ))}
        </div>

        <Reveal className="row" >
          <div className="care-cta">
            <Link to="/plant-care" className="btn btn--primary btn--lg">
              Explore Plant Care Guide <Icon name="arrow-right" size={18} />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default PlantCareSection;
