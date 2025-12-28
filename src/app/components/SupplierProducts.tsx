'use client'

import React, { useState, useEffect, useRef } from 'react';
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
import { showToast } from '../../lib/toast';
import { useAuth } from '../contexts/AuthContext';
import { cn } from './ui/utils';
import { ProductForm } from './ProductForm';
import { Loader2 } from 'lucide-react';

export function SupplierProducts() {
  const { user } = useAuth();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const fetchingRef = useRef(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showDetailView, setShowDetailView] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'add' | 'edit'>('list');

  // Fetch products
  useEffect(() => {
    if (!user?.id || fetchingRef.current) return;

    fetchingRef.current = true;
    setLoading(true);

    const fetchProducts = async () => {
      try {
        const params = new URLSearchParams();
        params.append('supplierId', user.id);
        if (statusFilter !== 'all') params.append('status', statusFilter);
        if (categoryFilter !== 'all') params.append('category', categoryFilter);
        if (searchQuery) params.append('search', searchQuery);

        const response = await fetch(`/api/supplier/products?${params.toString()}`);
        const data = await response.json();

        if (response.ok) {
          setProducts(data.products || []);
        } else {
          showToast.error(data.error || 'Failed to fetch products');
        }
      } catch (error) {
        console.error('Fetch products error:', error);
        showToast.error('Failed to fetch products');
      } finally {
        setLoading(false);
        fetchingRef.current = false;
      }
    };

    fetchProducts();
  }, [user?.id, statusFilter, categoryFilter, searchQuery]);

  const filteredProducts = products.filter(
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

  const handleEditProduct = async (product: any) => {
    try {
      // Fetch full product details for editing
      const response = await fetch(`/api/admin/products/${product.id}`);
      const data = await response.json();
      if (response.ok && data.product) {
        setEditingProduct(data.product);
        setViewMode('edit');
      } else {
        showToast.error('Failed to load product details');
      }
    } catch (error) {
      console.error('Fetch product error:', error);
      showToast.error('Failed to load product details');
    }
  };

  const handleBackToList = () => {
    setViewMode('list');
    setEditingProduct(null);
    // Refresh products list
    fetchingRef.current = false;
    setLoading(true);
    const fetchProducts = async () => {
      try {
        const params = new URLSearchParams();
        params.append('supplierId', user?.id || '');
        if (statusFilter !== 'all') params.append('status', statusFilter);
        if (categoryFilter !== 'all') params.append('category', categoryFilter);
        if (searchQuery) params.append('search', searchQuery);

        const response = await fetch(`/api/supplier/products?${params.toString()}`);
        const data = await response.json();

        if (response.ok) {
          setProducts(data.products || []);
        }
      } catch (error) {
        console.error('Fetch products error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
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
      {filteredProducts.length > 0 ? (
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
                          onClick={() => showToast.success('Product deleted successfully!')}
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
      ) : (
        <Card className="p-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center text-center"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            </motion.div>
            <p className="text-lg font-medium text-muted-foreground mb-2">
              {searchQuery || statusFilter !== 'all' || categoryFilter !== 'all'
                ? 'No products found'
                : 'No products yet'
              }
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              {searchQuery || statusFilter !== 'all' || categoryFilter !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Get started by adding your first product'
              }
            </p>
            {!searchQuery && statusFilter === 'all' && categoryFilter === 'all' && (
              <Button
                onClick={handleAddProduct}
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Product
              </Button>
            )}
          </motion.div>
        </Card>
      )}

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
    nextArrow: <NextArrow onClick={() => {}} />,
    prevArrow: <PrevArrow onClick={() => {}} />,
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