'use client'

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Slider from 'react-slick';
import {
  Package,
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  TrendingUp,
  AlertCircle,
  DollarSign,
  X,
  Box,
  Layers,
  ImageIcon,
  Tag,
  Star,
  Filter,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { toast } from 'sonner';
import { cn } from './ui/utils';
import { ProductForm } from './ProductForm';

// Mock products data
const mockProducts = [
  {
    id: 1,
    name: 'Wireless Bluetooth Headphones',
    sku: 'WBH-2024-001',
    category: 'Electronics',
    subcategory: 'Audio',
    stock: 245,
    price: 79.99,
    status: 'active',
    orders: 156,
    description: 'Premium wireless headphones with noise cancellation',
    moq: 10,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600',
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600',
      'https://images.unsplash.com/photo-1577174881658-0f30157f5a57?w=600',
    ],
  },
  {
    id: 2,
    name: 'Smart Watch Pro',
    sku: 'SWP-2024-002',
    category: 'Wearables',
    subcategory: 'Watches',
    stock: 89,
    price: 199.99,
    status: 'active',
    orders: 98,
    description: 'Advanced smartwatch with health monitoring',
    moq: 5,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600',
      'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600',
      'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=600',
    ],
  },
  {
    id: 3,
    name: 'USB-C Fast Charger',
    sku: 'UFC-2024-003',
    category: 'Accessories',
    subcategory: 'Chargers',
    stock: 12,
    price: 29.99,
    status: 'low-stock',
    orders: 234,
    description: '65W fast charging adapter',
    moq: 20,
    image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400',
    images: [
      'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600',
      'https://images.unsplash.com/photo-1624823183493-ed5832f48f18?w=600',
    ],
  },
  {
    id: 4,
    name: 'Laptop Stand Adjustable',
    sku: 'LSA-2024-004',
    category: 'Office',
    subcategory: 'Accessories',
    stock: 0,
    price: 45.99,
    status: 'out-of-stock',
    orders: 67,
    description: 'Ergonomic laptop stand with adjustable height',
    moq: 15,
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400',
    images: [
      'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600',
      'https://images.unsplash.com/photo-1588508065123-287b28e013da?w=600',
      'https://images.unsplash.com/photo-1585076800246-0405417327a7?w=600',
    ],
  },
  {
    id: 5,
    name: 'Portable SSD 1TB',
    sku: 'PSS-2024-005',
    category: 'Storage',
    subcategory: 'External Drives',
    stock: 156,
    price: 129.99,
    status: 'active',
    orders: 89,
    description: 'High-speed portable solid state drive',
    moq: 8,
    image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=400',
    images: [
      'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=600',
      'https://images.unsplash.com/photo-1531492746076-161ca9bcad58?w=600',
    ],
  },
];

