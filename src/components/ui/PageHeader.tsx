import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import Icon from './Icon';
import SceneArt from './botanical/SceneArt';
import Parallax from './Parallax';
import type { SceneVariant } from '@/types';

interface Crumb { label: string; to?: string }

interface Props {
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  crumbs?: Crumb[];
  scene?: SceneVariant;
  seed?: string;
  actions?: ReactNode;
}

/** Compact page banner used by every page except Home. */
export function PageHeader({ eyebrow, title, description, crumbs, scene = 'nursery', seed, actions }: Props) {
  return (
    <header className="page-header">
      <Parallax speed={-0.1} scale={1.14} className="page-header__art" mobileFactor={0.25}>
        <SceneArt variant={scene} seed={seed ?? title} />
      </Parallax>
      <div className="page-header__scrim" aria-hidden="true" />
      <div className="container container--wide page-header__inner">
        {crumbs && crumbs.length > 0 && (
          <nav className="crumbs" aria-label="Breadcrumb">
            <ol>
              <li><Link to="/">Home</Link></li>
              {crumbs.map((crumb) => (
                <li key={crumb.label}>
                  <Icon name="chevron-right" size={13} />
                  {crumb.to ? <Link to={crumb.to}>{crumb.label}</Link> : <span aria-current="page">{crumb.label}</span>}
                </li>
              ))}
            </ol>
          </nav>
        )}
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h1>{title}</h1>
        {description && <p className="page-header__desc">{description}</p>}
        {actions && <div className="row page-header__actions">{actions}</div>}
      </div>
    </header>
  );
}

export default PageHeader;
