// Store Templates & Section Registry

export type StoreType = 'single-product' | 'multi-product';

export interface SectionConfig {
  id: string;
  type: string;
  name: string;
  category: string;
  description: string;
  applicableFor: StoreType[];
  thumbnail: string;
  defaultProps: Record<string, any>;
  settings: SectionSetting[];
}

export interface SectionSetting {
  name: string;
  type: 'text' | 'textarea' | 'image' | 'url' | 'select' | 'range' | 'color' | 'toggle';
  label: string;
  options?: string[];
  min?: number;
  max?: number;
  step?: number;
  defaultValue?: any;
}

export interface StoreTemplate {
  id: string;
  name: string;
  description: string;
  storeType: StoreType;
  thumbnail: string;
  bestFor: string[];
  sections: Array<{
    id: string;
    type: string;
    order: number;
    enabled: boolean;
    props: Record<string, any>;
  }>;
}

// ============================================
// SECTION LIBRARY (22 Sections)
// ============================================

export const sectionLibrary: SectionConfig[] = [
  // UNIVERSAL SECTIONS (Both types)
  {
    id: 'header-navigation',
    type: 'header-navigation',
    name: 'Header Navigation',
    category: 'navigation',
    description: 'Sticky header with logo, menu, search, and cart',
    applicableFor: ['single-product', 'multi-product'],
    thumbnail: '/sections/header.png',
    defaultProps: {
      logo: '',
      showSearch: true,
      showCart: true,
      menuItems: [
        { label: 'Home', url: '/' },
        { label: 'Products', url: '/products' },
        { label: 'About', url: '/about' },
        { label: 'Contact', url: '/contact' },
      ],
    },
    settings: [
      { name: 'logo', type: 'image', label: 'Store Logo' },
      { name: 'showSearch', type: 'toggle', label: 'Show Search Bar' },
      { name: 'showCart', type: 'toggle', label: 'Show Cart Icon' },
    ],
  },
  {
    id: 'footer',
    type: 'footer',
    name: 'Footer',
    category: 'navigation',
    description: 'Footer with links, contact info, and social media',
    applicableFor: ['single-product', 'multi-product'],
    thumbnail: '/sections/footer.png',
    defaultProps: {
      companyName: 'Your Store',
      address: '123 Business St, City, Country',
      email: 'contact@yourstore.com',
      phone: '+1 (555) 123-4567',
      socialLinks: {
        facebook: '',
        instagram: '',
        twitter: '',
      },
      showNewsletter: true,
    },
    settings: [
      { name: 'companyName', type: 'text', label: 'Company Name' },
      { name: 'email', type: 'text', label: 'Email' },
      { name: 'phone', type: 'text', label: 'Phone' },
      { name: 'showNewsletter', type: 'toggle', label: 'Show Newsletter Signup' },
    ],
  },
  {
    id: 'testimonials',
    type: 'testimonials',
    name: 'Customer Testimonials',
    category: 'social-proof',
    description: 'Customer reviews and testimonials slider',
    applicableFor: ['single-product', 'multi-product'],
    thumbnail: '/sections/testimonials.png',
    defaultProps: {
      heading: 'What Our Customers Say',
      testimonials: [
        {
          name: 'John Doe',
          avatar: '',
          rating: 5,
          text: 'Amazing product! Highly recommended.',
          date: '2024-12-20',
        },
        {
          name: 'Jane Smith',
          avatar: '',
          rating: 5,
          text: 'Best purchase I made this year!',
          date: '2024-12-18',
        },
      ],
    },
    settings: [
      { name: 'heading', type: 'text', label: 'Section Heading' },
    ],
  },
  {
    id: 'faq',
    type: 'faq',
    name: 'FAQ Accordion',
    category: 'content',
    description: 'Frequently asked questions with accordion',
    applicableFor: ['single-product', 'multi-product'],
    thumbnail: '/sections/faq.png',
    defaultProps: {
      heading: 'Frequently Asked Questions',
      faqs: [
        { question: 'What is your return policy?', answer: 'We offer 30-day money-back guarantee.' },
        { question: 'How long does shipping take?', answer: 'Standard shipping takes 5-7 business days.' },
        { question: 'Do you ship internationally?', answer: 'Yes, we ship to over 100 countries worldwide.' },
      ],
    },
    settings: [
      { name: 'heading', type: 'text', label: 'Section Heading' },
    ],
  },
  {
    id: 'newsletter',
    type: 'newsletter',
    name: 'Newsletter Signup',
    category: 'marketing',
    description: 'Email newsletter subscription form',
    applicableFor: ['single-product', 'multi-product'],
    thumbnail: '/sections/newsletter.png',
    defaultProps: {
      heading: 'Stay Updated',
      subheading: 'Subscribe to get special offers and updates',
      buttonText: 'Subscribe',
      backgroundColor: '#6366f1',
    },
    settings: [
      { name: 'heading', type: 'text', label: 'Heading' },
      { name: 'subheading', type: 'text', label: 'Subheading' },
      { name: 'backgroundColor', type: 'color', label: 'Background Color' },
    ],
  },
  {
    id: 'trust-badges',
    type: 'trust-badges',
    name: 'Trust Badges',
    category: 'social-proof',
    description: 'Payment security and trust badges',
    applicableFor: ['single-product', 'multi-product'],
    thumbnail: '/sections/trust-badges.png',
    defaultProps: {
      badges: [
        { icon: 'shield', text: 'Secure Payment' },
        { icon: 'truck', text: 'Free Shipping' },
        { icon: 'refresh', text: '30-Day Returns' },
        { icon: 'headphones', text: '24/7 Support' },
      ],
    },
    settings: [],
  },
  {
    id: 'announcement-bar',
    type: 'announcement-bar',
    name: 'Announcement Bar',
    category: 'marketing',
    description: 'Sticky promotional banner at top',
    applicableFor: ['single-product', 'multi-product'],
    thumbnail: '/sections/announcement-bar.png',
    defaultProps: {
      text: 'Free Shipping on Orders Over $50! 🚚',
      backgroundColor: '#6366f1',
      textColor: '#ffffff',
      link: '/promotions',
      isCloseable: true,
      isSticky: true,
    },
    settings: [
      { name: 'text', type: 'text', label: 'Announcement Text' },
      { name: 'link', type: 'url', label: 'Link URL (optional)' },
      { name: 'backgroundColor', type: 'color', label: 'Background Color' },
      { name: 'textColor', type: 'color', label: 'Text Color' },
      { name: 'isCloseable', type: 'toggle', label: 'Show Close Button' },
      { name: 'isSticky', type: 'toggle', label: 'Sticky on Scroll' },
    ],
  },
  {
    id: 'contact-section',
    type: 'contact-section',
    name: 'Contact Section',
    category: 'content',
    description: 'Contact form with business information',
    applicableFor: ['single-product', 'multi-product'],
    thumbnail: '/sections/contact-section.png',
    defaultProps: {
      heading: 'Get In Touch',
      subheading: 'We\'d love to hear from you',
      showForm: true,
      showMap: true,
      address: '123 Business Street, City, Country',
      phone: '+1 (555) 123-4567',
      email: 'contact@yourstore.com',
      businessHours: 'Mon-Fri: 9AM-6PM',
      mapEmbedUrl: '',
    },
    settings: [
      { name: 'heading', type: 'text', label: 'Section Heading' },
      { name: 'subheading', type: 'text', label: 'Subheading' },
      { name: 'showForm', type: 'toggle', label: 'Show Contact Form' },
      { name: 'showMap', type: 'toggle', label: 'Show Google Map' },
      { name: 'address', type: 'textarea', label: 'Business Address' },
      { name: 'phone', type: 'text', label: 'Phone Number' },
      { name: 'email', type: 'text', label: 'Email Address' },
      { name: 'businessHours', type: 'text', label: 'Business Hours' },
      { name: 'mapEmbedUrl', type: 'url', label: 'Google Maps Embed URL' },
    ],
  },
  {
    id: 'image-text-block',
    type: 'image-text-block',
    name: 'Image with Text',
    category: 'content',
    description: 'Flexible content block with image and text',
    applicableFor: ['single-product', 'multi-product'],
    thumbnail: '/sections/image-text-block.png',
    defaultProps: {
      heading: 'Our Story',
      text: 'Share your brand story and connect with your customers. Tell them what makes your business unique and why they should choose you.',
      image: '',
      imagePosition: 'left', // left, right
      buttonText: 'Learn More',
      buttonLink: '',
      showButton: true,
      backgroundColor: '#ffffff',
    },
    settings: [
      { name: 'heading', type: 'text', label: 'Heading' },
      { name: 'text', type: 'textarea', label: 'Content Text' },
      { name: 'image', type: 'image', label: 'Image' },
      { name: 'imagePosition', type: 'select', label: 'Image Position', options: ['left', 'right'] },
      { name: 'showButton', type: 'toggle', label: 'Show Button' },
      { name: 'buttonText', type: 'text', label: 'Button Text' },
      { name: 'buttonLink', type: 'url', label: 'Button Link' },
      { name: 'backgroundColor', type: 'color', label: 'Background Color' },
    ],
  },
  {
    id: 'stats-counter',
    type: 'stats-counter',
    name: 'Stats & Numbers',
    category: 'social-proof',
    description: 'Animated statistics and achievements',
    applicableFor: ['single-product', 'multi-product'],
    thumbnail: '/sections/stats-counter.png',
    defaultProps: {
      heading: 'Our Achievements',
      subheading: 'Numbers that speak for themselves',
      stats: [
        { number: '10000', suffix: '+', label: 'Happy Customers', icon: 'users' },
        { number: '500', suffix: '+', label: 'Products Sold', icon: 'package' },
        { number: '24', suffix: '/7', label: 'Support', icon: 'headphones' },
        { number: '99', suffix: '%', label: 'Satisfaction', icon: 'heart' },
      ],
      backgroundColor: '#f9fafb',
      layout: 'grid', // grid, row
    },
    settings: [
      { name: 'heading', type: 'text', label: 'Section Heading' },
      { name: 'subheading', type: 'text', label: 'Subheading' },
      { name: 'layout', type: 'select', label: 'Layout', options: ['grid', 'row'] },
      { name: 'backgroundColor', type: 'color', label: 'Background Color' },
    ],
  },

  // SINGLE PRODUCT SPECIFIC SECTIONS
  {
    id: 'hero-video',
    type: 'hero-video',
    name: 'Hero Video Section',
    category: 'hero',
    description: 'Full-screen hero with background video',
    applicableFor: ['single-product'],
    thumbnail: '/sections/hero-video.png',
    defaultProps: {
      heading: 'Introducing Our Game-Changing Product',
      subheading: 'Experience the future today',
      ctaText: 'Order Now',
      ctaLink: '#order',
      videoUrl: '',
      overlayOpacity: 0.5,
      height: 700,
    },
    settings: [
      { name: 'heading', type: 'text', label: 'Main Heading' },
      { name: 'subheading', type: 'text', label: 'Subheading' },
      { name: 'ctaText', type: 'text', label: 'Button Text' },
      { name: 'videoUrl', type: 'url', label: 'Video URL' },
      { name: 'overlayOpacity', type: 'range', label: 'Overlay Opacity', min: 0, max: 1, step: 0.1 },
      { name: 'height', type: 'range', label: 'Section Height (px)', min: 500, max: 900, step: 50 },
    ],
  },
  {
    id: 'product-gallery',
    type: 'product-gallery',
    name: 'Product Gallery',
    category: 'product',
    description: 'Image gallery with multiple product angles',
    applicableFor: ['single-product'],
    thumbnail: '/sections/product-gallery.png',
    defaultProps: {
      images: [],
      layout: 'grid', // grid, carousel, masonry
    },
    settings: [
      { name: 'layout', type: 'select', label: 'Layout Style', options: ['grid', 'carousel', 'masonry'] },
    ],
  },
  {
    id: 'features-grid',
    type: 'features-grid',
    name: 'Key Features Grid',
    category: 'content',
    description: 'Highlight product features with icons',
    applicableFor: ['single-product'],
    thumbnail: '/sections/features.png',
    defaultProps: {
      heading: 'Key Features',
      features: [
        { icon: 'zap', title: 'Lightning Fast', description: 'Get results in seconds' },
        { icon: 'shield', title: 'Secure & Safe', description: 'Your data is protected' },
        { icon: 'heart', title: 'Easy to Use', description: 'No learning curve needed' },
        { icon: 'star', title: 'Premium Quality', description: 'Built to last' },
      ],
    },
    settings: [
      { name: 'heading', type: 'text', label: 'Section Heading' },
    ],
  },
  {
    id: 'how-it-works',
    type: 'how-it-works',
    name: 'How It Works',
    category: 'content',
    description: 'Step-by-step process explanation',
    applicableFor: ['single-product'],
    thumbnail: '/sections/how-it-works.png',
    defaultProps: {
      heading: 'How It Works',
      steps: [
        { number: 1, title: 'Order', description: 'Place your order in seconds' },
        { number: 2, title: 'Receive', description: 'Get it delivered to your door' },
        { number: 3, title: 'Enjoy', description: 'Start using immediately' },
      ],
    },
    settings: [
      { name: 'heading', type: 'text', label: 'Section Heading' },
    ],
  },
  {
    id: 'countdown-timer',
    type: 'countdown-timer',
    name: 'Countdown Timer',
    category: 'marketing',
    description: 'Urgency timer for limited offers',
    applicableFor: ['single-product'],
    thumbnail: '/sections/countdown.png',
    defaultProps: {
      heading: 'Limited Time Offer!',
      endDate: '2025-01-31',
      showDays: true,
      showHours: true,
      showMinutes: true,
      showSeconds: true,
    },
    settings: [
      { name: 'heading', type: 'text', label: 'Heading' },
      { name: 'endDate', type: 'text', label: 'End Date (YYYY-MM-DD)' },
    ],
  },
  {
    id: 'comparison-table',
    type: 'comparison-table',
    name: 'Comparison Table',
    category: 'product',
    description: 'Compare your product with competitors',
    applicableFor: ['single-product'],
    thumbnail: '/sections/comparison.png',
    defaultProps: {
      heading: 'How We Compare',
      competitors: [
        { name: 'Our Product', features: ['✓', '✓', '✓', '✓'], highlight: true },
        { name: 'Competitor A', features: ['✓', '✓', '✗', '✗'], highlight: false },
        { name: 'Competitor B', features: ['✓', '✗', '✗', '✗'], highlight: false },
      ],
      featureNames: ['Feature 1', 'Feature 2', 'Feature 3', 'Feature 4'],
    },
    settings: [
      { name: 'heading', type: 'text', label: 'Section Heading' },
    ],
  },

  // MULTI-PRODUCT SPECIFIC SECTIONS
  {
    id: 'hero-carousel',
    type: 'hero-carousel',
    name: 'Hero Carousel',
    category: 'hero',
    description: 'Rotating banner carousel',
    applicableFor: ['multi-product'],
    thumbnail: '/sections/hero-carousel.png',
    defaultProps: {
      slides: [
        {
          image: '',
          heading: 'Summer Sale',
          subheading: 'Up to 50% off',
          ctaText: 'Shop Now',
          ctaLink: '/products',
        },
        {
          image: '',
          heading: 'New Arrivals',
          subheading: 'Check out the latest products',
          ctaText: 'Explore',
          ctaLink: '/products/new',
        },
      ],
      autoplay: true,
      interval: 5000,
    },
    settings: [
      { name: 'autoplay', type: 'toggle', label: 'Auto-play Slides' },
      { name: 'interval', type: 'range', label: 'Slide Interval (ms)', min: 3000, max: 10000, step: 1000 },
    ],
  },
  {
    id: 'products-grid',
    type: 'products-grid',
    name: 'Products Grid',
    category: 'products',
    description: 'Grid display of products',
    applicableFor: ['multi-product'],
    thumbnail: '/sections/products-grid.png',
    defaultProps: {
      heading: 'Our Products',
      columns: 4,
      rows: 2,
      showFilters: true,
      productSource: 'all', // all, featured, category, manual
    },
    settings: [
      { name: 'heading', type: 'text', label: 'Section Heading' },
      { name: 'columns', type: 'range', label: 'Columns', min: 2, max: 5, step: 1 },
      { name: 'showFilters', type: 'toggle', label: 'Show Filters' },
    ],
  },
  {
    id: 'featured-products',
    type: 'featured-products',
    name: 'Featured Products',
    category: 'products',
    description: 'Showcase featured/best-selling products',
    applicableFor: ['multi-product'],
    thumbnail: '/sections/featured-products.png',
    defaultProps: {
      heading: 'Best Sellers',
      subheading: 'Our most popular products',
      productCount: 8,
      layout: 'grid', // grid, carousel
    },
    settings: [
      { name: 'heading', type: 'text', label: 'Section Heading' },
      { name: 'productCount', type: 'range', label: 'Number of Products', min: 4, max: 12, step: 2 },
      { name: 'layout', type: 'select', label: 'Layout', options: ['grid', 'carousel'] },
    ],
  },
  {
    id: 'categories-grid',
    type: 'categories-grid',
    name: 'Categories Grid',
    category: 'navigation',
    description: 'Shop by category with images',
    applicableFor: ['multi-product'],
    thumbnail: '/sections/categories.png',
    defaultProps: {
      heading: 'Shop by Category',
      categories: [
        { name: 'Electronics', image: '', productCount: 145 },
        { name: 'Fashion', image: '', productCount: 230 },
        { name: 'Home & Garden', image: '', productCount: 89 },
        { name: 'Sports', image: '', productCount: 67 },
      ],
    },
    settings: [
      { name: 'heading', type: 'text', label: 'Section Heading' },
    ],
  },
  {
    id: 'promotional-banner',
    type: 'promotional-banner',
    name: 'Promotional Banner',
    category: 'marketing',
    description: 'Full-width promotional banner',
    applicableFor: ['multi-product'],
    thumbnail: '/sections/promo-banner.png',
    defaultProps: {
      text: 'Free Shipping on Orders Over $50!',
      ctaText: 'Shop Now',
      ctaLink: '/products',
      backgroundColor: '#6366f1',
      textColor: '#ffffff',
    },
    settings: [
      { name: 'text', type: 'text', label: 'Banner Text' },
      { name: 'ctaText', type: 'text', label: 'Button Text' },
      { name: 'backgroundColor', type: 'color', label: 'Background Color' },
    ],
  },
  {
    id: 'collection-showcase',
    type: 'collection-showcase',
    name: 'Collection Showcase',
    category: 'products',
    description: 'Highlight specific product collections',
    applicableFor: ['multi-product'],
    thumbnail: '/sections/collections.png',
    defaultProps: {
      heading: 'Featured Collections',
      collections: [
        { name: 'Summer Collection', image: '', description: 'Hot deals for summer' },
        { name: 'New Arrivals', image: '', description: 'Just landed' },
      ],
      layout: 'split', // split, cards
    },
    settings: [
      { name: 'heading', type: 'text', label: 'Section Heading' },
      { name: 'layout', type: 'select', label: 'Layout Style', options: ['split', 'cards'] },
    ],
  },
];

