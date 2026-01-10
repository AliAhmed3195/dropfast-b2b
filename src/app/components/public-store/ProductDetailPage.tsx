'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Star,
  Minus,
  Plus,
  Heart,
  Share2,
  Truck,
  ShieldCheck,
  RotateCcw,
  Check,
} from 'lucide-react'
import { Button } from '../ui/button'
import { showToast } from '../../../lib/toast'

interface ProductDetailPageProps {
  product: any
  storeTheme: {
    primaryColor: string
    secondaryColor: string
    fontFamily: string
  }
  relatedProducts: any[]
  onAddToCart: (product: any, quantity: number) => void
  onBack: () => void
  storeSlug?: string
}

export function ProductDetailPage({
  product,
  storeTheme,
  relatedProducts,
  onAddToCart,
  onBack,
  storeSlug,
}: ProductDetailPageProps) {
  const router = useRouter()
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [activeTab, setActiveTab] = useState('description')
  const [showAddedToast, setShowAddedToast] = useState(false)

  const productImages = product.images || (product.image ? [product.image] : [])
  const isNew = product.createdAt ? new Date().getTime() - new Date(product.createdAt).getTime() < 30 * 24 * 60 * 60 * 1000 : false

  const handleAddToCart = () => {
    onAddToCart(product, quantity)
    setShowAddedToast(true)
    setTimeout(() => setShowAddedToast(false), 3000)
  }

  const handleToggleWishlist = () => {
    setIsWishlisted(!isWishlisted)
    showToast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist')
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      showToast.success('Link copied to clipboard')
    }
  }

  const incrementQuantity = () => {
    if (quantity < (product.stock || 0) && product.inStock) {
      setQuantity(quantity + 1)
    }
  }

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  const parseShippingMethods = () => {
    if (!product.shippingMethods) return []
    try {
      return typeof product.shippingMethods === 'string'
        ? JSON.parse(product.shippingMethods)
        : product.shippingMethods
    } catch {
      return []
    }
  }

  const shippingMethods = parseShippingMethods()

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      {storeSlug && (
        <div className="bg-gray-50 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center gap-2 text-sm">
              <button
                onClick={() => router.push(`/store/${storeSlug}`)}
                className="text-gray-600 hover:underline transition"
                style={{ '--hover-color': storeTheme.primaryColor } as React.CSSProperties}
                onMouseEnter={(e) => (e.currentTarget.style.color = storeTheme.primaryColor)}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#4b5563')}
              >
                Home
              </button>
              <span className="text-gray-400">/</span>
              <button
                onClick={() => router.push(`/store/${storeSlug}`)}
                className="text-gray-600 hover:underline transition"
                onMouseEnter={(e) => (e.currentTarget.style.color = storeTheme.primaryColor)}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#4b5563')}
              >
                Products
              </button>
              {product.category && (
                <>
                  <span className="text-gray-400">/</span>
                  <button
                    onClick={() => router.push(`/store/${storeSlug}?category=${product.category.toLowerCase()}`)}
                    className="text-gray-600 hover:underline transition"
                    onMouseEnter={(e) => (e.currentTarget.style.color = storeTheme.primaryColor)}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#4b5563')}
                  >
                    {product.category}
                  </button>
                </>
              )}
              <span className="text-gray-400">/</span>
              <span className="text-gray-900 font-medium">{product.name}</span>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Images */}
          <div className="space-y-4">
            <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100 border border-gray-200">
              <img
                src={productImages[selectedImage] || product.image || '/placeholder-image.jpg'}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {productImages.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {productImages.map((image: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition ${
                      selectedImage === index
                        ? 'border-primary'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    style={{
                      borderColor: selectedImage === index ? storeTheme.primaryColor : undefined,
                    }}
                  >
                    <img
                      src={image || '/placeholder-image.jpg'}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            {/* Badges */}
            <div className="flex items-center gap-2 mb-4">
              {isNew && (
                <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full">
                  NEW ARRIVAL
                </span>
              )}
              {product.featured && (
                <span
                  className="px-3 py-1 text-xs font-semibold rounded-full"
                  style={{
                    backgroundColor: `${storeTheme.primaryColor}20`,
                    color: storeTheme.primaryColor,
                  }}
                >
                  FEATURED
                </span>
              )}
              {product.inStock && (product.stock || 0) > 0 ? (
                <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                  IN STOCK
                </span>
              ) : (
                <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full">
                  OUT OF STOCK
                </span>
              )}
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(product.rating || 0)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-medium text-gray-900">{product.rating || 0}</span>
              <span className="text-sm text-gray-600">
                ({product.reviews || 0} {product.reviews === 1 ? 'review' : 'reviews'})
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-4xl font-bold text-gray-900">
                ${typeof product.price === 'number' ? product.price.toFixed(2) : product.price}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <>
                  <span className="text-xl text-gray-500 line-through">
                    ${typeof product.originalPrice === 'number' ? product.originalPrice.toFixed(2) : product.originalPrice}
                  </span>
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-semibold rounded-full">
                    Save ${((product.originalPrice - product.price) / product.originalPrice * 100).toFixed(0)}%
                  </span>
                </>
              )}
            </div>

            {/* Short Description */}
            <p className="text-gray-700 mb-8 leading-relaxed">
              {product.description || product.shortDescription || 'No description available.'}
            </p>

            {/* SKU & Category */}
            <div className="flex items-center gap-4 mb-6 text-sm">
              <span className="text-gray-600">SKU:</span>
              <span className="font-medium text-gray-900">{product.sku || 'N/A'}</span>
              {product.category && (
                <>
                  <span className="text-gray-400">|</span>
                  <span className="text-gray-600">Category:</span>
                  <button
                    onClick={() => storeSlug && router.push(`/store/${storeSlug}?category=${product.category.toLowerCase()}`)}
                    className="font-medium hover:underline transition"
                    style={{ color: storeTheme.primaryColor }}
                  >
                    {product.category}
                  </button>
                </>
              )}
            </div>

            {/* Quantity */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-900 mb-3">Quantity</label>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={decrementQuantity}
                    disabled={quantity <= 1}
                    className="px-4 py-3 hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => {
                      const val = Math.max(1, Math.min(product.stock || 1, parseInt(e.target.value) || 1))
                      setQuantity(val)
                    }}
                    className="w-16 text-center border-x border-gray-300 py-3 focus:outline-none"
                  />
                  <button
                    onClick={incrementQuantity}
                    disabled={quantity >= (product.stock || 0) || !product.inStock}
                    className="px-4 py-3 hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-sm text-gray-600">
                  {product.inStock && (product.stock || 0) > 0 ? `${product.stock} available` : 'Out of Stock'}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 mb-8">
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock || (product.stock || 0) <= 0}
                className="flex-1 px-8 py-4 font-semibold rounded-lg hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed text-white flex items-center justify-center gap-2"
                style={{ backgroundColor: storeTheme.primaryColor }}
              >
                Add to Cart
              </button>
              <button
                onClick={handleToggleWishlist}
                className={`px-4 py-4 border-2 rounded-lg hover:border-primary hover:text-primary transition ${
                  isWishlisted ? 'border-red-500 text-red-500' : 'border-gray-300'
                }`}
                style={{
                  borderColor: isWishlisted ? undefined : undefined,
                  color: isWishlisted ? '#ef4444' : undefined,
                }}
              >
                <Heart className={`w-6 h-6 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
              <button
                onClick={handleShare}
                className="px-4 py-4 border-2 border-gray-300 rounded-lg hover:border-primary hover:text-primary transition"
                style={{
                  borderColor: undefined,
                  '--tw-text-opacity': 1,
                } as React.CSSProperties}
              >
                <Share2 className="w-6 h-6" />
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-6 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                  <Truck className="w-5 h-5" style={{ color: storeTheme.primaryColor }} />
                </div>
                <div>
                  <div className="font-medium text-sm text-gray-900">
                    {shippingMethods.length > 0 && shippingMethods[0].cost === 0
                      ? 'Free Shipping'
                      : 'Shipping Available'}
                  </div>
                  <div className="text-xs text-gray-600">
                    {shippingMethods.length > 0
                      ? shippingMethods[0].name || 'Standard shipping'
                      : 'On orders $50+'}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" style={{ color: storeTheme.primaryColor }} />
                </div>
                <div>
                  <div className="font-medium text-sm text-gray-900">
                    {product.warrantyPeriod || 'Warranty'}
                  </div>
                  <div className="text-xs text-gray-600">Manufacturer</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                  <RotateCcw className="w-5 h-5" style={{ color: storeTheme.primaryColor }} />
                </div>
                <div>
                  <div className="font-medium text-sm text-gray-900">30-Day Returns</div>
                  <div className="text-xs text-gray-600">Money back</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-16">
          <div className="border-b border-gray-200">
            <div className="flex gap-8">
              {['description', 'specifications', 'reviews'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-4 px-1 font-medium capitalize transition ${
                    activeTab === tab
                      ? 'text-primary border-b-2 border-primary'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  style={{
                    color: activeTab === tab ? storeTheme.primaryColor : undefined,
                    borderColor: activeTab === tab ? storeTheme.primaryColor : undefined,
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="py-8">
            {activeTab === 'description' && (
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed">
                  {product.description || 'No description available.'}
                </p>
              </div>
            )}

            {activeTab === 'specifications' && (
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { label: 'SKU', value: product.sku || 'N/A' },
                  { label: 'Category', value: product.category || 'N/A' },
                  { label: 'Brand', value: product.brand || 'N/A' },
                  { label: 'Condition', value: product.condition || 'N/A' },
                  { label: 'Availability', value: product.inStock && (product.stock || 0) > 0 ? `${product.stock} units in stock` : 'Out of stock' },
                  { label: 'Supplier', value: product.supplierName || 'N/A' },
                  { label: 'Weight', value: product.weight && product.weightUnit ? `${product.weight} ${product.weightUnit}` : 'N/A' },
                  { label: 'Dimensions', value: product.length && product.width && product.height && product.dimensionUnit ? `${product.length} x ${product.width} x ${product.height} ${product.dimensionUnit}` : 'N/A' },
                  { label: 'Warranty', value: product.warrantyPeriod || 'N/A' },
                  { label: 'Lead Time', value: product.leadTime || 'N/A' },
                ]
                  .filter((spec) => spec.value !== 'N/A')
                  .map((spec, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="text-sm text-gray-600 mb-1">{spec.label}</div>
                        <div className="font-medium text-gray-900">{spec.value}</div>
                      </div>
                    </div>
                  ))}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                <div className="mb-8 p-6 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-8">
                    <div className="text-center">
                      <div className="text-5xl font-bold text-gray-900 mb-2">
                        {product.rating || 0}
                      </div>
                      <div className="flex items-center gap-1 mb-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 ${
                              i < Math.floor(product.rating || 0)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <div className="text-sm text-gray-600">
                        {product.reviews || 0} {product.reviews === 1 ? 'review' : 'reviews'}
                      </div>
                    </div>
                  </div>
                </div>

                {product.reviews === 0 && (
                  <div className="text-center py-8 text-gray-600">
                    No reviews yet. Be the first to review this product!
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.slice(0, 4).map((relatedProduct: any) => (
                <button
                  key={relatedProduct.id}
                  onClick={() => storeSlug && router.push(`/store/${storeSlug}/product/${relatedProduct.id}`)}
                  className="group bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition text-left"
                >
                  <div className="relative aspect-square overflow-hidden bg-gray-100">
                    <img
                      src={relatedProduct.images?.[0] || relatedProduct.image || '/placeholder-image.jpg'}
                      alt={relatedProduct.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {relatedProduct.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-gray-900">
                        ${typeof relatedProduct.price === 'number' ? relatedProduct.price.toFixed(2) : relatedProduct.price}
                      </span>
                      {relatedProduct.originalPrice && relatedProduct.originalPrice > relatedProduct.price && (
                        <span className="text-sm text-gray-500 line-through">
                          ${typeof relatedProduct.originalPrice === 'number' ? relatedProduct.originalPrice.toFixed(2) : relatedProduct.originalPrice}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Added to Cart Toast */}
      {showAddedToast && (
        <div className="fixed bottom-8 right-8 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <Check className="w-5 h-5" />
          <span className="font-medium">Added to cart successfully!</span>
        </div>
      )}
    </div>
  )
}
