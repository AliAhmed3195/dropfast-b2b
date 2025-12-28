'use client'

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Package,
  Search,
  Filter,
  Grid3x3,
  List,
  Eye,
  Edit,
  Trash2,
  Plus,
  MoreVertical,
  TrendingUp,
  DollarSign,
  Box,
  AlertCircle,
  X,
  User,
  Building2,
  Tag as TagIcon,
  Layers,
  ChevronLeft,
  ImageIcon,
  Store,
} from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from './ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { showToast } from '../../lib/toast';
import { ProductForm } from './ProductForm';

export function AdminInventoryProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [supplierFilter, setSupplierFilter] = useState('all');
  const [vendorFilter, setVendorFilter] = useState('all');
  const [storeFilter, setStoreFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const fetchingProductsRef = useRef(false);
  const currentAbortControllerRef = useRef<AbortController | null>(null);
  
  // Filter options from APIs
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [vendors, setVendors] = useState<any[]>([]);
  const [stores, setStores] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    // Prevent duplicate calls
    if (fetchingProductsRef.current) {
      return;
    }

    // Abort previous request if any
    if (currentAbortControllerRef.current) {
      currentAbortControllerRef.current.abort();
    }

    let isMounted = true;
    const abortController = new AbortController();
    currentAbortControllerRef.current = abortController;
    fetchingProductsRef.current = true;

    const loadProducts = async () => {
      if (!isMounted) return;

    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (categoryFilter !== 'all') params.append('category', categoryFilter);
      if (statusFilter !== 'all') params.append('status', statusFilter);
        if (supplierFilter !== 'all') params.append('supplier', supplierFilter);
        if (vendorFilter !== 'all') params.append('vendor', vendorFilter);
        if (storeFilter !== 'all') params.append('store', storeFilter);
      const url = `/api/admin/products${params.toString() ? '?' + params.toString() : ''}`;
        const response = await fetch(url, {
          signal: abortController.signal,
        });
      const data = await response.json();
      
        if (isMounted && response.ok) {
        setProducts(data.products || []);
        } else if (isMounted && !response.ok) {
          showToast.error(data.error || 'Failed to fetch products');
      }
      } catch (error: any) {
        if (error.name !== 'AbortError' && isMounted) {
      console.error('Fetch products error:', error);
          showToast.error('Failed to fetch products');
        }
    } finally {
        if (isMounted) {
      setLoading(false);
          fetchingProductsRef.current = false;
        }
      }
    };

    loadProducts();

    return () => {
      isMounted = false;
      abortController.abort();
      currentAbortControllerRef.current = null;
      fetchingProductsRef.current = false;
    };
  }, [categoryFilter, statusFilter, supplierFilter, vendorFilter, storeFilter]);

  // Fetch filter options (suppliers, vendors, categories, stores)
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        // Fetch suppliers, vendors, categories in parallel
        const [suppliersRes, vendorsRes, categoriesRes] = await Promise.all([
          fetch('/api/admin/suppliers'),
          fetch('/api/admin/vendors'),
          fetch('/api/admin/categories'),
        ]);

        const [suppliersData, vendorsData, categoriesData] = await Promise.all([
          suppliersRes.json(),
          vendorsRes.json(),
          categoriesRes.json(),
        ]);

        if (suppliersData.suppliers) {
          setSuppliers(suppliersData.suppliers);
        }
        if (vendorsData.vendors) {
          setVendors(vendorsData.vendors);
        }
        if (categoriesData.categories) {
          setCategories(categoriesData.categories);
        }
      } catch (error) {
        console.error('Fetch filter options error:', error);
      }
    };

    fetchFilterOptions();
  }, []);

  // Get stores from products (products linked to stores via StoreProduct)
  useEffect(() => {
    // Extract unique stores from products
    const productStores = new Set<string>();
    products.forEach(product => {
      if (product.stores && Array.isArray(product.stores)) {
        product.stores.forEach((store: string) => {
          productStores.add(store);
        });
      }
    });
    setStores(Array.from(productStores));
  }, [products]);

  const filteredProducts = products.filter(product => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === 'all' || product.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
    const matchesSupplier =
      supplierFilter === 'all' ||
      (product.addedByType === 'supplier' && product.addedBy === supplierFilter);
    // Match vendor - check if product is in any store owned by this vendor
    const matchesVendor =
      vendorFilter === 'all' ||
      (product.vendors && Array.isArray(product.vendors) && product.vendors.includes(vendorFilter));
    
    // Match store - check if product is in this store
    const matchesStore =
      storeFilter === 'all' ||
      (product.stores && Array.isArray(product.stores) && product.stores.includes(storeFilter));
    return (
      matchesSearch &&
      matchesCategory &&
      matchesStatus &&
      matchesSupplier &&
      matchesVendor &&
      matchesStore
    );
  });

  const stats = {
    total: products.length,
    active: products.filter(p => p.status === 'active').length,
    lowStock: products.filter(p => p.status === 'low_stock').length,
    outOfStock: products.filter(p => p.status === 'out_of_stock').length,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400';
      case 'low_stock':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'out_of_stock':
        return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getTagColor = (tag: string) => {
    switch (tag) {
      case 'Featured':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400';
      case 'Best Seller':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400';
      case 'New Arrival':
        return 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/20 dark:text-cyan-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 bg-clip-text text-transparent">
            Products
          </h2>
          <p className="text-muted-foreground mt-1">
            View and manage all products added by suppliers and vendors
          </p>
        </div>
        <Button
          onClick={() => setShowAddForm(true)}
          className="bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 text-white font-semibold hover:from-purple-700 hover:via-indigo-700 hover:to-cyan-700 shadow-lg"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">Total Products</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500">
              <Box className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">Active</p>
              <p className="text-2xl font-bold">{stats.active}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">Low Stock</p>
              <p className="text-2xl font-bold">{stats.lowStock}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-red-500 to-pink-500">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">Out of Stock</p>
              <p className="text-2xl font-bold">{stats.outOfStock}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1 relative w-full">
            <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or SKU..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full md:w-40">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category.id} value={category.name}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="low_stock">Low Stock</SelectItem>
              <SelectItem value="out_of_stock">Out of Stock</SelectItem>
            </SelectContent>
          </Select>
          <Select value={supplierFilter} onValueChange={setSupplierFilter}>
            <SelectTrigger className="w-full md:w-40">
              <Building2 className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Supplier" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Suppliers</SelectItem>
              {suppliers.map(supplier => (
                <SelectItem key={supplier.id} value={supplier.businessName || supplier.fullName}>
                  {supplier.businessName || supplier.fullName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={vendorFilter} onValueChange={setVendorFilter}>
            <SelectTrigger className="w-full md:w-40">
              <User className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Vendor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Vendors</SelectItem>
              {vendors.map(vendor => (
                <SelectItem key={vendor.id} value={vendor.businessName || vendor.fullName}>
                  {vendor.businessName || vendor.fullName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={storeFilter} onValueChange={setStoreFilter}>
            <SelectTrigger className="w-full md:w-40">
              <Store className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Store" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stores</SelectItem>
              {stores.map(store => (
                <SelectItem key={store} value={store}>
                  {store}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid3x3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Products Grid/List */}
      {loading ? (
        <Card className="p-12">
          <div className="flex flex-col items-center gap-3">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full"
            />
            <p className="text-muted-foreground">Loading products...</p>
          </div>
        </Card>
      ) : filteredProducts.length === 0 ? (
        <Card className="p-12">
          <div className="flex flex-col items-center gap-4">
            <div className="p-4 rounded-full bg-slate-100 dark:bg-slate-800">
              <Package className="w-8 h-8 text-muted-foreground" />
            </div>
            <div className="text-center">
              <p className="font-semibold text-lg">No products found</p>
              <p className="text-sm text-muted-foreground mt-1">
                {searchQuery || categoryFilter !== 'all' || statusFilter !== 'all'
                  ? 'Try adjusting your search or filters.'
                  : 'No products have been added yet. Click "Add Product" to create your first product.'}
              </p>
            </div>
            {!searchQuery && categoryFilter === 'all' && statusFilter === 'all' && (
              <Button
                onClick={() => setShowAddForm(true)}
                className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white mt-2"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
            )}
          </div>
        </Card>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-square relative overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2 flex flex-col gap-1">
                    {product.tags && Array.isArray(product.tags) && product.tags.length > 0 && product.tags.map(tag => (
                      <Badge key={tag} className={getTagColor(tag)}>
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-semibold text-sm line-clamp-2">{product.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1">SKU: {product.sku}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-purple-600">${product.price}</span>
                    <Badge className={getStatusColor(product.status)}>
                      {product.stock} in stock
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    <span className="font-medium">MOQ:</span> {product.moq} units
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    {product.addedByType === 'supplier' ? (
                      <Building2 className="w-3 h-3" />
                    ) : (
                      <User className="w-3 h-3" />
                    )}
                    <span className="truncate">{product.addedBy}</span>
                  </div>
                  <div className="flex gap-2">
                  <Button
                      className="flex-1"
                    size="sm"
                      variant="outline"
                    onClick={() => setSelectedProduct(product)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                      View
                    </Button>
                    <Button
                      className="flex-1"
                      size="sm"
                      onClick={async () => {
                        try {
                          // Fetch full product details for editing
                          const response = await fetch(`/api/admin/products/${product.id}`);
                          const data = await response.json();
                          if (response.ok && data.product) {
                            setEditingProduct(data.product);
                            setSelectedProduct(null);
                          } else {
                            showToast.error('Failed to load product details');
                          }
                        } catch (error) {
                          console.error('Fetch product error:', error);
                          showToast.error('Failed to load product details');
                        }
                      }}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                  </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}</div>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold">Product</TableHead>
                <TableHead className="font-semibold">SKU</TableHead>
                <TableHead className="font-semibold">Category</TableHead>
                <TableHead className="font-semibold">Price</TableHead>
                <TableHead className="font-semibold">MOQ</TableHead>
                <TableHead className="font-semibold">Stock</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Added By</TableHead>
                <TableHead className="font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-12">
                    <div className="flex flex-col items-center gap-3">
                      <div className="p-4 rounded-full bg-slate-100 dark:bg-slate-800">
                        <Package className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-semibold text-lg">No products found</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {searchQuery || categoryFilter !== 'all' || statusFilter !== 'all'
                            ? 'Try adjusting your search or filters.'
                            : 'No products have been added yet. Click "Add Product" to create your first product.'}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredProducts.map((product, index) => (
                <motion.tr
                  key={product.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-muted/50"
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div>
                        <p className="font-medium text-sm">{product.name}</p>
                        <div className="flex gap-1 mt-1">
                          {product.tags && Array.isArray(product.tags) && product.tags.length > 0 && product.tags.map(tag => (
                            <Badge key={tag} className={`${getTagColor(tag)} text-[10px]`}>
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{product.sku}</TableCell>
                  <TableCell>
                    <div>
                      <Badge variant="outline">{product.category}</Badge>
                      {product.subcategory && (
                        <p className="text-xs text-muted-foreground mt-1">{product.subcategory}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold text-purple-600">
                    ${product.price}
                  </TableCell>
                  <TableCell className="text-sm">{product.moq}</TableCell>
                  <TableCell className="text-sm">{product.stock}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(product.status)}>
                      {product.status.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-xs">
                      {product.addedByType === 'supplier' ? (
                        <Building2 className="w-3 h-3 text-blue-500" />
                      ) : (
                        <User className="w-3 h-3 text-cyan-500" />
                      )}
                      <span className="text-muted-foreground">{product.addedBy}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedProduct(product)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={async () => {
                          try {
                            // Fetch full product details for editing
                            const response = await fetch(`/api/admin/products/${product.id}`);
                            const data = await response.json();
                            if (response.ok && data.product) {
                              setEditingProduct(data.product);
                              setSelectedProduct(null);
                            } else {
                              showToast.error('Failed to load product details');
                            }
                          } catch (error) {
                            console.error('Fetch product error:', error);
                            showToast.error('Failed to load product details');
                          }
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </motion.tr>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* Product Detail Modal */}
      <AnimatePresence>
        {selectedProduct && !showAddForm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={() => setSelectedProduct(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-3xl z-50 max-h-[90vh] overflow-y-auto"
            >
              <Card className="h-full">
                <div className="sticky top-0 bg-white dark:bg-slate-900 border-b p-6 flex items-center justify-between z-10">
                  <h2 className="text-2xl font-bold">Product Details</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedProduct(null)}
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="aspect-square rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800">
                      <img
                        src={selectedProduct.image}
                        alt={selectedProduct.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-2xl font-bold mb-2">{selectedProduct.name}</h3>
                        <div className="flex gap-2 mb-4">
                          {selectedProduct.tags && Array.isArray(selectedProduct.tags) && selectedProduct.tags.length > 0 && selectedProduct.tags.map((tag: string) => (
                            <Badge key={tag} className={getTagColor(tag)}>
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <p className="text-3xl font-bold text-purple-600 mb-4">
                          ${selectedProduct.price}
                        </p>
                        {selectedProduct.description && (
                          <p className="text-sm text-muted-foreground">{selectedProduct.description}</p>
                        )}
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between py-2 border-b">
                          <span className="text-sm text-muted-foreground">SKU</span>
                          <span className="font-medium">{selectedProduct.sku}</span>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b">
                          <span className="text-sm text-muted-foreground">Category</span>
                          <Badge variant="outline">{selectedProduct.category}</Badge>
                        </div>
                        {selectedProduct.subcategory && (
                          <div className="flex items-center justify-between py-2 border-b">
                            <span className="text-sm text-muted-foreground">Subcategory</span>
                            <span className="font-medium">{selectedProduct.subcategory}</span>
                          </div>
                        )}
                        <div className="flex items-center justify-between py-2 border-b">
                          <span className="text-sm text-muted-foreground">MOQ</span>
                          <span className="font-semibold">{selectedProduct.moq} units</span>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b">
                          <span className="text-sm text-muted-foreground">Stock</span>
                          <span className="font-semibold">{selectedProduct.stock} units</span>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b">
                          <span className="text-sm text-muted-foreground">Status</span>
                          <Badge className={getStatusColor(selectedProduct.status)}>
                            {selectedProduct.status.replace('_', ' ')}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b">
                          <span className="text-sm text-muted-foreground">Added By</span>
                          <div className="flex items-center gap-2">
                            {selectedProduct.addedByType === 'supplier' ? (
                              <Building2 className="w-4 h-4 text-blue-500" />
                            ) : (
                              <User className="w-4 h-4 text-cyan-500" />
                            )}
                            <span className="font-medium">{selectedProduct.addedBy}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </>
        )}

        {/* Add/Edit Product Form Modal */}
        <AnimatePresence>
          {(showAddForm || editingProduct) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
              onClick={() => {
                setShowAddForm(false);
                setEditingProduct(null);
              }}
            >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-y-auto custom-scrollbar"
              >
                <div className="p-6">
                  <ProductForm
                    product={editingProduct}
                    onClose={() => {
                      setShowAddForm(false);
                      setEditingProduct(null);
                      // Refresh products list
                      const loadProducts = async () => {
                        try {
                          const params = new URLSearchParams();
                          if (categoryFilter !== 'all') params.append('category', categoryFilter);
                          if (statusFilter !== 'all') params.append('status', statusFilter);
                          if (supplierFilter !== 'all') params.append('supplier', supplierFilter);
                          if (vendorFilter !== 'all') params.append('vendor', vendorFilter);
                          if (storeFilter !== 'all') params.append('store', storeFilter);
                          const url = `/api/admin/products${params.toString() ? '?' + params.toString() : ''}`;
                          const response = await fetch(url);
                          const data = await response.json();
                          if (response.ok) {
                            setProducts(data.products || []);
                            // Toast is already shown in ProductForm, no need to duplicate
                          }
                        } catch (error) {
                          console.error('Refresh products error:', error);
                        }
                      };
                      loadProducts();
                    }}
            />
          </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </AnimatePresence>
          </div>
  );
}