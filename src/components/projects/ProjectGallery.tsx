import { useMemo, useState } from 'react';
import type { PlantImage, Project, ProjectCategoryId } from '@/types';
import { projectCategories } from '@/data/projects';
import SmartImage from '@/components/ui/SmartImage';
import Icon from '@/components/ui/Icon';
import Reveal from '@/components/ui/Reveal';
import Lightbox from '@/components/ui/Lightbox';
import EmptyState from '@/components/ui/EmptyState';
import { whatsappProps } from '@/lib/whatsapp';

interface Props {
  projects: Project[];
  showFilters?: boolean;
  limit?: number;
}

/**
 * Project gallery with category filtering and a lightbox.
 * Cards use a staggered mosaic on wide screens and a single column on phones.
 */
export function ProjectGallery({ projects, showFilters = true, limit }: Props) {
  const [active, setActive] = useState<ProjectCategoryId | 'all'>('all');
  const [lightbox, setLightbox] = useState<{ images: PlantImage[]; index: number; caption: string } | null>(null);

  const visible = useMemo(() => {
    const filtered = active === 'all' ? projects : projects.filter((p) => p.category === active);
    return limit ? filtered.slice(0, limit) : filtered;
  }, [projects, active, limit]);

  const available = useMemo(() => {
    const present = new Set(projects.map((p) => p.category));
    return projectCategories.filter((c) => c.id === 'all' || present.has(c.id as ProjectCategoryId));
  }, [projects]);

  return (
    <>
      {showFilters && (
        <div className="filter-row" role="group" aria-label="Filter projects by category">
          {available.map((category) => (
            <button
              key={category.id}
              className="chip"
              aria-pressed={active === category.id}
              onClick={() => setActive(category.id as ProjectCategoryId | 'all')}
            >
              {category.name}
            </button>
          ))}
        </div>
      )}

      {visible.length === 0 ? (
        <EmptyState
          icon="grid"
          title="No projects in this category yet"
          message="Try another category, or ask us about work similar to what you have in mind."
          action={
            <button className="btn btn--secondary" onClick={() => setActive('all')}>
              Show all projects
            </button>
          }
        />
      ) : (
        <div className="project-grid">
          {visible.map((project, i) => (
            <Reveal key={project.id} variant="bloom" delay={Math.min(i, 6) * 65} className="project-grid__item">
              <article className="project-card zoom-parent">
                <button
                  className="project-card__media"
                  onClick={() => setLightbox({ images: project.images, index: 0, caption: project.title })}
                  aria-label={`View images of ${project.title}`}
                >
                  <SmartImage image={project.images[0]} ratio="ratio-4-3" showDemoTag />
                  <span className="project-card__zoom" aria-hidden="true"><Icon name="search" size={18} /></span>
                </button>

                <div className="project-card__body">
                  <p className="project-card__cat">
                    {projectCategories.find((c) => c.id === project.category)?.name}
                    {project.location && <span> · {project.location}</span>}
                  </p>
                  <h3>{project.title}</h3>
                  <p className="project-card__summary">{project.summary}</p>
                  <ul className="project-card__tags">
                    {project.services.slice(0, 3).map((s) => (
                      <li key={s} className="badge badge--soft">{s}</li>
                    ))}
                  </ul>
                  <a
                    {...whatsappProps({ kind: 'project', projectTitle: project.title })}
                    className="link-arrow link-arrow--wa"
                  >
                    <Icon name="whatsapp" size={16} /> Discuss something similar
                  </a>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      )}

      {lightbox && (
        <Lightbox
          images={lightbox.images}
          index={lightbox.index}
          caption={lightbox.caption}
          onClose={() => setLightbox(null)}
          onNavigate={(index) => setLightbox((l) => (l ? { ...l, index } : l))}
        />
      )}
    </>
  );
}

export default ProjectGallery;
