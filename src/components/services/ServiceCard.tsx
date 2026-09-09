import { Link } from 'react-router-dom';
import type { Service } from '@/types';
import Icon, { type IconName } from '@/components/ui/Icon';
import SmartImage from '@/components/ui/SmartImage';
import { whatsappProps } from '@/lib/whatsapp';

interface Props {
  service: Service;
  variant?: 'media' | 'compact';
}

export function ServiceCard({ service, variant = 'media' }: Props) {
  if (variant === 'compact') {
    return (
      <article className="service-chip">
        <span className="service-chip__icon" data-motion={service.icon}><Icon name={service.icon as IconName} size={20} /></span>
        <div className="service-chip__body">
          <h3>{service.name}</h3>
          <p>{service.shortDescription}</p>
          <Link to={`/services/${service.slug}`} className="link-arrow">
            Learn More <Icon name="arrow-right" size={16} />
          </Link>
        </div>
      </article>
    );
  }

  return (
    <article className="service-card card card--hover">
      <SmartImage image={service.image} ratio="ratio-16-9" />
      <span className="service-card__icon" data-motion={service.icon}><Icon name={service.icon as IconName} size={20} /></span>
      <div className="card__body">
        <h3>{service.name}</h3>
        <p>{service.shortDescription}</p>
        <div className="service-card__actions">
          <Link to={`/services/${service.slug}`} className="link-arrow">
            Learn More <Icon name="arrow-right" size={16} />
          </Link>
          <a
            {...whatsappProps({ kind: 'service', serviceName: service.name })}
            className="service-card__wa"
            aria-label={`Enquire about ${service.name} on WhatsApp`}
          >
            <Icon name="whatsapp" size={18} />
          </a>
        </div>
      </div>
    </article>
  );
}

export default ServiceCard;
