'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import {
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
} from 'lucide-react'

interface StoreCartProps {
  cartItems: any[]
  storeTheme: {
    primaryColor: string
    secondaryColor: string
    fontFamily: string
  }
  onUpdateQuantity: (productId: string, quantity: number) => void
  onRemoveItem: (productId: string) => void
  onContinueShopping: () => void
  onProceedToCheckout: () => void
  storeSlug?: string
}

export function StoreCart({
  cartItems,
  storeTheme,
  onUpdateQuantity,
  onRemoveItem,
  onContinueShopping,
  onProceedToCheckout,
  storeSlug,
}: StoreCartProps) {
  const router = useRouter()
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const shipping = totalPrice >= 50 ? 0 : 9.99
  const tax = totalPrice * 0.1
  const total = totalPrice + shipping + tax

  const handleUpdateQuantity = (productId: string, currentQuantity: number, delta: number) => {
    const newQuantity = currentQuantity + delta
    if (newQuantity < 1) return
    onUpdateQuantity(productId, newQuantity)
  }

  const handleProductClick = (productId: string) => {
    if (storeSlug) {
      router.push(`/store/${storeSlug}/product/${productId}`)
    }
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-12 h-12 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some products to get started</p>
          <button
            onClick={onContinueShopping}
            className="inline-flex items-center gap-2 px-6 py-3 text-white font-semibold rounded-lg hover:opacity-90 transition"
            style={{ backgroundColor: storeTheme.primaryColor }}
          >
            Browse Products
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
          <p className="text-gray-600">
            {totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.productId}
                className="bg-white rounded-xl p-6 border border-gray-200"
              >
                <div className="flex gap-6">
                  {/* Image */}
                  <button
                    onClick={() => handleProductClick(item.productId)}
                    className="flex-shrink-0"
                  >
                    <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100">
                      <img
                        src={item.productImage || '/placeholder-image.jpg'}
                        alt={item.productName}
                        className="w-full h-full object-cover hover:scale-105 transition duration-300"
                      />
                    </div>
                  </button>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <button
                      onClick={() => handleProductClick(item.productId)}
                      className="font-semibold text-gray-900 hover:opacity-80 transition line-clamp-2 text-left w-full"
                      style={{
                        '--hover-color': storeTheme.primaryColor,
                      } as React.CSSProperties}
                      onMouseEnter={(e) => (e.currentTarget.style.color = storeTheme.primaryColor)}
                      onMouseLeave={(e) => (e.currentTarget.style.color = '#111827')}
                    >
                      {item.productName}
                    </button>
                    {item.sku && (
                      <div className="text-sm text-gray-600 mt-1">SKU: {item.sku}</div>
                    )}
                    <div className="mt-3 flex items-center gap-4">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-gray-300 rounded-lg">
                        <button
                          onClick={() => handleUpdateQuantity(item.productId, item.quantity, -1)}
                          className="px-3 py-2 hover:bg-gray-100 transition"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => {
                            const val = Math.max(1, parseInt(e.target.value) || 1)
                            onUpdateQuantity(item.productId, val)
                          }}
                          className="w-16 text-center border-x border-gray-300 py-2 focus:outline-none"
                        />
                        <button
                          onClick={() => handleUpdateQuantity(item.productId, item.quantity, 1)}
                          className="px-3 py-2 hover:bg-gray-100 transition"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Remove */}
                      <button
                        onClick={() => onRemoveItem(item.productId)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Remove from cart"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="text-right">
                    <div className="text-xl font-bold text-gray-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      ${item.price.toFixed(2)} each
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 border border-gray-200 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal ({totalItems} items)</span>
                  <span className="font-medium">${totalPrice.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-gray-700">
                  <span>Shipping</span>
                  <span className="font-medium">
                    {shipping === 0 ? (
                      <span className="text-green-600">FREE</span>
                    ) : (
                      `$${shipping.toFixed(2)}`
                    )}
                  </span>
                </div>

                {shipping > 0 && (
                  <div className="p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
                    Add ${(50 - totalPrice).toFixed(2)} more for FREE shipping!
                  </div>
                )}

                <div className="flex justify-between text-gray-700">
                  <span>Tax (10%)</span>
                  <span className="font-medium">${tax.toFixed(2)}</span>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">Total</span>
                    <span className="text-2xl font-bold text-gray-900">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={onProceedToCheckout}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 text-white font-semibold rounded-lg hover:opacity-90 transition mb-4"
                style={{ backgroundColor: storeTheme.primaryColor }}
              >
                Proceed to Checkout
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                onClick={onContinueShopping}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:border-primary hover:text-primary transition"
                style={{
                  '--hover-border-color': storeTheme.primaryColor,
                  '--hover-text-color': storeTheme.primaryColor,
                } as React.CSSProperties}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = storeTheme.primaryColor
                  e.currentTarget.style.color = storeTheme.primaryColor
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#d1d5db'
                  e.currentTarget.style.color = '#374151'
                }}
              >
                Continue Shopping
              </button>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
                <div className="flex items-center gap-3 text-sm text-gray-700">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Secure checkout</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-700">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>30-day money-back guarantee</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-700">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Free shipping on $50+</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
