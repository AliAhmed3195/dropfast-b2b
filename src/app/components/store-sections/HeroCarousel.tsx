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
}: HeroCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (!autoplay) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, interval);

    return () => clearInterval(timer);
  }, [autoplay, interval, slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section className="relative h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slides[currentSlide].image})` }}
          >
            <div className="absolute inset-0 bg-black/40" />
          </div>

          {/* Content */}
          <div className="relative h-full flex items-center justify-center text-center text-white px-4">
            <div className="max-w-4xl">
              <motion.h1
                className="text-5xl md:text-7xl font-bold mb-6"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.8 }}
              >
                {slides[currentSlide].heading}
              </motion.h1>

              <motion.p
                className="text-xl md:text-2xl mb-8 text-slate-200"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                {slides[currentSlide].subheading}
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
                  <a href={slides[currentSlide].ctaLink}>
                    {slides[currentSlide].ctaText}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </a>
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
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

      {/* Dots Indicator */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2">
        {slides.map((_, index) => (
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
    </section>
  );
}