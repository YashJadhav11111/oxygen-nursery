import { useCallback, useEffect, useRef, useState } from 'react';
import type { PlantImage } from '@/types';
import SmartImage from '@/components/ui/SmartImage';
import Icon from '@/components/ui/Icon';

interface Props {
  images: PlantImage[];
  caption: string;
  onExpand: (index: number) => void;
}

/**
 * The plant gallery.
 * The main viewport is a real horizontal scroll-snap track, so on a phone it is
 * swiped with a finger like any native gallery — no JS drag handling, no
 * fighting the browser. Thumbnails scroll it programmatically, and the active
 * one is derived from scroll position so the two never disagree.
 */
export function PlantGallery({ images, caption, onExpand }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const scrollTo = useCallback((index: number) => {
    const track = trackRef.current;
    if (!track) return;
    const slide = track.children[index] as HTMLElement | undefined;
    if (slide) track.scrollTo({ left: slide.offsetLeft - track.offsetLeft, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const i = Math.round(track.scrollLeft / Math.max(1, track.clientWidth));
        setActive(Math.min(images.length - 1, Math.max(0, i)));
      });
    };
    track.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      track.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frame);
    };
  }, [images.length]);

  return (
    <div className="gallery">
      <div className="gallery__stage">
        <div className="gallery__track" ref={trackRef} tabIndex={0} role="group" aria-roledescription="carousel" aria-label={`${caption} images`}>
          {images.map((image, i) => (
            <button
              key={i}
              className="gallery__slide"
              onClick={() => onExpand(i)}
              aria-label={`Open ${caption} image ${i + 1} of ${images.length} at full size`}
            >
              <SmartImage
                image={image}
                ratio="ratio-1-1"
                priority={i === 0}
                sizes="(max-width: 940px) 92vw, 560px"
              />
            </button>
          ))}
        </div>

        <button className="gallery__expand" onClick={() => onExpand(active)} aria-label="View full size">
          <Icon name="search" size={18} />
        </button>

        {images.length > 1 && (
          <>
            <button
              className="gallery__nav gallery__nav--prev"
              onClick={() => scrollTo(Math.max(0, active - 1))}
              disabled={active === 0}
              aria-label="Previous image"
            >
              <Icon name="chevron-left" size={20} />
            </button>
            <button
              className="gallery__nav gallery__nav--next"
              onClick={() => scrollTo(Math.min(images.length - 1, active + 1))}
              disabled={active === images.length - 1}
              aria-label="Next image"
            >
              <Icon name="chevron-right" size={20} />
            </button>
            <div className="gallery__dots" aria-hidden="true">
              {images.map((_, i) => (
                <span key={i} className={i === active ? 'is-active' : ''} />
              ))}
            </div>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="gallery__thumbs" role="group" aria-label="Choose an image">
          {images.map((image, i) => (
            <button
              key={i}
              className={`gallery__thumb ${i === active ? 'is-active' : ''}`}
              onClick={() => scrollTo(i)}
              aria-label={`Show image ${i + 1}`}
              aria-pressed={i === active}
            >
              <SmartImage image={image} ratio="ratio-1-1" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default PlantGallery;
