import Hero from '@/components/home/Hero';
import Intro from '@/components/home/Intro';
import FeaturedPlants from '@/components/home/FeaturedPlants';
import CategoriesSection from '@/components/home/CategoriesSection';
import Recommender from '@/components/home/Recommender';
import NewArrivals from '@/components/home/NewArrivals';
import Collections from '@/components/home/Collections';
import WhyUs from '@/components/home/WhyUs';
import ServicesSection from '@/components/home/ServicesSection';
import GreenSolutions from '@/components/home/GreenSolutions';
import ProjectsPreview from '@/components/home/ProjectsPreview';
import PlantCareSection from '@/components/home/PlantCareSection';
import GreenSolutionsValue from '@/components/home/GreenSolutionsValue';
import ContactBand from '@/components/home/ContactBand';
import { useSeo } from '@/hooks/useSeo';

/**
 * The home page is ordered as a story rather than a list of sections:
 *
 *   discover  →  explore plants  →  find the right plant
 *             →  explore services  →  see what is possible  →  book
 *
 * Each step is given a different visual treatment — editorial split, image
 * tiles, an interactive panel, a dark full-bleed band — so the page does not
 * read as one card grid repeated eight times.
 */
export default function Home() {
  useSeo({ appendSiteName: false });

  return (
    <>
      {/* 1 — Discover */}
      <Hero />
      <Intro />

      {/* 2 — Explore beautiful plants */}
      <FeaturedPlants />
      <CategoriesSection />

      {/* 3 — Find the right plant */}
      <Recommender />
      <NewArrivals />
      <Collections />

      {/* 4 — Explore garden services */}
      <WhyUs />
      <ServicesSection />

      {/* 5 — See green space possibilities */}
      <GreenSolutions />
      <ProjectsPreview />
      <PlantCareSection />

      {/* 6 — Book a consultation */}
      <GreenSolutionsValue />
      <ContactBand />
    </>
  );
}
