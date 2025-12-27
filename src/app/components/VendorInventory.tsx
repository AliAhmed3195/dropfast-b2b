'use client'

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Package,
  Plus,
  Search,
  Filter,
  Download,
  Store,
  X,
  DollarSign,
  List,
  Tag as TagIcon,
  CheckCircle2,
  Building2,
  TrendingUp,
  User,
  ShoppingBag,
} from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { toast } from 'sonner';
import { cn } from './ui/utils';
import { ProductForm } from './ProductForm';
import { UnifiedImportModal } from './UnifiedImportModal';

// Mock data - Supplier Products
const supplierProducts = [
  {
    id: 1,
    name: 'Wireless Bluetooth Headphones',
    sku: 'WBH-2024-001',
    supplier: 'TechGear Supplies',
    category: 'Electronics',
    supplierPrice: 45.99,
    moq: 10,
    stock: 245,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
    description: 'Premium wireless headphones with noise cancellation',
    type: 'supplier',
  },
  {
    id: 2,
    name: 'Smart Watch Pro',
    sku: 'SWP-2024-002',
    supplier: 'WearTech Inc',
    category: 'Wearables',
    supplierPrice: 129.99,
    moq: 5,
    stock: 89,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
    description: 'Advanced smartwatch with health monitoring',
    type: 'supplier',
  },
  {
    id: 3,
    name: 'USB-C Fast Charger',
    sku: 'UFC-2024-003',
    supplier: 'PowerHub Supplies',
    category: 'Accessories',
    supplierPrice: 15.99,
    moq: 20,
    stock: 450,
    image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400',
    description: '65W fast charging adapter with multiple ports',
    type: 'supplier',
  },
  {
    id: 4,
    name: 'Laptop Stand Adjustable',
    sku: 'LSA-2024-004',
    supplier: 'ErgoDesk Pro',
    category: 'Office',
    supplierPrice: 25.99,
    moq: 15,
    stock: 156,
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400',
    description: 'Ergonomic laptop stand with adjustable height',
    type: 'supplier',
  },
  {
    id: 5,
    name: 'Portable SSD 1TB',
    sku: 'PSS-2024-005',
    supplier: 'DataStore Solutions',
    category: 'Storage',
    supplierPrice: 79.99,
    moq: 8,
    stock: 95,
    image: 'https://images.unsplash.com/photo-1531492746076-161ca9bcad58?w=400',
    description: 'Ultra-fast portable SSD with USB 3.2',
    type: 'supplier',
  },
  {
    id: 6,
    name: 'Gaming Mouse RGB',
    sku: 'GMR-2024-006',
    supplier: 'GameGear Elite',
    category: 'Gaming',
    supplierPrice: 34.99,
    moq: 12,
    stock: 200,
    image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=400',
    description: 'Professional gaming mouse with RGB lighting',
    type: 'supplier',
  },
];

// Mock data - Vendor's own created products
const myCreatedProducts = [
  {
    id: 101,
    name: 'Custom Branded Laptop Bag',
    sku: 'CLB-2024-001',
    supplier: 'Self Created',
    category: 'Accessories',
    supplierPrice: 0,
    moq: 1,
    stock: 50,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',
    description: 'Premium laptop bag with custom branding',
    type: 'own',
    retailPrice: 59.99,
  },
  {
    id: 102,
    name: 'Eco-Friendly Water Bottle',
    sku: 'EWB-2024-002',
    supplier: 'Self Created',
    category: 'Lifestyle',
    supplierPrice: 0,
    moq: 1,
    stock: 120,
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400',
    description: 'Sustainable water bottle made from recycled materials',
    type: 'own',
    retailPrice: 24.99,
  },
];

// Combine all products
const allAvailableProducts = [...supplierProducts, ...myCreatedProducts];

// Get unique suppliers
const uniqueSuppliers = Array.from(new Set(supplierProducts.map(p => p.supplier)));

// Get unique categories
const uniqueCategories = Array.from(new Set(allAvailableProducts.map(p => p.category)));

