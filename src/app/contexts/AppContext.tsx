'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useAuth } from './AuthContext';

// Types
export interface Product {
  id: string;
  supplierId: string;
  supplierName: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  images: string[];
  stock: number;
  sku: string;
  rating: number;
  reviews: number;
  featured: boolean;
  status: 'active' | 'inactive' | 'out_of_stock';
  createdAt: string;
}

export interface Store {
  id: string;
  vendorId: string;
  name: string;
  slug: string;
  description: string;
  logo?: string;
  banner?: string;
  template: 'modern' | 'classic' | 'minimal' | 'bold';
  theme: {
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
  };
  products: string[]; // Product IDs
  customContent: {
    heroTitle?: string;
    heroSubtitle?: string;
    aboutText?: string;
    contactEmail?: string;
    socialLinks?: {
      facebook?: string;
      twitter?: string;
      instagram?: string;
    };
  };
  status: 'active' | 'draft' | 'inactive';
  createdAt: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
  supplierId: string;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  storeId: string;
  storeName: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: {
    fullName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phone: string;
  };
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
  storeId: string;
  storeName: string;
}

interface AppContextType {
  // Products
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  getProductById: (id: string) => Product | undefined;
  getProductsBySupplier: (supplierId: string) => Product[];

  // Stores
  stores: Store[];
  addStore: (store: Omit<Store, 'id' | 'createdAt'>) => void;
  updateStore: (id: string, updates: Partial<Store>) => void;
  deleteStore: (id: string) => void;
  getStoreById: (id: string) => Store | undefined;
  getStoresByVendor: (vendorId: string) => Store[];
  getStoreBySlug: (slug: string) => Store | undefined;

  // Orders
  orders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateOrder: (id: string, updates: Partial<Order>) => void;
  getOrderById: (id: string) => Order | undefined;
  getOrdersByCustomer: (customerId: string) => Order[];
  getOrdersByVendor: (vendorId: string) => Order[];
  getOrdersBySupplier: (supplierId: string) => Order[];

  // Cart
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  updateCartItem: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  getCartTotal: () => number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Mock initial data
const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    supplierId: '2',
    supplierName: 'TechSupply Co.',
    name: 'Wireless Bluetooth Headphones',
    description: 'Premium noise-cancelling headphones with 30-hour battery life. Perfect for music lovers and professionals.',
    price: 79.99,
    originalPrice: 129.99,
    category: 'Electronics',
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'],
    stock: 150,
    sku: 'WBH-001',
    rating: 4.8,
    reviews: 234,
    featured: true,
    status: 'active',
    createdAt: '2024-12-01T00:00:00Z',
  },
  {
    id: 'prod-2',
    supplierId: '2',
    supplierName: 'TechSupply Co.',
    name: 'Smart Watch Pro',
    description: 'Advanced fitness tracking, heart rate monitoring, and smartphone notifications in one elegant device.',
    price: 199.99,
    originalPrice: 299.99,
    category: 'Electronics',
    images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500'],
    stock: 85,
    sku: 'SWP-001',
    rating: 4.9,
    reviews: 456,
    featured: true,
    status: 'active',
    createdAt: '2024-12-02T00:00:00Z',
  },
  {
    id: 'prod-3',
    supplierId: '2',
    supplierName: 'TechSupply Co.',
    name: 'Ergonomic Laptop Stand',
    description: 'Adjustable aluminum laptop stand for improved posture and productivity. Compatible with all laptop sizes.',
    price: 45.99,
    category: 'Accessories',
    images: ['https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500'],
    stock: 200,
    sku: 'ELS-001',
    rating: 4.6,
    reviews: 189,
    featured: false,
    status: 'active',
    createdAt: '2024-12-03T00:00:00Z',
  },
  {
    id: 'prod-4',
    supplierId: '2',
    supplierName: 'TechSupply Co.',
    name: 'Wireless Mouse',
    description: 'Precision optical mouse with ergonomic design and long battery life. Silent clicks for quiet environments.',
    price: 29.99,
    category: 'Accessories',
    images: ['https://images.unsplash.com/photo-1527814050087-3793815479db?w=500'],
    stock: 300,
    sku: 'WM-001',
    rating: 4.7,
    reviews: 345,
    featured: false,
    status: 'active',
    createdAt: '2024-12-04T00:00:00Z',
  },
  {
    id: 'prod-5',
    supplierId: '2',
    supplierName: 'TechSupply Co.',
    name: 'USB-C Hub 7-in-1',
    description: 'Compact hub with HDMI, USB 3.0, SD card reader, and power delivery. Essential for modern laptops.',
    price: 39.99,
    category: 'Accessories',
    images: ['https://images.unsplash.com/photo-1625948515291-69613efd103f?w=500'],
    stock: 175,
    sku: 'UCH-001',
    rating: 4.5,
    reviews: 267,
    featured: false,
    status: 'active',
    createdAt: '2024-12-05T00:00:00Z',
  },
  {
    id: 'prod-6',
    supplierId: '2',
    supplierName: 'TechSupply Co.',
    name: 'Mechanical Keyboard RGB',
    description: 'Premium mechanical keyboard with customizable RGB lighting and tactile switches. Perfect for gaming and typing.',
    price: 129.99,
    originalPrice: 179.99,
    category: 'Electronics',
    images: ['https://images.unsplash.com/photo-1595225476474-87563907a212?w=500'],
    stock: 95,
    sku: 'MKR-001',
    rating: 4.9,
    reviews: 512,
    featured: true,
    status: 'active',
    createdAt: '2024-12-06T00:00:00Z',
  },
];

