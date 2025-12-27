import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Store,
  Plus,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Power,
  PowerOff,
  ExternalLink,
  Settings,
  Package,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Copy,
} from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { toast } from 'sonner';
import { cn } from './ui/utils';
import { StoreCreationWizard } from './StoreCreationWizard';
import { StoreBuilder } from './StoreBuilder';
import { PublicStore } from './public-store/PublicStore';
import { storeTemplates } from '../data/storeTemplates';

// Mock store data
const mockStores = [
  {
    id: '1',
    name: 'TechHub Store',
    url: 'techhub.fastdrop.com',
    storeType: 'multi-product',
    templateId: 'modern-ecommerce',
    status: 'active',
    industry: 'Electronics',
    stats: {
      products: 145,
      orders: 23,
      revenue: 4567,
      views: 1234,
    },
    createdAt: '2024-12-01',
    logo: '',
  },
  {
    id: '2',
    name: 'GadgetZone',
    url: 'gadgetzone.fastdrop.com',
    storeType: 'multi-product',
    templateId: 'classic-retail',
    status: 'active',
    industry: 'Electronics',
    stats: {
      products: 89,
      orders: 12,
      revenue: 2345,
      views: 567,
    },
    createdAt: '2024-12-15',
    logo: '',
  },
  {
    id: '3',
    name: 'ProWatch Elite',
    url: 'prowatch.fastdrop.com',
    storeType: 'single-product',
    templateId: 'tech-launch',
    status: 'draft',
    industry: 'Electronics',
    stats: {
      products: 1,
      orders: 0,
      revenue: 0,
      views: 0,
    },
    createdAt: '2024-12-25',
    logo: '',
  },
];

