'use client'

import React, { useState, useEffect, useRef } from 'react';
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
  Loader2,
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
import { showToast } from '../../lib/toast';
import { cn } from './ui/utils';
import { StoreCreationWizard } from './StoreCreationWizard';
import { StoreBuilder } from './StoreBuilder';
import { PublicStore } from './public-store/PublicStore';
import { storeTemplates } from '../data/storeTemplates';
import { useAuth } from '../contexts/AuthContext';

export function VendorStores() {
  const { user } = useAuth();
  const [stores, setStores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showWizard, setShowWizard] = useState(false);
  const [builderStore, setBuilderStore] = useState<any>(null);
  const [previewStore, setPreviewStore] = useState<any>(null);
  const fetchStoresAbortRef = useRef<AbortController | null>(null);

  // Fetch stores from API
  const fetchStores = useRef(async () => {
    if (!user?.id) return;

    // Cancel previous request
    if (fetchStoresAbortRef.current) {
      fetchStoresAbortRef.current.abort();
    }

    const abortController = new AbortController();
    fetchStoresAbortRef.current = abortController;

    try {
      setLoading(true);
      const response = await fetch(`/api/vendor/stores?vendorId=${user.id}`, {
        signal: abortController.signal,
      });

      if (!response.ok) {
        throw new Error('Failed to fetch stores');
      }

      const data = await response.json();
      setStores(data.stores || []);
    } catch (error: any) {
      if (error.name === 'AbortError') return;
      console.error('Fetch stores error:', error);
      showToast.error('Failed to load stores');
    } finally {
      setLoading(false);
    }
  });

  useEffect(() => {
    fetchStores.current();
    return () => {
      if (fetchStoresAbortRef.current) {
        fetchStoresAbortRef.current.abort();
      }
    };
  }, [user?.id]);

  const handleCreateStore = async (storeData: any) => {
    if (!user?.id) {
      showToast.error('User not authenticated');
      return;
    }

    try {
      const response = await fetch('/api/vendor/stores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vendorId: user.id,
          name: storeData.name,
          storeType: storeData.storeType,
          industry: storeData.industry,
          templateId: storeData.template?.id || storeData.templateId,
          description: storeData.description || '',
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create store');
      }

      const data = await response.json();
      showToast.success('Store created successfully!');
      setShowWizard(false);
      
      // Refresh stores list
      await fetchStores.current();
      
      // Open builder with new store
      const template = storeTemplates.find(t => t.id === data.store.templateId);
      setBuilderStore({ 
        ...data.store, 
        template: template || storeTemplates[0],
        // Ensure sections are initialized from template
        sections: data.store.sections || template?.sections || [],
      });
    } catch (error: any) {
      console.error('Create store error:', error);
      showToast.error(error.message || 'Failed to create store');
    }
  };

  const handleOpenBuilder = async (store: any) => {
    try {
      const response = await fetch(`/api/vendor/stores/${store.id}`);
      if (!response.ok) {
        throw new Error('Failed to load store');
      }
      const data = await response.json();
      
      // Ensure template object is properly set
      const template = data.store.templateDefinition || storeTemplates.find(t => t.id === data.store.templateId);
      
      setBuilderStore({
        ...data.store,
        storeType: data.store.storeType?.toLowerCase() || data.store.storeType, // Ensure lowercase format
        template: template || storeTemplates[0],
        // Ensure sections are properly initialized
        sections: data.store.sections && data.store.sections.length > 0 
          ? data.store.sections 
          : (template?.sections || []),
        // Ensure theme is properly set
        theme: data.store.theme || {
          primaryColor: data.store.primaryColor || '#4F46E5',
          secondaryColor: data.store.secondaryColor || '#06B6D4',
          fontFamily: data.store.fontFamily || 'Inter',
        },
        // Also pass colors directly for backward compatibility
        primaryColor: data.store.primaryColor,
        secondaryColor: data.store.secondaryColor,
        fontFamily: data.store.fontFamily,
      });
    } catch (error: any) {
      console.error('Load store error:', error);
      showToast.error('Failed to load store');
      // Fallback to local data
      const template = storeTemplates.find(t => t.id === store.templateId);
      setBuilderStore({ 
        ...store,
        storeType: store.storeType?.toLowerCase() || store.storeType, // Ensure lowercase format
        template: template || storeTemplates[0],
        sections: store.sections || template?.sections || [],
      });
    }
  };
  
  const handlePreviewStore = (store: any) => {
    // Load template from template ID
    const template = storeTemplates.find(t => t.id === store.templateId);
    
    const storeWithTemplate = {
      ...store,
      template: template || storeTemplates[0],
      theme: store.theme || {
        primaryColor: '#4F46E5',
        secondaryColor: '#06B6D4',
        fontFamily: 'Inter',
      },
      // Products will be fetched by PublicStore from API using store slug
    };
    setPreviewStore(storeWithTemplate);
  };

  const handleToggleStatus = async (storeId: string) => {
    if (!user?.id) {
      showToast.error('User not authenticated');
      return;
    }

    const store = stores.find(s => s.id === storeId);
    if (!store) return;

    const newStatus = store.status === 'active' ? 'inactive' : 'active';

    try {
      const response = await fetch(`/api/vendor/stores/${storeId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vendorId: user.id,
          status: newStatus,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update store status');
      }

      const data = await response.json();
      showToast.success(data.message || (newStatus === 'active' ? 'Store activated!' : 'Store deactivated'));
      
      // Refresh stores list
      await fetchStores.current();
    } catch (error: any) {
      console.error('Toggle status error:', error);
      showToast.error(error.message || 'Failed to update store status');
    }
  };

  const handleDeleteStore = async (storeId: string) => {
    const store = stores.find(s => s.id === storeId);
    if (!store) return;

    if (!window.confirm(`Are you sure you want to delete "${store.name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/vendor/stores/${storeId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete store');
      }

      showToast.success('Store deleted successfully');
      
      // Refresh stores list
      await fetchStores.current();
    } catch (error: any) {
      console.error('Delete store error:', error);
      showToast.error(error.message || 'Failed to delete store');
    }
  };

  const handleCopyUrl = (url: string) => {
    const fullUrl = url.startsWith('http') ? url : `${window.location.origin}${url}`;
    navigator.clipboard.writeText(fullUrl);
    showToast.success('Store URL copied to clipboard!');
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

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        </div>
      )}

      {/* Empty State */}
      {!loading && stores.length === 0 && !searchQuery && (
        <div className="text-center py-16">
          <Store className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
          <p className="text-lg text-muted-foreground mb-2">No stores yet</p>
          <p className="text-sm text-muted-foreground mb-4">Create your first store to get started</p>
          <Button
            onClick={() => setShowWizard(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Your First Store
          </Button>
        </div>
      )}

      {/* Stores Grid */}
      {!loading && (
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
                      <DropdownMenuItem onClick={() => window.open(store.url.startsWith('http') ? store.url : `${window.location.origin}${store.url}`, '_blank')}>
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View Live
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleCopyUrl(store.url)}>
                        <Copy className="w-4 h-4 mr-2" />
                        Copy URL
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => showToast.info('Opening store settings...')}>
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
                    onClick={() => showToast.info('Viewing store dashboard...')}
                  >
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Dashboard
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
        </div>
      )}

      {!loading && filteredStores.length === 0 && searchQuery && (
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