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

// Initial data (empty by default – ready for real data)
const INITIAL_PRODUCTS: Product[] = [];

const INITIAL_STORES: Store[] = [];

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
