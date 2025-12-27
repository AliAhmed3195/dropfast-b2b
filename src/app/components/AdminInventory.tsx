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
} from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
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

// Mock product data
const mockProducts = [
  {
    id: '1',
    name: 'Wireless Bluetooth Headphones',
    sku: 'WBH-001',
    category: 'Electronics',
    price: 79.99,
    stock: 145,
    status: 'active',
    addedBy: 'Tech Supply Co.',
    addedByType: 'supplier',
    store: 'N/A',
    tags: ['Featured', 'Best Seller'],
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200',
  },
  {
    id: '2',
    name: 'Smart Watch Series 5',
    sku: 'SW-005',
    category: 'Electronics',
    price: 299.99,
    stock: 89,
    status: 'active',
    addedBy: 'Global Electronics',
    addedByType: 'supplier',
    store: 'N/A',
    tags: ['New Arrival'],
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200',
  },
  {
    id: '3',
    name: 'Ergonomic Office Chair',
    sku: 'EOC-023',
    category: 'Furniture',
    price: 249.99,
    stock: 34,
    status: 'active',
    addedBy: 'Tech Haven Store',
    addedByType: 'vendor',
    store: 'Tech Haven',
    tags: ['Featured'],
    image: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=200',
  },
  {
    id: '4',
    name: 'Gaming Keyboard RGB',
    sku: 'GKR-078',
    category: 'Electronics',
    price: 129.99,
    stock: 5,
    status: 'low_stock',
    addedBy: 'Tech Supply Co.',
    addedByType: 'supplier',
    store: 'N/A',
    tags: ['Best Seller'],
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=200',
  },
  {
    id: '5',
    name: 'Portable Power Bank',
    sku: 'PPB-156',
    category: 'Accessories',
    price: 39.99,
    stock: 0,
    status: 'out_of_stock',
    addedBy: 'Global Electronics',
    addedByType: 'supplier',
    store: 'N/A',
    tags: [],
    image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=200',
  },
  {
    id: '6',
    name: 'Modern Standing Desk',
    sku: 'MSD-089',
    category: 'Furniture',
    price: 399.99,
    stock: 23,
    status: 'active',
    addedBy: 'Fashion Hub',
    addedByType: 'vendor',
    store: 'Fashion Hub',
    tags: ['Featured', 'New Arrival'],
    image: 'https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?w=200',
  },
  {
    id: '7',
    name: 'Wireless Mouse Pro',
    sku: 'WMP-234',
    category: 'Electronics',
    price: 59.99,
    stock: 167,
    status: 'active',
    addedBy: 'Tech Supply Co.',
    addedByType: 'supplier',
    store: 'N/A',
    tags: ['Best Seller'],
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=200',
  },
  {
    id: '8',
    name: 'USB-C Hub Adapter',
    sku: 'UCH-445',
    category: 'Accessories',
    price: 29.99,
    stock: 92,
    status: 'active',
    addedBy: 'Sports World',
    addedByType: 'vendor',
    store: 'Sports World',
    tags: [],
    image: 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=200',
  },
  {
    id: '9',
    name: 'Mechanical Keyboard',
    sku: 'MKB-567',
    category: 'Electronics',
    price: 149.99,
    stock: 8,
    status: 'low_stock',
    addedBy: 'Global Electronics',
    addedByType: 'supplier',
    store: 'N/A',
    tags: ['Featured'],
    image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=200',
  },
  {
    id: '10',
    name: 'Laptop Backpack',
    sku: 'LBP-890',
    category: 'Accessories',
    price: 79.99,
    stock: 45,
    status: 'active',
    addedBy: 'Tech Haven Store',
    addedByType: 'vendor',
    store: 'Tech Haven',
    tags: ['New Arrival'],
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200',
  },
  {
    id: '11',
    name: '4K Webcam',
    sku: 'WC4K-123',
    category: 'Electronics',
    price: 189.99,
    stock: 34,
    status: 'active',
    addedBy: 'Tech Supply Co.',
    addedByType: 'supplier',
    store: 'N/A',
    tags: ['Featured', 'Best Seller'],
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=200',
  },
  {
    id: '12',
    name: 'Desk Lamp LED',
    sku: 'DLL-456',
    category: 'Furniture',
    price: 49.99,
    stock: 78,
    status: 'active',
    addedBy: 'Fashion Hub',
    addedByType: 'vendor',
    store: 'Fashion Hub',
    tags: [],
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=200',
  },
  {
    id: '13',
    name: 'Noise Cancelling Earbuds',
    sku: 'NCE-789',
    category: 'Electronics',
    price: 159.99,
    stock: 0,
    status: 'out_of_stock',
    addedBy: 'Global Electronics',
    addedByType: 'supplier',
    store: 'N/A',
    tags: ['Best Seller'],
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=200',
  },
  {
    id: '14',
    name: 'Phone Stand Holder',
    sku: 'PSH-321',
    category: 'Accessories',
    price: 19.99,
    stock: 156,
    status: 'active',
    addedBy: 'Tech Haven Store',
    addedByType: 'vendor',
    store: 'Tech Haven',
    tags: ['Featured'],
    image: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=200',
  },
  {
    id: '15',
    name: 'Monitor Stand Riser',
    sku: 'MSR-654',
    category: 'Furniture',
    price: 89.99,
    stock: 3,
    status: 'low_stock',
    addedBy: 'Sports World',
    addedByType: 'vendor',
    store: 'Sports World',
    tags: ['New Arrival'],
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=200',
  },
];

