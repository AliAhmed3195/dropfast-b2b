import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Package,
  Search,
  Grid3x3,
  List,
  MoreVertical,
  Edit,
  Trash2,
  Store,
  TrendingUp,
  Eye,
  DollarSign,
  X,
  AlertCircle,
  CheckCircle2,
  Save,
  Building2,
  Tag as TagIcon,
  Calendar,
  Box,
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
} from './ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { toast } from 'sonner';

// Mock imported products data
const importedProducts = [
  {
    id: 1,
    name: 'Wireless Bluetooth Headphones',
    sku: 'WBH-2024-001',
    store: 'TechHub Store',
    storeId: 'store-1',
    category: 'Electronics',
    supplier: 'TechGear Supplies',
    supplierPrice: 45.99,
    retailPrice: 79.99,
    margin: 42.5,
    stock: 245,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
    importedDate: '2024-12-20',
    description: 'Premium wireless headphones with noise cancellation',
    metaTitle: 'Wireless Bluetooth Headphones - Premium Audio',
    metaDescription: 'Experience superior sound quality with our premium wireless headphones featuring active noise cancellation.',
    metaKeywords: 'wireless, bluetooth, headphones, noise cancellation, audio',
  },
  {
    id: 2,
    name: 'Smart Watch Pro',
    sku: 'SWP-2024-002',
    store: 'TechHub Store',
    storeId: 'store-1',
    category: 'Wearables',
    supplier: 'WearTech Inc',
    supplierPrice: 129.99,
    retailPrice: 199.99,
    margin: 35.0,
    stock: 89,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
    importedDate: '2024-12-18',
    description: 'Advanced smartwatch with health monitoring',
    metaTitle: 'Smart Watch Pro - Health & Fitness Tracker',
    metaDescription: 'Track your health and fitness goals with advanced monitoring features.',
    metaKeywords: 'smartwatch, fitness, health, wearable, tracker',
  },
  {
    id: 3,
    name: 'USB-C Fast Charger',
    sku: 'UFC-2024-003',
    store: 'ElectroMart',
    storeId: 'store-2',
    category: 'Accessories',
    supplier: 'PowerHub Supplies',
    supplierPrice: 15.99,
    retailPrice: 29.99,
    margin: 46.7,
    stock: 450,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400',
    importedDate: '2024-12-15',
    description: '65W fast charging adapter with multiple ports',
    metaTitle: 'USB-C Fast Charger 65W - Multi-Port',
    metaDescription: 'Fast charge multiple devices simultaneously with our 65W USB-C charger.',
    metaKeywords: 'usb-c, fast charger, 65w, multi-port, adapter',
  },
  {
    id: 4,
    name: 'Laptop Stand Adjustable',
    sku: 'LSA-2024-004',
    store: 'GadgetZone',
    storeId: 'store-3',
    category: 'Office',
    supplier: 'ErgoDesk Pro',
    supplierPrice: 25.99,
    retailPrice: 49.99,
    margin: 48.0,
    stock: 156,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400',
    importedDate: '2024-12-12',
    description: 'Ergonomic laptop stand with adjustable height',
    metaTitle: 'Adjustable Laptop Stand - Ergonomic Design',
    metaDescription: 'Improve your posture with our ergonomic adjustable laptop stand.',
    metaKeywords: 'laptop stand, ergonomic, adjustable, office, workspace',
  },
  {
    id: 5,
    name: 'Portable SSD 1TB',
    sku: 'PSS-2024-005',
    store: 'TechHub Store',
    storeId: 'store-1',
    category: 'Storage',
    supplier: 'DataStore Solutions',
    supplierPrice: 79.99,
    retailPrice: 129.99,
    margin: 38.5,
    stock: 0,
    status: 'out-of-stock',
    image: 'https://images.unsplash.com/photo-1531492746076-161ca9bcad58?w=400',
    importedDate: '2024-12-10',
    description: 'Ultra-fast portable SSD with USB 3.2',
    metaTitle: 'Portable SSD 1TB - High Speed Storage',
    metaDescription: 'Ultra-fast portable storage solution with 1TB capacity.',
    metaKeywords: 'ssd, portable, storage, 1tb, usb 3.2',
  },
  {
    id: 6,
    name: 'Gaming Mouse RGB',
    sku: 'GMR-2024-006',
    store: 'ElectroMart',
    storeId: 'store-2',
    category: 'Gaming',
    supplier: 'GameGear Elite',
    supplierPrice: 34.99,
    retailPrice: 59.99,
    margin: 41.7,
    stock: 15,
    status: 'low-stock',
    image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=400',
    importedDate: '2024-12-08',
    description: 'Professional gaming mouse with RGB lighting',
    metaTitle: 'Gaming Mouse RGB - Pro Gaming Gear',
    metaDescription: 'Elevate your gaming with our professional RGB gaming mouse.',
    metaKeywords: 'gaming mouse, rgb, professional, gaming gear',
  },
  {
    id: 7,
    name: 'Mechanical Keyboard',
    sku: 'MKB-2024-007',
    store: 'TechHub Store',
    storeId: 'store-1',
    category: 'Gaming',
    supplier: 'GameGear Elite',
    supplierPrice: 89.99,
    retailPrice: 149.99,
    margin: 40.0,
    stock: 75,
    status: 'draft',
    image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=400',
    importedDate: '2024-12-05',
    description: 'Mechanical keyboard with customizable RGB lighting',
    metaTitle: 'Mechanical Keyboard RGB - Gaming Keyboard',
    metaDescription: 'Premium mechanical keyboard with customizable RGB lighting.',
    metaKeywords: 'mechanical keyboard, rgb, gaming, customizable',
  },
];

