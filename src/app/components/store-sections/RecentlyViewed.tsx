'use client'

import React from 'react';
import { Star } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { Card } from '../ui/card';
import { Button } from '../ui/button';

interface Product {
  name: string;
  image: string;
  price: string;
  rating?: number;
}

interface RecentlyViewedProps {
  heading?: string;
  products?: Product[];
}

export function RecentlyViewed({
  heading = 'Recently Viewed',
  products = [
    { name: 'Product 1', image: '', price: '$29.99', rating: 4.5 },
    { name: 'Product 2', image: '', price: '$39.99', rating: 4.0 },
    { name: 'Product 3', image: '', price: '$49.99', rating: 5.0 },
    { name: 'Product 4', image: '', price: '$19.99', rating: 4.2 },
  ],
}: RecentlyViewedProps) {
  return (
    <section className="py-20 px-6">
      <div className="w-full mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2>{heading}</h2>
          <Button variant="outline">View All</Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, idx) => (
            <Card
              key={idx}
              className="group cursor-pointer hover:shadow-xl transition-all overflow-hidden"
            >
              <div className="aspect-square relative overflow-hidden">
                {product.image ? (
                  <ImageWithFallback
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-purple-500/20 to-cyan-500/20 flex items-center justify-center">
                    <span className="text-4xl">📦</span>
                  </div>
                )}
              </div>

              <div className="p-4">
                <h3 className="font-semibold mb-2 line-clamp-2">{product.name}</h3>
                
                {product.rating && (
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.rating!)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-slate-300'
                        }`}
                      />
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="font-bold text-lg">{product.price}</span>
                  <Button size="sm" variant="ghost">
                    View
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}