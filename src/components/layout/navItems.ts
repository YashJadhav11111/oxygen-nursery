export interface NavItem {
  label: string;
  to: string;
}

/** Primary navigation. Kept short on purpose — the navbar is not a sitemap. */
export const navItems: NavItem[] = [
  { label: 'Home', to: '/' },
  { label: 'Plants', to: '/plants' },
  { label: 'Services', to: '/services' },
  { label: 'Projects', to: '/projects' },
  { label: 'Plant Care', to: '/plant-care' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
];
