'use client'

import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  ShoppingCart,
  Heart,
  Star,
  Truck,
  Shield,
  Package,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Check,
  Minus,
  Plus,
} from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { toast } from 'sonner';
import { Product } from '../../contexts/AppContext';

interface ProductDetailPageProps {
  product: Product;
  storeTheme: {
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
  };
  relatedProducts: Product[];
  onAddToCart: (product: Product, quantity: number) => void;
  onBack: () => void;
}

export function ProductDetailPage({
  product,
  storeTheme,
  relatedProducts,
  onAddToCart,
  onBack,
}: ProductDetailPageProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleAddToCart = () => {
    onAddToCart(product, quantity);
    toast.success(`Added ${quantity} item(s) to cart`);
  };

  const handleToggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
  };

  const incrementQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={onBack} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Store
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <Card className="overflow-hidden relative">
              <div className="aspect-square bg-gray-100 flex items-center justify-center">
                <img
                  src={product.images[selectedImage] || 'https://via.placeholder.com/600'}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {product.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>
            </Card>

            {/* Thumbnail Gallery */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index ? 'border-current' : 'border-gray-200'
                    }`}
                    style={{
                      borderColor: selectedImage === index ? storeTheme.primaryColor : undefined,
                    }}
                  >
                    <img
                      src={image || 'https://via.placeholder.com/150'}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Title & Rating */}
            <div>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4"
                      fill={i < Math.floor(product.rating) ? storeTheme.primaryColor : 'none'}
                      style={{ color: storeTheme.primaryColor }}
                    />
                  ))}
                  <span className="ml-2 text-sm text-gray-600">
                    {product.rating} ({product.reviews} reviews)
                  </span>
                </div>
                <Badge variant={product.stock > 0 ? 'default' : 'secondary'}>
                  {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                </Badge>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span
                className="text-4xl font-bold"
                style={{ color: storeTheme.primaryColor }}
              >
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <>
                  <span className="text-xl text-gray-400 line-through">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                  <Badge
                    className="text-white"
                    style={{ backgroundColor: storeTheme.secondaryColor }}
                  >
                    Save {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                  </Badge>
                </>
              )}
            </div>

            <Separator />

            {/* Description */}
            <div>
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
            </div>

            <Separator />

            {/* Quantity & Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Label className="text-sm font-medium">Quantity:</Label>
                <div className="flex items-center border rounded-lg">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={decrementQuantity}
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="px-6 py-2 font-medium">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={incrementQuantity}
                    disabled={quantity >= product.stock}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <span className="text-sm text-gray-500">
                  {product.stock} available
                </span>
              </div>

              <div className="flex gap-3">
                <Button
                  className="flex-1 text-white"
                  size="lg"
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  style={{ backgroundColor: storeTheme.primaryColor }}
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleToggleWishlist}
                  className={isWishlisted ? 'text-red-500' : ''}
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                </Button>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 pt-6">
              <div className="flex flex-col items-center text-center gap-2">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${storeTheme.primaryColor}20` }}
                >
                  <Truck className="w-6 h-6" style={{ color: storeTheme.primaryColor }} />
                </div>
                <div>
                  <p className="font-medium text-sm">Free Shipping</p>
                  <p className="text-xs text-gray-500">On orders over $50</p>
                </div>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${storeTheme.primaryColor}20` }}
                >
                  <Shield className="w-6 h-6" style={{ color: storeTheme.primaryColor }} />
                </div>
                <div>
                  <p className="font-medium text-sm">Secure Payment</p>
                  <p className="text-xs text-gray-500">100% Protected</p>
                </div>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${storeTheme.primaryColor}20` }}
                >
                  <Package className="w-6 h-6" style={{ color: storeTheme.primaryColor }} />
                </div>
                <div>
                  <p className="font-medium text-sm">Easy Returns</p>
                  <p className="text-xs text-gray-500">30 Day Guarantee</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <Card className="mb-12">
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="w-full justify-start border-b rounded-none h-auto p-0">
              <TabsTrigger value="details" className="rounded-none data-[state=active]:border-b-2" style={{ borderColor: storeTheme.primaryColor }}>
                Product Details
              </TabsTrigger>
              <TabsTrigger value="reviews" className="rounded-none data-[state=active]:border-b-2" style={{ borderColor: storeTheme.primaryColor }}>
                Reviews ({product.reviews})
              </TabsTrigger>
              <TabsTrigger value="shipping" className="rounded-none data-[state=active]:border-b-2" style={{ borderColor: storeTheme.primaryColor }}>
                Shipping Info
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="p-6">
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">SKU</p>
                    <p className="font-medium">{product.sku}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Category</p>
                    <p className="font-medium">{product.category}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Availability</p>
                    <p className="font-medium">{product.stock} units in stock</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Supplier</p>
                    <p className="font-medium">{product.supplierName}</p>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="reviews" className="p-6">
              <div className="space-y-6">
                {/* Mock Reviews */}
                {[1, 2, 3].map((review) => (
                  <div key={review} className="border-b pb-6 last:border-0">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-4 h-4"
                            fill={i < 4 ? storeTheme.primaryColor : 'none'}
                            style={{ color: storeTheme.primaryColor }}
                          />
                        ))}
                      </div>
                      <span className="font-medium">Customer {review}</span>
                      <span className="text-sm text-gray-500">• 2 days ago</span>
                    </div>
                    <p className="text-gray-700">
                      Great product! Exactly as described. Fast shipping and excellent quality.
                    </p>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="shipping" className="p-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 mt-0.5" style={{ color: storeTheme.primaryColor }} />
                  <div>
                    <p className="font-medium">Free Standard Shipping</p>
                    <p className="text-sm text-gray-600">On orders over $50 - Delivery in 5-7 business days</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 mt-0.5" style={{ color: storeTheme.primaryColor }} />
                  <div>
                    <p className="font-medium">Express Shipping Available</p>
                    <p className="text-sm text-gray-600">$15 flat rate - Delivery in 2-3 business days</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 mt-0.5" style={{ color: storeTheme.primaryColor }} />
                  <div>
                    <p className="font-medium">International Shipping</p>
                    <p className="text-sm text-gray-600">Available to most countries - Delivery in 10-15 business days</p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </Card>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Related Products</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.slice(0, 4).map((relatedProduct) => (
                <Card key={relatedProduct.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="aspect-square bg-gray-100">
                    <img
                      src={relatedProduct.images[0] || 'https://via.placeholder.com/300'}
                      alt={relatedProduct.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium mb-1 line-clamp-1">{relatedProduct.name}</h3>
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-3 h-3"
                          fill={i < Math.floor(relatedProduct.rating) ? storeTheme.primaryColor : 'none'}
                          style={{ color: storeTheme.primaryColor }}
                        />
                      ))}
                      <span className="text-xs text-gray-500 ml-1">
                        ({relatedProduct.reviews})
                      </span>
                    </div>
                    <p className="font-bold" style={{ color: storeTheme.primaryColor }}>
                      ${relatedProduct.price.toFixed(2)}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
