import { useState } from 'react';
import type { PlantImage } from '@/types';
import SmartImage from './SmartImage';

interface Props {
  before: PlantImage;
  after: PlantImage;
  label?: string;
}

/**
 * Before / after comparison.
 * The handle is a real range input, so it works with a mouse, a finger, and
 * the arrow keys, and screen readers announce it correctly.
 */
export function BeforeAfter({ before, after, label = 'Before and after comparison' }: Props) {
  const [position, setPosition] = useState(50);

  return (
    <figure className="ba">
      <div className="ba__frame">
        <div className="ba__layer">
          <SmartImage image={after} ratio="ratio-4-3" />
          <span className="ba__tag ba__tag--after">After</span>
        </div>
        <div className="ba__layer ba__layer--clip" style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}>
          <SmartImage image={before} ratio="ratio-4-3" />
          <span className="ba__tag ba__tag--before">Before</span>
        </div>
        <div className="ba__handle" style={{ left: `${position}%` }} aria-hidden="true">
          <span className="ba__grip">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <path d="m9 6-4 6 4 6M15 6l4 6-4 6" />
            </svg>
          </span>
        </div>
        <input
          className="ba__range"
          type="range"
          min={0}
          max={100}
          value={position}
          onChange={(e) => setPosition(Number(e.target.value))}
          aria-label={label}
          aria-valuetext={`${position}% of the before image visible`}
        />
      </div>
      <figcaption className="ba__caption muted">Drag the handle, or use the arrow keys, to compare.</figcaption>
    </figure>
  );
}

export default BeforeAfter;
