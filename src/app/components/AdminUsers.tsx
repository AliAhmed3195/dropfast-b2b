'use client'

import React, { useState, useEffect, useRef } from 'react';
import { useApiCall } from '../../hooks/useApiCall';
import { motion, AnimatePresence } from 'motion/react';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Ban,
  CheckCircle2,
  Mail,
  Store,
  Package,
  ShoppingBag,
  TrendingUp,
  Building2,
  MapPin,
  Phone,
  Shield,
  Briefcase,
  X,
  Calendar,
} from 'lucide-react';
import { SimpleUserForm } from './SimpleUserForm';
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
import { Avatar, AvatarFallback } from './ui/avatar';
import { Label } from './ui/label';
import { showToast } from '../../lib/toast';
import { cn } from './ui/utils';

// Mock user data - Admin internal users
const adminUsers = [
  {
    id: 'admin-1',
    name: 'Super Admin',
    email: 'admin@fastdrop.com',
    role: 'admin',
    userType: 'admin',
    status: 'active',
    joinedDate: '2024-01-15',
    lastActive: '2024-12-24',
    createdBy: 'System',
    organization: 'FastDrop Platform',
  },
  {
    id: 'admin-2',
    name: 'Finance Manager',
    email: 'finance@fastdrop.com',
    role: 'admin',
    userType: 'admin',
    status: 'active',
    joinedDate: '2024-02-01',
    lastActive: '2024-12-23',
    createdBy: 'Super Admin',
    organization: 'FastDrop Platform',
  },
  {
    id: 'admin-3',
    name: 'Support Manager',
    email: 'support@fastdrop.com',
    role: 'admin',
    userType: 'admin',
    status: 'active',
    joinedDate: '2024-02-15',
    lastActive: '2024-12-24',
    createdBy: 'Super Admin',
    organization: 'FastDrop Platform',
  },
];

// Mock supplier users - Created by suppliers to manage their systems
const supplierUsers = [
  {
    id: 'sup-user-1',
    name: 'Tech Supply Manager',
    email: 'manager@techsupply.com',
    role: 'supplier',
    userType: 'supplier',
    status: 'active',
    joinedDate: '2024-03-10',
    lastActive: '2024-12-24',
    createdBy: 'Tech Supply Co.',
    organization: 'Tech Supply Co.',
    permissions: ['product-management', 'inventory', 'analytics'],
  },
  {
    id: 'sup-user-2',
    name: 'Tech Supply Inventory Lead',
    email: 'inventory@techsupply.com',
    role: 'supplier',
    userType: 'supplier',
    status: 'active',
    joinedDate: '2024-03-15',
    lastActive: '2024-12-23',
    createdBy: 'Tech Supply Co.',
    organization: 'Tech Supply Co.',
    permissions: ['inventory', 'orders'],
  },
  {
    id: 'sup-user-3',
    name: 'Global Electronics Manager',
    email: 'ops@globalelec.com',
    role: 'supplier',
    userType: 'supplier',
    status: 'active',
    joinedDate: '2024-04-20',
    lastActive: '2024-12-24',
    createdBy: 'Global Electronics',
    organization: 'Global Electronics',
    permissions: ['product-management', 'orders', 'analytics'],
  },
  {
    id: 'sup-user-4',
    name: 'Global Electronics Support',
    email: 'support@globalelec.com',
    role: 'supplier',
    userType: 'supplier',
    status: 'active',
    joinedDate: '2024-05-01',
    lastActive: '2024-12-22',
    createdBy: 'Global Electronics',
    organization: 'Global Electronics',
    permissions: ['orders', 'customer-support'],
  },
];

