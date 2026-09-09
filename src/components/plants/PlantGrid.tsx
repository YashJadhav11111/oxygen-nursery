import type { Plant } from '@/types';
import PlantCard from './PlantCard';
import Reveal from '@/components/ui/Reveal';

interface Props {
  plants: Plant[];
  columns?: 'cols-3' | 'cols-4';
  animate?: boolean;
  /**
   * On small screens, lay the cards out as a horizontal, snap-scrolling rail
   * instead of a tall stack — so browsing plants on a phone is a swipe rather
   * than a long scroll. Reverts to a grid from 760px up.
   */
  rail?: boolean;
}

export function PlantGrid({ plants, columns = 'cols-4', animate = true, rail = false }: Props) {
  return (
    <div className={rail ? `rail rail--${columns}` : `grid ${columns}`}>
      {plants.map((plant, i) =>
        animate ? (
          <Reveal key={plant.id} variant="unfurl" delay={Math.min(i, 7) * 60} className="rail__item">
            <PlantCard plant={plant} priority={i < 4} />
          </Reveal>
        ) : (
          <div className="rail__item" key={plant.id}>
            <PlantCard plant={plant} priority={i < 4} />
          </div>
        ),
      )}
    </div>
  );
}

export default PlantGrid;
