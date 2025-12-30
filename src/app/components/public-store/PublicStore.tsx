'use client'

import React, { useState, useEffect } from 'react';
import { StoreLandingPage } from './StoreLandingPage';
import { ProductDetailPage } from './ProductDetailPage';
import { StoreCart } from './StoreCart';
import { StoreCheckout } from './StoreCheckout';
import { showToast } from '../../../lib/toast';
import { Loader2 } from 'lucide-react';

interface PublicStoreProps {
  storeData: any;
  onClose: () => void;
}

type PublicStoreView = 
  | { type: 'landing' }
  | { type: 'product'; productId: string }
  | { type: 'cart' }
  | { type: 'checkout' };

interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  images?: string[];
  image?: string;
  category?: string;
  stock?: number;
  status?: string;
  rating?: number;
  brand?: string;
  condition?: string;
  sku?: string;
  inStock?: boolean;
  reviews?: number;
}

interface CartItem {
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
  storeId: string;
  storeName: string;
}

export function PublicStore({ storeData, onClose }: PublicStoreProps) {
  const [currentView, setCurrentView] = useState<PublicStoreView>({ type: 'landing' });
  const [storeCart, setStoreCart] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [store, setStore] = useState<any>(storeData);

  // Fetch store and products from API
  useEffect(() => {
    const fetchStoreData = async () => {
      if (!storeData.slug) {
        setLoading(false);
        return;
      }

      try {
        // Fetch store data
        const storeResponse = await fetch(`/api/public/store/${storeData.slug}`);
        if (storeResponse.ok) {
          const storeData = await storeResponse.json();
          setStore(storeData.store);
        }

        // Fetch products
        const productsResponse = await fetch(`/api/public/store/${storeData.slug}/products`);
        if (productsResponse.ok) {
          const productsData = await productsResponse.json();
          setProducts(productsData.products || []);
        }
      } catch (error) {
        console.error('Fetch store data error:', error);
        showToast.error('Failed to load store data');
      } finally {
        setLoading(false);
      }
    };

    fetchStoreData();
  }, [storeData.slug]);

  // Get store theme
  const storeTheme = store?.theme || storeData.theme || {
    primaryColor: '#4F46E5',
    secondaryColor: '#06B6D4',
    fontFamily: 'Inter',
  };

  // Store products (from API)
  const storeProducts = products;

  // Handle add to cart
  const handleAddToCart = (product: Product, quantity: number) => {
    const existingItem = storeCart.find((item) => item.productId === product.id);

    if (existingItem) {
      setStoreCart(
        storeCart.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      );
    } else {
      setStoreCart([
        ...storeCart,
        {
          productId: product.id,
          productName: product.name,
          productImage: product.image || product.images?.[0] || '',
          quantity,
          price: product.price,
          storeId: store?.id || storeData.id,
          storeName: store?.name || storeData.name,
        },
      ]);
    }
  };

  // Handle update cart quantity
  const handleUpdateCartQuantity = (productId: string, quantity: number) => {
    setStoreCart(
      storeCart.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      )
    );
  };

  // Handle remove from cart
  const handleRemoveFromCart = (productId: string) => {
    setStoreCart(storeCart.filter((item) => item.productId !== productId));
  };

  // Handle place order
  const handlePlaceOrder = async (formData: any) => {
    if (!store?.id) {
      showToast.error('Store not found');
      return;
    }

    const subtotal = storeCart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = 10;
    const tax = subtotal * 0.1;
    const total = subtotal + shipping + tax;

    try {
      const response = await fetch('/api/public/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storeId: store.id,
          customerEmail: formData.email,
          customerPhone: formData.phone,
          customerName: formData.fullName,
          shippingFullName: formData.fullName,
          shippingAddress: formData.address,
          shippingCity: formData.city,
          shippingState: formData.state,
          shippingZipCode: formData.zipCode,
          shippingCountry: formData.country,
          shippingPhone: formData.phone,
          paymentMethod: formData.paymentMethod || 'credit_card',
          items: storeCart.map((item) => ({
            productId: item.productId,
            productName: item.productName,
            productImage: item.productImage,
            quantity: item.quantity,
            price: item.price,
            supplierId: null, // Will be fetched from product if needed
          })),
          subtotal,
          shipping,
          tax,
          total,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to place order');
      }

      const data = await response.json();
      setStoreCart([]);
      setCurrentView({ type: 'landing' });
      showToast.success(`Order placed successfully! Order #${data.order.orderNumber}`);
    } catch (error: any) {
      console.error('Place order error:', error);
      showToast.error(error.message || 'Failed to place order');
    }
  };

  // Render current view
  const renderView = () => {
    switch (currentView.type) {
      case 'landing':
        return (
          <StoreLandingPage
            storeConfig={{
              name: store?.name || storeData.name,
              slug: store?.slug || storeData.slug,
              template: store?.template || storeData.template || 'modern',
              theme: storeTheme,
              sections: store?.sections || storeData.sections || storeData.template?.sections || [],
            }}
            products={storeProducts}
            onProductClick={(productId) => setCurrentView({ type: 'product', productId })}
          />
        );

      case 'product':
        const product = storeProducts.find((p) => p.id === currentView.productId);
        if (!product) {
          return <div>Product not found</div>;
        }

        const relatedProducts = storeProducts.filter(
          (p) => p.category === product.category && p.id !== product.id
        );

        return (
          <ProductDetailPage
            product={product}
            storeTheme={storeTheme}
            relatedProducts={relatedProducts}
            onAddToCart={handleAddToCart}
            onBack={() => setCurrentView({ type: 'landing' })}
          />
        );

      case 'cart':
        return (
          <StoreCart
            cartItems={storeCart}
            storeTheme={storeTheme}
            onUpdateQuantity={handleUpdateCartQuantity}
            onRemoveItem={handleRemoveFromCart}
            onContinueShopping={() => setCurrentView({ type: 'landing' })}
            onProceedToCheckout={() => setCurrentView({ type: 'checkout' })}
          />
        );

      case 'checkout':
        return (
          <StoreCheckout
            cartItems={storeCart}
            storeTheme={storeTheme}
            onBack={() => setCurrentView({ type: 'cart' })}
            onPlaceOrder={handlePlaceOrder}
          />
        );

      default:
        return <div>Unknown view</div>;
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 bg-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-white overflow-auto">
      {/* Store Header/Navigation */}
      <div className="sticky top-0 z-50 bg-white border-b shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Store Logo/Name */}
            <div className="flex items-center gap-3">
              {(store?.logo || storeData.logo) && (
                <img src={store?.logo || storeData.logo} alt={store?.name || storeData.name} className="h-10 w-10 object-cover rounded" />
              )}
              <h1 className="text-xl font-bold" style={{ color: storeTheme.primaryColor }}>
                {store?.name || storeData.name}
              </h1>
            </div>

            {/* Navigation */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setCurrentView({ type: 'landing' })}
                className="text-sm font-medium hover:opacity-70 transition-opacity"
              >
                Home
              </button>
              <button
                onClick={() => setCurrentView({ type: 'cart' })}
                className="relative text-sm font-medium hover:opacity-70 transition-opacity"
              >
                Cart
                {storeCart.length > 0 && (
                  <span
                    className="absolute -top-2 -right-2 w-5 h-5 rounded-full text-xs text-white flex items-center justify-center"
                    style={{ backgroundColor: storeTheme.primaryColor }}
                  >
                    {storeCart.length}
                  </span>
                )}
              </button>
              {onClose && (
                <button
                  onClick={onClose}
                  className="text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-100"
                >
                  Close Preview
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      {renderView()}
    </div>
  );
}