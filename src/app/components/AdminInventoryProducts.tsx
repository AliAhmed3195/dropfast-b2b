import React, { useState } from 'react';
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
import { toast } from 'sonner';
import { useNavigation } from '../contexts/NavigationContext';

// Mock product data
const mockProducts = [
  {
    id: '1',
    name: 'Wireless Bluetooth Headphones',
    sku: 'WBH-001',
    category: 'Electronics',
    subcategory: 'Audio',
    price: 79.99,
    moq: 10,
    stock: 145,
    status: 'active',
    addedBy: 'Tech Supply Co.',
    addedByType: 'supplier',
    store: '',
    tags: ['Featured', 'Best Seller'],
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200',
    description: 'Premium wireless headphones with noise cancellation',
  },
  {
    id: '2',
    name: 'Smart Watch Series 5',
    sku: 'SW-005',
    category: 'Electronics',
    subcategory: 'Wearables',
    price: 299.99,
    moq: 5,
    stock: 89,
    status: 'active',
    addedBy: 'Global Electronics',
    addedByType: 'supplier',
    store: '',
    tags: ['New Arrival'],
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200',
    description: 'Advanced fitness tracking smartwatch',
  },
  {
    id: '3',
    name: 'Ergonomic Office Chair',
    sku: 'EOC-023',
    category: 'Furniture',
    subcategory: 'Office',
    price: 249.99,
    moq: 2,
    stock: 34,
    status: 'active',
    addedBy: 'Fashion Hub',
    addedByType: 'vendor',
    store: 'Fashion Hub Store',
    tags: ['Featured'],
    image: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=200',
    description: 'Comfortable ergonomic chair for long work hours',
  },
  {
    id: '4',
    name: 'Gaming Keyboard RGB',
    sku: 'GKR-078',
    category: 'Electronics',
    subcategory: 'Gaming',
    price: 129.99,
    moq: 10,
    stock: 5,
    status: 'low_stock',
    addedBy: 'Tech Supply Co.',
    addedByType: 'supplier',
    store: '',
    tags: ['Best Seller'],
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=200',
    description: 'Mechanical gaming keyboard with RGB lighting',
  },
  {
    id: '5',
    name: 'Portable Power Bank',
    sku: 'PPB-156',
    category: 'Accessories',
    subcategory: 'Charging',
    price: 39.99,
    moq: 20,
    stock: 0,
    status: 'out_of_stock',
    addedBy: 'Global Electronics',
    addedByType: 'supplier',
    store: '',
    tags: [],
    image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=200',
    description: '10000mAh portable charger',
  },
  {
    id: '6',
    name: 'Wireless Gaming Mouse',
    sku: 'WGM-045',
    category: 'Electronics',
    subcategory: 'Gaming',
    price: 59.99,
    moq: 15,
    stock: 78,
    status: 'active',
    addedBy: 'Tech Supply Co.',
    addedByType: 'supplier',
    store: '',
    tags: ['Best Seller'],
    image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=200',
    description: 'High-precision wireless gaming mouse',
  },
  {
    id: '7',
    name: 'Premium Laptop Stand',
    sku: 'PLS-012',
    category: 'Accessories',
    subcategory: 'Office',
    price: 45.99,
    moq: 8,
    stock: 120,
    status: 'active',
    addedBy: 'Tech Haven Store',
    addedByType: 'vendor',
    store: 'Tech Haven Store',
    tags: ['Featured'],
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=200',
    description: 'Adjustable aluminum laptop stand',
  },
  {
    id: '8',
    name: 'USB-C Hub 7-in-1',
    sku: 'UCH-789',
    category: 'Accessories',
    subcategory: 'Connectivity',
    price: 34.99,
    moq: 25,
    stock: 156,
    status: 'active',
    addedBy: 'Global Electronics',
    addedByType: 'supplier',
    store: '',
    tags: ['New Arrival'],
    image: 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=200',
    description: 'Multi-port USB-C hub with HDMI and SD card reader',
  },
  {
    id: '9',
    name: 'Mechanical Keyboard Switches',
    sku: 'MKS-234',
    category: 'Electronics',
    subcategory: 'Gaming',
    price: 89.99,
    moq: 5,
    stock: 42,
    status: 'active',
    addedBy: 'Tech Supply Co.',
    addedByType: 'supplier',
    store: '',
    tags: ['Featured'],
    image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=200',
    description: 'Premium mechanical keyboard switches for enthusiasts',
  },
  {
    id: '10',
    name: 'Desk Organizer Set',
    sku: 'DOS-567',
    category: 'Furniture',
    subcategory: 'Office',
    price: 29.99,
    moq: 12,
    stock: 8,
    status: 'low_stock',
    addedBy: 'Fashion Hub',
    addedByType: 'vendor',
    store: 'Fashion Hub Store',
    tags: [],
    image: 'https://images.unsplash.com/photo-1594834226164-cbd06f65d53e?w=200',
    description: 'Complete desk organization solution',
  },
  {
    id: '11',
    name: '4K Webcam Pro',
    sku: 'WCP-901',
    category: 'Electronics',
    subcategory: 'Video',
    price: 149.99,
    moq: 6,
    stock: 67,
    status: 'active',
    addedBy: 'Global Electronics',
    addedByType: 'supplier',
    store: '',
    tags: ['Best Seller', 'New Arrival'],
    image: 'https://images.unsplash.com/photo-1585931927934-bb61065f2a5e?w=200',
    description: '4K webcam with auto-focus and noise cancellation',
  },
  {
    id: '12',
    name: 'Wireless Charging Pad',
    sku: 'WCP-345',
    category: 'Accessories',
    subcategory: 'Charging',
    price: 24.99,
    moq: 30,
    stock: 203,
    status: 'active',
    addedBy: 'Tech Supply Co.',
    addedByType: 'supplier',
    store: '',
    tags: ['Featured'],
    image: 'https://images.unsplash.com/photo-1591290619762-9b2c0659c2e8?w=200',
    description: 'Fast wireless charging pad for all devices',
  },
  {
    id: '13',
    name: 'Gaming Headset RGB',
    sku: 'GHS-678',
    category: 'Electronics',
    subcategory: 'Audio',
    price: 119.99,
    moq: 8,
    stock: 91,
    status: 'active',
    addedBy: 'Tech Haven Store',
    addedByType: 'vendor',
    store: 'Tech Haven Store',
    tags: ['Best Seller'],
    image: 'https://images.unsplash.com/photo-1599669454699-248893623440?w=200',
    description: '7.1 surround sound gaming headset with RGB',
  },
  {
    id: '14',
    name: 'Monitor Arm Mount',
    sku: 'MAM-123',
    category: 'Furniture',
    subcategory: 'Office',
    price: 79.99,
    moq: 4,
    stock: 45,
    status: 'active',
    addedBy: 'Tech Haven Store',
    addedByType: 'vendor',
    store: 'Tech Haven Store',
    tags: ['Featured'],
    image: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=200',
    description: 'Adjustable dual monitor arm mount',
  },
  {
    id: '15',
    name: 'Bluetooth Speaker Portable',
    sku: 'BSP-890',
    category: 'Electronics',
    subcategory: 'Audio',
    price: 69.99,
    moq: 12,
    stock: 134,
    status: 'active',
    addedBy: 'Global Electronics',
    addedByType: 'supplier',
    store: '',
    tags: ['New Arrival'],
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=200',
    description: 'Waterproof portable Bluetooth speaker',
  },
  {
    id: '16',
    name: 'Cable Management Kit',
    sku: 'CMK-456',
    category: 'Accessories',
    subcategory: 'Office',
    price: 19.99,
    moq: 20,
    stock: 0,
    status: 'out_of_stock',
    addedBy: 'Fashion Hub',
    addedByType: 'vendor',
    store: 'Fashion Hub Store',
    tags: [],
    image: 'https://images.unsplash.com/photo-1558089687-81b5cd2d3f2e?w=200',
    description: 'Complete cable organization and management kit',
  },
  {
    id: '17',
    name: 'LED Desk Lamp',
    sku: 'LDL-234',
    category: 'Furniture',
    subcategory: 'Office',
    price: 54.99,
    moq: 10,
    stock: 72,
    status: 'active',
    addedBy: 'Tech Haven Store',
    addedByType: 'vendor',
    store: 'Tech Haven Store',
    tags: ['Featured'],
    image: 'https://images.unsplash.com/photo-1565018697736-9d4a14c07f3c?w=200',
    description: 'Adjustable LED desk lamp with touch controls',
  },
  {
    id: '18',
    name: 'External SSD 1TB',
    sku: 'SSD-789',
    category: 'Electronics',
    subcategory: 'Storage',
    price: 129.99,
    moq: 5,
    stock: 56,
    status: 'active',
    addedBy: 'Global Electronics',
    addedByType: 'supplier',
    store: '',
    tags: ['Best Seller'],
    image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=200',
    description: 'Ultra-fast portable SSD with 1TB storage',
  },
  {
    id: '19',
    name: 'Smartphone Gimbal',
    sku: 'SG-567',
    category: 'Accessories',
    subcategory: 'Video',
    price: 89.99,
    moq: 6,
    stock: 3,
    status: 'low_stock',
    addedBy: 'Tech Supply Co.',
    addedByType: 'supplier',
    store: '',
    tags: ['New Arrival'],
    image: 'https://images.unsplash.com/photo-1575819797647-4e90c7c9d6a5?w=200',
    description: '3-axis smartphone stabilizer gimbal',
  },
  {
    id: '20',
    name: 'Ergonomic Mouse Pad',
    sku: 'EMP-345',
    category: 'Accessories',
    subcategory: 'Office',
    price: 14.99,
    moq: 30,
    stock: 245,
    status: 'active',
    addedBy: 'Fashion Hub',
    addedByType: 'vendor',
    store: 'Fashion Hub Store',
    tags: ['Featured'],
    image: 'https://images.unsplash.com/photo-1563296239-3d44c2d26b5e?w=200',
    description: 'Ergonomic mouse pad with wrist support',
  },
];

