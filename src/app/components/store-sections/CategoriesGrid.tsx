'use client'

import React from 'react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { Card } from '../ui/card';

interface Category {
  name: string;
  image: string;
  productCount?: number;
}

interface CategoriesGridProps {
  heading?: string;
  categories?: Category[];
}

export function CategoriesGrid({
  heading = 'Shop by Category',
  categories = [
    { name: 'Electronics', image: '', productCount: 120 },
    { name: 'Fashion', image: '', productCount: 250 },
    { name: 'Home & Garden', image: '', productCount: 180 },
    { name: 'Sports', image: '', productCount: 95 },
    { name: 'Books', image: '', productCount: 420 },
    { name: 'Toys', image: '', productCount: 150 },
  ],
}: CategoriesGridProps) {
  return (
    <section className="py-20 px-6">
      <div className="w-full mx-auto px-4">
        <div className="text-center mb-12">
          <h2>{heading}</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((category, idx) => (
            <Card
              key={idx}
              className="group cursor-pointer hover:shadow-xl transition-all overflow-hidden"
            >
              <div className="aspect-square relative overflow-hidden">
                {category.image ? (
                  <ImageWithFallback
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-purple-500/20 to-cyan-500/20 flex items-center justify-center">
                    <span className="text-4xl">📦</span>
                  </div>
                )}
              </div>
              <div className="p-4 text-center">
                <h3 className="font-semibold mb-1">{category.name}</h3>
                {category.productCount && (
                  <p className="text-sm text-muted-foreground">
                    {category.productCount} products
                  </p>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}