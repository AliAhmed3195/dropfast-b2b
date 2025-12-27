'use client'

import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  CreditCard,
  Truck,
  MapPin,
  Lock,
  CheckCircle2,
  Package,
  User,
  Mail,
  Phone,
  Home,
  Building,
  Globe,
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { toast } from 'sonner';

interface CheckoutFormData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  paymentMethod: 'credit_card' | 'paypal' | 'bank_transfer';
}

export function Checkout() {
  const { cart, getCartTotal, clearCart, addOrder } = useApp();
  const { user } = useAuth();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<CheckoutFormData>({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    paymentMethod: 'credit_card',
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const subtotal = getCartTotal();
  const shipping = cart.length > 0 ? 10 : 0;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  const handleInputChange = (field: keyof CheckoutFormData, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const validateStep1 = () => {
    if (!formData.fullName || !formData.email || !formData.phone) {
      toast.error('Please fill in all contact information');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.address || !formData.city || !formData.state || !formData.zipCode || !formData.country) {
      toast.error('Please fill in all shipping address fields');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    } else if (currentStep === 2 && validateStep2()) {
      setCurrentStep(3);
    }
  };

  const handlePlaceOrder = async () => {
    if (!user) return;

    setIsProcessing(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Group items by store
    const storeOrders = cart.reduce((acc, item) => {
      if (!acc[item.storeId]) {
        acc[item.storeId] = {
          storeId: item.storeId,
          storeName: item.storeName,
          items: [],
        };
      }
      acc[item.storeId].items.push({
        productId: item.productId,
        productName: item.productName,
        productImage: item.productImage,
        quantity: item.quantity,
        price: item.price,
        supplierId: '2', // In real app, get from product data
      });
      return acc;
    }, {} as Record<string, any>);

    // Create orders for each store
    Object.values(storeOrders).forEach((storeOrder: any) => {
      const orderSubtotal = storeOrder.items.reduce(
        (sum: number, item: any) => sum + item.price * item.quantity,
        0
      );

      addOrder({
        customerId: user.id,
        customerName: formData.fullName,
        customerEmail: formData.email,
        storeId: storeOrder.storeId,
        storeName: storeOrder.storeName,
        items: storeOrder.items,
        subtotal: orderSubtotal,
        shipping: shipping / Object.keys(storeOrders).length,
        tax: orderSubtotal * 0.1,
        total: orderSubtotal + shipping / Object.keys(storeOrders).length + orderSubtotal * 0.1,
        status: 'pending',
        shippingAddress: {
          fullName: formData.fullName,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country,
          phone: formData.phone,
        },
        paymentMethod: formData.paymentMethod,
        paymentStatus: 'paid',
      });
    });

    clearCart();
    setIsProcessing(false);
    toast.success('Order placed successfully!');
    router.push('/dashboard/customer/orders');
  };

  const steps = [
    { number: 1, title: 'Contact Info', icon: User },
    { number: 2, title: 'Shipping', icon: Truck },
    { number: 3, title: 'Payment', icon: CreditCard },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Button variant="ghost" onClick={() => router.push('/dashboard/customer/cart')} className="mb-2">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Cart
        </Button>
        <h2 className="text-3xl font-bold mb-2">Checkout</h2>
        <p className="text-muted-foreground">Complete your order securely</p>
      </div>

      {/* Progress Steps */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <React.Fragment key={step.number}>
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                    currentStep >= step.number
                      ? 'bg-gradient-to-r from-purple-500 to-cyan-500 text-white shadow-lg'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {currentStep > step.number ? (
                    <CheckCircle2 className="w-6 h-6" />
                  ) : (
                    <step.icon className="w-6 h-6" />
                  )}
                </div>
                <div className="hidden md:block">
                  <p className={`font-semibold ${currentStep >= step.number ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {step.title}
                  </p>
                  <p className="text-xs text-muted-foreground">Step {step.number}</p>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className={`flex-1 h-1 mx-4 rounded-full ${currentStep > step.number ? 'bg-gradient-to-r from-purple-500 to-cyan-500' : 'bg-muted'}`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Step 1: Contact Information */}
          {currentStep === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Contact Information</h3>
                    <p className="text-sm text-muted-foreground">
                      Where should we send order updates?
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="fullName" className="text-sm font-semibold mb-2 block">Full Name *</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="fullName"
                        placeholder="John Doe"
                        value={formData.fullName}
                        onChange={e => handleInputChange('fullName', e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-sm font-semibold mb-2 block">Email Address *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={e => handleInputChange('email', e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="phone" className="text-sm font-semibold mb-2 block">Phone Number *</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        value={formData.phone}
                        onChange={e => handleInputChange('phone', e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <Button
                    onClick={handleNext}
                    className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white"
                  >
                    Continue to Shipping
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Step 2: Shipping Address */}
          {currentStep === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Shipping Address</h3>
                    <p className="text-sm text-muted-foreground">
                      Where should we deliver your order?
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="address" className="text-sm font-semibold mb-2 block">Street Address *</Label>
                    <div className="relative">
                      <Home className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="address"
                        placeholder="123 Main Street"
                        value={formData.address}
                        onChange={e => handleInputChange('address', e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city" className="text-sm font-semibold mb-2 block">City *</Label>
                      <div className="relative">
                        <Building className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="city"
                          placeholder="New York"
                          value={formData.city}
                          onChange={e => handleInputChange('city', e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="state" className="text-sm font-semibold mb-2 block">State *</Label>
                      <Input
                        id="state"
                        placeholder="NY"
                        value={formData.state}
                        onChange={e => handleInputChange('state', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="zipCode" className="text-sm font-semibold mb-2 block">ZIP Code *</Label>
                      <Input
                        id="zipCode"
                        placeholder="10001"
                        value={formData.zipCode}
                        onChange={e => handleInputChange('zipCode', e.target.value)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="country" className="text-sm font-semibold mb-2 block">Country *</Label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="country"
                          placeholder="United States"
                          value={formData.country}
                          onChange={e => handleInputChange('country', e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between gap-3 mt-6">
                  <Button variant="outline" onClick={() => setCurrentStep(1)}>
                    Back
                  </Button>
                  <Button
                    onClick={handleNext}
                    className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white"
                  >
                    Continue to Payment
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Step 3: Payment */}
          {currentStep === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500">
                    <CreditCard className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Payment Method</h3>
                    <p className="text-sm text-muted-foreground">
                      Choose your preferred payment method
                    </p>
                  </div>
                </div>

                <RadioGroup
                  value={formData.paymentMethod}
                  onValueChange={(value: any) => handleInputChange('paymentMethod', value)}
                  className="space-y-3"
                >
                  <div
                    className={`flex items-center gap-4 p-4 rounded-lg border-2 transition-all cursor-pointer ${
                      formData.paymentMethod === 'credit_card'
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/10'
                        : 'border-border hover:border-purple-300'
                    }`}
                    onClick={() => handleInputChange('paymentMethod', 'credit_card')}
                  >
                    <RadioGroupItem value="credit_card" id="credit_card" />
                    <div className="flex-1">
                      <Label htmlFor="credit_card" className="cursor-pointer font-semibold">
                        Credit / Debit Card
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Pay securely with your card
                      </p>
                    </div>
                    <CreditCard className="w-6 h-6 text-muted-foreground" />
                  </div>

                  <div
                    className={`flex items-center gap-4 p-4 rounded-lg border-2 transition-all cursor-pointer ${
                      formData.paymentMethod === 'paypal'
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/10'
                        : 'border-border hover:border-purple-300'
                    }`}
                    onClick={() => handleInputChange('paymentMethod', 'paypal')}
                  >
                    <RadioGroupItem value="paypal" id="paypal" />
                    <div className="flex-1">
                      <Label htmlFor="paypal" className="cursor-pointer font-semibold">
                        PayPal
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Fast and secure PayPal checkout
                      </p>
                    </div>
                    <div className="w-16 h-6 bg-blue-600 rounded flex items-center justify-center">
                      <span className="text-white text-xs font-bold">PayPal</span>
                    </div>
                  </div>

                  <div
                    className={`flex items-center gap-4 p-4 rounded-lg border-2 transition-all cursor-pointer ${
                      formData.paymentMethod === 'bank_transfer'
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/10'
                        : 'border-border hover:border-purple-300'
                    }`}
                    onClick={() => handleInputChange('paymentMethod', 'bank_transfer')}
                  >
                    <RadioGroupItem value="bank_transfer" id="bank_transfer" />
                    <div className="flex-1">
                      <Label htmlFor="bank_transfer" className="cursor-pointer font-semibold">
                        Bank Transfer
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Direct bank transfer
                      </p>
                    </div>
                    <Building className="w-6 h-6 text-muted-foreground" />
                  </div>
                </RadioGroup>

                <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800">
                  <div className="flex items-start gap-3">
                    <Lock className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
                    <div>
                      <p className="font-semibold text-green-900 dark:text-green-100 text-sm">
                        Secure Payment
                      </p>
                      <p className="text-xs text-green-700 dark:text-green-300">
                        Your payment information is encrypted and secure. We never store your card details.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between gap-3 mt-6">
                  <Button variant="outline" onClick={() => setCurrentStep(2)}>
                    Back
                  </Button>
                  <Button
                    onClick={handlePlaceOrder}
                    disabled={isProcessing}
                    className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white"
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 mr-2" />
                        Place Order ${total.toFixed(2)}
                      </>
                    )}
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}
        </div>

        {/* Order Summary - Sticky */}
        <div className="lg:col-span-1">
          <Card className="p-6 sticky top-24">
            <h3 className="font-bold text-lg mb-4">Order Summary</h3>

            <div className="space-y-3 mb-4">
              {cart.map(item => (
                <div key={item.productId} className="flex gap-3">
                  <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center overflow-hidden">
                    {item.productImage ? (
                      <img
                        src={item.productImage}
                        alt={item.productName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Package className="w-6 h-6 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm line-clamp-2">{item.productName}</p>
                    <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-semibold text-sm">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>

            <Separator className="my-4" />

            <div className="space-y-2 mb-4">
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

            <div className="p-3 rounded-lg bg-gradient-to-r from-purple-50 to-cyan-50 dark:from-purple-900/20 dark:to-cyan-900/20">
              <p className="text-xs text-center text-muted-foreground">
                🎉 Free returns within 30 days
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
