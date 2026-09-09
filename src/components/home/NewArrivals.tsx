import { Link } from 'react-router-dom';
import SectionHead from '@/components/ui/SectionHead';
import PlantGrid from '@/components/plants/PlantGrid';
import { SkeletonGrid } from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import Icon from '@/components/ui/Icon';
import { useAsync } from '@/hooks/useAsync';
import plantService from '@/services/plantService';

/** Section 10 — driven entirely by `newArrival: true` in the plant data. */
export function NewArrivals() {
  const { data, loading, error } = useAsync(() => plantService.list({ newArrival: true, limit: 4 }), []);

  if (!loading && !error && (!data || data.length === 0)) return null;

  return (
    <section className="section section--paper" aria-labelledby="arrivals-title">
      <div className="container container--wide">
        <div className="spread section-head-row">
          <SectionHead
            eyebrow="Just In"
            title="Fresh Arrivals"
            description="Recently added to the nursery."
          />
          <Link to="/plants?new=true" className="btn btn--secondary section-head-row__action">
            See all new plants <Icon name="arrow-right" size={17} />
          </Link>
        </div>

        {loading && <SkeletonGrid count={4} />}
        {error && !loading && <EmptyState icon="alert" title="Couldn't load new arrivals" message={error} />}
        {!loading && data && data.length > 0 && <PlantGrid plants={data} rail />}
      </div>
    </section>
  );
}

export default NewArrivals;
