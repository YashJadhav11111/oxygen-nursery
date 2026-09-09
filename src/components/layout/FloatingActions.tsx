import { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '@/components/ui/Icon';
import { whatsappProps } from '@/lib/whatsapp';
import { PHONE_NUMBERS } from '@/config/businessConfig';

/**
 * Floating contact actions.
 * Desktop: a WhatsApp button anchored bottom-right, expandable to call/book.
 * Mobile: a bottom action bar, kept clear of page content via body padding.
 */
export function FloatingActions() {
  const [expanded, setExpanded] = useState(false);
  const primaryPhone = PHONE_NUMBERS[0];

  return (
    <>
      <div className={`fab ${expanded ? 'is-expanded' : ''}`}>
        {expanded && (
          <div className="fab__stack">
            <Link to="/book" className="fab__item" onClick={() => setExpanded(false)}>
              <Icon name="calendar" size={19} />
              <span>Book Consultation</span>
            </Link>
            <a href={`tel:+${primaryPhone.international}`} className="fab__item">
              <Icon name="phone" size={19} />
              <span>Call {primaryPhone.local}</span>
            </a>
          </div>
        )}

        <div className="fab__row">
          <button
            className="fab__toggle"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            aria-label={expanded ? 'Hide contact options' : 'Show contact options'}
          >
            <Icon name={expanded ? 'close' : 'headset'} size={20} />
          </button>
          <a
            {...whatsappProps({ kind: 'general' })}
            className="fab__whatsapp"
            aria-label="Chat with Oxygen Nursery on WhatsApp"
          >
            <Icon name="whatsapp" size={26} />
            <span className="fab__pulse" aria-hidden="true" />
          </a>
        </div>
      </div>

      <nav className="mobile-bar" aria-label="Quick contact">
        <a href={`tel:+${primaryPhone.international}`} className="mobile-bar__item">
          <Icon name="phone" size={20} />
          <span>Call</span>
        </a>
        <a {...whatsappProps({ kind: 'general' })} className="mobile-bar__item mobile-bar__item--wa">
          <Icon name="whatsapp" size={20} />
          <span>WhatsApp</span>
        </a>
        <Link to="/book" className="mobile-bar__item mobile-bar__item--cta">
          <Icon name="calendar" size={20} />
          <span>Book</span>
        </Link>
      </nav>
    </>
  );
}

export default FloatingActions;
