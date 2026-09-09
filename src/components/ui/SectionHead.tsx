import type { ReactNode } from 'react';
import Reveal, { type RevealVariant } from './Reveal';

interface Props {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  center?: boolean;
  /** Heading level — keeps the document outline correct on every page. */
  as?: 'h1' | 'h2' | 'h3';
  action?: ReactNode;
  /** How this heading block settles in. Vary by section. */
  variant?: RevealVariant;
}

export function SectionHead({ eyebrow, title, description, center, as: Tag = 'h2', action, variant = 'rise' }: Props) {
  return (
    <Reveal variant={variant} className={`section-head ${center ? 'section-head--center' : ''}`}>
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <Tag>{title}</Tag>
      {description && <p>{description}</p>}
      {action && <div className="row" style={{ marginTop: 'var(--space-5)' }}>{action}</div>}
    </Reveal>
  );
}

export default SectionHead;