export function VendorInventory() {
  const [searchQuery, setSearchQuery] = useState('');
  const [productTypeFilter, setProductTypeFilter] = useState<'all' | 'supplier' | 'own'>('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [supplierFilter, setSupplierFilter] = useState('all');
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'list' | 'create'>('list');

  // Import type selection
  const [importType, setImportType] = useState<'my-products' | 'my-products-store'>('my-products');

  // Unified import form state
  const [importForm, setImportForm] = useState({
    storeId: '',
    sellingPrice: '',
    metaTitle: '',
    metaDescription: '',
    metaKeywords: '',
  });

  // Filter products
  const filteredProducts = allAvailableProducts.filter(product => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = 
      productTypeFilter === 'all' || product.type === productTypeFilter;
    
    const matchesCategory =
      categoryFilter === 'all' || product.category === categoryFilter;
    
    const matchesSupplier =
      supplierFilter === 'all' || product.supplier === supplierFilter;

    return matchesSearch && matchesType && matchesCategory && matchesSupplier;
  });

  const handleOpenImportModal = (product: any) => {
    setSelectedProduct(product);
    setImportModalOpen(true);
    setImportType('my-products'); // Reset to default import type
    setImportForm({
      storeId: '',
      sellingPrice: product.type === 'supplier' ? (product.supplierPrice * 1.5).toFixed(2) : product.retailPrice.toFixed(2),
      metaTitle: product.name,
      metaDescription: product.description,
      metaKeywords: product.category,
    });
  };

  const handleAddToMyProducts = () => {
    // Set import type to 'my-products'
    setImportType('my-products');
  };

  const handleAddToMyProductsAndStore = () => {
    // Set import type to 'my-products-store'
    setImportType('my-products-store');
  };

  const handleImportProduct = () => {
    if (!importForm.storeId && importType === 'my-products-store') {
      toast.error('Please select a store');
      return;
    }
    if (!importForm.sellingPrice) {
      toast.error('Please enter a selling price');
      return;
    }

    if (selectedProduct.type === 'supplier' && parseFloat(importForm.sellingPrice) <= selectedProduct.supplierPrice) {
      toast.error('Selling price must be higher than supplier price!');
      return;
    }

    toast.success('Product added successfully!', {
      description: 'Product has been added to My Products and your selected store.',
    });
    setImportModalOpen(false);
  };

  const stats = {
    totalAvailable: allAvailableProducts.length,
    supplierProducts: supplierProducts.length,
    myProducts: myCreatedProducts.length,
    totalSuppliers: uniqueSuppliers.length,
  };

  // If in create mode, show ProductForm as full page
  if (viewMode === 'create') {
    return (
      <ProductForm 
        onClose={() => setViewMode('list')}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-2">Available Products</h2>
          <p className="text-muted-foreground">
            Browse and import products from suppliers or manage your own products
          </p>
        </div>
        <Button className="bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 text-white font-semibold hover:from-purple-700 hover:via-indigo-700 hover:to-cyan-700 shadow-lg shadow-purple-500/30" onClick={() => setViewMode('create')}>
          <Plus className="w-5 h-5 mr-2" />
          Create Product
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Available</p>
              <p className="text-2xl font-bold">{stats.totalAvailable}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Supplier Products</p>
              <p className="text-2xl font-bold">{stats.supplierProducts}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">My Products</p>
              <p className="text-2xl font-bold">{stats.myProducts}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500 to-red-500">
              <Store className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Suppliers</p>
              <p className="text-2xl font-bold">{stats.totalSuppliers}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4 flex-wrap">
            {/* Search */}
            <div className="relative flex-1 min-w-[300px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search products by name or SKU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Product Type Filter */}
            <Select value={productTypeFilter} onValueChange={(value: any) => setProductTypeFilter(value)}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Product Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Products</SelectItem>
                <SelectItem value="supplier">Supplier Products</SelectItem>
                <SelectItem value="own">My Products</SelectItem>
              </SelectContent>
            </Select>

            {/* Category Filter */}
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {uniqueCategories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Supplier Filter */}
            <Select value={supplierFilter} onValueChange={setSupplierFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Supplier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Suppliers</SelectItem>
                {uniqueSuppliers.map(supplier => (
                  <SelectItem key={supplier} value={supplier}>
                    {supplier}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Clear Filters */}
            {(searchQuery || productTypeFilter !== 'all' || categoryFilter !== 'all' || supplierFilter !== 'all') && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery('');
                  setProductTypeFilter('all');
                  setCategoryFilter('all');
                  setSupplierFilter('all');
                }}
              >
                <X className="w-4 h-4 mr-2" />
                Clear Filters
              </Button>
            )}
          </div>

          {/* Active Filters Display */}
          <div className="flex items-center gap-2 flex-wrap">
            {productTypeFilter !== 'all' && (
              <Badge variant="secondary" className="gap-2">
                Type: {productTypeFilter === 'supplier' ? 'Supplier Products' : 'My Products'}
                <X 
                  className="w-3 h-3 cursor-pointer" 
                  onClick={() => setProductTypeFilter('all')}
                />
              </Badge>
            )}
            {categoryFilter !== 'all' && (
              <Badge variant="secondary" className="gap-2">
                Category: {categoryFilter}
                <X 
                  className="w-3 h-3 cursor-pointer" 
                  onClick={() => setCategoryFilter('all')}
                />
              </Badge>
            )}
            {supplierFilter !== 'all' && (
              <Badge variant="secondary" className="gap-2">
                Supplier: {supplierFilter}
                <X 
                  className="w-3 h-3 cursor-pointer" 
                  onClick={() => setSupplierFilter('all')}
                />
              </Badge>
            )}
          </div>
        </div>
      </Card>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-2 hover:border-purple-300 dark:hover:border-purple-700">
              {/* Product Image */}
              <div className="relative h-48 bg-slate-100 dark:bg-slate-800 overflow-hidden group">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3">
                  {product.type === 'own' ? (
                    <Badge className="bg-green-500 text-white">
                      <User className="w-3 h-3 mr-1" />
                      My Product
                    </Badge>
                  ) : (
                    <Badge className="bg-blue-500 text-white">
                      <Building2 className="w-3 h-3 mr-1" />
                      Supplier
                    </Badge>
                  )}
                </div>
                {product.type === 'supplier' && (
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-white/90 text-slate-900 backdrop-blur-sm">
                      MOQ: {product.moq}
                    </Badge>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-5">
                <div className="mb-3">
                  <h3 className="font-bold mb-1 line-clamp-1">{product.name}</h3>
                  <p className="text-xs text-muted-foreground">{product.sku}</p>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      {product.type === 'supplier' ? 'Supplier:' : 'Created by:'}
                    </span>
                    <span className="font-semibold text-xs">{product.supplier}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Category:</span>
                    <Badge variant="outline" className="text-xs">{product.category}</Badge>
                  </div>
                  {product.type === 'supplier' && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Supplier Price:</span>
                      <span className="text-xl font-bold text-green-600">${product.supplierPrice}</span>
                    </div>
                  )}
                  {product.type === 'own' && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Retail Price:</span>
                      <span className="text-xl font-bold text-purple-600">${product.retailPrice}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Stock:</span>
                    <Badge className="bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                      {product.stock} units
                    </Badge>
                  </div>
                </div>

                <Button
                  onClick={() => handleOpenImportModal(product)}
                  className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 text-white hover:from-purple-700 hover:to-cyan-700"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Import
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-16">
          <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
          <p className="text-lg text-muted-foreground">No products found</p>
          <p className="text-sm text-muted-foreground mt-2">Try adjusting your filters</p>
        </div>
      )}

      {/* Import Product Modal */}
      <AnimatePresence>
        {importModalOpen && selectedProduct && (
          <UnifiedImportModal
            product={selectedProduct}
            onClose={() => setImportModalOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}