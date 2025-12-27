import React from 'react';
import { Button } from '../ui/button';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface PromotionalBannerProps {
  heading?: string;
  subheading?: string;
  ctaText?: string;
  ctaLink?: string;
  backgroundImage?: string;
  backgroundColor?: string;
  textColor?: string;
}

export function PromotionalBanner({
  heading = 'Special Offer!',
  subheading = 'Get 50% off on all products this week',
  ctaText = 'Shop Now',
  ctaLink = '/products',
  backgroundImage = '',
  backgroundColor = '#6366f1',
  textColor = '#ffffff',
}: PromotionalBannerProps) {
  return (
    <section
      className="relative py-16 px-6 overflow-hidden"
      style={{ backgroundColor }}
    >
      {backgroundImage && (
        <div className="absolute inset-0">
          <ImageWithFallback
            src={backgroundImage}
            alt="Promo background"
            className="w-full h-full object-cover opacity-30"
          />
        </div>
      )}

      <div className="relative z-10 w-full mx-auto px-4 text-center">
        <h2 className="mb-4" style={{ color: textColor }}>
          {heading}
        </h2>
        <p className="text-xl mb-8 opacity-90" style={{ color: textColor }}>
          {subheading}
        </p>
        <Button
          size="lg"
          className="bg-white text-purple-600 hover:bg-white/90 font-bold"
          onClick={() => ctaLink && (window.location.href = ctaLink)}
        >
          {ctaText}
        </Button>
      </div>
    </section>
  );
}