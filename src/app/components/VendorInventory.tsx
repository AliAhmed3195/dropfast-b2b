'use client'

import React, { useState, useEffect, useRef } from 'react';
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
  Loader2,
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
import { cn } from './ui/utils';
import { ProductForm } from './ProductForm';
import { UnifiedImportModal } from './UnifiedImportModal';
import { useAuth } from '../contexts/AuthContext';
import { showToast } from '../../lib/toast';

export function VendorInventory() {
  const { user } = useAuth();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const fetchingRef = useRef(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [productTypeFilter, setProductTypeFilter] = useState<'all' | 'supplier' | 'own'>('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [supplierFilter, setSupplierFilter] = useState('all');
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'list' | 'create'>('list');
  const [availableSuppliers, setAvailableSuppliers] = useState<string[]>([]);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);

  // Fetch inventory products
  useEffect(() => {
    if (!user?.id || fetchingRef.current) return;

    fetchingRef.current = true;
    setLoading(true);

    const fetchInventory = async () => {
      try {
        const params = new URLSearchParams();
        params.append('vendorId', user.id);
        if (productTypeFilter !== 'all') params.append('productType', productTypeFilter);
        if (categoryFilter !== 'all') params.append('category', categoryFilter);
        if (supplierFilter !== 'all') params.append('supplier', supplierFilter);
        if (searchQuery) params.append('search', searchQuery);

        const response = await fetch(`/api/vendor/inventory?${params.toString()}`);
        const data = await response.json();

        if (response.ok) {
          setProducts(data.products || []);
          if (data.filters) {
            setAvailableSuppliers(data.filters.suppliers || []);
            setAvailableCategories(data.filters.categories || []);
          }
        } else {
          showToast.error(data.error || 'Failed to fetch inventory');
        }
      } catch (error) {
        console.error('Fetch inventory error:', error);
        showToast.error('Failed to fetch inventory');
      } finally {
        setLoading(false);
        fetchingRef.current = false;
      }
    };

    fetchInventory();
  }, [user?.id, productTypeFilter, categoryFilter, supplierFilter, searchQuery]);

  // Filter products (client-side filtering for search since API already filters by category/supplier)
  const filteredProducts = products.filter(product => {
    const matchesSearch =
      searchQuery === '' ||
      product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku?.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesSearch;
  });

  const handleOpenImportModal = (product: any) => {
    setSelectedProduct(product);
    setImportModalOpen(true);
  };

  const stats = {
    totalAvailable: products.length,
    supplierProducts: products.filter(p => p.type === 'supplier').length,
    myProducts: products.filter(p => p.type === 'own').length,
    totalSuppliers: availableSuppliers.length,
  };

  // If in create mode, show ProductForm as full page
  if (viewMode === 'create') {
    return (
      <ProductForm 
        onClose={() => setViewMode('list')}
      />
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
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
                {availableCategories.map(category => (
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
                {availableSuppliers.map(supplier => (
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
        <Card className="p-12 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            </motion.div>
            <p className="text-lg font-medium text-muted-foreground mb-2">
              {searchQuery || categoryFilter !== 'all' || supplierFilter !== 'all' || productTypeFilter !== 'all'
                ? 'No products found'
                : 'No products available'
              }
            </p>
            <p className="text-sm text-muted-foreground">
              {searchQuery || categoryFilter !== 'all' || supplierFilter !== 'all' || productTypeFilter !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Products will appear here once suppliers add them'
              }
            </p>
          </motion.div>
        </Card>
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