// ============================================
// STORE TEMPLATES (4 Templates)
// ============================================

export const storeTemplates: StoreTemplate[] = [
  // SINGLE PRODUCT TEMPLATES
  {
    id: 'tech-launch',
    name: 'Tech Launch',
    description: 'Perfect for launching a single tech product or gadget',
    storeType: 'single-product',
    thumbnail: '/templates/tech-launch.png',
    bestFor: ['Electronics', 'Gadgets', 'Tech Products', 'Hardware'],
    sections: [
      { id: 'header-1', type: 'header-navigation', order: 1, enabled: true, props: {} },
      { id: 'hero-1', type: 'hero-video', order: 2, enabled: true, props: {} },
      { id: 'features-1', type: 'features-grid', order: 3, enabled: true, props: {} },
      { id: 'gallery-1', type: 'product-gallery', order: 4, enabled: true, props: {} },
      { id: 'how-1', type: 'how-it-works', order: 5, enabled: true, props: {} },
      { id: 'comparison-1', type: 'comparison-table', order: 6, enabled: true, props: {} },
      { id: 'testimonials-1', type: 'testimonials', order: 7, enabled: true, props: {} },
      { id: 'faq-1', type: 'faq', order: 8, enabled: true, props: {} },
      { id: 'countdown-1', type: 'countdown-timer', order: 9, enabled: true, props: {} },
      { id: 'footer-1', type: 'footer', order: 10, enabled: true, props: {} },
    ],
  },
  {
    id: 'premium-brand',
    name: 'Premium Brand',
    description: 'Elegant template for luxury single-product brands',
    storeType: 'single-product',
    thumbnail: '/templates/premium-brand.png',
    bestFor: ['Luxury Items', 'Jewelry', 'Watches', 'High-end Products'],
    sections: [
      { id: 'header-1', type: 'header-navigation', order: 1, enabled: true, props: {} },
      { id: 'hero-1', type: 'hero-video', order: 2, enabled: true, props: { height: 800 } },
      { id: 'gallery-1', type: 'product-gallery', order: 3, enabled: true, props: { layout: 'masonry' } },
      { id: 'features-1', type: 'features-grid', order: 4, enabled: true, props: {} },
      { id: 'testimonials-1', type: 'testimonials', order: 5, enabled: true, props: {} },
      { id: 'trust-1', type: 'trust-badges', order: 6, enabled: true, props: {} },
      { id: 'faq-1', type: 'faq', order: 7, enabled: true, props: {} },
      { id: 'newsletter-1', type: 'newsletter', order: 8, enabled: true, props: {} },
      { id: 'footer-1', type: 'footer', order: 9, enabled: true, props: {} },
    ],
  },

  // MULTI-PRODUCT TEMPLATES
  {
    id: 'modern-ecommerce',
    name: 'Modern Ecommerce',
    description: 'Contemporary multi-product store with clean design',
    storeType: 'multi-product',
    thumbnail: '/templates/modern-ecommerce.png',
    bestFor: ['Dropshipping', 'General Store', 'Multiple Products', 'Electronics'],
    sections: [
      { id: 'header-1', type: 'header-navigation', order: 1, enabled: true, props: {} },
      { id: 'hero-1', type: 'hero-carousel', order: 2, enabled: true, props: {} },
      { id: 'categories-1', type: 'categories-grid', order: 3, enabled: true, props: {} },
      { id: 'featured-1', type: 'featured-products', order: 4, enabled: true, props: {} },
      { id: 'promo-1', type: 'promotional-banner', order: 5, enabled: true, props: {} },
      { id: 'products-1', type: 'products-grid', order: 6, enabled: true, props: {} },
      { id: 'testimonials-1', type: 'testimonials', order: 7, enabled: true, props: {} },
      { id: 'trust-1', type: 'trust-badges', order: 8, enabled: true, props: {} },
      { id: 'newsletter-1', type: 'newsletter', order: 9, enabled: true, props: {} },
      { id: 'footer-1', type: 'footer', order: 10, enabled: true, props: {} },
    ],
  },
  {
    id: 'classic-retail',
    name: 'Classic Retail',
    description: 'Traditional ecommerce layout for established brands',
    storeType: 'multi-product',
    thumbnail: '/templates/classic-retail.png',
    bestFor: ['Retail', 'Fashion', 'Home Goods', 'Traditional Store'],
    sections: [
      { id: 'header-1', type: 'header-navigation', order: 1, enabled: true, props: {} },
      { id: 'promo-1', type: 'promotional-banner', order: 2, enabled: true, props: {} },
      { id: 'hero-1', type: 'hero-carousel', order: 3, enabled: true, props: {} },
      { id: 'categories-1', type: 'categories-grid', order: 4, enabled: true, props: {} },
      { id: 'collection-1', type: 'collection-showcase', order: 5, enabled: true, props: {} },
      { id: 'products-1', type: 'products-grid', order: 6, enabled: true, props: { showFilters: true } },
      { id: 'featured-1', type: 'featured-products', order: 7, enabled: true, props: {} },
      { id: 'testimonials-1', type: 'testimonials', order: 8, enabled: true, props: {} },
      { id: 'faq-1', type: 'faq', order: 9, enabled: true, props: {} },
      { id: 'footer-1', type: 'footer', order: 10, enabled: true, props: {} },
    ],
  },
];

// Helper function to get sections for a store type
export function getSectionsForStoreType(storeType: StoreType): SectionConfig[] {
  return sectionLibrary.filter(section => 
    section.applicableFor.includes(storeType)
  );
}

// Helper function to get template by ID
export function getTemplateById(templateId: string): StoreTemplate | undefined {
  return storeTemplates.find(t => t.id === templateId);
}

// Helper function to get section config by type
export function getSectionConfigByType(sectionType: string): SectionConfig | undefined {
  return sectionLibrary.find(s => s.type === sectionType);
}