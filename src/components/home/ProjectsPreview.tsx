import { Link } from 'react-router-dom';
import SectionHead from '@/components/ui/SectionHead';
import Icon from '@/components/ui/Icon';
import ProjectGallery from '@/components/projects/ProjectGallery';
import BeforeAfter from '@/components/ui/BeforeAfter';
import Reveal from '@/components/ui/Reveal';
import { projects } from '@/data/projects';

export function ProjectsPreview() {
  const showcase = projects.find((p) => p.beforeAfter);

  return (
    <section className="section section--alt" aria-labelledby="projects-title">
      <div className="container container--wide">
        <div className="spread section-head-row">
          <SectionHead
            eyebrow="Our Work"
            title="Projects &amp; Gallery"
            description="Sample scopes showing the kind of work we take on. Photographs of our own completed projects will replace these illustrations."
          />
          <Link to="/projects" className="btn btn--secondary section-head-row__action">
            View Gallery <Icon name="arrow-right" size={17} />
          </Link>
        </div>

        <ProjectGallery projects={projects} showFilters={false} limit={6} />

        {showcase?.beforeAfter && (
          <Reveal variant="unfurl" className="ba-showcase">
            <div className="ba-showcase__copy">
              <span className="eyebrow">Before &amp; After</span>
              <h3>{showcase.title}</h3>
              <p className="muted">{showcase.description}</p>
              <Link to="/projects" className="btn btn--primary">See more projects</Link>
            </div>
            <BeforeAfter
              before={showcase.beforeAfter.before}
              after={showcase.beforeAfter.after}
              label={`${showcase.title} — before and after`}
            />
          </Reveal>
        )}
      </div>
    </section>
  );
}

export default ProjectsPreview;
