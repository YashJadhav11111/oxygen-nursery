import Icon from './Icon';
import { whatsappProps, type WhatsAppContext } from '@/lib/whatsapp';

interface Props {
  context?: WhatsAppContext;
  label?: string;
  variant?: 'whatsapp' | 'whatsapp-outline' | 'secondary' | 'light' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  block?: boolean;
  className?: string;
}

/**
 * Every WhatsApp call-to-action on the site renders through this component, so
 * the message wording and the destination number stay consistent everywhere.
 */
export function WhatsAppButton({
  context = { kind: 'general' },
  label = 'Chat on WhatsApp',
  variant = 'whatsapp',
  size = 'md',
  block = false,
  className = '',
}: Props) {
  return (
    <a
      {...whatsappProps(context)}
      className={`btn btn--${variant} ${size !== 'md' ? `btn--${size}` : ''} ${block ? 'btn--block' : ''} ${className}`}
    >
      <Icon name="whatsapp" size={size === 'sm' ? 16 : 19} />
      {label}
    </a>
  );
}

export default WhatsAppButton;
