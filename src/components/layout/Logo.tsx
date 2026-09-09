import { Link } from 'react-router-dom';
import { BRAND, BUSINESS_NAME, TAGLINE } from '@/config/businessConfig';

interface Props {
  variant?: 'mark' | 'lockup' | 'full';
  /** On dark backgrounds the mark sits on a light tile — the logo is never recoloured. */
  onDark?: boolean;
  className?: string;
  linkTo?: string | null;
}

/**
 * The official Oxygen Nursery logo, used as supplied.
 * It is never redrawn, recoloured or distorted. Because the artwork is deep
 * evergreen on a light ground, dark sections place it on a soft light tile
 * rather than inverting it.
 */
export function Logo({ variant = 'lockup', onDark = false, className = '', linkTo = '/' }: Props) {
  const content =
    variant === 'full' ? (
      <img
        src={BRAND.logoFull}
        alt={BRAND.alt}
        className="logo__full"
        width={760}
        height={642}
        loading="lazy"
      />
    ) : (
      <>
        <span className={`logo__tile ${onDark ? 'logo__tile--dark-bg' : ''}`}>
          <img src={BRAND.logoMark} alt="" aria-hidden="true" width={520} height={284} />
        </span>
        {variant === 'lockup' && (
          <span className="logo__words">
            <strong>{BUSINESS_NAME}</strong>
            <em>{TAGLINE}</em>
          </span>
        )}
      </>
    );

  const className_ = `logo logo--${variant} ${onDark ? 'logo--on-dark' : ''} ${className}`;

  if (!linkTo) return <span className={className_}>{content}</span>;

  return (
    <Link to={linkTo} className={className_} aria-label={`${BUSINESS_NAME} — home`}>
      {content}
    </Link>
  );
}

export default Logo;
