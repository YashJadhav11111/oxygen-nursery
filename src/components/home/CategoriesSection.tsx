import { Link } from 'react-router-dom';
import SectionHead from '@/components/ui/SectionHead';
import Reveal from '@/components/ui/Reveal';
import SmartImage from '@/components/ui/SmartImage';
import Icon from '@/components/ui/Icon';
import { categories } from '@/data/categories';

/** Each card deep-links into the Plants page with that filter already applied. */
export function CategoriesSection() {
  return (
    <section className="section" aria-labelledby="categories-title">
      <div className="container container--wide">
        <SectionHead
          center
          eyebrow="Browse By Type"
          title="Find the Right Kind of Plant"
          variant="settle"
          description="Ten categories covering everything we grow — pick one to jump straight into the catalogue."
        />

        <div className="category-grid">
          {categories.map((category, i) => (
            <Reveal key={category.id} variant="bloom" delay={Math.min(i, 9) * 50}>
              <Link to={`/plants?category=${category.id}`} className="category-card zoom-parent">
                <SmartImage image={category.image} ratio="ratio-3-4" />
                <span className="category-card__scrim" aria-hidden="true" />
                <span className="category-card__body">
                  <span className="category-card__name">{category.name}</span>
                  <span className="category-card__desc">{category.description}</span>
                  <span className="category-card__go">
                    Browse <Icon name="arrow-right" size={15} />
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

export default CategoriesSection;