export function VendorStores() {
  const [stores, setStores] = useState(mockStores);
  const [searchQuery, setSearchQuery] = useState('');
  const [showWizard, setShowWizard] = useState(false);
  const [builderStore, setBuilderStore] = useState<any>(null);
  const [previewStore, setPreviewStore] = useState<any>(null);

  const handleCreateStore = (storeData: any) => {
    console.log('New store created:', storeData);
    setShowWizard(false);
    
    // Add new store to list
    const newStore = {
      id: String(stores.length + 1),
      name: storeData.name,
      url: storeData.url,
      storeType: storeData.storeType,
      templateId: storeData.template?.id || 'custom',
      status: 'draft',
      industry: storeData.industry,
      stats: {
        products: 0,
        orders: 0,
        revenue: 0,
        views: 0,
      },
      createdAt: new Date().toISOString().split('T')[0],
      logo: '',
    };
    
    setStores([...stores, newStore]);
    
    // Open builder directly
    setBuilderStore({ ...newStore, template: storeData.template });
  };

  const handleOpenBuilder = (store: any) => {
    // Load template from template ID
    const template = storeTemplates.find(t => t.id === store.templateId);
    const storeWithTemplate = {
      ...store,
      template: template || storeTemplates[0], // Fallback to first template
    };
    setBuilderStore(storeWithTemplate);
  };
  
  const handlePreviewStore = (store: any) => {
    // Load template from template ID
    const template = storeTemplates.find(t => t.id === store.templateId);
    
    // Get mock product IDs - in real app would be from database
    const mockProductIds = ['1', '2', '3', '4', '5'];
    
    const storeWithTemplate = {
      ...store,
      template: template || storeTemplates[0],
      theme: store.theme || {
        primaryColor: '#4F46E5',
        secondaryColor: '#06B6D4',
        fontFamily: 'Inter',
      },
      products: mockProductIds, // Pass product IDs that exist in AppContext
    };
    setPreviewStore(storeWithTemplate);
  };

  const handleToggleStatus = (storeId: string) => {
    setStores(stores.map(store => {
      if (store.id === storeId) {
        const newStatus = store.status === 'active' ? 'inactive' : 'active';
        toast.success(
          newStatus === 'active' ? 'Store activated!' : 'Store deactivated',
          {
            description: newStatus === 'active' 
              ? 'Your store is now live' 
              : 'Customers cannot access your store',
          }
        );
        return { ...store, status: newStatus };
      }
      return store;
    }));
  };

  const handleDeleteStore = (storeId: string) => {
    const store = stores.find(s => s.id === storeId);
    if (window.confirm(`Are you sure you want to delete "${store?.name}"? This action cannot be undone.`)) {
      setStores(stores.filter(s => s.id !== storeId));
      toast.success('Store deleted successfully');
    }
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(`https://${url}`);
    toast.success('Store URL copied to clipboard!');
  };

  const filteredStores = stores.filter(store =>
    store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    store.url.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalStats = {
    totalStores: stores.length,
    activeStores: stores.filter(s => s.status === 'active').length,
    draftStores: stores.filter(s => s.status === 'draft').length,
    totalRevenue: stores.reduce((sum, s) => sum + s.stats.revenue, 0),
  };

  // If builder is open, show builder instead
  if (builderStore) {
    return (
      <StoreBuilder
        storeData={builderStore}
        onBack={() => setBuilderStore(null)}
      />
    );
  }

  // If preview is open, show public store
  if (previewStore) {
    return (
      <PublicStore
        storeData={previewStore}
        onClose={() => setPreviewStore(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-2">My Stores</h2>
          <p className="text-muted-foreground">
            Manage all your storefronts in one place
          </p>
        </div>
        <Button
          onClick={() => setShowWizard(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-sm"
        >
          <Plus className="w-5 h-5 mr-2" />
          Create New Store
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 rounded-full -mr-16 -mt-16" />
          <div className="relative flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500">
              <Store className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">Total Stores</p>
              <p className="text-2xl font-bold">{totalStats.totalStores}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-full -mr-16 -mt-16" />
          <div className="relative flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500">
              <Power className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">Active</p>
              <p className="text-2xl font-bold">{totalStats.activeStores}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-full -mr-16 -mt-16" />
          <div className="relative flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500 to-red-500">
              <Edit className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">Draft</p>
              <p className="text-2xl font-bold">{totalStats.draftStores}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-full -mr-16 -mt-16" />
          <div className="relative flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">Total Revenue</p>
              <p className="text-2xl font-bold">${totalStats.totalRevenue.toLocaleString()}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Search */}
      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search stores by name or URL..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      {/* Stores Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStores.map((store, index) => (
          <motion.div
            key={store.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-2 hover:border-purple-300 dark:hover:border-purple-700 h-full flex flex-col">
              {/* Store Header */}
              <div className={cn(
                "p-6 bg-gradient-to-br",
                store.status === 'active' 
                  ? "from-green-500 to-emerald-500" 
                  : store.status === 'draft'
                  ? "from-orange-500 to-amber-500"
                  : "from-slate-500 to-slate-600"
              )}>
                <div className="flex items-start justify-between mb-4">
                  <div className="w-16 h-16 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Store className="w-8 h-8 text-white" />
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleOpenBuilder(store)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Store
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handlePreviewStore(store)}>
                        <Eye className="w-4 h-4 mr-2" />
                        Preview Store
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => window.open(`https://${store.url}`, '_blank')}>
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View Live
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleCopyUrl(store.url)}>
                        <Copy className="w-4 h-4 mr-2" />
                        Copy URL
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => toast.info('Opening store settings...')}>
                        <Settings className="w-4 h-4 mr-2" />
                        Settings
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleToggleStatus(store.id)}>
                        {store.status === 'active' ? (
                          <>
                            <PowerOff className="w-4 h-4 mr-2" />
                            Deactivate
                          </>
                        ) : (
                          <>
                            <Power className="w-4 h-4 mr-2" />
                            Activate
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => handleDeleteStore(store.id)}
                        className="text-red-600 focus:text-red-600"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Store
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">{store.name}</h3>
                  <p className="text-sm text-white/80 font-mono">{store.url}</p>
                </div>
              </div>

              {/* Store Info */}
              <div className="p-6 flex-1 flex flex-col">
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Status:</span>
                    <Badge className={cn(
                      store.status === 'active' && "bg-green-500 text-white",
                      store.status === 'draft' && "bg-orange-500 text-white",
                      store.status === 'inactive' && "bg-slate-500 text-white"
                    )}>
                      {store.status.charAt(0).toUpperCase() + store.status.slice(1)}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Template:</span>
                    <span className="font-semibold">{store.templateId}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Type:</span>
                    <Badge variant="outline">
                      {store.storeType === 'single-product' ? 'Single Product' : 'Multi-Product'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Created:</span>
                    <span className="font-semibold">{new Date(store.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="mt-auto pt-4 border-t">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <Package className="w-4 h-4 text-purple-600" />
                        <span className="text-xs text-muted-foreground">Products</span>
                      </div>
                      <p className="text-xl font-bold">{store.stats.products}</p>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <ShoppingCart className="w-4 h-4 text-green-600" />
                        <span className="text-xs text-muted-foreground">Orders</span>
                      </div>
                      <p className="text-xl font-bold">{store.stats.orders}</p>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <DollarSign className="w-4 h-4 text-blue-600" />
                        <span className="text-xs text-muted-foreground">Revenue</span>
                      </div>
                      <p className="text-lg font-bold">${store.stats.revenue}</p>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <Eye className="w-4 h-4 text-cyan-600" />
                        <span className="text-xs text-muted-foreground">Views</span>
                      </div>
                      <p className="text-lg font-bold">{store.stats.views}</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-4 flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleOpenBuilder(store)}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
                    onClick={() => toast.info('Viewing store dashboard...')}
                  >
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Dashboard
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}

        {/* Create New Store Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: filteredStores.length * 0.05 }}
        >
          <Card 
            className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-purple-400 dark:hover:border-purple-600 cursor-pointer transition-all h-full flex items-center justify-center min-h-[400px]"
            onClick={() => setShowWizard(true)}
          >
            <div className="text-center p-8">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-100 to-cyan-100 dark:from-purple-900/30 dark:to-cyan-900/30 flex items-center justify-center mx-auto mb-4">
                <Plus className="w-10 h-10 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Create New Store</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Launch your next storefront in minutes
              </p>
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm">
                Get Started
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>

      {filteredStores.length === 0 && searchQuery && (
        <div className="text-center py-16">
          <Store className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
          <p className="text-lg text-muted-foreground">No stores found</p>
          <p className="text-sm text-muted-foreground mt-2">Try a different search term</p>
        </div>
      )}

      {/* Store Creation Wizard */}
      <AnimatePresence>
        {showWizard && (
          <StoreCreationWizard
            onClose={() => setShowWizard(false)}
            onComplete={handleCreateStore}
          />
        )}
      </AnimatePresence>
    </div>
  );
}