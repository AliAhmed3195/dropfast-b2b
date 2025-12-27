'use client'

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { Button } from '../ui/button';

interface ProductGalleryProps {
  images?: string[];
  layout?: 'grid' | 'carousel' | 'masonry';
}

export function ProductGallery({
  images = [],
  layout = 'grid',
}: ProductGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (images.length === 0) {
    return (
      <section className="py-20 px-6">
        <div className="w-full mx-auto px-4">
          <div className="h-96 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 rounded-2xl flex items-center justify-center">
            <p className="text-muted-foreground">Add product images</p>
          </div>
        </div>
      </section>
    );
  }

  if (layout === 'carousel') {
    return (
      <section className="py-20 px-6">
        <div className="w-full mx-auto px-4">
          <div className="relative">
            <ImageWithFallback
              src={images[currentIndex]}
              alt={`Product ${currentIndex + 1}`}
              className="w-full h-[600px] object-cover rounded-2xl"
            />
            
            <Button
              variant="outline"
              size="sm"
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>

            <div className="flex gap-2 justify-center mt-4">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    idx === currentIndex
                      ? 'bg-purple-600 w-8'
                      : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (layout === 'masonry') {
    return (
      <section className="py-20 px-6">
        <div className="w-full mx-auto px-4">
          <div className="columns-1 md:columns-2 lg:columns-3 gap-4">
            {images.map((image, idx) => (
              <div key={idx} className="mb-4 break-inside-avoid">
                <ImageWithFallback
                  src={image}
                  alt={`Product ${idx + 1}`}
                  className="w-full rounded-xl hover:shadow-2xl transition-shadow cursor-pointer"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Default: Grid layout
  return (
    <section className="py-20 px-6">
      <div className="w-full mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map((image, idx) => (
            <div key={idx} className="aspect-square">
              <ImageWithFallback
                src={image}
                alt={`Product ${idx + 1}`}
                className="w-full h-full object-cover rounded-xl hover:shadow-2xl transition-shadow cursor-pointer"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}