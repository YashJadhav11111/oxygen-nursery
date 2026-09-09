import { Link } from 'react-router-dom';
import Icon from '@/components/ui/Icon';
import Reveal from '@/components/ui/Reveal';
import DepthMedia from '@/components/ui/DepthMedia';
import LiveArt from '@/components/ui/LiveArt';
import SceneArt from '@/components/ui/botanical/SceneArt';

export function Intro() {
  return (
    <section className="section intro" aria-labelledby="intro-title">
      <div className="container container--wide intro__grid">
        <Reveal variant="drift-left" className="intro__copy">
          <span className="eyebrow">Oxygen Nursery</span>
          <h2 id="intro-title">Bring Nature Into Your Space</h2>
          <p className="lede">
            We grow and supply plants — and we build the gardens they live in. From a single
            plant for a windowsill to a full landscape for a plot, the work starts the same
            way: understanding the space, its light, its soil and how it will be used.
          </p>
          <p>
            Alongside plant supply, Oxygen Nursery takes on landscape designing, garden
            development, terrace and vertical gardens, lawns, irrigation and garden
            maintenance, as well as larger green-space work such as Miyawaki plantations and
            green belt development.
          </p>
          <div className="row intro__actions">
            <Link to="/services" className="btn btn--primary">Explore Services</Link>
            <Link to="/about" className="link-arrow">
              About Oxygen Nursery <Icon name="arrow-right" size={17} />
            </Link>
          </div>
        </Reveal>

        <Reveal variant="bloom" className="intro__art" delay={120}>
          <DepthMedia className="intro__art-main"><SceneArt variant="nursery" seed="intro-main" /></DepthMedia>
          {/* The seedling inset breathes — the one living moment on this page. */}
          <div className="intro__art-sub">
            <LiveArt><SceneArt variant="sprout" seed="intro-sub" /></LiveArt>
          </div>
          <div className="intro__art-note">
            <Icon name="sprout" size={22} />
            <p>Every space has the potential to become greener, healthier and more beautiful.</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default Intro;
