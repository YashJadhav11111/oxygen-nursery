import { Link } from 'react-router-dom';
import Icon from '@/components/ui/Icon';
import SceneArt from '@/components/ui/botanical/SceneArt';
import Parallax from '@/components/ui/Parallax';
import WhatsAppButton from '@/components/ui/WhatsAppButton';
import { useSeo } from '@/hooks/useSeo';

export default function NotFound() {
  useSeo({ title: 'Page not found' });

  return (
    <section className="notfound">
      <Parallax speed={-0.1} scale={1.14} className="notfound__art" mobileFactor={0.25}><SceneArt variant="sprout" seed="404" /></Parallax>
      <div className="notfound__scrim" aria-hidden="true" />
      <div className="container container--narrow notfound__inner">
        <span className="eyebrow">404</span>
        <h1>This page hasn’t taken root</h1>
        <p className="lede">
          The page you were looking for isn’t here. It may have moved, or the link may be old.
        </p>
        <div className="row" style={{ justifyContent: 'center' }}>
          <Link to="/" className="btn btn--light btn--lg"><Icon name="home" size={18} /> Back to home</Link>
          <Link to="/plants" className="btn btn--ghost btn--lg">Browse plants</Link>
          <WhatsAppButton variant="ghost" size="lg" label="Ask us" />
        </div>
      </div>
    </section>
  );
}