const INITIAL_STORES: Store[] = [
  {
    id: 'store-1',
    vendorId: '3',
    name: 'Tech Haven',
    slug: 'tech-haven',
    description: 'Your one-stop shop for premium tech accessories and gadgets',
    template: 'modern',
    theme: {
      primaryColor: '#6366f1',
      secondaryColor: '#06b6d4',
      fontFamily: 'Inter',
    },
    products: ['prod-1', 'prod-2', 'prod-3'],
    customContent: {
      heroTitle: 'Welcome to Tech Haven',
      heroSubtitle: 'Premium Tech Accessories for Modern Life',
      aboutText: 'We curate the best tech products to enhance your digital lifestyle.',
      contactEmail: 'hello@techhaven.com',
    },
    status: 'active',
    createdAt: '2024-12-10T00:00:00Z',
  },
];

const INITIAL_ORDERS: Order[] = [];

export function AppProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [stores, setStores] = useState<Store[]>(INITIAL_STORES);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [cart, setCart] = useState<CartItem[]>([]);

  // Product methods
  const addProduct = (product: Omit<Product, 'id' | 'createdAt'>) => {
    const newProduct: Product = {
      ...product,
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setProducts([...products, newProduct]);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(products.map(p => (p.id === id ? { ...p, ...updates } : p)));
  };

  const deleteProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const getProductById = (id: string) => {
    return products.find(p => p.id === id);
  };

  const getProductsBySupplier = (supplierId: string) => {
    return products.filter(p => p.supplierId === supplierId);
  };

  // Store methods
  const addStore = (store: Omit<Store, 'id' | 'createdAt'>) => {
    const newStore: Store = {
      ...store,
      id: `store-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setStores([...stores, newStore]);
  };

  const updateStore = (id: string, updates: Partial<Store>) => {
    setStores(stores.map(s => (s.id === id ? { ...s, ...updates } : s)));
  };

  const deleteStore = (id: string) => {
    setStores(stores.filter(s => s.id !== id));
  };

  const getStoreById = (id: string) => {
    return stores.find(s => s.id === id);
  };

  const getStoresByVendor = (vendorId: string) => {
    return stores.filter(s => s.vendorId === vendorId);
  };

  const getStoreBySlug = (slug: string) => {
    return stores.find(s => s.slug === slug);
  };

  // Order methods
  const addOrder = (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newOrder: Order = {
      ...order,
      id: `ORD-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setOrders([...orders, newOrder]);
  };

  const updateOrder = (id: string, updates: Partial<Order>) => {
    setOrders(
      orders.map(o =>
        o.id === id ? { ...o, ...updates, updatedAt: new Date().toISOString() } : o
      )
    );
  };

  const getOrderById = (id: string) => {
    return orders.find(o => o.id === id);
  };

  const getOrdersByCustomer = (customerId: string) => {
    return orders.filter(o => o.customerId === customerId);
  };

  const getOrdersByVendor = (vendorId: string) => {
    const vendorStoreIds = stores.filter(s => s.vendorId === vendorId).map(s => s.id);
    return orders.filter(o => vendorStoreIds.includes(o.storeId));
  };

  const getOrdersBySupplier = (supplierId: string) => {
    return orders.filter(o =>
      o.items.some(item => item.supplierId === supplierId)
    );
  };

  // Cart methods
  const addToCart = (item: CartItem) => {
    const existingItem = cart.find(i => i.productId === item.productId);
    if (existingItem) {
      setCart(
        cart.map(i =>
          i.productId === item.productId
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        )
      );
    } else {
      setCart([...cart, item]);
    }
  };

  const updateCartItem = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart(cart.map(i => (i.productId === productId ? { ...i, quantity } : i)));
    }
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(i => i.productId !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <AppContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        getProductById,
        getProductsBySupplier,
        stores,
        addStore,
        updateStore,
        deleteStore,
        getStoreById,
        getStoresByVendor,
        getStoreBySlug,
        orders,
        addOrder,
        updateOrder,
        getOrderById,
        getOrdersByCustomer,
        getOrdersByVendor,
        getOrdersBySupplier,
        cart,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
        getCartTotal,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
