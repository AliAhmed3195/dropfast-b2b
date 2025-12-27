// Section Components Registry

// Universal Sections
export { HeaderNavigation } from './HeaderNavigation';
export { Footer } from './Footer';
export { HeroCarousel } from './HeroCarousel';
export { Testimonials } from './Testimonials';
export { Newsletter } from './Newsletter';
export { TrustBadges } from './TrustBadges';
export { AnnouncementBar } from './AnnouncementBar';
export { ContactSection } from './ContactSection';
export { ImageTextBlock } from './ImageTextBlock';
export { StatsCounter } from './StatsCounter';
export { FAQ } from './FAQ';

// Single-Product Sections
export { HeroVideo } from './HeroVideo';
export { ProductGallery } from './ProductGallery';
export { FeaturesGrid } from './FeaturesGrid';
export { ProductComparison } from './ProductComparison';
export { PricingTiers } from './PricingTiers';
export { HowItWorks } from './HowItWorks';
export { CountdownTimer } from './CountdownTimer';
export { ComparisonTable } from './ComparisonTable';

// Multi-Product Sections
export { ProductsGrid } from './ProductsGrid';
export { CategoriesGrid } from './CategoriesGrid';
export { CollectionShowcase } from './CollectionShowcase';
export { BrandsShowcase } from './BrandsShowcase';
export { DealOfDay } from './DealOfDay';
export { RecentlyViewed } from './RecentlyViewed';
export { PromotionalBanner } from './PromotionalBanner';

// Section Type Registry - maps section type to component
import { HeaderNavigation } from './HeaderNavigation';
import { Footer } from './Footer';
import { HeroCarousel } from './HeroCarousel';
import { Testimonials } from './Testimonials';
import { Newsletter } from './Newsletter';
import { TrustBadges } from './TrustBadges';
import { AnnouncementBar } from './AnnouncementBar';
import { ContactSection } from './ContactSection';
import { ImageTextBlock } from './ImageTextBlock';
import { StatsCounter } from './StatsCounter';
import { FAQ } from './FAQ';
import { HeroVideo } from './HeroVideo';
import { ProductGallery } from './ProductGallery';
import { FeaturesGrid } from './FeaturesGrid';
import { ProductComparison } from './ProductComparison';
import { PricingTiers } from './PricingTiers';
import { HowItWorks } from './HowItWorks';
import { CountdownTimer } from './CountdownTimer';
import { ComparisonTable } from './ComparisonTable';
import { ProductsGrid } from './ProductsGrid';
import { CategoriesGrid } from './CategoriesGrid';
import { CollectionShowcase } from './CollectionShowcase';
import { BrandsShowcase } from './BrandsShowcase';
import { DealOfDay } from './DealOfDay';
import { RecentlyViewed } from './RecentlyViewed';
import { PromotionalBanner } from './PromotionalBanner';

export const sectionComponents: Record<string, React.ComponentType<any>> = {
  // Universal
  'header-navigation': HeaderNavigation,
  'footer': Footer,
  'hero-carousel': HeroCarousel,
  'featured-products': ProductsGrid, // Reuse ProductsGrid
  'testimonials': Testimonials,
  'newsletter': Newsletter,
  'trust-badges': TrustBadges,
  'announcement-bar': AnnouncementBar,
  'contact-section': ContactSection,
  'image-text-block': ImageTextBlock,
  'stats-counter': StatsCounter,
  'faq': FAQ,
  
  // Single-Product
  'hero-video': HeroVideo,
  'product-gallery': ProductGallery,
  'features-grid': FeaturesGrid,
  'product-comparison': ProductComparison,
  'pricing-tiers': PricingTiers,
  'faq-section': FAQ, // Reuse FAQ
  'how-it-works': HowItWorks,
  'countdown-timer': CountdownTimer,
  'comparison-table': ComparisonTable,
  
  // Multi-Product
  'products-grid': ProductsGrid,
  'categories-grid': CategoriesGrid,
  'collection-showcase': CollectionShowcase,
  'brands-showcase': BrandsShowcase,
  'deal-of-day': DealOfDay,
  'recently-viewed': RecentlyViewed,
  'promotional-banner': PromotionalBanner,
};

// Helper to get section component
export function getSectionComponent(sectionType: string): React.ComponentType<any> | null {
  return sectionComponents[sectionType] || null;
}