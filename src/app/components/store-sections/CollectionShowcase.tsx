'use client'

import React from 'react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

interface Collection {
  name: string;
  description: string;
  image: string;
  badge?: string;
  itemCount?: number;
}

interface CollectionShowcaseProps {
  heading?: string;
  collections?: Collection[];
}

export function CollectionShowcase({
  heading = 'Featured Collections',
  collections = [
    {
      name: 'Summer Collection',
      description: 'Hot trends for the season',
      image: '',
      badge: 'New',
      itemCount: 48,
    },
    {
      name: 'Best Sellers',
      description: 'Customer favorites',
      image: '',
      badge: 'Popular',
      itemCount: 32,
    },
    {
      name: 'Sale Items',
      description: 'Up to 50% off',
      image: '',
      badge: 'Sale',
      itemCount: 67,
    },
  ],
}: CollectionShowcaseProps) {
  return (
    <section className="py-20 px-6 bg-slate-50 dark:bg-slate-900/30">
      <div className="w-full mx-auto px-4">
        <div className="text-center mb-12">
          <h2>{heading}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {collections.map((collection, idx) => (
            <div
              key={idx}
              className="group relative overflow-hidden rounded-2xl cursor-pointer"
            >
              <div className="aspect-[4/5] relative">
                {collection.image ? (
                  <ImageWithFallback
                    src={collection.image}
                    alt={collection.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-purple-500/30 to-cyan-500/30" />
                )}
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                
                {collection.badge && (
                  <Badge className="absolute top-4 right-4 bg-gradient-to-r from-purple-600 to-cyan-600 text-white">
                    {collection.badge}
                  </Badge>
                )}

                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-white font-bold text-2xl mb-2">{collection.name}</h3>
                  <p className="text-white/90 mb-4">{collection.description}</p>
                  {collection.itemCount && (
                    <p className="text-sm text-white/70 mb-4">
                      {collection.itemCount} items
                    </p>
                  )}
                  <Button
                    variant="outline"
                    className="border-white text-white hover:bg-white hover:text-black"
                  >
                    Shop Now
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}