// Mock vendor users - Created by vendors to manage their stores
const vendorUsers = [
  {
    id: 'ven-user-1',
    name: 'TechGear Store Manager',
    email: 'manager@techgear.com',
    role: 'vendor',
    userType: 'vendor',
    status: 'active',
    joinedDate: '2024-05-15',
    lastActive: '2024-12-24',
    createdBy: 'Tech Haven Store',
    organization: 'Tech Haven Store',
    permissions: ['store-management', 'products', 'orders'],
  },
  {
    id: 'ven-user-2',
    name: 'TechGear Sales Manager',
    email: 'sales@techgear.com',
    role: 'vendor',
    userType: 'vendor',
    status: 'active',
    joinedDate: '2024-05-20',
    lastActive: '2024-12-23',
    createdBy: 'Tech Haven Store',
    organization: 'Tech Haven Store',
    permissions: ['orders', 'customer-support', 'analytics'],
  },
  {
    id: 'ven-user-3',
    name: 'Fashion Hub Operations',
    email: 'ops@fashionhub.com',
    role: 'vendor',
    userType: 'vendor',
    status: 'active',
    joinedDate: '2024-06-10',
    lastActive: '2024-12-24',
    createdBy: 'Fashion Hub',
    organization: 'Fashion Hub',
    permissions: ['products', 'inventory', 'orders'],
  },
  {
    id: 'ven-user-4',
    name: 'Fashion Hub Customer Service',
    email: 'cs@fashionhub.com',
    role: 'vendor',
    userType: 'vendor',
    status: 'active',
    joinedDate: '2024-06-15',
    lastActive: '2024-12-23',
    createdBy: 'Fashion Hub',
    organization: 'Fashion Hub',
    permissions: ['orders', 'customer-support'],
  },
];

