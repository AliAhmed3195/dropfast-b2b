'use client'

import React from 'react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { Card } from '../ui/card';

interface Category {
  name: string;
  image: string;
  productCount?: number;
  link?: string;
}

interface CategoriesGridProps {
  heading?: string;
  categories?: Category[];
  columns?: number;
  showProductCount?: boolean;
}

export function CategoriesGrid({
  heading = 'Shop by Category',
  categories = [
    { name: 'Electronics', image: '', productCount: 120, link: '/category/electronics' },
    { name: 'Fashion', image: '', productCount: 250, link: '/category/fashion' },
    { name: 'Home & Garden', image: '', productCount: 180, link: '/category/home-garden' },
    { name: 'Sports', image: '', productCount: 95, link: '/category/sports' },
    { name: 'Books', image: '', productCount: 420, link: '/category/books' },
    { name: 'Toys', image: '', productCount: 150, link: '/category/toys' },
  ],
  columns = 6,
  showProductCount = true,
}: CategoriesGridProps) {
  // Filter out invalid categories
  const validCategories = (categories || []).filter(cat => cat && cat.name);

  // Grid column classes based on columns prop
  const getGridCols = () => {
    const cols = Math.min(Math.max(columns || 6, 2), 6);
    return {
      2: 'grid-cols-2',
      3: 'grid-cols-2 md:grid-cols-3',
      4: 'grid-cols-2 md:grid-cols-4',
      5: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-5',
      6: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6',
    }[cols] || 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6';
  };

  if (validCategories.length === 0) {
    return (
      <section className="py-20 px-6">
        <div className="w-full mx-auto px-4">
          <div className="text-center mb-12">
            <h2>{heading}</h2>
          </div>
          <div className="text-center text-muted-foreground py-12">
            <p>No categories available. Add categories to customize this section.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-6">
      <div className="w-full mx-auto px-4">
        <div className="text-center mb-12">
          <h2>{heading}</h2>
        </div>

        <div className={`grid ${getGridCols()} gap-6`}>
          {validCategories.map((category, idx) => {
            const CategoryCard = (
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
                  {showProductCount && category.productCount !== undefined && (
                    <p className="text-sm text-muted-foreground">
                      {category.productCount} products
                    </p>
                  )}
                </div>
              </Card>
            );

            return category.link ? (
              <a key={idx} href={category.link} className="block">
                {CategoryCard}
              </a>
            ) : (
              CategoryCard
            );
          })}
        </div>
      </div>
    </section>
  );
}