/**
 * Shown in place of a plant photograph that does not exist yet.
 *
 * Deliberately NOT a drawing of the plant. A customer looking at a nursery
 * catalogue is trying to judge what will arrive in their pot, and an
 * illustration — however accurate — quietly answers that question with
 * something that is not the plant. This says plainly that the photograph is
 * still to come, and an admin can upload one at any time from Image
 * Management, at which point this disappears on its own.
 *
 * The background is an abstract leaf texture in the site's own palette. It is
 * ornament, not a depiction of any species.
 */
import { useId } from 'react';

interface Props {
  /** Plant name, so the tile still says what it stands for. */
  label: string;
  /** Smaller type and no caption, for thumbnails. */
  compact?: boolean;
}

export function PhotoPending({ label, compact = false }: Props) {
  // Each tile owns its pattern. Sharing one id across instances works until the
  // first tile unmounts on scroll and takes the pattern with it.
  const patternId = useId();

  return (
    <span className={`photo-pending ${compact ? 'photo-pending--compact' : ''}`} aria-hidden="true">
      <svg className="photo-pending__texture" viewBox="0 0 320 320" preserveAspectRatio="xMidYMid slice" focusable="false">
        <defs>
          {/* One leaf, tiled and rotated — a watermark, not a portrait. */}
          <pattern id={patternId} width="40" height="40" patternUnits="userSpaceOnUse" patternTransform="rotate(24)">
            <path
              d="M20 6c7 5 10 11 10 17s-4 11-10 11-10-5-10-11S13 11 20 6Z"
              fill="currentColor"
              opacity="0.5"
            />
            <path d="M20 8v25" stroke="currentColor" strokeWidth="0.9" opacity="0.35" fill="none" />
          </pattern>
        </defs>
        <rect width="320" height="320" fill={`url(#${patternId})`} />
      </svg>

      <span className="photo-pending__body">
        <svg className="photo-pending__mark" viewBox="0 0 24 24" fill="none" focusable="false">
          <path
            d="M4 17.5 8.4 13l3 3 3.6-4 5 5.5M3.5 5.5h17v13h-17z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="photo-pending__name">{label}</span>
        {!compact && <span className="photo-pending__note">Photograph coming soon</span>}
      </span>
    </span>
  );
}

export default PhotoPending;
