import PageHeader from '@/components/ui/PageHeader';
import ProjectGallery from '@/components/projects/ProjectGallery';
import BeforeAfter from '@/components/ui/BeforeAfter';
import Reveal from '@/components/ui/Reveal';
import SectionHead from '@/components/ui/SectionHead';
import Icon from '@/components/ui/Icon';
import WhatsAppButton from '@/components/ui/WhatsAppButton';
import { projects } from '@/data/projects';
import { useSeo } from '@/hooks/useSeo';

export default function Projects() {
  useSeo({
    title: 'Projects & Gallery',
    description:
      'Landscaping, garden development, terrace and vertical gardens, lawns, plantations and green spaces by Oxygen Nursery, Nashik.',
  });

  const withBeforeAfter = projects.filter((p) => p.beforeAfter);

  return (
    <>
      <PageHeader
        eyebrow="Our Work"
        title="Projects &amp; Gallery"
        description="Sample scopes showing the kind of work we take on across gardens, terraces, lawns and plantations."
        crumbs={[{ label: 'Projects' }]}
        scene="landscape"
        seed="projects-page"
      />

      <section className="section section--tight">
        <div className="container container--wide">
          <h2 className="sr-only">Project gallery</h2>
          <p className="demo-note" style={{ marginBottom: 'var(--space-5)' }}>
            <Icon name="alert" size={14} />
            Illustrations, not photographs — real project images will replace these.
          </p>
          <ProjectGallery projects={projects} />
        </div>
      </section>

      {withBeforeAfter.length > 0 && (
        <section className="section section--alt" aria-labelledby="ba-title">
          <div className="container container--wide">
            <SectionHead
              eyebrow="Before &amp; After"
              title="The Difference a Season Makes"
              description="Drag each slider to compare the space before work started with how it looks once planting has established."
            />
            <div className="grid cols-2 ba-grid">
              {withBeforeAfter.slice(0, 4).map((project, i) => (
                <Reveal key={project.id} variant="bloom" delay={i * 75}>
                  <div className="ba-item">
                    <BeforeAfter
                      before={project.beforeAfter!.before}
                      after={project.beforeAfter!.after}
                      label={`${project.title} — before and after`}
                    />
                    <h3>{project.title}</h3>
                    <p className="muted">{project.summary}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section">
        <div className="container container--narrow text-center">
          <SectionHead
            center
            eyebrow="Your Space Next"
            title="Plan Your Garden"
            description="Send us a photograph and a rough size, and we will tell you what is possible."
          />
          <div className="row" style={{ justifyContent: 'center' }}>
            <WhatsAppButton size="lg" label="Share your space on WhatsApp" />
          </div>
        </div>
      </section>
    </>
  );
}
