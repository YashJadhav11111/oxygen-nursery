import { BRAND } from '@/config/businessConfig';

/** Shown while a lazily-loaded route chunk arrives. */
export function PageLoader() {
  return (
    <div className="page-loader" role="status" aria-live="polite">
      <img src={BRAND.logoMark} alt="" aria-hidden="true" className="page-loader__mark" />
      <span className="page-loader__bar" aria-hidden="true" />
      <span className="sr-only">Loading page</span>
    </div>
  );
}

export default PageLoader;
