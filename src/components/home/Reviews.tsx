import SectionHead from '@/components/ui/SectionHead';
import Reveal from '@/components/ui/Reveal';
import StarRating from '@/components/ui/StarRating';
import Icon from '@/components/ui/Icon';
import { reviews } from '@/data/reviews';
import { formatDate } from '@/lib/format';

/**
 * Section 19 — Customer reviews.
 * Phase 1 entries are placeholders and are labelled as such on the page; the
 * site never presents demo content as a real customer review.
 */
export function Reviews() {
  const allDemo = reviews.every((r) => r.demo);

  return (
    <section className="section section--alt" aria-labelledby="reviews-title">
      <div className="container container--wide">
        <SectionHead
          center
          eyebrow="Reviews"
          title="What Customers Say"
          description={
            allDemo
              ? 'We are collecting reviews from our customers. The entries below are placeholders showing how they will appear.'
              : undefined
          }
        />

        {allDemo && (
          <p className="text-center" style={{ marginBottom: 'var(--space-6)' }}>
            <span className="demo-note">
              <Icon name="alert" size={14} /> Placeholder reviews — not real customer feedback
            </span>
          </p>
        )}

        <div className="grid cols-4">
          {reviews.map((review, i) => (
            <Reveal key={review.id} delay={Math.min(i, 4) * 60}>
              <article className={`review-card ${review.demo ? 'is-demo' : ''}`}>
                <StarRating rating={review.rating} label={`${review.rating} out of 5 stars`} />
                <p className="review-card__text">“{review.review}”</p>
                <footer className="review-card__meta">
                  <span className="review-card__name">
                    {review.name}
                    {review.verified && (
                      <span className="review-card__verified" title="Verified customer">
                        <Icon name="check-circle" size={14} /> Verified
                      </span>
                    )}
                  </span>
                  <span className="muted">
                    {review.location ? `${review.location} · ` : ''}{formatDate(review.date)}
                  </span>
                </footer>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Reviews;