export function SupplierProducts() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showDetailView, setShowDetailView] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'add' | 'edit'>('list');

  const filteredProducts = mockProducts.filter(
    product =>
      (product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (statusFilter === 'all' || product.status === statusFilter) &&
      (categoryFilter === 'all' || product.category === categoryFilter)
  ).sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'stock-low':
        return a.stock - b.stock;
      case 'stock-high':
        return b.stock - a.stock;
      case 'orders':
        return b.orders - a.orders;
      default:
        return 0;
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400';
      case 'low-stock':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'out-of-stock':
        return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const handleViewDetails = (product: any) => {
    setSelectedProduct(product);
    setShowDetailView(true);
  };

  const handleAddProduct = () => {
    setViewMode('add');
    setEditingProduct(null);
  };

  const handleEditProduct = (product: any) => {
    setViewMode('edit');
    setEditingProduct(product);
  };

  const handleBackToList = () => {
    setViewMode('list');
    setEditingProduct(null);
  };

  // If in add/edit mode, show ProductForm as full page
  if (viewMode === 'add' || viewMode === 'edit') {
    return (
      <ProductForm 
        product={editingProduct}
        onClose={handleBackToList}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-2">My Products</h2>
          <p className="text-muted-foreground">
            Manage your product catalog and inventory
          </p>
        </div>
        <Button
          onClick={handleAddProduct}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-sm"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add New Product
        </Button>
      </div>

      {/* Search and Filter */}
      <Card className="p-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or SKU..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>
        {showFilters && (
          <div className="mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Status</Label>
                <Select
                  value={statusFilter}
                  onValueChange={setStatusFilter}
                >
                  <SelectTrigger>
                    <SelectValue>
                      {statusFilter === 'all' ? 'All' : statusFilter.replace('-', ' ')}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="low-stock">Low Stock</SelectItem>
                    <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Category</Label>
                <Select
                  value={categoryFilter}
                  onValueChange={setCategoryFilter}
                >
                  <SelectTrigger>
                    <SelectValue>
                      {categoryFilter === 'all' ? 'All' : categoryFilter}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="Electronics">Electronics</SelectItem>
                    <SelectItem value="Wearables">Wearables</SelectItem>
                    <SelectItem value="Accessories">Accessories</SelectItem>
                    <SelectItem value="Office">Office</SelectItem>
                    <SelectItem value="Storage">Storage</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="mt-4">
              <Label>Sort By</Label>
              <Select
                value={sortBy}
                onValueChange={setSortBy}
              >
                <SelectTrigger>
                  <SelectValue>
                    {sortBy === 'name' ? 'Name' : sortBy.replace('-', ' ')}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="price-low">Price (Low to High)</SelectItem>
                  <SelectItem value="price-high">Price (High to Low)</SelectItem>
                  <SelectItem value="stock-low">Stock (Low to High)</SelectItem>
                  <SelectItem value="stock-high">Stock (High to Low)</SelectItem>
                  <SelectItem value="orders">Orders (High to Low)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </Card>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              {/* Product Image */}
              <div className="relative h-48 bg-slate-100 dark:bg-slate-800">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <Badge
                  className={cn(
                    'absolute top-3 right-3',
                    getStatusColor(product.status)
                  )}
                >
                  {product.status.replace('-', ' ')}
                </Badge>
              </div>

              {/* Product Info */}
              <div className="p-4 space-y-3">
                <div>
                  <h3 className="font-bold text-lg mb-1">{product.name}</h3>
                  <p className="text-xs text-muted-foreground font-mono">
                    {product.sku}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Category</p>
                    <p className="text-sm font-medium">{product.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Stock</p>
                    <p
                      className={cn(
                        'text-sm font-bold',
                        product.stock === 0
                          ? 'text-red-600'
                          : product.stock < 50
                          ? 'text-yellow-600'
                          : 'text-green-600'
                      )}
                    >
                      {product.stock}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t">
                  <div>
                    <p className="text-2xl font-bold text-purple-600">
                      ${product.price}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      MOQ: {product.moq} units
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDetails(product)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditProduct(product)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Product
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-red-600"
                          onClick={() => toast.success('Product deleted successfully!')}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Package className="w-4 h-4" />
                  <span>{product.orders} orders fulfilled</span>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Product Detail Modal */}
      <AnimatePresence>
        {showDetailView && selectedProduct && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={() => {
                setShowDetailView(false);
                setSelectedProduct(null);
              }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-3xl z-50"
            >
              <ProductDetailView
                product={selectedProduct}
                onClose={() => {
                  setShowDetailView(false);
                  setSelectedProduct(null);
                }}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// Product Detail View Component
function ProductDetailView(
  {
  product,
  onClose,
}: {
  product: any;
  onClose: () => void;
}) {
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  return (
    <Card className="max-h-[90vh] overflow-y-auto">
      <div className="sticky top-0 bg-white dark:bg-slate-900 border-b p-6 flex items-center justify-between z-10">
        <h2 className="text-2xl font-bold">Product Details</h2>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-5 h-5" />
        </Button>
      </div>

      <div className="p-6 space-y-6">
        {/* Product Image Slider */}
        <div className="relative rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 product-slider">
          <Slider {...sliderSettings}>
            {product.images.map((image: string, index: number) => (
              <div key={index} className="relative h-80">
                <img
                  src={image}
                  alt={`${product.name} - Image ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </Slider>
          <Badge
            className={cn(
              'absolute top-4 right-4 z-10',
              product.status === 'active'
                ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                : product.status === 'low-stock'
                ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400'
                : 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
            )}
          >
            {product.status.replace('-', ' ')}
          </Badge>
        </div>

        {/* Product Info */}
        <div>
          <h3 className="text-2xl font-bold mb-2">{product.name}</h3>
          <p className="text-sm text-muted-foreground font-mono mb-4">
            SKU: {product.sku}
          </p>
          <p className="text-muted-foreground">{product.description}</p>
        </div>

        {/* Pricing & Stock Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20 border-purple-200 dark:border-purple-800">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="w-4 h-4 text-purple-600" />
              <p className="text-sm text-muted-foreground">Base Price</p>
            </div>
            <p className="text-2xl font-bold text-purple-600">
              ${product.price}
            </p>
          </Card>
          <Card className="p-4 bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-950/20 dark:to-blue-950/20 border-cyan-200 dark:border-cyan-800">
            <div className="flex items-center gap-2 mb-1">
              <Package className="w-4 h-4 text-cyan-600" />
              <p className="text-sm text-muted-foreground">MOQ</p>
            </div>
            <p className="text-2xl font-bold text-cyan-600">{product.moq}</p>
            <p className="text-xs text-muted-foreground mt-1">units</p>
          </Card>
          <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800">
            <div className="flex items-center gap-2 mb-1">
              <Box className="w-4 h-4 text-green-600" />
              <p className="text-sm text-muted-foreground">Stock</p>
            </div>
            <p
              className={cn(
                'text-2xl font-bold',
                product.stock === 0
                  ? 'text-red-600'
                  : product.stock < 50
                  ? 'text-yellow-600'
                  : 'text-green-600'
              )}
            >
              {product.stock}
            </p>
            <p className="text-xs text-muted-foreground mt-1">in stock</p>
          </Card>
          <Card className="p-4 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 border-orange-200 dark:border-orange-800">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-orange-600" />
              <p className="text-sm text-muted-foreground">Orders</p>
            </div>
            <p className="text-2xl font-bold text-orange-600">{product.orders}</p>
            <p className="text-xs text-muted-foreground mt-1">fulfilled</p>
          </Card>
        </div>

        {/* Category & Classification */}
        <Card className="p-4">
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <Layers className="w-4 h-4" />
            Category & Classification
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Category</p>
              <Badge variant="outline" className="text-sm">
                {product.category}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Subcategory</p>
              <Badge variant="outline" className="text-sm">
                {product.subcategory}
              </Badge>
            </div>
          </div>
        </Card>

        {/* Pricing Tiers */}
        <Card className="p-4">
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <Tag className="w-4 h-4" />
            Volume Pricing
          </h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <div>
                <p className="text-sm font-medium">Base Price</p>
                <p className="text-xs text-muted-foreground">{product.moq} - 49 units</p>
              </div>
              <p className="text-lg font-bold text-purple-600">${product.price}</p>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <div>
                <p className="text-sm font-medium">Bulk Discount</p>
                <p className="text-xs text-muted-foreground">50 - 99 units</p>
              </div>
              <p className="text-lg font-bold text-purple-600">${(product.price * 0.95).toFixed(2)}</p>
              <Badge className="bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                -5%
              </Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <div>
                <p className="text-sm font-medium">Wholesale Price</p>
                <p className="text-xs text-muted-foreground">100+ units</p>
              </div>
              <p className="text-lg font-bold text-purple-600">${(product.price * 0.90).toFixed(2)}</p>
              <Badge className="bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                -10%
              </Badge>
            </div>
          </div>
        </Card>

        {/* Product Specifications */}
        <Card className="p-4">
          <h4 className="font-semibold mb-3">Product Specifications</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between py-2 border-b">
                <span className="text-sm text-muted-foreground">Weight</span>
                <span className="text-sm font-medium">0.5 kg</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-sm text-muted-foreground">Dimensions</span>
                <span className="text-sm font-medium">15×10×5 cm</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-sm text-muted-foreground">Material</span>
                <span className="text-sm font-medium">Plastic, Metal</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between py-2 border-b">
                <span className="text-sm text-muted-foreground">Color</span>
                <span className="text-sm font-medium">Black, White</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-sm text-muted-foreground">Warranty</span>
                <span className="text-sm font-medium">12 months</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-sm text-muted-foreground">Brand</span>
                <span className="text-sm font-medium">FastDrop</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Shipping Information */}
        <Card className="p-4">
          <h4 className="font-semibold mb-3">Shipping Information</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Processing Time</p>
              <p className="text-sm font-medium">1-2 business days</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Shipping Cost</p>
              <p className="text-sm font-medium">$5.00 per unit</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Origin</p>
              <p className="text-sm font-medium">United States</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Free Shipping</p>
              <p className="text-sm font-medium">Orders over $500</p>
            </div>
          </div>
        </Card>

        {/* Commission & Margins */}
        <Card className="p-4">
          <h4 className="font-semibold mb-3">Commission & Margins</h4>
          <div className="grid grid-cols-3 gap-4">
            <div className="p-3 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Platform Fee</p>
              <p className="text-lg font-bold text-blue-600">5%</p>
            </div>
            <div className="p-3 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Suggested Markup</p>
              <p className="text-lg font-bold text-purple-600">30-50%</p>
            </div>
            <div className="p-3 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Your Profit</p>
              <p className="text-lg font-bold text-green-600">${(product.price * 0.25).toFixed(2)}</p>
            </div>
          </div>
        </Card>

        {/* Product Tags */}
        <Card className="p-4">
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <Tag className="w-4 h-4" />
            Product Tags
          </h4>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">Electronics</Badge>
            <Badge variant="outline">Fast Shipping</Badge>
            <Badge variant="outline">Best Seller</Badge>
            <Badge variant="outline">New Arrival</Badge>
            <Badge variant="outline">Premium Quality</Badge>
          </div>
        </Card>

        {/* Performance Metrics */}
        <Card className="p-4">
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <Star className="w-4 h-4" />
            Performance Metrics
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Rating</p>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-lg font-bold">4.8</span>
                <span className="text-sm text-muted-foreground">(245)</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Return Rate</p>
              <p className="text-lg font-bold text-green-600">2.3%</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Revenue</p>
              <p className="text-lg font-bold">${(product.orders * product.price).toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Active Vendors</p>
              <p className="text-lg font-bold">28</p>
            </div>
          </div>
        </Card>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t">
          <Button 
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-sm"
            onClick={onClose}
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit Product
          </Button>
          <Button
            variant="outline"
            className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>
    </Card>
  );
}

// Arrow components for Slider
function NextArrow({ onClick }: { onClick: () => void }) {
  return (
    <div
      className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white dark:bg-slate-900 p-2 rounded-full cursor-pointer"
      onClick={onClick}
    >
      <ChevronRight className="w-4 h-4 text-gray-500 dark:text-gray-400" />
    </div>
  );
}

function PrevArrow({ onClick }: { onClick: () => void }) {
  return (
    <div
      className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white dark:bg-slate-900 p-2 rounded-full cursor-pointer"
      onClick={onClick}
    >
      <ChevronLeft className="w-4 h-4 text-gray-500 dark:text-gray-400" />
    </div>
  );
}