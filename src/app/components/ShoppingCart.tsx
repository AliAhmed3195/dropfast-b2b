'use client'

import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  ArrowLeft,
  CreditCard,
  Package,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { showToast } from '../../lib/toast';
import { EmptyState } from './ui/EmptyState';

export function ShoppingCartComponent() {
  const { user } = useAuth();
  const router = useRouter();
  
  // Get cart from localStorage
  const [cart, setCart] = useState<any[]>(() => {
    if (typeof window !== 'undefined' && user?.id) {
      const saved = localStorage.getItem(`cart_${user.id}`);
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const getCartTotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const updateCartItem = (productId: string, quantity: number) => {
    const updated = cart.map((item: any) =>
      item.productId === productId ? { ...item, quantity } : item
    ).filter((item: any) => item.quantity > 0);
    setCart(updated);
    if (user?.id && typeof window !== 'undefined') {
      localStorage.setItem(`cart_${user.id}`, JSON.stringify(updated));
    }
  };

  const removeFromCart = (productId: string) => {
    const updated = cart.filter((item: any) => item.productId !== productId);
    setCart(updated);
    if (user?.id && typeof window !== 'undefined') {
      localStorage.setItem(`cart_${user.id}`, JSON.stringify(updated));
    }
  };

  const clearCart = () => {
    setCart([]);
    if (user?.id && typeof window !== 'undefined') {
      localStorage.setItem(`cart_${user.id}`, JSON.stringify([]));
    }
    showToast.success('Cart cleared');
  };

  const subtotal = getCartTotal();
  const shipping = cart.length > 0 ? 10 : 0;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  const handleUpdateQuantity = (productId: string, currentQuantity: number, delta: number) => {
    const newQuantity = currentQuantity + delta;
    if (newQuantity < 1) return;
    updateCartItem(productId, newQuantity);
  };

  const handleRemove = (productId: string) => {
    removeFromCart(productId);
    showToast.success('Item removed from cart');
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      showToast.error('Your cart is empty');
      return;
    }
    router.push('/dashboard/customer/checkout');
  };

  if (cart.length === 0) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => router.push('/dashboard/customer/browse')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Shopping
        </Button>
        <EmptyState
          icon={ShoppingCart}
          title="Your cart is empty"
          description="Add some products to get started"
          action={{
            label: 'Browse Products',
            onClick: () => router.push('/dashboard/customer/browse'),
          }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Button variant="ghost" onClick={() => router.push('/dashboard/customer/browse')} className="mb-2">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Continue Shopping
          </Button>
          <h2 className="text-3xl font-bold">Shopping Cart</h2>
          <p className="text-muted-foreground">{cart.length} items in your cart</p>
        </div>
        <Button variant="outline" onClick={clearCart}>
          Clear Cart
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item: any, index: number) => (
            <motion.div
              key={item.productId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-4">
                <div className="flex gap-4">
                  <div className="w-24 h-24 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center overflow-hidden">
                    {item.productImage ? (
                      <img
                        src={item.productImage}
                        alt={item.productName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Package className="w-8 h-8 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold mb-1">{item.productName}</h4>
                        <p className="text-sm text-muted-foreground">
                          from {item.storeName}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemove(item.productId)}
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleUpdateQuantity(item.productId, item.quantity, -1)
                          }
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="w-12 text-center font-medium">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleUpdateQuantity(item.productId, item.quantity, 1)
                          }
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          ${item.price.toFixed(2)} each
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Order Summary */}
        <div>
          <Card className="p-6 sticky top-24">
            <h3 className="font-bold text-lg mb-4">Order Summary</h3>
            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-medium">${shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax (10%)</span>
                <span className="font-medium">${tax.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="font-semibold">Total</span>
                <span className="font-bold text-xl">${total.toFixed(2)}</span>
              </div>
            </div>
            <Button
              onClick={handleCheckout}
              className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white"
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Proceed to Checkout
            </Button>
            <div className="mt-4 p-3 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
              <p className="text-xs text-center text-muted-foreground">
                Secure checkout powered by FastDrop
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