// Get unique values for filters
const uniqueStores = Array.from(
  new Map(importedProducts.map(p => [p.storeId, { id: p.storeId, name: p.store }])).values()
);
const uniqueCategories = Array.from(new Set(importedProducts.map(p => p.category)));

export function VendorProducts() {
  const [searchQuery, setSearchQuery] = useState('');
  const [storeFilter, setStoreFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Modal states
  const [viewDetailProduct, setViewDetailProduct] = useState<any>(null);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  
  // Edit form state
  const [editForm, setEditForm] = useState({
    retailPrice: '',
    metaTitle: '',
    metaDescription: '',
    metaKeywords: '',
  });

  // Filter products
  const filteredProducts = importedProducts.filter(product => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStore = storeFilter === 'all' || product.storeId === storeFilter;
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || product.status === statusFilter;

    return matchesSearch && matchesStore && matchesCategory && matchesStatus;
  });

  const stats = {
    total: importedProducts.length,
    active: importedProducts.filter(p => p.status === 'active').length,
    lowStock: importedProducts.filter(p => p.status === 'low-stock').length,
    outOfStock: importedProducts.filter(p => p.status === 'out-of-stock').length,
    avgMargin: importedProducts.reduce((acc, p) => acc + p.margin, 0) / importedProducts.length,
  };

  const handleViewDetails = (product: any) => {
    setViewDetailProduct(product);
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setEditForm({
      retailPrice: product.retailPrice.toString(),
      metaTitle: product.metaTitle || '',
      metaDescription: product.metaDescription || '',
      metaKeywords: product.metaKeywords || '',
    });
  };

  const handleSaveEdit = () => {
    if (!editForm.retailPrice || parseFloat(editForm.retailPrice) <= editingProduct.supplierPrice) {
      toast.error('Retail price must be higher than supplier price!');
      return;
    }

    toast.success('Product updated successfully!', {
      description: 'Price and SEO settings have been updated.',
    });
    setEditingProduct(null);
  };

  const handleRemove = (productId: number) => {
    toast.success('Product removed from store');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400">
          <CheckCircle2 className="w-3 h-3 mr-1" />
          Active
        </Badge>;
      case 'low-stock':
        return <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400">
          <AlertCircle className="w-3 h-3 mr-1" />
          Low Stock
        </Badge>;
      case 'out-of-stock':
        return <Badge className="bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400">
          <AlertCircle className="w-3 h-3 mr-1" />
          Out of Stock
        </Badge>;
      case 'draft':
        return <Badge className="bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400">
          Draft
        </Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-2">Imported Products</h2>
          <p className="text-muted-foreground">
            Manage products imported from suppliers across all your stores
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
            className={viewMode === 'grid' ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white' : ''}
          >
            <Grid3x3 className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
            className={viewMode === 'list' ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white' : ''}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Products</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500">
              <CheckCircle2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active</p>
              <p className="text-2xl font-bold">{stats.active}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Low Stock</p>
              <p className="text-2xl font-bold">{stats.lowStock}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-red-500 to-pink-500">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Out of Stock</p>
              <p className="text-2xl font-bold">{stats.outOfStock}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg Margin</p>
              <p className="text-2xl font-bold">{stats.avgMargin.toFixed(1)}%</p>
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
                placeholder="Search imported products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Store Filter */}
            <Select value={storeFilter} onValueChange={setStoreFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="All Stores" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stores</SelectItem>
                {uniqueStores.map(store => (
                  <SelectItem key={store.id} value={store.id}>
                    {store.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Category Filter */}
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="All Categories" />
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

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="low-stock">Low Stock</SelectItem>
                <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>

            {/* Clear Filters */}
            {(searchQuery || storeFilter !== 'all' || categoryFilter !== 'all' || statusFilter !== 'all') && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery('');
                  setStoreFilter('all');
                  setCategoryFilter('all');
                  setStatusFilter('all');
                }}
              >
                <X className="w-4 h-4 mr-2" />
                Clear Filters
              </Button>
            )}
          </div>

          {/* Active Filters Display */}
          <div className="flex items-center gap-2 flex-wrap">
            {storeFilter !== 'all' && (
              <Badge variant="secondary" className="gap-2">
                Store: {uniqueStores.find(s => s.id === storeFilter)?.name}
                <X 
                  className="w-3 h-3 cursor-pointer" 
                  onClick={() => setStoreFilter('all')}
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
            {statusFilter !== 'all' && (
              <Badge variant="secondary" className="gap-2">
                Status: {statusFilter}
                <X 
                  className="w-3 h-3 cursor-pointer" 
                  onClick={() => setStatusFilter('all')}
                />
              </Badge>
            )}
          </div>
        </div>
      </Card>

      {/* Products View */}
      {viewMode === 'grid' ? (
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
                    {getStatusBadge(product.status)}
                  </div>
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400">
                      <Store className="w-3 h-3 mr-1" />
                      {product.store}
                    </Badge>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-5">
                  <div className="mb-3">
                    <h3 className="font-bold mb-1 line-clamp-1">{product.name}</h3>
                    <p className="text-xs text-muted-foreground">{product.sku}</p>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Supplier:</span>
                      <span className="font-semibold text-xs">{product.supplier}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Category:</span>
                      <Badge variant="outline" className="text-xs">{product.category}</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-2 rounded-lg bg-red-50 dark:bg-red-900/20">
                        <p className="text-xs text-muted-foreground">Cost</p>
                        <p className="font-bold text-red-600">${product.supplierPrice}</p>
                      </div>
                      <div className="p-2 rounded-lg bg-green-50 dark:bg-green-900/20">
                        <p className="text-xs text-muted-foreground">Price</p>
                        <p className="font-bold text-green-600">${product.retailPrice}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm p-2 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                      <span className="text-muted-foreground">Margin:</span>
                      <span className="font-bold text-purple-600">{product.margin.toFixed(1)}%</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Stock:</span>
                      <span className="font-semibold">{product.stock} units</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => handleEdit(product)}
                      size="sm"
                      className="flex-1 bg-gradient-to-r from-purple-600 to-cyan-600 text-white hover:from-purple-700 hover:to-cyan-700"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewDetails(product)}>
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600" onClick={() => handleRemove(product.id)}>
                          <Trash2 className="w-4 h-4 mr-2" />
                          Remove
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Store</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Cost</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Margin</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id} className="hover:bg-purple-50/50 dark:hover:bg-purple-900/10">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div>
                        <p className="font-semibold">{product.name}</p>
                        <p className="text-xs text-muted-foreground">{product.sku}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      <Store className="w-3 h-3 mr-1" />
                      {product.store}
                    </Badge>
                  </TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell className="text-sm">{product.supplier}</TableCell>
                  <TableCell className="font-semibold text-red-600">${product.supplierPrice}</TableCell>
                  <TableCell className="font-semibold text-green-600">${product.retailPrice}</TableCell>
                  <TableCell className="font-semibold text-purple-600">{product.margin.toFixed(1)}%</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>{getStatusBadge(product.status)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(product)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleViewDetails(product)}>
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600" onClick={() => handleRemove(product.id)}>
                          <Trash2 className="w-4 h-4 mr-2" />
                          Remove
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      {filteredProducts.length === 0 && (
        <div className="text-center py-16">
          <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
          <p className="text-lg text-muted-foreground">No imported products found</p>
          <p className="text-sm text-muted-foreground mt-2">Try adjusting your filters or import products from the Inventory page</p>
        </div>
      )}

      {/* View Details Modal */}
      <AnimatePresence>
        {viewDetailProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setViewDetailProduct(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar"
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 text-white p-6 rounded-t-2xl z-10">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-white/20 flex-shrink-0">
                      <img
                        src={viewDetailProduct.image}
                        alt={viewDetailProduct.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold mb-1">Product Details</h3>
                      <p className="text-purple-100">{viewDetailProduct.name}</p>
                      <p className="text-sm text-purple-200 mt-1">{viewDetailProduct.sku}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setViewDetailProduct(null)}
                    className="text-white hover:bg-white/20 rounded-lg"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                {/* Quick Stats */}
                <div className="grid grid-cols-4 gap-4">
                  <div className="p-4 rounded-xl bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border-2 border-red-200 dark:border-red-800">
                    <p className="text-sm text-muted-foreground mb-1">Cost Price</p>
                    <p className="text-2xl font-bold text-red-600">${viewDetailProduct.supplierPrice}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-200 dark:border-green-800">
                    <p className="text-sm text-muted-foreground mb-1">Retail Price</p>
                    <p className="text-2xl font-bold text-green-600">${viewDetailProduct.retailPrice}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-2 border-purple-200 dark:border-purple-800">
                    <p className="text-sm text-muted-foreground mb-1">Margin</p>
                    <p className="text-2xl font-bold text-purple-600">{viewDetailProduct.margin.toFixed(1)}%</p>
                  </div>
                  <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-2 border-blue-200 dark:border-blue-800">
                    <p className="text-sm text-muted-foreground mb-1">Stock</p>
                    <p className="text-2xl font-bold text-blue-600">{viewDetailProduct.stock}</p>
                  </div>
                </div>

                {/* Product Information */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-bold text-lg flex items-center gap-2">
                      <Package className="w-5 h-5 text-purple-600" />
                      Product Information
                    </h4>
                    <div className="space-y-3">
                      <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                        <p className="text-xs text-muted-foreground mb-1">Category</p>
                        <p className="font-semibold">{viewDetailProduct.category}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                        <p className="text-xs text-muted-foreground mb-1">Status</p>
                        {getStatusBadge(viewDetailProduct.status)}
                      </div>
                      <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                        <p className="text-xs text-muted-foreground mb-1">Description</p>
                        <p className="text-sm">{viewDetailProduct.description}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-bold text-lg flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-purple-600" />
                      Store & Supplier
                    </h4>
                    <div className="space-y-3">
                      <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                        <p className="text-xs text-muted-foreground mb-1">Store</p>
                        <p className="font-semibold flex items-center gap-2">
                          <Store className="w-4 h-4 text-purple-600" />
                          {viewDetailProduct.store}
                        </p>
                      </div>
                      <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                        <p className="text-xs text-muted-foreground mb-1">Supplier</p>
                        <p className="font-semibold">{viewDetailProduct.supplier}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                        <p className="text-xs text-muted-foreground mb-1">Imported Date</p>
                        <p className="font-semibold flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-purple-600" />
                          {viewDetailProduct.importedDate}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* SEO Information */}
                <div className="border-t pt-4">
                  <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <TagIcon className="w-5 h-5 text-purple-600" />
                    SEO Settings
                  </h4>
                  <div className="space-y-3">
                    <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                      <p className="text-xs text-muted-foreground mb-1">Meta Title</p>
                      <p className="text-sm">{viewDetailProduct.metaTitle || 'Not set'}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                      <p className="text-xs text-muted-foreground mb-1">Meta Description</p>
                      <p className="text-sm">{viewDetailProduct.metaDescription || 'Not set'}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                      <p className="text-xs text-muted-foreground mb-1">Meta Keywords</p>
                      <p className="text-sm">{viewDetailProduct.metaKeywords || 'Not set'}</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 pt-4 border-t">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setViewDetailProduct(null)}
                  >
                    Close
                  </Button>
                  <Button
                    onClick={() => {
                      setViewDetailProduct(null);
                      handleEdit(viewDetailProduct);
                    }}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-cyan-600 text-white hover:from-purple-700 hover:to-cyan-700"
                  >
                    <Edit className="w-5 h-5 mr-2" />
                    Edit Product
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Product Modal (Price & SEO Only) */}
      <AnimatePresence>
        {editingProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setEditingProduct(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar"
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 text-white p-6 rounded-t-2xl z-10">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-white/20 flex-shrink-0">
                      <img
                        src={editingProduct.image}
                        alt={editingProduct.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold mb-1">Edit Product</h3>
                      <p className="text-purple-100">{editingProduct.name}</p>
                      <p className="text-sm text-purple-200 mt-1">Update price and SEO settings</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingProduct(null)}
                    className="text-white hover:bg-white/20 rounded-lg"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                {/* Pricing Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border-2 border-red-200 dark:border-red-800">
                    <p className="text-sm text-muted-foreground mb-1">Supplier Price (Fixed)</p>
                    <p className="text-2xl font-bold text-red-600">${editingProduct.supplierPrice}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-2 border-purple-200 dark:border-purple-800">
                    <p className="text-sm text-muted-foreground mb-1">Current Margin</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {editForm.retailPrice && parseFloat(editForm.retailPrice) > editingProduct.supplierPrice
                        ? (((parseFloat(editForm.retailPrice) - editingProduct.supplierPrice) / parseFloat(editForm.retailPrice)) * 100).toFixed(1)
                        : editingProduct.margin.toFixed(1)}%
                    </p>
                  </div>
                </div>

                {/* Edit Form */}
                <div className="space-y-4">
                  {/* Retail Price */}
                  <div>
                    <Label className="text-base font-bold mb-2 block">
                      Retail Price <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="Enter retail price"
                        value={editForm.retailPrice}
                        onChange={(e) => setEditForm({ ...editForm, retailPrice: e.target.value })}
                        className="pl-10 text-lg font-semibold"
                      />
                    </div>
                    {editForm.retailPrice && parseFloat(editForm.retailPrice) > editingProduct.supplierPrice && (
                      <p className="text-sm text-green-600 mt-2">
                        ✓ Profit: ${(parseFloat(editForm.retailPrice) - editingProduct.supplierPrice).toFixed(2)} per unit
                      </p>
                    )}
                    {editForm.retailPrice && parseFloat(editForm.retailPrice) <= editingProduct.supplierPrice && (
                      <p className="text-sm text-red-600 mt-2">
                        ✗ Price must be higher than supplier price (${editingProduct.supplierPrice})
                      </p>
                    )}
                  </div>

                  {/* SEO Fields */}
                  <div className="border-t pt-4">
                    <h4 className="font-bold mb-4">SEO Settings</h4>
                    
                    <div className="space-y-4">
                      <div>
                        <Label>Meta Title</Label>
                        <Input
                          placeholder="SEO optimized title"
                          value={editForm.metaTitle}
                          onChange={(e) => setEditForm({ ...editForm, metaTitle: e.target.value })}
                        />
                      </div>

                      <div>
                        <Label>Meta Description</Label>
                        <Textarea
                          placeholder="SEO optimized description"
                          value={editForm.metaDescription}
                          onChange={(e) => setEditForm({ ...editForm, metaDescription: e.target.value })}
                          rows={3}
                        />
                      </div>

                      <div>
                        <Label>Meta Keywords</Label>
                        <Input
                          placeholder="keyword1, keyword2, keyword3"
                          value={editForm.metaKeywords}
                          onChange={(e) => setEditForm({ ...editForm, metaKeywords: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Info Note */}
                <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    <strong>Note:</strong> You can only edit the retail price and SEO settings for imported products. Product details (name, description, category, etc.) are managed by the supplier.
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 pt-4 border-t">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setEditingProduct(null)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSaveEdit}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-cyan-600 text-white hover:from-purple-700 hover:to-cyan-700"
                  >
                    <Save className="w-5 h-5 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
