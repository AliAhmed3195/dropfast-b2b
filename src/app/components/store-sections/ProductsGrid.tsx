'use client'

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ShoppingCart, Heart, Eye, Star } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

interface ProductsGridProps {
  heading?: string;
  subheading?: string;
  columns?: number;
  rows?: number;
  productCount?: number;
  showFilters?: boolean;
  showRating?: boolean;
  showQuickActions?: boolean;
  showStockBadge?: boolean;
  backgroundColor?: string;
  textAlignment?: 'left' | 'center' | 'right';
  layout?: 'grid' | 'carousel';
  products?: any[];
  onProductClick?: (productId: string) => void;
  theme?: {
    primaryColor: string;
    secondaryColor: string;
  };
}

// Mock products
const mockProducts = [
  {
    id: 1,
    name: 'Wireless Earbuds Pro',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500',
    rating: 4.5,
    reviews: 128,
    inStock: true,
  },
  {
    id: 2,
    name: 'Smart Watch Ultra',
    price: 299.99,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
    rating: 4.8,
    reviews: 256,
    inStock: true,
  },
  {
    id: 3,
    name: 'Laptop Stand',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500',
    rating: 4.3,
    reviews: 89,
    inStock: false,
  },
  {
    id: 4,
    name: 'USB-C Hub',
    price: 39.99,
    image: 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=500',
    rating: 4.6,
    reviews: 172,
    inStock: true,
  },
  {
    id: 5,
    name: 'Mechanical Keyboard',
    price: 129.99,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500',
    rating: 4.9,
    reviews: 341,
    inStock: true,
  },
  {
    id: 6,
    name: 'Wireless Mouse',
    price: 59.99,
    image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=500',
    rating: 4.4,
    reviews: 203,
    inStock: true,
  },
  {
    id: 7,
    name: 'Webcam HD Pro',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1589003077984-894e133dabab?w=500',
    rating: 4.7,
    reviews: 156,
    inStock: true,
  },
  {
    id: 8,
    name: 'Phone Stand',
    price: 24.99,
    image: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=500',
    rating: 4.2,
    reviews: 67,
    inStock: true,
  },
];

export function ProductsGrid({
  heading = 'Our Products',
  subheading = '',
  columns = 4,
  rows = 2,
  productCount,
  showFilters = true,
  showRating = true,
  showQuickActions = true,
  showStockBadge = true,
  backgroundColor = '',
  textAlignment = 'center',
  layout = 'grid',
  products,
  onProductClick,
  theme,
}: ProductsGridProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Use provided products or empty array (don't use mockProducts)
  const productsToDisplay = products && products.length > 0 ? products : [];
  
  // Calculate display products count
  // Priority: productCount > (columns * rows) > default
  const maxProducts = productCount || (columns && rows ? columns * rows : 8);
  const displayProducts = productsToDisplay.slice(0, maxProducts);
  
  // Use theme colors or defaults
  const primaryColor = theme?.primaryColor || '#6366f1';
  const secondaryColor = theme?.secondaryColor || '#06b6d4';

  // Get text alignment class
  const getTextAlignmentClass = () => {
    switch (textAlignment) {
      case 'left':
        return 'text-left';
      case 'right':
        return 'text-right';
      default:
        return 'text-center';
    }
  };

  // Get grid columns class based on columns prop
  const getGridCols = () => {
    const cols = Math.min(Math.max(columns || 4, 1), 6);
    return {
      1: 'grid-cols-1',
      2: 'grid-cols-1 sm:grid-cols-2',
      3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
      4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
      5: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5',
      6: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6',
    }[cols] || 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
  };

  return (
    <section 
      className="py-16"
      style={{ 
        backgroundColor: backgroundColor || undefined,
        ...(backgroundColor ? {} : { background: 'inherit' })
      }}
    >
      <div className="container mx-auto px-4">
        {/* Heading */}
        <div className={`mb-12 ${getTextAlignmentClass()}`}>
          {heading && (
            <motion.h2
              className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              {heading}
            </motion.h2>
          )}
          {subheading && (
            <motion.p
              className="text-lg text-muted-foreground"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              {subheading}
            </motion.p>
          )}
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {['all', 'electronics', 'accessories', 'new'].map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category)}
                className={
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white'
                    : ''
                }
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </Button>
            ))}
          </div>
        )}

        {/* Products Grid */}
        <div
          className={`grid ${getGridCols()} gap-6`}
        >
          {displayProducts.length === 0 ? (
            <div className="col-span-full text-center py-16">
              <p className="text-muted-foreground">No products available</p>
            </div>
          ) : (
            displayProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="overflow-hidden group hover:shadow-2xl transition-all duration-300 h-full flex flex-col">
                  {/* Product Image */}
                  <div
                    className="relative overflow-hidden aspect-square bg-slate-200 dark:bg-slate-800 cursor-pointer"
                    onClick={() => onProductClick?.(String(product.id))}
                  >
                    <img
                      src={product.image || product.images?.[0] || '/placeholder-image.jpg'}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />

                  {/* Quick Actions */}
                  {showQuickActions && (
                    <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="sm"
                        variant="secondary"
                        className="rounded-full w-10 h-10 p-0 shadow-lg"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Handle wishlist
                        }}
                      >
                        <Heart className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        className="rounded-full w-10 h-10 p-0 shadow-lg"
                        onClick={(e) => {
                          e.stopPropagation();
                          onProductClick?.(String(product.id));
                        }}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  )}

                  {/* Stock Badge */}
                  {showStockBadge && (!product.inStock || product.stock === 0 || (product.stock || 0) <= 0 || product.status !== 'active') && (
                    <Badge className="absolute top-3 left-3 bg-red-500 text-white">
                      Out of Stock
                    </Badge>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-4 flex-1 flex flex-col">
                  <h3
                    className="font-bold text-lg mb-2 line-clamp-2 cursor-pointer hover:text-purple-600 transition-colors"
                    onClick={() => onProductClick?.(String(product.id))}
                  >
                    {product.name}
                  </h3>

                  {/* Rating */}
                  {showRating && (product.rating || product.reviews) && (
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(product.rating || 0)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-slate-300'
                            }`}
                          />
                        ))}
                      </div>
                      {product.reviews > 0 && (
                        <span className="text-sm text-muted-foreground">
                          ({product.reviews})
                        </span>
                      )}
                    </div>
                  )}

                  {/* Price */}
                  <div className="mt-auto">
                    <p 
                      className="text-2xl font-bold mb-3"
                      style={{ color: primaryColor }}
                    >
                      ${product.price || 0}
                    </p>

                    {/* Add to Cart */}
                    <Button
                      className="w-full text-white"
                      style={{ 
                        background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})` 
                      }}
                      disabled={!product.inStock || (product.stock || 0) <= 0 || product.status !== 'active'}
                      onClick={(e) => {
                        e.stopPropagation();
                        onProductClick?.(String(product.id));
                      }}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      {(!product.inStock || (product.stock || 0) <= 0 || product.status !== 'active') ? 'Out of Stock' : 'Add to Cart'}
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}