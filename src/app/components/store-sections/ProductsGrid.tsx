import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ShoppingCart, Heart, Eye, Star } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

interface ProductsGridProps {
  heading?: string;
  columns?: number;
  rows?: number;
  showFilters?: boolean;
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
  columns = 4,
  rows = 2,
  showFilters = true,
  products = mockProducts,
  onProductClick,
  theme,
}: ProductsGridProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const displayProducts = products.slice(0, columns * rows);
  
  // Use theme colors or defaults
  const primaryColor = theme?.primaryColor || '#6366f1';
  const secondaryColor = theme?.secondaryColor || '#06b6d4';

  return (
    <section className="py-16 bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4">
        {/* Heading */}
        <div className="text-center mb-12">
          <motion.h2
            className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {heading}
          </motion.h2>
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
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {displayProducts.map((product, index) => (
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
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />

                  {/* Quick Actions */}
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

                  {/* Stock Badge */}
                  {!product.inStock && (
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
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(product.rating)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-slate-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      ({product.reviews})
                    </span>
                  </div>

                  {/* Price */}
                  <div className="mt-auto">
                    <p 
                      className="text-2xl font-bold mb-3"
                      style={{ color: primaryColor }}
                    >
                      ${product.price}
                    </p>

                    {/* Add to Cart */}
                    <Button
                      className="w-full text-white"
                      style={{ 
                        background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})` 
                      }}
                      disabled={!product.inStock}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}