export function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [userTypeFilter, setUserTypeFilter] = useState<'all' | 'admin' | 'supplier' | 'vendor'>('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [viewingUser, setViewingUser] = useState<any>(null);
  const { callApi } = useApiCall();

  const fetchUsers = async (signal?: AbortSignal) => {
    try {
      setLoading(true);
      const role = userTypeFilter === 'all' ? '' : userTypeFilter;
      const url = role ? `/api/admin/users?role=${role}` : '/api/admin/users';
      const response = await fetch(url, { signal });
      const data = await response.json();
      
      if (response.ok) {
        setUsers(data.users || []);
      } else {
        showToast.error(data.error || 'Failed to fetch users');
      }
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        console.error('Fetch users error:', error);
        showToast.error('Failed to fetch users');
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch users on mount
  useEffect(() => {
    callApi(fetchUsers);
  }, [userTypeFilter, callApi]);

  const handleFormSuccess = async () => {
    setShowForm(false);
    await fetchUsers();
    showToast.success('User created successfully!');
  };

  const handleSaveUser = async (updatedUser: any) => {
    try {
      // Map to API format - ensure role is properly formatted
      const roleValue = updatedUser.userType || updatedUser.role || 'customer';
      const apiData: any = {
        name: updatedUser.name || '',
        email: updatedUser.email || '',
        role: roleValue.toLowerCase(), // API expects lowercase
        businessName: updatedUser.organization || updatedUser.businessName || null,
      };

      // Include status if provided
      if (updatedUser.status !== undefined) {
        apiData.status = updatedUser.status; // API will convert to isActive
      } else if (updatedUser.isActive !== undefined) {
        apiData.isActive = updatedUser.isActive;
      }

      // Validate required fields
      if (!apiData.name || !apiData.email) {
        showToast.error('Name and Email are required');
        return;
      }

      const response = await fetch(`/api/admin/users/${updatedUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(apiData),
      });

      const data = await response.json();

      if (response.ok) {
        await fetchUsers();
        setEditingUser(null);
        showToast.success('User updated successfully!');
      } else {
        showToast.error(data.error || 'Failed to update user');
      }
    } catch (error) {
      console.error('Update user error:', error);
      showToast.error('Failed to update user');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchUsers();
        showToast.success('User deleted successfully!');
      } else {
        const data = await response.json();
        showToast.error(data.error || 'Failed to delete user');
      }
    } catch (error) {
      console.error('Delete user error:', error);
      showToast.error('Failed to delete user');
    }
  };

  const handleToggleStatus = async (userId: string, newStatus: string) => {
    // Update local state immediately for better UX
    setUsers(prevUsers => 
      prevUsers.map(u => 
        u.id === userId ? { ...u, status: newStatus } : u
      )
    );
    
    // Note: Status is UI-only since database doesn't have status field
    // The status will persist in component state until page refresh
    // To persist in database, we would need to add a status field to the User model
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.organization.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = userTypeFilter === 'all' || user.userType === userTypeFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const getUserTypeIcon = (userType: string) => {
    switch (userType) {
      case 'admin':
        return Shield;
      case 'supplier':
        return Package;
      case 'vendor':
        return Store;
      default:
        return Users;
    }
  };

  const getUserTypeColor = (userType: string) => {
    switch (userType) {
      case 'admin':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400';
      case 'supplier':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400';
      case 'vendor':
        return 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/20 dark:text-cyan-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const stats = {
    total: users.length,
    admin: users.filter(u => u.userType === 'admin').length,
    supplier: users.filter(u => u.userType === 'supplier').length,
    vendor: users.filter(u => u.userType === 'vendor').length,
  };

  // If form is showing, render it instead of the list
  if (showForm) {
    return (
      <SimpleUserForm
        onCancel={() => setShowForm(false)}
        onSuccess={handleFormSuccess}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-2">User Management</h2>
          <p className="text-muted-foreground">
            Manage platform users, supplier teams, and vendor staff
          </p>
        </div>
        <Button 
          className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white" 
          onClick={() => setShowForm(true)}
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Add Admin User
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Users</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
          </div>
        </Card>

        <Card 
          className={cn(
            'p-6 cursor-pointer transition-all border-2',
            userTypeFilter === 'admin' 
              ? 'border-purple-500 shadow-lg shadow-purple-500/20' 
              : 'hover:border-purple-300'
          )}
          onClick={() => setUserTypeFilter(userTypeFilter === 'admin' ? 'all' : 'admin')}
        >
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Admin Users</p>
              <p className="text-2xl font-bold">{stats.admin}</p>
            </div>
          </div>
        </Card>

        <Card 
          className={cn(
            'p-6 cursor-pointer transition-all border-2',
            userTypeFilter === 'supplier' 
              ? 'border-blue-500 shadow-lg shadow-blue-500/20' 
              : 'hover:border-blue-300'
          )}
          onClick={() => setUserTypeFilter(userTypeFilter === 'supplier' ? 'all' : 'supplier')}
        >
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Supplier Users</p>
              <p className="text-2xl font-bold">{stats.supplier}</p>
            </div>
          </div>
        </Card>

        <Card 
          className={cn(
            'p-6 cursor-pointer transition-all border-2',
            userTypeFilter === 'vendor' 
              ? 'border-cyan-500 shadow-lg shadow-cyan-500/20' 
              : 'hover:border-cyan-300'
          )}
          onClick={() => setUserTypeFilter(userTypeFilter === 'vendor' ? 'all' : 'vendor')}
        >
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-500">
              <Store className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Vendor Users</p>
              <p className="text-2xl font-bold">{stats.vendor}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Active Filter Info */}
      {userTypeFilter !== 'all' && (
        <Card className="p-4 bg-gradient-to-r from-purple-50 to-cyan-50 dark:from-purple-900/20 dark:to-cyan-900/20 border-2 border-purple-200 dark:border-purple-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Badge className={getUserTypeColor(userTypeFilter)}>
                {userTypeFilter.charAt(0).toUpperCase() + userTypeFilter.slice(1)} Users Only
              </Badge>
              <p className="text-sm text-muted-foreground">
                Showing {filteredUsers.length} {userTypeFilter} user{filteredUsers.length !== 1 ? 's' : ''}
              </p>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setUserTypeFilter('all')}
            >
              Clear Filter
            </Button>
          </div>
        </Card>
      )}

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, or organization..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={userTypeFilter} onValueChange={(value: any) => setUserTypeFilter(value)}>
            <SelectTrigger className="w-full md:w-48">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="User Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All User Types</SelectItem>
              <SelectItem value="admin">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-purple-600" />
                  Admin Users
                </div>
              </SelectItem>
              <SelectItem value="supplier">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-blue-600" />
                  Supplier Users
                </div>
              </SelectItem>
              <SelectItem value="vendor">
                <div className="flex items-center gap-2">
                  <Store className="w-4 h-4 text-cyan-600" />
                  Vendor Users
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Users Table */}
      <Card>
        {loading ? (
          <div className="text-center py-16">
            <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50 animate-pulse" />
            <p className="text-lg text-muted-foreground">Loading users...</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold">User</TableHead>
                <TableHead className="font-semibold">Type</TableHead>
                <TableHead className="font-semibold">Organization</TableHead>
                <TableHead className="font-semibold">Created By</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Joined</TableHead>
                <TableHead className="font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user, index) => {
              const UserTypeIcon = getUserTypeIcon(user.userType);

              return (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-muted/50"
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback className="bg-gradient-to-br from-purple-500 to-cyan-500 text-white">
                          {user.name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getUserTypeColor(user.userType)}>
                      <UserTypeIcon className="w-3 h-3 mr-1" />
                      {user.userType.charAt(0).toUpperCase() + user.userType.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">{user.organization}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">{user.createdBy}</span>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        user.status === 'active'
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                          : 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                      }
                    >
                      {user.status === 'active' ? (
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                      ) : (
                        <Ban className="w-3 h-3 mr-1" />
                      )}
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(user.joinedDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setViewingUser(user)}>
                          <Users className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setEditingUser(user)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit User
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </motion.tr>
              );
            })}
          </TableBody>
        </Table>
        )}

        {!loading && filteredUsers.length === 0 && (
          <div className="text-center py-16">
            <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-lg text-muted-foreground">No users found</p>
          </div>
        )}
      </Card>

      {/* Edit User Modal */}
      <AnimatePresence>
        {editingUser && (
          <EditUserModal
            user={editingUser}
            onClose={() => setEditingUser(null)}
            onSave={handleSaveUser}
            onToggleStatus={handleToggleStatus}
          />
        )}
      </AnimatePresence>

      {/* View User Details Modal */}
      <AnimatePresence>
        {viewingUser && (
          <UserDetailModal
            userId={viewingUser.id}
            onClose={() => setViewingUser(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// View User Details Modal Component
function UserDetailModal({ userId, onClose }: { userId: string; onClose: () => void }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const fetchingRef = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!userId) return;
    
    // Prevent duplicate calls
    if (fetchingRef.current) {
      return;
    }

    // Abort previous request if any
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    let isMounted = true;
    const abortController = new AbortController();
    abortControllerRef.current = abortController;
    fetchingRef.current = true;
    
    const fetchUserDetails = async () => {
      if (!isMounted) return;
      
      try {
        setLoading(true);
        const response = await fetch(`/api/admin/users/${userId}`, {
          signal: abortController.signal,
        });
        const data = await response.json();
        
        if (isMounted) {
          if (response.ok) {
            setUser(data.user);
          } else {
            showToast.error(data.error || 'Failed to fetch user details');
            onClose();
          }
        }
      } catch (error: any) {
        if (error.name !== 'AbortError' && isMounted) {
          console.error('Fetch user details error:', error);
          showToast.error('Failed to fetch user details');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
          fetchingRef.current = false;
        }
      }
    };
    
    fetchUserDetails();
    
    return () => {
      isMounted = false;
      abortController.abort();
      abortControllerRef.current = null;
      fetchingRef.current = false;
    };
  }, [userId]);

  if (loading) {
    return (
      <>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          onClick={onClose}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl z-50 max-h-[90vh] overflow-y-auto"
        >
          <Card className="p-6">
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground">Loading user details...</p>
              </div>
            </div>
          </Card>
        </motion.div>
      </>
    );
  }

  if (!user) return null;

  const getUserTypeIcon = (userType: string) => {
    switch (userType) {
      case 'admin':
        return Shield;
      case 'supplier':
        return Package;
      case 'vendor':
        return Store;
      default:
        return Users;
    }
  };

  const UserTypeIcon = getUserTypeIcon(user.userType || user.role);

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl z-50 max-h-[90vh] overflow-y-auto"
      >
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">User Details</h2>
              <p className="text-sm text-muted-foreground">Complete user information</p>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="space-y-6">
            {/* User Header */}
            <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-50 to-cyan-50 dark:from-purple-900/20 dark:to-cyan-900/20 rounded-lg">
              <Avatar className="w-16 h-16">
                <AvatarFallback className="bg-gradient-to-br from-purple-500 to-cyan-500 text-white text-xl">
                  {user.name?.slice(0, 2).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="text-xl font-bold">{user.name}</h3>
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {user.email}
                </p>
                <Badge className={cn(
                  'mt-2',
                  user.userType === 'admin' || user.role === 'admin'
                    ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400'
                    : user.userType === 'supplier' || user.role === 'supplier'
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                    : user.userType === 'vendor' || user.role === 'vendor'
                    ? 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/20 dark:text-cyan-400'
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400'
                )}>
                  <UserTypeIcon className="w-3 h-3 mr-1" />
                  {(user.userType || user.role || 'customer').charAt(0).toUpperCase() + (user.userType || user.role || 'customer').slice(1)}
                </Badge>
              </div>
            </div>

            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-muted-foreground">Organization</Label>
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <span>{user.businessName || user.organization || 'N/A'}</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-muted-foreground">Joined Date</Label>
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <span>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</span>
                </div>
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
                Close
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    </>
  );
}

// Edit User Modal Component
function EditUserModal({ user, onClose, onSave, onToggleStatus }: any) {
  const [formData, setFormData] = useState(user);
  const [loading, setLoading] = useState(false);
  const fetchingRef = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Fetch full user data when editing to ensure we have all fields
  useEffect(() => {
    if (!user?.id) return;
    
    // Prevent duplicate calls
    if (fetchingRef.current) {
      return;
    }

    // Abort previous request if any
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    let isMounted = true;
    const abortController = new AbortController();
    abortControllerRef.current = abortController;
    fetchingRef.current = true;
    
    const loadUserDetails = async () => {
      if (!isMounted) return;
      
      try {
        setLoading(true);
        const response = await fetch(`/api/admin/users/${user.id}`, {
          signal: abortController.signal,
        });
        const data = await response.json();
        
        if (isMounted && response.ok) {
          setFormData({
            ...data.user,
            organization: data.user.businessName || data.user.organization || '',
            userType: data.user.userType || data.user.role || 'customer',
            status: data.user.status || (data.user.isActive ? 'active' : 'inactive') || 'active',
          });
        }
      } catch (error: any) {
        if (error.name !== 'AbortError' && isMounted) {
          console.error('Fetch user details error:', error);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
          fetchingRef.current = false;
        }
      }
    };
    
    loadUserDetails();
    
    return () => {
      isMounted = false;
      abortController.abort();
      abortControllerRef.current = null;
      fetchingRef.current = false;
    };
  }, [user?.id]);

  const fetchUserDetails = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/users/${user.id}`);
      const data = await response.json();
      
      if (response.ok) {
        setFormData({
          ...data.user,
          organization: data.user.businessName || data.user.organization || '',
          userType: data.user.userType || data.user.role || 'customer',
          status: data.user.status || (data.user.isActive ? 'active' : 'inactive') || 'active',
        });
      }
    } catch (error) {
      console.error('Fetch user details error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name || !formData.email) {
      showToast.error('Name and Email are required');
      return;
    }

    // Map formData to API format - only send fields that exist in original form
    const updateData = {
      id: user.id,
      name: formData.name || '',
      email: formData.email || '',
      role: (formData.userType || formData.role || 'customer').toLowerCase(),
      businessName: formData.organization || formData.businessName || null,
      status: formData.status || 'active', // Include status in save
    };
    
    onSave(updateData);
  };

  const handleStatusToggle = async () => {
    const newStatus = formData.status === 'active' ? 'inactive' : 'active';
    const updatedFormData = { ...formData, status: newStatus };
    setFormData(updatedFormData);
    
    // Immediately save the status change to database
    const updateData = {
      id: user.id,
      name: formData.name || '',
      email: formData.email || '',
      role: (formData.userType || formData.role || 'customer').toLowerCase(),
      businessName: formData.organization || formData.businessName || null,
      status: newStatus,
    };
    
    try {
      await onSave(updateData);
      showToast.success(`User ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully!`);
    } catch (error) {
      // Revert status on error
      setFormData({ ...formData });
      showToast.error('Failed to update user status');
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl z-50 max-h-[90vh] overflow-y-auto"
      >
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">Edit User</h2>
              <p className="text-sm text-muted-foreground">Update user information</p>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="user-name" className="block text-sm font-semibold mb-2">
                    Name
                  </label>
                  <Input
                    id="user-name"
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="user-email" className="block text-sm font-semibold mb-2">
                    Email
                  </label>
                  <Input
                    id="user-email"
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="user-organization" className="block text-sm font-semibold mb-2">
                    Organization
                  </label>
                  <Input
                    id="user-organization"
                    type="text"
                    value={formData.organization || formData.businessName || ''}
                    onChange={(e) => setFormData({ ...formData, organization: e.target.value, businessName: e.target.value })}
                  />
                </div>
                <div>
                  <label htmlFor="user-type" className="block text-sm font-semibold mb-2">
                    User Type
                  </label>
                  <Select
                    value={formData.userType || formData.role || 'customer'}
                    onValueChange={(value) => setFormData({ ...formData, userType: value, role: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="supplier">Supplier</SelectItem>
                      <SelectItem value="vendor">Vendor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <div>
                  <p className="font-semibold">Account Status</p>
                  <p className="text-sm text-muted-foreground">
                    {formData.status === 'active' ? 'User is active' : 'User is suspended'}
                  </p>
                </div>
                <Button
                  type="button"
                  variant={formData.status === 'active' ? 'outline' : 'default'}
                  size="sm"
                  onClick={handleStatusToggle}
                >
                  {formData.status === 'active' ? 'Deactivate' : 'Activate'}
                </Button>
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
                className="flex-1 bg-gradient-to-r from-purple-600 to-cyan-600 text-white"
              >
                Save Changes
              </Button>
            </div>
          </form>
        </Card>
      </motion.div>
    </>
  );
}