'use client'

import React from 'react';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface Brand {
  name: string;
  logo: string;
}

interface BrandsShowcaseProps {
  heading?: string;
  brands?: Brand[];
}

export function BrandsShowcase({
  heading = 'Featured Brands',
  brands = [
    { name: 'Brand 1', logo: '' },
    { name: 'Brand 2', logo: '' },
    { name: 'Brand 3', logo: '' },
    { name: 'Brand 4', logo: '' },
    { name: 'Brand 5', logo: '' },
    { name: 'Brand 6', logo: '' },
  ],
}: BrandsShowcaseProps) {
  return (
    <section className="py-20 px-6 bg-slate-50 dark:bg-slate-900/30">
      <div className="w-full mx-auto px-4">
        <div className="text-center mb-12">
          <h2>{heading}</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {brands.map((brand, idx) => (
            <div
              key={idx}
              className="flex items-center justify-center p-6 bg-white dark:bg-slate-800 rounded-xl hover:shadow-lg transition-shadow cursor-pointer group"
            >
              {brand.logo ? (
                <ImageWithFallback
                  src={brand.logo}
                  alt={brand.name}
                  className="w-full h-16 object-contain grayscale group-hover:grayscale-0 transition-all"
                />
              ) : (
                <div className="text-2xl font-bold text-muted-foreground group-hover:text-foreground transition-colors">
                  {brand.name}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}