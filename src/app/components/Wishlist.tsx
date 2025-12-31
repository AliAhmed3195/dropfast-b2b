'use client'

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import {
  Heart,
  ShoppingCart,
  Trash2,
  Star,
  Package,
  Tag,
  ArrowRight,
  Loader2,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { showToast } from '../../lib/toast';

export function Wishlist() {
  const { user } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const fetchingRef = useRef(false);
  
  // In a real app, wishlist would be stored in state/database
  // For now, using localStorage
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    if (typeof window !== 'undefined' && user?.id) {
      const saved = localStorage.getItem(`wishlist_${user.id}`);
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  // Fetch products
  useEffect(() => {
    if (fetchingRef.current) return;

    fetchingRef.current = true;
    setLoading(true);

    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/customer/products');
        const data = await response.json();

        if (response.ok) {
          setProducts(data.products || []);
        } else {
          showToast.error(data.error || 'Failed to fetch products');
        }
      } catch (error) {
        console.error('Fetch products error:', error);
        showToast.error('Failed to fetch products');
      } finally {
        setLoading(false);
        fetchingRef.current = false;
      }
    };

    fetchProducts();
  }, []);

  const wishlistProducts = products.filter((p: any) => wishlistIds.includes(p.id));

  // Get cart from localStorage
  const [cart, setCart] = useState<any[]>(() => {
    if (typeof window !== 'undefined' && user?.id) {
      const saved = localStorage.getItem(`cart_${user.id}`);
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const removeFromWishlist = (productId: string) => {
    const updated = wishlistIds.filter(id => id !== productId);
    setWishlistIds(updated);
    if (user?.id && typeof window !== 'undefined') {
      localStorage.setItem(`wishlist_${user.id}`, JSON.stringify(updated));
    }
    showToast.success('Removed from wishlist');
  };

  const handleAddToCart = (product: any) => {
    try {
      const cartItems = JSON.parse(localStorage.getItem(`cart_${user?.id}`) || '[]');
      const existingItem = cartItems.find((item: any) => item.productId === product.id);
      
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cartItems.push({
          productId: product.id,
          productName: product.name,
          productImage: product.images?.[0] || '',
          quantity: 1,
          price: product.price,
          storeId: 'store-1', // TODO: Get from product/store relationship
          storeName: 'Store',
        });
      }
      
      if (user?.id && typeof window !== 'undefined') {
        localStorage.setItem(`cart_${user.id}`, JSON.stringify(cartItems));
        setCart(cartItems);
      }
      showToast.success('Added to cart!');
    } catch (error) {
      showToast.error('Failed to add to cart');
    }
  };

  const isInCart = (productId: string) => {
    return cart.some((item: any) => item.productId === productId);
  };

  const totalValue = wishlistProducts.reduce((sum, p) => sum + p.price, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold mb-2">My Wishlist</h2>
        <p className="text-muted-foreground">
          {wishlistProducts.length} {wishlistProducts.length === 1 ? 'item' : 'items'} saved for later
        </p>
      </div>

      {/* Stats */}
      {wishlistProducts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Items</p>
                <p className="text-2xl font-bold">{wishlistProducts.length}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500">
                <Tag className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Value</p>
                <p className="text-2xl font-bold">${totalValue.toFixed(2)}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500">
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">In Cart</p>
                <p className="text-2xl font-bold">
                  {wishlistProducts.filter(p => isInCart(p.id)).length}
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Wishlist Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      ) : wishlistProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistProducts.map((product: any, index: number) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="overflow-hidden hover:shadow-lg transition-all group">
                {/* Product Image */}
                <div className="relative aspect-square bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 overflow-hidden">
                  {product.images[0] ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-16 h-16 text-muted-foreground" />
                    </div>
                  )}
                  
                  {/* Remove Button */}
                  <Button
                    size="sm"
                    variant="secondary"
                    className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeFromWishlist(product.id)}
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </Button>

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {product.featured && (
                      <Badge className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white border-0">
                        Featured
                      </Badge>
                    )}
                    {product.originalPrice && (
                      <Badge className="bg-red-500 text-white border-0">
                        Save ${(product.originalPrice - product.price).toFixed(2)}
                      </Badge>
                    )}
                  </div>

                  {/* Quick Add to Cart */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="sm"
                      className="w-full bg-white text-black hover:bg-gray-100"
                      onClick={() => handleAddToCart(product)}
                      disabled={isInCart(product.id)}
                    >
                      {isInCart(product.id) ? (
                        <>
                          <Package className="w-4 h-4 mr-2" />
                          In Cart
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Add to Cart
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <div className="mb-2">
                    <Badge variant="outline" className="text-xs mb-2">
                      {product.category}
                    </Badge>
                    <h3 className="font-semibold line-clamp-2 mb-1">{product.name}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {product.description}
                    </p>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < Math.floor(product.rating)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      ({product.reviews})
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex items-end gap-2 mb-3">
                    <p className="text-xl font-bold">${product.price.toFixed(2)}</p>
                    {product.originalPrice && (
                      <p className="text-sm text-muted-foreground line-through">
                        ${product.originalPrice.toFixed(2)}
                      </p>
                    )}
                  </div>

                  {/* Stock Status */}
                  <div className="mb-3">
                    {product.stock > 20 ? (
                      <Badge className="bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                        In Stock
                      </Badge>
                    ) : product.stock > 0 ? (
                      <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400">
                        Only {product.stock} left
                      </Badge>
                    ) : (
                      <Badge className="bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400">
                        Out of Stock
                      </Badge>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="flex-1 bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white"
                      onClick={() => handleAddToCart(product)}
                      disabled={isInCart(product.id) || product.stock === 0}
                    >
                      {isInCart(product.id) ? 'In Cart' : 'Add to Cart'}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => removeFromWishlist(product.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <Heart className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-bold mb-2">Your wishlist is empty</h3>
          <p className="text-muted-foreground mb-6">Save products you love to buy them later</p>
          <Button
            onClick={() => router.push('/dashboard/customer/browse')}
            className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white"
          >
            Start Shopping
          </Button>
        </Card>
      )}
    </div>
  );
}
