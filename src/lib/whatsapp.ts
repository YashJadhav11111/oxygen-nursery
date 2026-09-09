import { WHATSAPP_NUMBER, BUSINESS_NAME } from '@/config/businessConfig';

/**
 * ===========================================================================
 * THE SINGLE WHATSAPP UTILITY
 * ===========================================================================
 * Every WhatsApp button on the site — navbar, hero, plant cards, plant detail,
 * services, contact, floating button, appointment confirmation — builds its
 * link here. The number itself comes from businessConfig.ts, so changing it is
 * a one-line edit.
 * ===========================================================================
 */

export type WhatsAppContext =
  | { kind: 'general' }
  | { kind: 'plant'; plantName: string }
  | { kind: 'plant-availability'; plantName: string }
  | { kind: 'service'; serviceName: string }
  | { kind: 'appointment'; serviceName: string; date: string; time?: string; name?: string }
  | { kind: 'project'; projectTitle: string }
  | { kind: 'care'; guideTitle: string }
  | { kind: 'custom'; message: string };

export function whatsappMessage(context: WhatsAppContext): string {
  const hello = `Hello ${BUSINESS_NAME},`;
  switch (context.kind) {
    case 'plant':
      return `${hello} I am interested in ${context.plantName}. Please share availability and details.`;
    case 'plant-availability':
      return `${hello} could you let me know when ${context.plantName} will be available again?`;
    case 'service':
      return `${hello} I would like to enquire about ${context.serviceName}.`;
    case 'appointment': {
      const who = context.name ? ` My name is ${context.name}.` : '';
      const when = context.time ? `${context.date} at ${context.time}` : context.date;
      return `${hello} I would like to book a consultation for ${context.serviceName} on ${when}.${who}`;
    }
    case 'project':
      return `${hello} I saw "${context.projectTitle}" on your website and would like to discuss something similar.`;
    case 'care':
      return `${hello} I have a question about "${context.guideTitle}".`;
    case 'custom':
      return context.message;
    case 'general':
    default:
      return `${hello} I would like to know more about your plants and gardening services.`;
  }
}

/** Builds the wa.me deep link. Works on mobile app and WhatsApp Web. */
export function whatsappLink(context: WhatsAppContext = { kind: 'general' }): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage(context))}`;
}

/** Convenience props for anchor elements. */
export function whatsappProps(context: WhatsAppContext = { kind: 'general' }) {
  return {
    href: whatsappLink(context),
    target: '_blank' as const,
    rel: 'noopener noreferrer',
  };
}
