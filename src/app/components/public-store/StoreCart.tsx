'use client'

import React from 'react';
import { motion } from 'motion/react';
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  ArrowLeft,
  ArrowRight,
  Package,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { showToast } from '../../../lib/toast';
import { CartItem } from '../../contexts/AppContext';

interface StoreCartProps {
  cartItems: CartItem[];
  storeTheme: {
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
  };
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onContinueShopping: () => void;
  onProceedToCheckout: () => void;
}

export function StoreCart({
  cartItems,
  storeTheme,
  onUpdateQuantity,
  onRemoveItem,
  onContinueShopping,
  onProceedToCheckout,
}: StoreCartProps) {
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = cartItems.length > 0 ? 10 : 0;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  const handleUpdateQuantity = (productId: string, currentQuantity: number, delta: number) => {
    const newQuantity = currentQuantity + delta;
    if (newQuantity < 1) return;
    onUpdateQuantity(productId, newQuantity);
  };

  const handleRemove = (productId: string) => {
    onRemoveItem(productId);
    showToast.success('Item removed from cart');
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="pt-6 text-center space-y-4">
            <div
              className="w-20 h-20 rounded-full mx-auto flex items-center justify-center"
              style={{ backgroundColor: `${storeTheme.primaryColor}20` }}
            >
              <ShoppingCart className="w-10 h-10" style={{ color: storeTheme.primaryColor }} />
            </div>
            <h2 className="text-2xl font-bold">Your cart is empty</h2>
            <p className="text-gray-600">Add some products to your cart to continue shopping.</p>
            <Button
              onClick={onContinueShopping}
              className="text-white"
              style={{ backgroundColor: storeTheme.primaryColor }}
            >
              Continue Shopping
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={onContinueShopping} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Continue Shopping
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item, index) => (
              <motion.div
                key={item.productId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex gap-6">
                      {/* Product Image */}
                      <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        <img
                          src={item.productImage || 'https://via.placeholder.com/100'}
                          alt={item.productName}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg mb-1">{item.productName}</h3>
                        <p className="text-sm text-gray-500 mb-3">From {item.storeName}</p>
                        
                        <div className="flex items-center gap-6">
                          {/* Quantity Control */}
                          <div className="flex items-center border rounded-lg">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleUpdateQuantity(item.productId, item.quantity, -1)}
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                            <span className="px-4 py-2 font-medium min-w-[3rem] text-center">
                              {item.quantity}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleUpdateQuantity(item.productId, item.quantity, 1)}
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>

                          {/* Price */}
                          <div>
                            <p
                              className="text-xl font-bold"
                              style={{ color: storeTheme.primaryColor }}
                            >
                              ${(item.price * item.quantity).toFixed(2)}
                            </p>
                            <p className="text-sm text-gray-500">
                              ${item.price.toFixed(2)} each
                            </p>
                          </div>

                          {/* Remove Button */}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemove(item.productId)}
                            className="ml-auto text-red-500 hover:text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Summary Details */}
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal ({cartItems.length} items)</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">${shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax (10%)</span>
                    <span className="font-medium">${tax.toFixed(2)}</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between text-lg">
                    <span className="font-bold">Total</span>
                    <span
                      className="font-bold text-2xl"
                      style={{ color: storeTheme.primaryColor }}
                    >
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Checkout Button */}
                <Button
                  className="w-full text-white"
                  size="lg"
                  onClick={onProceedToCheckout}
                  style={{ backgroundColor: storeTheme.primaryColor }}
                >
                  Proceed to Checkout
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>

                {/* Features */}
                <div className="space-y-3 pt-4 border-t">
                  <div className="flex items-center gap-3 text-sm">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: `${storeTheme.primaryColor}20` }}
                    >
                      <Package className="w-4 h-4" style={{ color: storeTheme.primaryColor }} />
                    </div>
                    <span className="text-gray-700">Free shipping on orders over $50</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: `${storeTheme.primaryColor}20` }}
                    >
                      <ShoppingCart className="w-4 h-4" style={{ color: storeTheme.primaryColor }} />
                    </div>
                    <span className="text-gray-700">Secure checkout</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
