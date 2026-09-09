import { useState } from 'react';
import { useInView } from '@/hooks/useInView';
import { useOnScreenClass } from '@/motion/useOnScreenClass';
import type { PlantImage } from '@/types';
import { plantPhotos } from '@/data/photos';
import SceneArt from './botanical/SceneArt';
import PhotoPending from './PhotoPending';

interface Props {
  image: PlantImage;
  /** Aspect-ratio helper class, e.g. "ratio-4-3". */
  ratio?: string;
  className?: string;
  /** Eager-load above-the-fold imagery only. */
  priority?: boolean;
  sizes?: string;
  /** Show a marker so illustrations are never mistaken for photographs. */
  showDemoTag?: boolean;
  tagLabel?: string;
  /**
   * Give this illustration a slow, continuous breath so the scene reads as
   * living rather than printed.
   *
   * Use it sparingly. A page where everything moves reads as noise, not life —
   * the effect only works because most of the imagery is still. The motion
   * pauses whenever the image is off screen, and never runs under reduced
   * motion. It has no effect on a photograph.
   */
  alive?: boolean;
  children?: React.ReactNode;
}

/**
 * SmartImage is the ONE place the site decides what to render for an image.
 *
 *   image.src present    → that photograph (lazy, responsive via srcSet)
 *   image.plant set      → that species' photograph from the manifest
 *   image.plant, no photo→ an explicit "photograph coming soon" state
 *   image.scene set      → an illustration of that kind of work
 *   photo fails to load  → the coming-soon state (plants) or the scene
 *                          illustration, so nothing ever breaks
 *
 * Plants and scenes are treated differently on purpose. An illustration of a
 * *service* — someone laying irrigation — is obviously a diagram of an idea.
 * An illustration of a *plant* sits where a customer expects the thing they
 * are buying, so plants never fall back to artwork.
 */
export function SmartImage({
  image, ratio = 'ratio-4-3', className = '', priority = false, sizes,
  showDemoTag = false, tagLabel = 'Illustration', alive = false, children,
}: Props) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // A bare plant slug (a collection tile, say) resolves to that plant's own
  // photograph, so adding photos lights those up with no further edits.
  const fromManifest = !image.src && image.plant ? plantPhotos[image.plant]?.[0] : undefined;
  const photo = image.src ? image : fromManifest;
  const usePhoto = Boolean(photo) && !failed;
  const isPlant = Boolean(image.plant);

  // Illustrations are inline SVG, so they are mounted only when near the
  // viewport. Photographs use the browser's own lazy loading instead.
  const { ref, inView } = useInView<HTMLDivElement>('600px', priority || usePhoto);
  // Continuous motion is gated on visibility, so it costs nothing once scrolled past.
  const liveRef = useOnScreenClass<HTMLSpanElement>('is-onscreen');

  return (
    <div ref={ref} className={`media ${ratio} ${className}`} data-loading={usePhoto && !loaded ? 'true' : 'false'}>
      {usePhoto && photo ? (
        <img
          src={photo.src}
          srcSet={photo.srcSet}
          alt={image.alt || photo.alt}
          sizes={sizes ?? '(max-width: 700px) 92vw, 460px'}
          loading={priority ? 'eager' : 'lazy'}
          decoding={priority ? 'sync' : 'async'}
          fetchPriority={priority ? 'high' : 'auto'}
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: photo.objectPosition,
          }}
        />
      ) : isPlant ? (
        <>
          <PhotoPending label={image.label ?? image.alt} />
          <span className="sr-only">{image.alt} — photograph coming soon</span>
        </>
      ) : (
        <>
          <span
            className={`media__art ${alive ? 'media__art--alive' : ''}`}
            ref={alive ? liveRef : undefined}
          >
            {inView && <SceneArt variant={image.scene ?? 'nursery'} seed={image.seed ?? image.alt} />}
          </span>
          <span className="sr-only">{image.alt}</span>
          {showDemoTag && <span className="media__tag">{tagLabel}</span>}
        </>
      )}
      {children}
    </div>
  );
}

export default SmartImage;
