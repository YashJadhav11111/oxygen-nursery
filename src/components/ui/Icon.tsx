interface IconProps {
  name: IconName;
  size?: number;
  className?: string;
  strokeWidth?: number;
}

export type IconName =
  | 'leaf' | 'compass' | 'shovel' | 'grid' | 'building' | 'butterfly' | 'basket' | 'lawn'
  | 'droplet' | 'scissors' | 'forest' | 'seedling' | 'factory' | 'star' | 'sun' | 'layers'
  | 'sparkle' | 'bug' | 'home' | 'tree' | 'whatsapp' | 'phone' | 'calendar' | 'map-pin'
  | 'clock' | 'search' | 'sliders' | 'chevron-left' | 'chevron-right' | 'chevron-down'
  | 'close' | 'menu' | 'arrow-right' | 'check' | 'check-circle' | 'alert' | 'instagram'
  | 'facebook' | 'youtube' | 'shield' | 'sprout' | 'recycle' | 'award' | 'headset';

const paths: Record<IconName, JSX.Element> = {
  leaf: <><path d="M11 20A7 7 0 0 1 4 13c0-5 4-9 16-9 0 10-4 16-9 16Z" /><path d="M4 21c2.5-6 6-9.5 12-12" /></>,
  compass: <><circle cx="12" cy="12" r="9" /><path d="m15.5 8.5-2.2 5.3-5.3 2.2 2.2-5.3z" /></>,
  shovel: <><path d="M4 20 14 10" /><path d="M13 3h7v7" /><path d="M15 5 9.5 10.5" /><path d="M2 18a3.5 3.5 0 0 0 4 4l2-2-4-4Z" /></>,
  grid: <><rect x="3" y="3" width="7.5" height="7.5" rx="1.5" /><rect x="13.5" y="3" width="7.5" height="7.5" rx="1.5" /><rect x="3" y="13.5" width="7.5" height="7.5" rx="1.5" /><rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.5" /></>,
  building: <><path d="M4 21V6a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v15" /><path d="M15 10h3a2 2 0 0 1 2 2v9" /><path d="M2 21h20" /><path d="M8 8h3M8 12h3M8 16h3" /></>,
  butterfly: <><path d="M12 5v14" /><path d="M12 8C9 3 3 4 3 9c0 4 5 5 9 3" /><path d="M12 8c3-5 9-4 9 1 0 4-5 5-9 3" /><path d="M12 12c-3 5-8 5-8 1" /><path d="M12 12c3 5 8 5 8 1" /></>,
  basket: <><path d="m5 11 2-6M19 11l-2-6" /><path d="M3 11h18l-1.6 8a2 2 0 0 1-2 1.6H6.6a2 2 0 0 1-2-1.6z" /><path d="M9.5 15v2.5M14.5 15v2.5" /></>,
  lawn: <><path d="M3 20h18" /><path d="M5 20v-4M9 20v-6M13 20v-5M17 20v-7" /><path d="M5 16c-1.5-1-2-2.5-2-4M9 14c-2-1-2.5-3-2.5-5M13 15c1.8-1 2.5-3 2.5-5M17 13c2-1 2.5-3 2.5-5" /></>,
  droplet: <path d="M12 3s6 6.5 6 10.5A6 6 0 0 1 6 13.5C6 9.5 12 3 12 3Z" />,
  scissors: <><circle cx="6" cy="6" r="2.6" /><circle cx="6" cy="18" r="2.6" /><path d="M8 8l12 11M20 5 8 16" /></>,
  forest: <><path d="M7 15 3.5 15 7 9l3.5 6H7Z" /><path d="M7 11 4.5 11 7 6.5 9.5 11H7Z" /><path d="M7 15v5" /><path d="M17 16l-4 0 4-7 4 7h-4Z" /><path d="M17 12l-2.6 0L17 7.5 19.6 12H17Z" /><path d="M17 16v4" /><path d="M2 21h20" /></>,
  seedling: <><path d="M12 21v-8" /><path d="M12 13C12 9 9 7 5 7c0 4 3 6 7 6Z" /><path d="M12 13c0-3.5 3-5.5 7-5.5 0 3.5-3 5.5-7 5.5Z" /><path d="M6 21h12" /></>,
  factory: <><path d="M3 21V10l5 3.5V10l5 3.5V10l5 3.5V21" /><path d="M2 21h20" /><path d="M6 6V3h3v3" /><path d="M8 17h2M14 17h2" /></>,
  star: <path d="m12 3 2.6 5.7 6.2.7-4.6 4.2 1.3 6.1L12 16.7 6.5 19.7l1.3-6.1L3.2 9.4l6.2-.7z" />,
  sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M19.1 4.9l-1.8 1.8M6.7 17.3l-1.8 1.8" /></>,
  layers: <><path d="m12 3 9 5-9 5-9-5 9-5Z" /><path d="m3 13 9 5 9-5" /><path d="m3 17 9 5 9-5" /></>,
  sparkle: <><path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" /><path d="M18.5 16.5 19 18l1.5.5L19 19l-.5 1.5L18 19l-1.5-.5L18 18z" /></>,
  bug: <><path d="M8 8a4 4 0 0 1 8 0" /><rect x="7" y="8" width="10" height="11" rx="5" /><path d="M3 12h4M17 12h4M4 7l3 2M20 7l-3 2M4 18l3-2M20 18l-3-2M12 12v6" /></>,
  home: <><path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1z" /></>,
  tree: <><path d="M12 22v-6" /><path d="M12 16a6 6 0 0 0 0-12 6 6 0 0 0-2.4 11.5" /><path d="M12 16a5 5 0 0 1-5-5" /><path d="M8.5 22h7" /></>,
  whatsapp: <path d="M12.02 2a9.9 9.9 0 0 0-8.5 15L2 22l5.2-1.4A9.9 9.9 0 1 0 12.02 2Zm5.7 14.1c-.24.68-1.4 1.3-1.94 1.35-.5.05-1.13.07-1.82-.11a15.5 15.5 0 0 1-6.7-5.4c-.5-.7-1.1-1.8-1.1-2.9 0-1.1.58-1.65.79-1.88a.83.83 0 0 1 .6-.28h.43c.14 0 .33-.05.51.4l.7 1.7c.06.13.1.28 0 .45l-.28.42-.4.44c-.13.13-.27.28-.12.55.15.27.67 1.1 1.44 1.79.99.88 1.82 1.15 2.08 1.29.26.13.41.11.56-.07l.8-.93c.19-.23.35-.18.58-.1l1.65.78c.24.11.4.17.46.27.06.1.06.58-.18 1.26Z" strokeWidth="0" fill="currentColor" />,
  phone: <path d="M6.6 3h2.2l1.6 4-1.9 1.2a12.5 12.5 0 0 0 5.3 5.3L15 11.6l4 1.6v2.2A2.6 2.6 0 0 1 16.4 18 13.4 13.4 0 0 1 4 5.6 2.6 2.6 0 0 1 6.6 3Z" />,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="2.5" /><path d="M3 10h18M8 3v4M16 3v4" /></>,
  'map-pin': <><path d="M20 10c0 5.5-8 12-8 12s-8-6.5-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="2.8" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5.2l3.2 2" /></>,
  search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-3.6-3.6" /></>,
  sliders: <><path d="M4 6h16M4 12h16M4 18h16" /><circle cx="9" cy="6" r="2.2" /><circle cx="15" cy="12" r="2.2" /><circle cx="7" cy="18" r="2.2" /></>,
  'chevron-left': <path d="m15 5-7 7 7 7" />,
  'chevron-right': <path d="m9 5 7 7-7 7" />,
  'chevron-down': <path d="m6 9 6 6 6-6" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  'arrow-right': <><path d="M4 12h15" /><path d="m13 6 6 6-6 6" /></>,
  check: <path d="m5 13 4.5 4.5L19 7" />,
  'check-circle': <><circle cx="12" cy="12" r="9" /><path d="m8 12 2.8 2.8L16 9.5" /></>,
  alert: <><circle cx="12" cy="12" r="9" /><path d="M12 7.5v5.5M12 16.2v.2" /></>,
  instagram: <><rect x="3" y="3" width="18" height="18" rx="5.2" /><circle cx="12" cy="12" r="4" /><circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" strokeWidth="0" /></>,
  facebook: <path d="M14.5 8.5H17V5.4h-2.6c-2.3 0-3.9 1.6-3.9 4v2.1H8v3.1h2.5V21h3.2v-6.4H16l.5-3.1h-2.8V9.7c0-.8.4-1.2 1.3-1.2Z" />,
  youtube: <><rect x="2.5" y="5.5" width="19" height="13" rx="4" /><path d="m10.5 9.5 5 2.5-5 2.5z" /></>,
  shield: <><path d="M12 3 20 6v6c0 4.6-3.4 8.2-8 9.5-4.6-1.3-8-4.9-8-9.5V6Z" /><path d="m9 12 2.2 2.2L15.5 10" /></>,
  sprout: <><path d="M12 21v-7" /><path d="M12 14c-4 0-6-2-6-6 4 0 6 2 6 6Z" /><path d="M12 14c0-3.3 2-5.3 6-5.3 0 3.3-2 5.3-6 5.3Z" /></>,
  recycle: <><path d="m7 17-2.5.5L6 14" /><path d="M4.5 17.5A2.5 2.5 0 0 1 5 14l2-3.4" /><path d="m14 4.5 1.6 2.6 2.6-.6" /><path d="M13 4.2a2.5 2.5 0 0 1 3.4.9L18.5 9" /><path d="m10.5 20.5 2-2.5-2-2.5" /><path d="M20 13.5a2.5 2.5 0 0 1-2.2 4H12.5" /></>,
  award: <><circle cx="12" cy="9" r="5.5" /><path d="m8.5 13.5-1.3 7L12 18l4.8 2.5-1.3-7" /></>,
  headset: <><path d="M4 14v-2a8 8 0 0 1 16 0v2" /><rect x="2.5" y="13.5" width="4.5" height="6" rx="2" /><rect x="17" y="13.5" width="4.5" height="6" rx="2" /><path d="M20 19.5V20a2.5 2.5 0 0 1-2.5 2.5H13" /></>,
};

export function Icon({ name, size = 20, className = '', strokeWidth = 1.8 }: IconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {paths[name]}
    </svg>
  );
}

export default Icon;
