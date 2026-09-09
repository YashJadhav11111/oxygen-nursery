/** Loading placeholders that match the shape of the real content. */
export function SkeletonCard() {
  return (
    <div className="card skeleton-card" aria-hidden="true">
      <div className="skeleton skeleton--media ratio-4-3" />
      <div className="card__body">
        <div className="skeleton skeleton--line" style={{ width: '40%' }} />
        <div className="skeleton skeleton--line" style={{ width: '75%', height: 20 }} />
        <div className="skeleton skeleton--line" style={{ width: '95%' }} />
        <div className="skeleton skeleton--line" style={{ width: '60%' }} />
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 8, className = 'cols-4' }: { count?: number; className?: string }) {
  return (
    <div className={`grid ${className}`} aria-busy="true" aria-label="Loading">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export default SkeletonGrid;
