/**
 * businessConfig.ts
 * ---------------------------------------------------------------------------
 * SINGLE SOURCE OF TRUTH for every business detail on the website.
 * Change a phone number, address, logo or social link here and it updates
 * everywhere — navbar, footer, WhatsApp links, contact page, SEO metadata.
 *
 * Nothing else in the codebase should hardcode a phone number or address.
 * ---------------------------------------------------------------------------
 */

export interface PhoneNumber {
  /** Digits only, as dialled locally. */
  local: string;
  /** Full international format used for tel: and wa.me links. */
  international: string;
  label?: string;
}

export const BUSINESS_NAME = 'Oxygen Nursery';
export const TAGLINE = 'Green Begins With Us.';

export const ADDRESS = {
  line1: 'Chandshi',
  city: 'Nashik',
  state: 'Maharashtra',
  country: 'India',
  postalCode: '', // add when available
  get full() {
    return [this.line1, this.city, this.state].filter(Boolean).join(', ');
  },
};

export const PHONE_NUMBERS: PhoneNumber[] = [
  { local: '8888453354', international: '918888453354', label: 'Primary' },
  { local: '7972453354', international: '917972453354', label: 'Alternate' },
];

/** The number all WhatsApp deep links point at. */
export const WHATSAPP_NUMBER = '918888453354';

export const CUSTOMER_SERVICE = {
  availability: '24/7',
  label: '24/7 Customer Service',
  note: 'Customer service is available 24/7. Nursery visiting hours may differ — please call ahead.',
};

/**
 * Replace with the exact Google Maps place URL / embed once confirmed.
 * `embedUrl` empty => the Contact page renders a graceful placeholder card
 * instead of an iframe, so nothing looks broken.
 */
export const GOOGLE_MAPS = {
  /** Opens Google Maps directions with a text query. Safe without coordinates. */
  directionsUrl:
    'https://www.google.com/maps/dir/?api=1&destination=' +
    encodeURIComponent('Oxygen Nursery, Chandshi, Nashik, Maharashtra'),
  placeUrl: '',
  /** e.g. 'https://www.google.com/maps/embed?pb=...' */
  embedUrl: '',
};

export const BRAND = {
  /** Official Oxygen Nursery logo — full lockup (mark + wordmark + tagline). */
  logoFull: '/brand/logo-full.png',
  /** Official Oxygen Nursery logo — compact "ON" monogram for tight spaces. */
  logoMark: '/brand/logo-mark.png',
  favicon: '/favicon-64.png',
  appleTouchIcon: '/apple-touch-icon.png',
  alt: 'Oxygen Nursery — Green Begins With Us.',
  /**
   * The logo is drawn in deep evergreen on a light ground. It is never
   * recoloured, inverted or distorted; on dark sections the UI places it on a
   * soft white tile instead (see .brand-tile in components.css).
   */
  needsLightBacking: true,
};

/** Placeholder social links. Disabled in the UI until real URLs are supplied. */
export const SOCIAL_LINKS: { name: string; url: string | null; icon: string }[] = [
  { name: 'Instagram', url: null, icon: 'instagram' },
  { name: 'Facebook', url: null, icon: 'facebook' },
  { name: 'YouTube', url: null, icon: 'youtube' },
];

export const SEO = {
  siteUrl: '', // set once the domain is live, e.g. https://oxygennursery.in
  defaultTitle: 'Oxygen Nursery | Plants, Gardening & Landscaping in Nashik',
  titleTemplate: '%s | Oxygen Nursery',
  defaultDescription:
    'Oxygen Nursery in Chandshi, Nashik supplies indoor, outdoor, flowering and fruit plants and provides gardening, landscape designing, garden development and green-space solutions. 24/7 customer service.',
};

export const businessConfig = {
  BUSINESS_NAME,
  TAGLINE,
  ADDRESS,
  PHONE_NUMBERS,
  WHATSAPP_NUMBER,
  CUSTOMER_SERVICE,
  GOOGLE_MAPS,
  BRAND,
  SOCIAL_LINKS,
  SEO,
};

export default businessConfig;
