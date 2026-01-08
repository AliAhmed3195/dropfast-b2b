'use client'

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  CreditCard,
  Truck,
  Lock,
  CheckCircle2,
  User,
  Mail,
  Phone,
  Home,
  MapPin,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Separator } from '../ui/separator';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { showToast } from '../../../lib/toast';
import { CartItem } from '../../contexts/AppContext';
import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

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

interface StoreCheckoutProps {
  cartItems: CartItem[];
  storeTheme: {
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
  };
  onBack: () => void;
  onPlaceOrder: (formData: CheckoutFormData, paymentIntentId?: string) => void;
}

export function StoreCheckout({
  cartItems,
  storeTheme,
  onBack,
  onPlaceOrder,
}: StoreCheckoutProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [paymentIntentId, setPaymentIntentId] = useState<string | undefined>();
  const [clientSecret, setClientSecret] = useState<string | undefined>();
  const [formData, setFormData] = useState<CheckoutFormData>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    paymentMethod: 'credit_card',
  });

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 10;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  const handleInputChange = (field: keyof CheckoutFormData, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const steps = [
    { number: 1, title: 'Shipping', icon: Truck },
    { number: 2, title: 'Payment', icon: CreditCard },
    { number: 3, title: 'Review', icon: CheckCircle2 },
  ];

  // Create payment intent when moving to payment step
  useEffect(() => {
    if (currentStep === 2 && formData.paymentMethod === 'credit_card' && !clientSecret) {
      const createPaymentIntent = async () => {
        try {
          const response = await fetch('/api/public/create-payment-intent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              amount: total,
              currency: 'USD',
              metadata: {
                customerEmail: formData.email,
                customerName: formData.fullName,
              },
            }),
          });

          if (response.ok) {
            const { clientSecret: secret, paymentIntentId: id } = await response.json();
            setClientSecret(secret);
            setPaymentIntentId(id);
          }
        } catch (error) {
          console.error('Failed to create payment intent:', error);
        }
      };

      createPaymentIntent();
    }
  }, [currentStep, formData.paymentMethod, formData.email, formData.fullName, total, clientSecret]);

  const getElementsOptions = (): StripeElementsOptions => {
    if (clientSecret) {
      return {
        clientSecret,
      };
    }
    return {
      mode: 'payment',
      amount: Math.round(total * 100),
      currency: 'usd',
    };
  };

  const CheckoutForm = () => {
    const PaymentStepComponent = ({
      formData,
      clientSecret,
      storeTheme,
      onPaymentMethodChange,
      onBack,
      onSuccess,
    }: {
      formData: CheckoutFormData;
      clientSecret: string | undefined;
      storeTheme: { primaryColor: string; secondaryColor: string; fontFamily: string };
      onPaymentMethodChange: (method: CheckoutFormData['paymentMethod']) => void;
      onBack: () => void;
      onSuccess: () => void;
    }) => {
      const stripe = useStripe();
      const elements = useElements();
      const [isProcessing, setIsProcessing] = useState(false);

      const handlePayment = async () => {
        if (!stripe || !elements || !clientSecret) {
          showToast.error('Payment not ready. Please wait...');
          return;
        }

        setIsProcessing(true);
        try {
          const { error: confirmError } = await stripe.confirmPayment({
            elements,
            clientSecret,
            confirmParams: {
              return_url: window.location.href,
            },
            redirect: 'if_required',
          });

          if (confirmError) {
            throw new Error(confirmError.message || 'Payment failed');
          }
          onSuccess();
        } catch (error: any) {
          console.error('Payment error:', error);
          showToast.error(error.message || 'Payment failed. Please try again.');
        } finally {
          setIsProcessing(false);
        }
      };

      return (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" style={{ color: storeTheme.primaryColor }} />
              Payment Method
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <RadioGroup
              value={formData.paymentMethod}
              onValueChange={(value) =>
                onPaymentMethodChange(value as CheckoutFormData['paymentMethod'])
              }
            >
              <div className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:border-current transition-colors">
                <RadioGroupItem value="credit_card" id="credit_card" />
                <Label htmlFor="credit_card" className="flex-1 cursor-pointer">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Credit/Debit Card</span>
                    <CreditCard className="w-5 h-5 text-gray-400" />
                  </div>
                </Label>
              </div>
              <div className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:border-current transition-colors">
                <RadioGroupItem value="paypal" id="paypal" />
                <Label htmlFor="paypal" className="flex-1 cursor-pointer">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">PayPal</span>
                    <span className="text-sm text-gray-500">Pay with PayPal</span>
                  </div>
                </Label>
              </div>
              <div className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:border-current transition-colors">
                <RadioGroupItem value="bank_transfer" id="bank_transfer" />
                <Label htmlFor="bank_transfer" className="flex-1 cursor-pointer">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Bank Transfer</span>
                    <span className="text-sm text-gray-500">Direct bank transfer</span>
                  </div>
                </Label>
              </div>
            </RadioGroup>

            {formData.paymentMethod === 'credit_card' && (
              <div className="space-y-4 pt-4 border-t">
                <div className="space-y-2">
                  <Label>Card Details</Label>
                  <div className="p-3 border rounded-md">
                    {clientSecret ? (
                      <PaymentElement />
                    ) : (
                      <div className="text-sm text-gray-500">Loading payment form...</div>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <Button variant="outline" onClick={onBack} className="flex-1">
                Back
              </Button>
              {formData.paymentMethod === 'credit_card' ? (
                <Button
                  className="flex-1 text-white"
                  onClick={handlePayment}
                  disabled={isProcessing}
                  style={{ backgroundColor: storeTheme.primaryColor }}
                >
                  {isProcessing ? 'Processing...' : 'Process Payment'}
                </Button>
              ) : (
                <Button
                  className="flex-1 text-white"
                  onClick={onSuccess}
                  style={{ backgroundColor: storeTheme.primaryColor }}
                >
                  Review Order
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      );
    };
    return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={onBack} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Cart
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {steps.map((step, index) => (
              <React.Fragment key={step.number}>
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-colors ${
                      currentStep >= step.number ? 'text-white' : 'bg-gray-200 text-gray-400'
                    }`}
                    style={{
                      backgroundColor:
                        currentStep >= step.number ? storeTheme.primaryColor : undefined,
                    }}
                  >
                    <step.icon className="w-6 h-6" />
                  </div>
                  <span
                    className={`text-sm font-medium ${
                      currentStep >= step.number ? '' : 'text-gray-400'
                    }`}
                    style={{
                      color: currentStep >= step.number ? storeTheme.primaryColor : undefined,
                    }}
                  >
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className="flex-1 h-0.5 bg-gray-200 mx-4 mb-8">
                    <div
                      className="h-full transition-all duration-300"
                      style={{
                        width: currentStep > step.number ? '100%' : '0%',
                        backgroundColor: storeTheme.primaryColor,
                      }}
                    />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            {/* Step 1: Shipping Information */}
            {currentStep === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Truck className="w-5 h-5" style={{ color: storeTheme.primaryColor }} />
                      Shipping Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">
                          Full Name <span className="text-red-500">*</span>
                        </Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <Input
                            id="fullName"
                            placeholder="John Doe"
                            value={formData.fullName}
                            onChange={(e) => handleInputChange('fullName', e.target.value)}
                            className="pl-10"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">
                          Email <span className="text-red-500">*</span>
                        </Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <Input
                            id="email"
                            type="email"
                            placeholder="john@example.com"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            className="pl-10"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">
                        Phone Number <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          id="phone"
                          placeholder="+1 (555) 000-0000"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">
                        Street Address <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <Home className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          id="address"
                          placeholder="123 Main Street"
                          value={formData.address}
                          onChange={(e) => handleInputChange('address', e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <Input
                            id="city"
                            placeholder="New York"
                            value={formData.city}
                            onChange={(e) => handleInputChange('city', e.target.value)}
                            className="pl-10"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">State</Label>
                        <Input
                          id="state"
                          placeholder="NY"
                          value={formData.state}
                          onChange={(e) => handleInputChange('state', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="zipCode">ZIP Code</Label>
                        <Input
                          id="zipCode"
                          placeholder="10001"
                          value={formData.zipCode}
                          onChange={(e) => handleInputChange('zipCode', e.target.value)}
                        />
                      </div>
                    </div>

                    <Button
                      className="w-full text-white"
                      onClick={() => setCurrentStep(2)}
                      style={{ backgroundColor: storeTheme.primaryColor }}
                    >
                      Continue to Payment
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Step 2: Payment Method */}
            {currentStep === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <PaymentStepComponent
                  formData={formData}
                  clientSecret={clientSecret}
                  storeTheme={storeTheme}
                  onPaymentMethodChange={(method) => handleInputChange('paymentMethod', method)}
                  onBack={() => setCurrentStep(1)}
                  onSuccess={() => setCurrentStep(3)}
                />
              </motion.div>
            )}

            {/* Step 3: Review & Place Order */}
            {currentStep === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Review Your Order</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Shipping Info */}
                    <div>
                      <h3 className="font-semibold mb-2">Shipping Address</h3>
                      <p className="text-sm text-gray-600">
                        {formData.fullName}<br />
                        {formData.address}<br />
                        {formData.city}, {formData.state} {formData.zipCode}<br />
                        {formData.country}
                      </p>
                    </div>

                    <Separator />

                    {/* Payment Info */}
                    <div>
                      <h3 className="font-semibold mb-2">Payment Method</h3>
                      <p className="text-sm text-gray-600 capitalize">
                        {formData.paymentMethod.replace('_', ' ')}
                      </p>
                    </div>

                    <Separator />

                    {/* Order Items */}
                    <div>
                      <h3 className="font-semibold mb-3">Order Items</h3>
                      <div className="space-y-3">
                        {cartItems.map((item) => (
                          <div key={item.productId} className="flex gap-4 text-sm">
                            <img
                              src={item.productImage || 'https://via.placeholder.com/60'}
                              alt={item.productName}
                              className="w-16 h-16 rounded object-cover"
                            />
                            <div className="flex-1">
                              <p className="font-medium">{item.productName}</p>
                              <p className="text-gray-500">Qty: {item.quantity}</p>
                            </div>
                            <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button variant="outline" onClick={() => setCurrentStep(2)} className="flex-1">
                        Back
                      </Button>
                      <Button
                        className="flex-1 text-white gap-2"
                        onClick={() => onPlaceOrder(formData, paymentIntentId)}
                        style={{ backgroundColor: storeTheme.primaryColor }}
                      >
                        <Lock className="w-4 h-4" />
                        Place Order
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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

                <div className="pt-4 border-t">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Lock className="w-4 h-4" />
                    <span>Secure checkout powered by FastDrop</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
    );
  };

  if (process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
    return (
      <Elements 
        stripe={stripePromise} 
        options={getElementsOptions()}
        key={clientSecret || 'initial'}
      >
        <CheckoutForm />
      </Elements>
    );
  }
  return <CheckoutForm />;
}
