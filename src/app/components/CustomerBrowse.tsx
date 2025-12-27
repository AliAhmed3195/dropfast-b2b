import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Store,
  Search,
  ShoppingCart,
  Heart,
  Star,
  Package,
  ExternalLink,
  Plus,
  Filter,
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation } from '../contexts/NavigationContext';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { toast } from 'sonner';

export function CustomerBrowse() {
  const { stores, products, addToCart, getProductById } = useApp();
  const { user } = useAuth();
  const { setView, setViewParams } = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Wishlist state (in real app, this would be in context/database)
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    const saved = localStorage.getItem(`wishlist_${user?.id}`);
    return saved ? JSON.parse(saved) : [];
  });

  const activeStores = stores.filter(s => s.status === 'active');

  const allProducts = products.filter(p => p.status === 'active');
  const categories = ['all', ...Array.from(new Set(allProducts.map(p => p.category)))];

  const filteredProducts = allProducts.filter(p => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddToCart = (productId: string) => {
    const product = getProductById(productId);
    if (!product) return;

    // Find store that has this product
    const store = stores.find(s => s.products.includes(productId));
    if (!store) {
      toast.error('Product not available in any store');
      return;
    }

    addToCart({
      productId: product.id,
      productName: product.name,
      productImage: product.images[0] || '',
      quantity: 1,
      price: product.price,
      storeId: store.id,
      storeName: store.name,
    });

    toast.success('Added to cart!');
  };
  
  const toggleWishlist = (productId: string) => {
    const isInWishlist = wishlistIds.includes(productId);
    let updated: string[];
    
    if (isInWishlist) {
      updated = wishlistIds.filter(id => id !== productId);
      toast.success('Removed from wishlist');
    } else {
      updated = [...wishlistIds, productId];
      toast.success('Added to wishlist');
    }
    
    setWishlistIds(updated);
    localStorage.setItem(`wishlist_${user?.id}`, JSON.stringify(updated));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold mb-2">Browse Products</h2>
        <p className="text-muted-foreground">
          Discover amazing products from verified stores
        </p>
      </div>

      {/* Featured Stores */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Featured Stores</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {activeStores.slice(0, 3).map((store, index) => (
            <motion.div
              key={store.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
                    <Store className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold">{store.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {store.products.length} products
                    </p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {store.description}
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Visit Store
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Search and Filter */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Products Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">
            {filteredProducts.length} Products Available
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="overflow-hidden hover:shadow-lg transition-all group">
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
                  {product.originalPrice && (
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-red-500 text-white">
                        {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                      </Badge>
                    </div>
                  )}
                  <button className="absolute top-3 right-3 p-2 rounded-full bg-white/80 dark:bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white dark:hover:bg-black" onClick={() => toggleWishlist(product.id)}>
                    <Heart className={`w-4 h-4 ${wishlistIds.includes(product.id) ? 'fill-red-500 text-red-500' : ''}`} />
                  </button>
                </div>
                <div className="p-4">
                  <div className="mb-2">
                    <Badge variant="outline" className="text-xs">
                      {product.category}
                    </Badge>
                  </div>
                  <h4 className="font-semibold mb-1 line-clamp-1">{product.name}</h4>
                  <p className="text-xs text-muted-foreground mb-2">
                    by {product.supplierName}
                  </p>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex items-center gap-1 mb-3">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{product.rating}</span>
                    <span className="text-sm text-muted-foreground">
                      ({product.reviews})
                    </span>
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-xl font-bold">${product.price}</p>
                      {product.originalPrice && (
                        <p className="text-sm text-muted-foreground line-through">
                          ${product.originalPrice}
                        </p>
                      )}
                    </div>
                    {product.stock > 0 ? (
                      <Badge variant="outline" className="text-xs">
                        {product.stock} left
                      </Badge>
                    ) : (
                      <Badge variant="destructive" className="text-xs">
                        Out of stock
                      </Badge>
                    )}
                  </div>
                  <Button
                    onClick={() => handleAddToCart(product.id)}
                    disabled={product.stock === 0}
                    className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to Cart
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <Card className="p-12 text-center">
            <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No products found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filters
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}