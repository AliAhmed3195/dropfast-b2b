import React, { useState } from 'react';
import { StoreLandingPage } from './StoreLandingPage';
import { ProductDetailPage } from './ProductDetailPage';
import { StoreCart } from './StoreCart';
import { StoreCheckout } from './StoreCheckout';
import { useApp } from '../../contexts/AppContext';
import { Product, CartItem } from '../../contexts/AppContext';
import { toast } from 'sonner';

interface PublicStoreProps {
  storeData: any;
  onClose: () => void;
}

type PublicStoreView = 
  | { type: 'landing' }
  | { type: 'product'; productId: string }
  | { type: 'cart' }
  | { type: 'checkout' };

export function PublicStore({ storeData, onClose }: PublicStoreProps) {
  const { products, addOrder } = useApp();
  const [currentView, setCurrentView] = useState<PublicStoreView>({ type: 'landing' });
  const [storeCart, setStoreCart] = useState<CartItem[]>([]);

  // Get store theme
  const storeTheme = storeData.theme || {
    primaryColor: '#4F46E5',
    secondaryColor: '#06B6D4',
    fontFamily: 'Inter',
  };

  // Get store's products
  const storeProducts = products.filter((p) =>
    storeData.products?.includes(p.id) && p.status === 'active'
  );

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
          productImage: product.images[0] || '',
          quantity,
          price: product.price,
          storeId: storeData.id,
          storeName: storeData.name,
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
  const handlePlaceOrder = (formData: any) => {
    const subtotal = storeCart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = 10;
    const tax = subtotal * 0.1;
    const total = subtotal + shipping + tax;

    const order = {
      id: `ORD-${Date.now()}`,
      customerId: 'guest',
      customerName: formData.fullName,
      customerEmail: formData.email,
      storeId: storeData.id,
      storeName: storeData.name,
      items: storeCart.map((item) => ({
        productId: item.productId,
        productName: item.productName,
        productImage: item.productImage,
        quantity: item.quantity,
        price: item.price,
        supplierId: products.find((p) => p.id === item.productId)?.supplierId || '',
      })),
      subtotal,
      shipping,
      tax,
      total,
      status: 'pending' as const,
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
      paymentStatus: 'pending' as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    addOrder(order);
    setStoreCart([]);
    setCurrentView({ type: 'landing' });
    toast.success('Order placed successfully! Thank you for your purchase.');
  };

  // Render current view
  const renderView = () => {
    switch (currentView.type) {
      case 'landing':
        return (
          <StoreLandingPage
            storeConfig={{
              name: storeData.name,
              slug: storeData.slug,
              template: storeData.template,
              theme: storeTheme,
              sections: storeData.template?.sections || [],
            }}
            onProductClick={(productId) => setCurrentView({ type: 'product', productId })}
          />
        );

      case 'product':
        const product = products.find((p) => p.id === currentView.productId);
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

  return (
    <div className="fixed inset-0 z-50 bg-white overflow-auto">
      {/* Store Header/Navigation */}
      <div className="sticky top-0 z-50 bg-white border-b shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Store Logo/Name */}
            <div className="flex items-center gap-3">
              {storeData.logo && (
                <img src={storeData.logo} alt={storeData.name} className="h-10 w-10 object-cover rounded" />
              )}
              <h1 className="text-xl font-bold" style={{ color: storeTheme.primaryColor }}>
                {storeData.name}
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
              <button
                onClick={onClose}
                className="text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-100"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      {renderView()}
    </div>
  );
}