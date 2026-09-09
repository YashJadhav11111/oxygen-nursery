import { Link } from 'react-router-dom';
import { useTilt } from '@/motion/useTilt';
import type { Plant } from '@/types';
import SmartImage from '@/components/ui/SmartImage';
import Icon from '@/components/ui/Icon';
import { getCategoryName } from '@/data/categories';
import { availabilityClass, availabilityLabel, careLabel, formatPrice, sunlightLabel, waterLabel } from '@/lib/format';
import { whatsappProps } from '@/lib/whatsapp';

interface Props {
  plant: Plant;
  priority?: boolean;
}

/**
 * The catalogue card leads with the plant and keeps text to what helps someone
 * choose: category, name, one line, and the two care facts that decide whether
 * a plant suits a space. Everything else lives on the detail page.
 */
export function PlantCard({ plant, priority = false }: Props) {
  const price = formatPrice(plant.price, plant.priceUnit);
  const unavailable = plant.availability === 'unavailable';
  // A slight turn of the card, as though it were a printed plant label being
  // tilted in the hand. Desktop pointers only; touch gets a press state.
  const tiltRef = useTilt<HTMLElement>(4.5);

  return (
    <article className="plant-card card card--hover" ref={tiltRef}>
      <Link
        to={`/plants/${plant.slug}`}
        className="plant-card__media-link"
        tabIndex={-1}
        aria-hidden="true"
        data-tilt-media
      >
        <SmartImage
          image={plant.images[0]}
          ratio="ratio-4-5"
          priority={priority}
          sizes="(max-width: 760px) 78vw, (max-width: 1100px) 44vw, 300px"
        />
        <span className="plant-card__veil" aria-hidden="true" />
        <span className="plant-card__peek" aria-hidden="true">
          <Icon name="arrow-right" size={17} />
        </span>
      </Link>

      <div className="plant-card__badges">
        {plant.newArrival && <span className="badge badge--new">New</span>}
        <span className={`badge ${availabilityClass[plant.availability]}`}>
          <span className="badge__dot" />
          {availabilityLabel[plant.availability]}
        </span>
      </div>

      <div className="card__body plant-card__body">
        <p className="plant-card__category">{getCategoryName(plant.category)}</p>
        <h3 className="plant-card__name">
          <Link to={`/plants/${plant.slug}`}>{plant.name}</Link>
        </h3>
        <p className="plant-card__desc">{plant.description}</p>

        <ul className="plant-card__meta">
          <li title={`Sunlight: ${sunlightLabel[plant.sunlight]}`}>
            <Icon name="sun" size={14} /> {sunlightLabel[plant.sunlight]}
          </li>
          <li title={`Watering: ${waterLabel[plant.water]}`}>
            <Icon name="droplet" size={14} /> {waterLabel[plant.water]}
          </li>
          <li title={`Care level: ${careLabel[plant.careLevel]}`}>
            <Icon name="leaf" size={14} /> {careLabel[plant.careLevel]}
          </li>
        </ul>

        {price && <p className="plant-card__price">{price}</p>}

        <div className="plant-card__actions">
          <Link to={`/plants/${plant.slug}`} className="btn btn--secondary btn--sm">
            View Details
          </Link>
          <a
            {...whatsappProps(
              unavailable
                ? { kind: 'plant-availability', plantName: plant.name }
                : { kind: 'plant', plantName: plant.name },
            )}
            className="btn btn--whatsapp btn--sm"
            aria-label={`Enquire about ${plant.name} on WhatsApp`}
          >
            <Icon name="whatsapp" size={16} />
            {unavailable ? 'Ask' : 'Enquire'}
          </a>
        </div>
      </div>
    </article>
  );
}

export default PlantCard;
