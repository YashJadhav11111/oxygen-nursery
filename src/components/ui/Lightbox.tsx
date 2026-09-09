import { useCallback, useEffect, useRef } from 'react';
import type { PlantImage } from '@/types';
import Icon from './Icon';
import SmartImage from './SmartImage';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';

interface Props {
  images: PlantImage[];
  index: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
  caption?: string;
}

/** Accessible image lightbox: Esc to close, arrow keys to move, focus returned on close. */
export function Lightbox({ images, index, onClose, onNavigate, caption }: Props) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);
  useBodyScrollLock(true);

  const go = useCallback(
    (delta: number) => onNavigate((index + delta + images.length) % images.length),
    [index, images.length, onNavigate],
  );

  useEffect(() => {
    previouslyFocused.current = document.activeElement as HTMLElement;
    dialogRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      previouslyFocused.current?.focus?.();
    };
  }, [go, onClose]);

  const image = images[index];
  if (!image) return null;

  return (
    <div className="lightbox" role="dialog" aria-modal="true" aria-label="Image viewer" onClick={onClose}>
      <div
        className="lightbox__inner"
        ref={dialogRef}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        <SmartImage image={image} ratio="ratio-16-9" className="lightbox__media" priority />
        <div className="lightbox__bar">
          <p>{caption ?? image.alt}</p>
          <span className="lightbox__count">{index + 1} / {images.length}</span>
        </div>
      </div>

      <button className="lightbox__close" onClick={onClose} aria-label="Close image viewer">
        <Icon name="close" size={22} />
      </button>
      {images.length > 1 && (
        <>
          <button
            className="lightbox__nav lightbox__nav--prev"
            onClick={(e) => { e.stopPropagation(); go(-1); }}
            aria-label="Previous image"
          >
            <Icon name="chevron-left" size={24} />
          </button>
          <button
            className="lightbox__nav lightbox__nav--next"
            onClick={(e) => { e.stopPropagation(); go(1); }}
            aria-label="Next image"
          >
            <Icon name="chevron-right" size={24} />
          </button>
        </>
      )}
    </div>
  );
}

export default Lightbox;