export function AdminInventory() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all'); // supplier/vendor filter
  const [tagFilter, setTagFilter] = useState('all'); // tag filter
  const [storeFilter, setStoreFilter] = useState('all'); // store filter
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === 'all' || product.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
    const matchesType = typeFilter === 'all' || product.addedByType === typeFilter;
    const matchesTag = tagFilter === 'all' || product.tags.includes(tagFilter);
    const matchesStore = storeFilter === 'all' || product.store === storeFilter;
    return matchesSearch && matchesCategory && matchesStatus && matchesType && matchesTag && matchesStore;
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-2">Inventory Management</h2>
          <p className="text-muted-foreground">
            View all products added by suppliers and vendors
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Products</p>
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
              <p className="text-sm text-muted-foreground">Active</p>
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
              <p className="text-sm text-muted-foreground">Low Stock</p>
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
              <p className="text-sm text-muted-foreground">Out of Stock</p>
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
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full md:w-40">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="supplier">Supplier</SelectItem>
              <SelectItem value="vendor">Vendor</SelectItem>
            </SelectContent>
          </Select>
          <Select value={tagFilter} onValueChange={setTagFilter}>
            <SelectTrigger className="w-full md:w-40">
              <SelectValue placeholder="Tag" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tags</SelectItem>
              <SelectItem value="Featured">Featured</SelectItem>
              <SelectItem value="Best Seller">Best Seller</SelectItem>
              <SelectItem value="New Arrival">New Arrival</SelectItem>
            </SelectContent>
          </Select>
          <Select value={storeFilter} onValueChange={setStoreFilter}>
            <SelectTrigger className="w-full md:w-40">
              <SelectValue placeholder="Store" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stores</SelectItem>
              <SelectItem value="Tech Haven">Tech Haven</SelectItem>
              <SelectItem value="Fashion Hub">Fashion Hub</SelectItem>
              <SelectItem value="Sports World">Sports World</SelectItem>
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
          ))}
        </div>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Added By</TableHead>
                <TableHead>Actions</TableHead>
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
                    <Badge variant="outline">{product.category}</Badge>
                  </TableCell>
                  <TableCell className="font-semibold text-purple-600">
                    ${product.price}
                  </TableCell>
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
        {selectedProduct && (
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
              className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-3xl z-50"
            >
              <Card className="h-full overflow-y-auto">
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
      </AnimatePresence>
    </div>
  );
}