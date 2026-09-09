import { Link } from 'react-router-dom';
import Icon from '@/components/ui/Icon';
import SectionHead from '@/components/ui/SectionHead';
import PlantGrid from '@/components/plants/PlantGrid';
import { SkeletonGrid } from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import { useAsync } from '@/hooks/useAsync';
import plantService from '@/services/plantService';

export function FeaturedPlants() {
  const { data, loading, error } = useAsync(() => plantService.list({ featured: true, limit: 8 }), []);

  return (
    <section className="section section--alt" aria-labelledby="featured-title">
      <div className="container container--wide">
        <div className="spread section-head-row">
          <SectionHead
            eyebrow="The Collection"
            title="Explore Our Plants"
            description="A selection from the nursery — indoor foliage, flowering plants, fruit plants and garden trees."
          />
          <Link to="/plants" className="btn btn--secondary section-head-row__action">
            View All Plants <Icon name="arrow-right" size={17} />
          </Link>
        </div>

        {loading && <SkeletonGrid count={4} />}
        {error && !loading && (
          <EmptyState icon="alert" title="We couldn't load the plants" message={error} />
        )}
        {!loading && !error && data && data.length > 0 && <PlantGrid plants={data} rail />}
        {!loading && !error && data && data.length === 0 && (
          <EmptyState
            title="No featured plants right now"
            message="The full catalogue is still available to browse."
            action={<Link to="/plants" className="btn btn--primary">Browse all plants</Link>}
          />
        )}
      </div>
    </section>
  );
}

export default FeaturedPlants;
