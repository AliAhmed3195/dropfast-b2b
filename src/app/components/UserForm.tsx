'use client'

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { User, Mail, Lock, Building2, FileText, Globe, DollarSign, MapPin, Phone, Calendar, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { cn } from './ui/utils';
import { countries as countriesData } from '../../data/countries';
import { currencies as currenciesData, formatCurrency } from '../../data/currencies';
import { showToast } from '../../lib/toast';

interface UserFormProps {
  preSelectedRole?: 'supplier' | 'vendor' | 'customer';
  editUser?: any; // User data for edit mode
  onCancel: () => void;
  onSuccess: () => void;
}

export function UserForm({ preSelectedRole, editUser, onCancel, onSuccess }: UserFormProps) {
  const isEditMode = !!editUser;
  const fetchingDetailsRef = useRef(false);
  const detailsAbortControllerRef = useRef<AbortController | null>(null);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: preSelectedRole || 'customer',
    includeBusinessDetails: false,
    businessName: '',
    businessType: 'individual',
    registrationNumber: '',
    vatNumber: '',
    country: 'United States',
    currency: 'USD',
    streetAddress: '',
    city: '',
    stateProvince: '',
    addressCountry: 'United States',
    phoneNumber: '',
    dateOfBirth: '',
    // Supplier specific
    productCategories: '',
    shippingLocations: '',
    minimumOrderValue: '',
    // Vendor specific
    storeName: '',
    storeType: 'single',
    commissionRate: '15',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(isEditMode);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load user data when in edit mode
  useEffect(() => {
    if (!isEditMode || !editUser?.id) return;

    // Prevent duplicate calls
    if (fetchingDetailsRef.current) {
      return;
    }

    // Abort previous request if any
    if (detailsAbortControllerRef.current) {
      detailsAbortControllerRef.current.abort();
    }

    let isMounted = true;
    const abortController = new AbortController();
    detailsAbortControllerRef.current = abortController;
    fetchingDetailsRef.current = true;

    const loadUserDetails = async () => {
      if (!isMounted) return;

      try {
        setLoading(true);
        const response = await fetch(`/api/admin/users/${editUser.id}`, {
          signal: abortController.signal,
        });
        const data = await response.json();

        if (isMounted && response.ok) {
          const user = data.user;
          setFormData({
            fullName: user.name || editUser.fullName || '',
            email: user.email || editUser.email || '',
            password: '', // Don't pre-fill password
            role: (user.role || editUser.role || preSelectedRole || 'customer').toLowerCase(),
            includeBusinessDetails: !!(user.businessName || user.businessType),
            businessName: user.businessName || editUser.businessName || '',
            businessType: user.businessType || 'individual',
            registrationNumber: user.registrationNumber || '',
            vatNumber: user.vatNumber || '',
            country: user.country || editUser.country || 'United States',
            currency: user.currency || 'USD',
            streetAddress: user.streetAddress || '',
            city: user.city || '',
            stateProvince: user.stateProvince || '',
            addressCountry: user.addressCountry || user.country || 'United States',
            phoneNumber: user.phone || editUser.phoneNumber || '',
            dateOfBirth: user.dateOfBirth || '',
            // Supplier specific
            productCategories: user.productCategories || '',
            shippingLocations: user.shippingLocations || '',
            minimumOrderValue: user.minimumOrderValue?.toString() || '',
            // Vendor specific
            storeName: '',
            storeType: 'single',
            commissionRate: user.commissionRate?.toString() || '15',
          });
        }
      } catch (error: any) {
        if (error.name !== 'AbortError' && isMounted) {
          console.error('Fetch user details error:', error);
          showToast.error('Failed to load user data');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
          fetchingDetailsRef.current = false;
        }
      }
    };

    loadUserDetails();

    return () => {
      isMounted = false;
      abortController.abort();
      detailsAbortControllerRef.current = null;
      fetchingDetailsRef.current = false;
    };
  }, [isEditMode, editUser?.id, preSelectedRole]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format';
    // Password is only required for new users, not for editing
    if (!isEditMode && (!formData.password || formData.password.length < 6)) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    // If editing and password is provided, validate it
    if (isEditMode && formData.password && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.includeBusinessDetails) {
      if (!formData.businessName.trim()) newErrors.businessName = 'Business name is required';
      if (!formData.country) newErrors.country = 'Country is required';
      if (!formData.currency) newErrors.currency = 'Currency is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      if (isEditMode) {
        // Update existing user
        const payload: any = {
          name: formData.fullName,
          email: formData.email,
          phone: formData.phoneNumber || null,
          businessName: formData.includeBusinessDetails ? formData.businessName : null,
          businessType: formData.includeBusinessDetails ? formData.businessType : null,
          streetAddress: formData.streetAddress || null,
          city: formData.city || null,
          stateProvince: formData.stateProvince || null,
          zipCode: '',
          addressCountry: formData.addressCountry || null,
          country: formData.country || null,
          currency: formData.currency || null,
        };

        // Add role-specific fields
        if (formData.role === 'supplier') {
          payload.productCategories = formData.productCategories || null;
          payload.shippingLocations = formData.shippingLocations || null;
          payload.minimumOrderValue = formData.minimumOrderValue || null;
        } else if (formData.role === 'vendor') {
          payload.commissionRate = formData.commissionRate || '15.0';
        }

        // Only include password if it's provided
        if (formData.password) {
          payload.password = formData.password;
        }

        const response = await fetch(`/api/admin/users/${editUser.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (response.ok) {
          const roleName = formData.role === 'vendor' ? 'Vendor' : formData.role === 'supplier' ? 'Supplier' : 'User';
          showToast.success(`${roleName} updated successfully!`);
          onSuccess();
        } else {
          const errorMessage = data.error || 'Failed to update user';
          showToast.error(errorMessage);
          setErrors({ submit: errorMessage });
        }
      } else {
        // Create new user
        const endpoint = formData.role === 'vendor' 
          ? '/api/admin/vendors' 
          : formData.role === 'supplier'
          ? '/api/admin/suppliers'
          : '/api/admin/users';

        const payload: any = {
          name: formData.fullName,
          email: formData.email,
          password: formData.password,
          phone: formData.phoneNumber || null,
          businessName: formData.includeBusinessDetails ? formData.businessName : null,
          businessType: formData.includeBusinessDetails ? formData.businessType : null,
          streetAddress: formData.streetAddress || null,
          city: formData.city || null,
          stateProvince: formData.stateProvince || null,
          zipCode: '',
          addressCountry: formData.addressCountry || null,
          country: formData.country || null,
          currency: formData.currency || null,
        };

        // Add role-specific fields
        if (formData.role === 'supplier') {
          payload.productCategories = formData.productCategories || null;
          payload.shippingLocations = formData.shippingLocations || null;
          payload.minimumOrderValue = formData.minimumOrderValue || null;
        } else if (formData.role === 'vendor') {
          payload.commissionRate = formData.commissionRate || '15.0';
        } else {
          payload.role = formData.role.toUpperCase();
        }

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (response.ok) {
          const roleName = formData.role === 'vendor' ? 'Vendor' : formData.role === 'supplier' ? 'Supplier' : 'User';
          showToast.success(`${roleName} created successfully!`);
          onSuccess();
        } else {
          const errorMessage = data.error || 'Failed to create user';
          showToast.error(errorMessage);
          setErrors({ submit: errorMessage });
        }
      }
    } catch (error) {
      console.error(isEditMode ? 'Update user error:' : 'Create user error:', error);
      const errorMessage = isEditMode ? 'Failed to update user' : 'Failed to create user';
      showToast.error(errorMessage);
      setErrors({ submit: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  const businessTypes = [
    { value: 'individual', label: 'Individual' },
    { value: 'company', label: 'Company' },
    { value: 'partnership', label: 'Partnership' },
    { value: 'corporation', label: 'Corporation' },
  ];


  const roles = [
    { value: 'supplier', label: 'Supplier', color: 'from-blue-500 to-blue-600' },
    { value: 'vendor', label: 'Vendor', color: 'from-cyan-500 to-cyan-600' },
    { value: 'customer', label: 'Customer', color: 'from-green-500 to-green-600' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Button
            variant="ghost"
            onClick={onCancel}
            className="mb-4 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to {preSelectedRole ? `${preSelectedRole.charAt(0).toUpperCase()}${preSelectedRole.slice(1)}s` : 'Users'}
          </Button>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 bg-clip-text text-transparent">
            {preSelectedRole 
              ? `Add New ${preSelectedRole.charAt(0).toUpperCase()}${preSelectedRole.slice(1)}`
              : 'Add New User'
            }
          </h1>
          <p className="text-muted-foreground mt-2">
            {preSelectedRole 
              ? `Create a new ${preSelectedRole} account with business details`
              : 'Create a new user account'
            }
          </p>
        </motion.div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-8 space-y-8"
        >
          {/* Basic Information */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-sm font-semibold flex items-center gap-2">
                  <User className="w-4 h-4 text-purple-500" />
                  Full Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  className={cn(
                    "h-11 bg-slate-50 dark:bg-slate-800/50 border-2",
                    errors.fullName ? "border-red-500" : "border-slate-200 dark:border-slate-700"
                  )}
                  placeholder="Enter full name"
                />
                {errors.fullName && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.fullName}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold flex items-center gap-2">
                  <Mail className="w-4 h-4 text-purple-500" />
                  Email Address <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={cn(
                    "h-11 bg-slate-50 dark:bg-slate-800/50 border-2",
                    errors.email ? "border-red-500" : "border-slate-200 dark:border-slate-700"
                  )}
                  placeholder="admin@fastdrop.com"
                />
                {errors.email && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.email}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-semibold flex items-center gap-2">
                  <Lock className="w-4 h-4 text-purple-500" />
                  Password <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={cn(
                    "h-11 bg-slate-50 dark:bg-slate-800/50 border-2",
                    errors.password ? "border-red-500" : "border-slate-200 dark:border-slate-700"
                  )}
                  placeholder="••••••••"
                />
                {errors.password && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.password}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold flex items-center gap-2">
                  <User className="w-4 h-4 text-purple-500" />
                  Role <span className="text-red-500">*</span>
                </Label>
                <select
                  value={formData.role}
                  onChange={(e) => handleInputChange('role', e.target.value)}
                  disabled={!!preSelectedRole}
                  className="w-full h-11 px-3 bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-purple-500/20 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {roles.map(role => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Business Information Toggle */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 rounded-xl border border-blue-200 dark:border-blue-800/50">
              <input
                type="checkbox"
                id="includeBusinessDetails"
                checked={formData.includeBusinessDetails}
                onChange={(e) => handleInputChange('includeBusinessDetails', e.target.checked)}
                className="w-5 h-5 rounded border-2 border-blue-500 text-blue-600 focus:ring-2 focus:ring-blue-500/20"
              />
              <Label htmlFor="includeBusinessDetails" className="font-semibold text-sm cursor-pointer flex-1">
                Add Company Details (Optional)
              </Label>
            </div>

            {/* Business Information Section */}
            {formData.includeBusinessDetails && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-6 pt-4"
              >
                <div className="flex items-center gap-2 pb-2 border-b-2 border-gradient-to-r from-purple-500 to-cyan-500">
                  <Building2 className="w-5 h-5 text-purple-500" />
                  <h3 className="font-semibold text-lg">Business Information</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="businessName" className="text-sm font-semibold">
                      Business/Company Name {formData.includeBusinessDetails && <span className="text-red-500">*</span>}
                    </Label>
                    <Input
                      id="businessName"
                      value={formData.businessName}
                      onChange={(e) => handleInputChange('businessName', e.target.value)}
                      className={cn(
                        "h-11 bg-slate-50 dark:bg-slate-800/50 border-2",
                        errors.businessName ? "border-red-500" : "border-slate-200 dark:border-slate-700"
                      )}
                      placeholder="Enter business name"
                    />
                    {errors.businessName && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.businessName}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="businessType" className="text-sm font-semibold">
                      Business Type
                    </Label>
                    <select
                      id="businessType"
                      value={formData.businessType}
                      onChange={(e) => handleInputChange('businessType', e.target.value)}
                      className="w-full h-11 px-3 bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-purple-500/20"
                    >
                      {businessTypes.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="registrationNumber" className="text-sm font-semibold">
                      Registration Number
                    </Label>
                    <Input
                      id="registrationNumber"
                      value={formData.registrationNumber}
                      onChange={(e) => handleInputChange('registrationNumber', e.target.value)}
                      className="h-11 bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-200 dark:border-slate-700"
                      placeholder="Optional"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="vatNumber" className="text-sm font-semibold">
                      VAT/GST Number
                    </Label>
                    <Input
                      id="vatNumber"
                      value={formData.vatNumber}
                      onChange={(e) => handleInputChange('vatNumber', e.target.value)}
                      className="h-11 bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-200 dark:border-slate-700"
                      placeholder="Optional"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="country" className="text-sm font-semibold flex items-center gap-2">
                      <Globe className="w-4 h-4 text-purple-500" />
                      Country {formData.includeBusinessDetails && <span className="text-red-500">*</span>}
                    </Label>
                    <select
                      id="country"
                      value={formData.country}
                      onChange={(e) => handleInputChange('country', e.target.value)}
                      className={cn(
                        "w-full h-11 px-3 bg-slate-50 dark:bg-slate-800/50 border-2 rounded-lg focus:ring-2 focus:ring-purple-500/20",
                        errors.country ? "border-red-500" : "border-slate-200 dark:border-slate-700"
                      )}
                    >
                      {countriesData.map((country: any) => (
                        <option key={country.code} value={country.name}>
                          {country.flag} {country.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="currency" className="text-sm font-semibold flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-purple-500" />
                      Local Currency (UI Reference) {formData.includeBusinessDetails && <span className="text-red-500">*</span>}
                    </Label>
                    <select
                      id="currency"
                      value={formData.currency}
                      onChange={(e) => handleInputChange('currency', e.target.value)}
                      className={cn(
                        "w-full h-11 px-3 bg-slate-50 dark:bg-slate-800/50 border-2 rounded-lg focus:ring-2 focus:ring-purple-500/20",
                        errors.currency ? "border-red-500" : "border-slate-200 dark:border-slate-700"
                      )}
                    >
                      {currenciesData.map((currency: any) => (
                        <option key={currency.code} value={currency.code}>
                          {formatCurrency(currency, true)}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-muted-foreground">
                      This currency will be used for UI display and profit calculator. All prices are stored in USD in the database.
                    </p>
                  </div>
                </div>

                {/* Business Address */}
                <div className="space-y-4 pt-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-purple-500" />
                    <h4 className="font-semibold">Business Address</h4>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="streetAddress" className="text-sm font-semibold">
                      Street Address
                    </Label>
                    <Input
                      id="streetAddress"
                      value={formData.streetAddress}
                      onChange={(e) => handleInputChange('streetAddress', e.target.value)}
                      className="h-11 bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-200 dark:border-slate-700"
                      placeholder="123 Main Street"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="city" className="text-sm font-semibold">
                        City
                      </Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        className="h-11 bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-200 dark:border-slate-700"
                        placeholder="New York"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="stateProvince" className="text-sm font-semibold">
                        State/Province
                      </Label>
                      <Input
                        id="stateProvince"
                        value={formData.stateProvince}
                        onChange={(e) => handleInputChange('stateProvince', e.target.value)}
                        className="h-11 bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-200 dark:border-slate-700"
                        placeholder="NY"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="addressCountry" className="text-sm font-semibold">
                      Country
                    </Label>
                    <select
                      id="addressCountry"
                      value={formData.addressCountry}
                      onChange={(e) => handleInputChange('addressCountry', e.target.value)}
                      className="w-full h-11 px-3 bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-purple-500/20"
                    >
                      {countriesData.map((country) => (
                        <option key={country.code} value={country.name}>
                          {country.flag} {country.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* KYC Verification */}
                <div className="space-y-4 pt-4">
                  <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border-2 border-blue-200 dark:border-blue-800/50 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-blue-900 dark:text-blue-100">KYC Verification</h4>
                        <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                          Required for Stripe Connect and payout processing
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 hover:from-blue-600 hover:to-blue-700"
                      >
                        Add KYC Details
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Additional Information */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="phoneNumber" className="text-sm font-semibold flex items-center gap-2">
                  <Phone className="w-4 h-4 text-purple-500" />
                  Phone Number
                </Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  className="h-11 bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-200 dark:border-slate-700"
                  placeholder="+1 (555) 000-0000"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateOfBirth" className="text-sm font-semibold flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-purple-500" />
                  Date of Birth
                </Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                  className="h-11 bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-200 dark:border-slate-700"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-4 pt-6 border-t-2 border-slate-200 dark:border-slate-800">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
              className="px-6"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="px-8 bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 text-white font-semibold hover:from-purple-700 hover:via-indigo-700 hover:to-cyan-700 shadow-lg shadow-purple-500/30"
            >
              {isSubmitting ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                  />
                  Creating...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  {preSelectedRole 
                    ? `Create ${preSelectedRole.charAt(0).toUpperCase()}${preSelectedRole.slice(1)}`
                    : 'Create User'
                  }
                </>
              )}
            </Button>
          </div>
        </motion.form>
      </div>
    </div>
  );
}