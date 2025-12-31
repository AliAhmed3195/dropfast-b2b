'use client'

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Button } from '../ui/button';

interface HeroCarouselProps {
  slides?: Array<{
    image: string;
    heading: string;
    subheading: string;
    ctaText: string;
    ctaLink: string;
  }>;
  autoplay?: boolean;
  interval?: number;
  height?: number;
  overlayOpacity?: number;
  textAlignment?: 'left' | 'center' | 'right';
  showArrows?: boolean;
  showDots?: boolean;
  animationType?: 'fade' | 'slide' | 'zoom';
}

export function HeroCarousel({
  slides = [
    {
      image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200',
      heading: 'Summer Sale',
      subheading: 'Up to 50% off on selected items',
      ctaText: 'Shop Now',
      ctaLink: '/products',
    },
    {
      image: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?w=1200',
      heading: 'New Arrivals',
      subheading: 'Check out the latest products',
      ctaText: 'Explore',
      ctaLink: '/products/new',
    },
    {
      image: 'https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=1200',
      heading: 'Free Shipping',
      subheading: 'On all orders over $50',
      ctaText: 'Learn More',
      ctaLink: '/shipping',
    },
  ],
  autoplay = true,
  interval = 5000,
  height = 600,
  overlayOpacity = 0.4,
  textAlignment = 'center',
  showArrows = true,
  showDots = true,
  animationType = 'fade',
}: HeroCarouselProps) {
  // Filter out invalid slides and ensure all have required properties
  const validSlides = (slides || []).filter(slide => slide && typeof slide === 'object').map(slide => ({
    image: slide.image || '',
    heading: slide.heading || '',
    subheading: slide.subheading || '',
    ctaText: slide.ctaText || 'Shop Now',
    ctaLink: slide.ctaLink || '/products',
  }));

  const [currentSlide, setCurrentSlide] = useState(0);

  // Reset currentSlide if it's out of bounds
  useEffect(() => {
    if (validSlides.length === 0) return;
    if (currentSlide >= validSlides.length) {
      setCurrentSlide(0);
    }
  }, [validSlides.length, currentSlide]);

  useEffect(() => {
    if (!autoplay || validSlides.length === 0) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % validSlides.length);
    }, interval);

    return () => clearInterval(timer);
  }, [autoplay, interval, validSlides.length]);

  const nextSlide = () => {
    if (validSlides.length === 0) return;
    setCurrentSlide((prev) => (prev + 1) % validSlides.length);
  };

  const prevSlide = () => {
    if (validSlides.length === 0) return;
    setCurrentSlide((prev) => (prev - 1 + validSlides.length) % validSlides.length);
  };

  const getAnimationProps = () => {
    switch (animationType) {
      case 'slide':
        return {
          initial: { x: 300, opacity: 0 },
          animate: { x: 0, opacity: 1 },
          exit: { x: -300, opacity: 0 },
        };
      case 'zoom':
        return {
          initial: { scale: 1.2, opacity: 0 },
          animate: { scale: 1, opacity: 1 },
          exit: { scale: 0.8, opacity: 0 },
        };
      default: // fade
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
        };
    }
  };

  const getTextAlignmentClass = () => {
    switch (textAlignment) {
      case 'left':
        return 'items-center justify-start text-left';
      case 'right':
        return 'items-center justify-end text-right';
      default: // center
        return 'items-center justify-center text-center';
    }
  };

  // Show empty state if no valid slides
  if (validSlides.length === 0) {
    return (
      <section className="relative overflow-hidden flex items-center justify-center bg-slate-100 dark:bg-slate-800" style={{ height: `${height}px` }}>
        <div className="text-center text-muted-foreground">
          <p className="text-lg">No slides available</p>
          <p className="text-sm mt-2">Add slides to customize the carousel</p>
        </div>
      </section>
    );
  }

  const currentSlideData = validSlides[currentSlide] || validSlides[0];

  return (
    <section className="relative overflow-hidden" style={{ height: `${height}px` }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          {...getAnimationProps()}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: currentSlideData.image ? `url(${currentSlideData.image})` : undefined }}
          >
            <div className="absolute inset-0" style={{ backgroundColor: `rgba(0, 0, 0, ${overlayOpacity})` }} />
          </div>

          {/* Content */}
          <div className={`relative h-full flex ${getTextAlignmentClass()} text-white px-4`}>
            <div className="max-w-4xl">
              <motion.h1
                className="text-5xl md:text-7xl font-bold mb-6"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.8 }}
              >
                {currentSlideData.heading}
              </motion.h1>

              <motion.p
                className="text-xl md:text-2xl mb-8 text-slate-200"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                {currentSlideData.subheading}
              </motion.p>

              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-cyan-600 text-white hover:from-purple-700 hover:to-cyan-700 text-lg px-8 py-6 shadow-2xl"
                  asChild
                >
                  <a href={currentSlideData.ctaLink}>
                    {currentSlideData.ctaText}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </a>
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      {showArrows && validSlides.length > 1 && (
        <div className="absolute inset-0 flex items-center justify-between px-6 pointer-events-none">
          <Button
            variant="secondary"
            size="sm"
            onClick={prevSlide}
            className="pointer-events-auto rounded-full w-12 h-12 p-0 bg-white/80 hover:bg-white"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={nextSlide}
            className="pointer-events-auto rounded-full w-12 h-12 p-0 bg-white/80 hover:bg-white"
          >
            <ChevronRight className="w-6 h-6" />
          </Button>
        </div>
      )}

      {/* Dots Indicator */}
      {showDots && validSlides.length > 1 && (
        <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2">
          {validSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide
                  ? 'bg-white w-8'
                  : 'bg-white/50 hover:bg-white/75'
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}