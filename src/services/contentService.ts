import { provider } from './providerRegistry';

/** Content reads (services, projects, care guides, reviews) go through here. */
export const contentService = {
  services: () => provider.getServices(),
  projects: () => provider.getProjects(),
  careGuides: () => provider.getCareGuides(),
  reviews: () => provider.getReviews(),
};

export default contentService;