export function AdminInventoryProducts() {
  const { setView } = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [supplierFilter, setSupplierFilter] = useState('all');
  const [vendorFilter, setVendorFilter] = useState('all');
  const [storeFilter, setStoreFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // Get unique suppliers and vendors/stores
  const suppliers = Array.from(
    new Set(
      mockProducts
        .filter(p => p.addedByType === 'supplier')
        .map(p => p.addedBy)
    )
  );
  const vendors = Array.from(
    new Set(
      mockProducts
        .filter(p => p.addedByType === 'vendor')
        .map(p => p.addedBy)
    )
  );
  const stores = Array.from(
    new Set(mockProducts.filter(p => p.store).map(p => p.store))
  );

  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === 'all' || product.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
    const matchesSupplier =
      supplierFilter === 'all' ||
      (product.addedByType === 'supplier' && product.addedBy === supplierFilter);
    const matchesVendor =
      vendorFilter === 'all' ||
      (product.addedByType === 'vendor' && product.addedBy === vendorFilter);
    const matchesStore = storeFilter === 'all' || product.store === storeFilter;
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
    total: mockProducts.length,
    active: mockProducts.filter(p => p.status === 'active').length,
    lowStock: mockProducts.filter(p => p.status === 'low_stock').length,
    outOfStock: mockProducts.filter(p => p.status === 'out_of_stock').length,
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
              <SelectItem value="Electronics">Electronics</SelectItem>
              <SelectItem value="Furniture">Furniture</SelectItem>
              <SelectItem value="Accessories">Accessories</SelectItem>
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
                <SelectItem key={supplier} value={supplier}>
                  {supplier}
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
                <SelectItem key={vendor} value={vendor}>
                  {vendor}
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
      {viewMode === 'grid' ? (
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
                    {product.tags.map(tag => (
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
                  <Button
                    className="w-full"
                    size="sm"
                    onClick={() => setSelectedProduct(product)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
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
              {filteredProducts.map((product, index) => (
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
                          {product.tags.map(tag => (
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
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedProduct(product)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </motion.tr>
              ))}
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
                          {selectedProduct.tags.map((tag: string) => (
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

        {/* Add Product Form */}
        {showAddForm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={() => setShowAddForm(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-4xl z-50 max-h-[90vh] overflow-y-auto"
            >
              <AddProductForm onClose={() => setShowAddForm(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// Add Product Form Component (with all supplier fields)
function AddProductForm({ onClose }: { onClose: () => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    toast.success('Product added successfully!');
    setIsSubmitting(false);
    onClose();
  };

  return (
    <Card className="h-full overflow-y-auto">
      <div className="sticky top-0 bg-white dark:bg-slate-900 border-b p-6 flex items-center justify-between z-10">
        <div>
          <h2 className="text-2xl font-bold">Add New Product</h2>
          <p className="text-sm text-muted-foreground">
            Fill in the product details below
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-5 h-5" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="font-bold flex items-center gap-2">
            <Package className="w-5 h-5 text-purple-500" />
            Basic Information
          </h3>

          <div className="space-y-2">
            <Label htmlFor="productName">
              Product Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="productName"
              placeholder="e.g., Wireless Headphones"
              className="h-11"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe your product..."
              className="min-h-[100px]"
              rows={4}
            />
          </div>
        </div>

        {/* Pricing */}
        <div className="space-y-4">
          <h3 className="font-bold flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-500" />
            Pricing
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">
                Price (USD) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                placeholder="0.00"
                className="h-11"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="moq">
                MOQ (Minimum Order Quantity) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="moq"
                type="number"
                placeholder="10"
                className="h-11"
                required
              />
            </div>
          </div>
        </div>

        {/* Category & Tags */}
        <div className="space-y-4">
          <h3 className="font-bold flex items-center gap-2">
            <Layers className="w-5 h-5 text-cyan-500" />
            Classification
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">
                Category <span className="text-red-500">*</span>
              </Label>
              <Select required>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="electronics">Electronics</SelectItem>
                  <SelectItem value="wearables">Wearables</SelectItem>
                  <SelectItem value="accessories">Accessories</SelectItem>
                  <SelectItem value="office">Office</SelectItem>
                  <SelectItem value="storage">Storage</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="subcategory">Subcategory</Label>
              <Select>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Select subcategory" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="audio">Audio</SelectItem>
                  <SelectItem value="watches">Watches</SelectItem>
                  <SelectItem value="chargers">Chargers</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Stock Information */}
        <div className="space-y-4">
          <h3 className="font-bold flex items-center gap-2">
            <Box className="w-5 h-5 text-yellow-500" />
            Stock Information
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="stock">
                Available Stock <span className="text-red-500">*</span>
              </Label>
              <Input
                id="stock"
                type="number"
                placeholder="100"
                className="h-11"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sku">
                SKU <span className="text-red-500">*</span>
              </Label>
              <Input
                id="sku"
                placeholder="e.g., WBH-2024-001"
                className="h-11"
                required
              />
            </div>
          </div>
        </div>

        {/* Product Image */}
        <div className="space-y-4">
          <h3 className="font-bold flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-blue-500" />
            Product Image
          </h3>

          <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-8 text-center hover:border-purple-500 transition-colors cursor-pointer">
            <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="font-medium mb-1">Click to upload or drag and drop</p>
            <p className="text-sm text-muted-foreground">
              PNG, JPG up to 10MB
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 text-white font-semibold hover:from-purple-700 hover:via-indigo-700 hover:to-cyan-700"
          >
            {isSubmitting ? 'Adding Product...' : 'Add Product'}
          </Button>
        </div>
      </form>
    </Card>
  );
}