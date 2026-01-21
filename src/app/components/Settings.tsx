import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  User,
  Bell,
  Lock,
  CreditCard,
  Globe,
  Moon,
  Sun,
  Mail,
  Phone,
  MapPin,
  Building,
  Save,
  Shield,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from './ThemeProvider';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Separator } from './ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { toast } from 'sonner';

export function Settings() {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Profile Settings - Complete Database Fields
  const [profileData, setProfileData] = useState({
    // Basic Info
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    dateOfBirth: '',
    avatar: user?.avatar || '',
    
    // Address
    streetAddress: '',
    city: '',
    stateProvince: '',
    zipCode: '',
    addressCountry: '',
    
    // Business Info (Supplier/Vendor)
    businessName: '',
    businessType: '',
    registrationNumber: '',
    vatNumber: '',
    taxId: '',
    country: '',
    currency: 'USD',
    baseCurrency: 'USD',
    
    // Supplier Specific
    productCategories: '',
    shippingLocations: '',
    minimumOrderValue: '',
    
    // Vendor Specific
    commissionRate: '15',
  });

  // Notification Settings
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    orderUpdates: true,
    promotionalEmails: false,
    weeklyReports: true,
    securityAlerts: true,
  });

  // Security/Password Settings
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Validation Functions
  const validatePassword = (password: string): boolean => {
    // Minimum 8 characters, at least one uppercase, one lowercase, one number
    if (password.length < 8) return false;
    if (!/[A-Z]/.test(password)) return false; // At least one uppercase
    if (!/[a-z]/.test(password)) return false; // At least one lowercase
    if (!/[0-9]/.test(password)) return false; // At least one number
    return true;
  };

  const validatePasswordChange = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Current password required
    if (!passwordData.currentPassword.trim()) {
      newErrors.currentPassword = 'Current password is required';
    }

    // New password required and validation
    if (!passwordData.newPassword.trim()) {
      newErrors.newPassword = 'New password is required';
    } else if (passwordData.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters long';
    } else if (!validatePassword(passwordData.newPassword)) {
      newErrors.newPassword = 'Password must include uppercase, lowercase, and number';
    }

    // Confirm password match
    if (!passwordData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your new password';
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Check if new password is different from current
    if (passwordData.currentPassword && passwordData.newPassword) {
      if (passwordData.currentPassword === passwordData.newPassword) {
        newErrors.newPassword = 'New password must be different from current password';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePasswordUpdate = () => {
    if (!validatePasswordChange()) {
      toast.error('Please fix the errors before saving');
      return;
    }

    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Password updated successfully!');
      // Clear password fields
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setErrors({});
    }, 1000);
  };

  // Validation Functions
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    if (!phone) return true; // Optional field
    const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  const validateZipCode = (zip: string): boolean => {
    if (!zip) return true; // Optional field
    const zipRegex = /^[0-9]{5}(-[0-9]{4})?$|^[A-Z0-9]{3,10}$/i;
    return zipRegex.test(zip);
  };

  const validateTaxId = (taxId: string): boolean => {
    if (!taxId) return true; // Optional field
    return taxId.length >= 5; // Basic validation
  };

  const validateVatNumber = (vat: string): boolean => {
    if (!vat) return true; // Optional field
    return vat.length >= 5; // Basic validation
  };

  const validateCommissionRate = (rate: string): boolean => {
    if (!rate) return true;
    const numRate = parseFloat(rate);
    return !isNaN(numRate) && numRate >= 0 && numRate <= 100;
  };

  const validateMinimumOrderValue = (value: string): boolean => {
    if (!value) return true;
    const numValue = parseFloat(value);
    return !isNaN(numValue) && numValue >= 0;
  };

  const validateDateOfBirth = (date: string): boolean => {
    if (!date) return true; // Optional field
    const dateObj = new Date(date);
    const today = new Date();
    const age = today.getFullYear() - dateObj.getFullYear();
    return !isNaN(dateObj.getTime()) && age >= 18 && age <= 120;
  };

  const validateRegistrationNumber = (regNum: string): boolean => {
    if (!regNum) return true; // Optional field
    return regNum.length >= 5;
  };

  const validateProfile = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Basic Information - All Required
    if (!profileData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (profileData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!profileData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(profileData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!profileData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!validatePhone(profileData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!profileData.dateOfBirth.trim()) {
      newErrors.dateOfBirth = 'Date of birth is required';
    } else if (!validateDateOfBirth(profileData.dateOfBirth)) {
      newErrors.dateOfBirth = 'Invalid date or age must be between 18 and 120 years';
    }

    // Address validation - All Address Fields Required
    if (!profileData.streetAddress.trim()) {
      newErrors.streetAddress = 'Street address is required';
    } else if (profileData.streetAddress.trim().length < 5) {
      newErrors.streetAddress = 'Street address must be at least 5 characters';
    }

    if (!profileData.city.trim()) {
      newErrors.city = 'City is required';
    } else if (profileData.city.trim().length < 2) {
      newErrors.city = 'City name must be at least 2 characters';
    }

    if (!profileData.stateProvince.trim()) {
      newErrors.stateProvince = 'State/Province is required';
    } else if (profileData.stateProvince.trim().length < 2) {
      newErrors.stateProvince = 'State/Province must be at least 2 characters';
    }

    if (!profileData.zipCode.trim()) {
      newErrors.zipCode = 'ZIP/Postal code is required';
    } else if (!validateZipCode(profileData.zipCode)) {
      newErrors.zipCode = 'Please enter a valid ZIP/Postal code';
    }

    if (!profileData.addressCountry.trim()) {
      newErrors.addressCountry = 'Country is required';
    } else if (profileData.addressCountry.trim().length < 2) {
      newErrors.addressCountry = 'Country name must be at least 2 characters';
    }

    // Business validation for Supplier/Vendor - All Required
    if (user?.role === 'supplier' || user?.role === 'vendor') {
      if (!profileData.businessName.trim()) {
        newErrors.businessName = 'Business name is required';
      } else if (profileData.businessName.length < 3) {
        newErrors.businessName = 'Business name must be at least 3 characters';
      }

      if (!profileData.businessType.trim()) {
        newErrors.businessType = 'Business type is required';
      }

      if (!profileData.registrationNumber.trim()) {
        newErrors.registrationNumber = 'Registration number is required';
      } else if (!validateRegistrationNumber(profileData.registrationNumber)) {
        newErrors.registrationNumber = 'Registration number must be at least 5 characters';
      }

      if (!profileData.taxId.trim()) {
        newErrors.taxId = 'Tax ID is required';
      } else if (!validateTaxId(profileData.taxId)) {
        newErrors.taxId = 'Tax ID must be at least 5 characters';
      }

      if (!profileData.vatNumber.trim()) {
        newErrors.vatNumber = 'VAT number is required';
      } else if (!validateVatNumber(profileData.vatNumber)) {
        newErrors.vatNumber = 'VAT number must be at least 5 characters';
      }

      if (!profileData.country.trim()) {
        newErrors.country = 'Operating country is required';
      } else if (profileData.country.trim().length < 2) {
        newErrors.country = 'Operating country must be at least 2 characters';
      }
    }

    // Vendor specific validation
    if (user?.role === 'vendor') {
      if (profileData.commissionRate && !validateCommissionRate(profileData.commissionRate)) {
        newErrors.commissionRate = 'Commission rate must be between 0 and 100';
      }
    }

    // Supplier specific validation - All Required
    if (user?.role === 'supplier') {
      if (!profileData.productCategories.trim()) {
        newErrors.productCategories = 'Product categories are required';
      } else {
        const categories = profileData.productCategories.split(',').map(c => c.trim());
        if (categories.some(cat => cat.length < 2)) {
          newErrors.productCategories = 'Each category must be at least 2 characters';
        }
      }

      if (!profileData.shippingLocations.trim()) {
        newErrors.shippingLocations = 'Shipping locations are required';
      } else {
        const locations = profileData.shippingLocations.split(',').map(l => l.trim());
        if (locations.some(loc => loc.length < 2)) {
          newErrors.shippingLocations = 'Each location must be at least 2 characters';
        }
      }

      if (!profileData.minimumOrderValue.trim()) {
        newErrors.minimumOrderValue = 'Minimum order value is required';
      } else if (!validateMinimumOrderValue(profileData.minimumOrderValue)) {
        newErrors.minimumOrderValue = 'Minimum order value must be a positive number';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveProfile = async () => {
    // Validate before saving
    if (!validateProfile()) {
      toast.error('Please fix the errors before saving');
      return;
    }

    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsSaving(false);
      toast.success('Profile updated successfully');
      setErrors({}); // Clear errors on success
    } catch (error) {
      setIsSaving(false);
      toast.error('Failed to update profile');
    }
  };

  const handleSaveNotifications = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    toast.success('Notification preferences saved');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold mb-2">Settings</h2>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Personal Information</h3>
                <p className="text-sm text-muted-foreground">
                  Update your personal details and contact information
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Basic Information - All Roles */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-muted-foreground uppercase">Basic Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name" className="text-sm font-semibold mb-2 block">
                      Full Name <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="name"
                        value={profileData.name}
                        onChange={e => {
                          setProfileData({ ...profileData, name: e.target.value });
                          if (errors.name) setErrors({ ...errors, name: '' });
                        }}
                        className={`pl-10 ${errors.name ? 'border-red-500 focus:ring-red-500' : ''}`}
                      />
                    </div>
                    {errors.name && (
                      <p className="text-sm text-red-500 mt-1">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-sm font-semibold mb-2 block">
                      Email Address <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        onChange={e => {
                          setProfileData({ ...profileData, email: e.target.value });
                          if (errors.email) setErrors({ ...errors, email: '' });
                        }}
                        className={`pl-10 ${errors.email ? 'border-red-500 focus:ring-red-500' : ''}`}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-sm text-red-500 mt-1">{errors.email}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone" className="text-sm font-semibold mb-2 block">
                      Phone Number <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        value={profileData.phone}
                        onChange={e => {
                          setProfileData({ ...profileData, phone: e.target.value });
                          if (errors.phone) setErrors({ ...errors, phone: '' });
                        }}
                        className={`pl-10 ${errors.phone ? 'border-red-500 focus:ring-red-500' : ''}`}
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-sm text-red-500 mt-1">{errors.phone}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="dateOfBirth" className="text-sm font-semibold mb-2 block">
                      Date of Birth <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={profileData.dateOfBirth}
                      onChange={e => {
                        setProfileData({ ...profileData, dateOfBirth: e.target.value });
                        if (errors.dateOfBirth) setErrors({ ...errors, dateOfBirth: '' });
                      }}
                      className={errors.dateOfBirth ? 'border-red-500 focus:ring-red-500' : ''}
                    />
                    {errors.dateOfBirth && (
                      <p className="text-sm text-red-500 mt-1">{errors.dateOfBirth}</p>
                    )}
                  </div>
                </div>
              </div>

              <Separator />

              {/* Address Information - All Roles */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-muted-foreground uppercase">Address</h4>
                <div>
                  <Label htmlFor="streetAddress" className="text-sm font-semibold mb-2 block">
                    Street Address <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="streetAddress"
                      value={profileData.streetAddress}
                      onChange={e => {
                        setProfileData({ ...profileData, streetAddress: e.target.value });
                        if (errors.streetAddress) setErrors({ ...errors, streetAddress: '' });
                      }}
                      className={`pl-10 ${errors.streetAddress ? 'border-red-500 focus:ring-red-500' : ''}`}
                      placeholder="123 Business Street"
                    />
                  </div>
                  {errors.streetAddress && (
                    <p className="text-sm text-red-500 mt-1">{errors.streetAddress}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city" className="text-sm font-semibold mb-2 block">
                      City <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="city"
                      value={profileData.city}
                      onChange={e => {
                        setProfileData({ ...profileData, city: e.target.value });
                        if (errors.city) setErrors({ ...errors, city: '' });
                      }}
                      className={errors.city ? 'border-red-500 focus:ring-red-500' : ''}
                      placeholder="San Francisco"
                    />
                    {errors.city && (
                      <p className="text-sm text-red-500 mt-1">{errors.city}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="stateProvince" className="text-sm font-semibold mb-2 block">
                      State/Province <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="stateProvince"
                      value={profileData.stateProvince}
                      onChange={e => {
                        setProfileData({ ...profileData, stateProvince: e.target.value });
                        if (errors.stateProvince) setErrors({ ...errors, stateProvince: '' });
                      }}
                      className={errors.stateProvince ? 'border-red-500 focus:ring-red-500' : ''}
                      placeholder="California"
                    />
                    {errors.stateProvince && (
                      <p className="text-sm text-red-500 mt-1">{errors.stateProvince}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="zipCode" className="text-sm font-semibold mb-2 block">
                      ZIP/Postal Code <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="zipCode"
                      value={profileData.zipCode}
                      onChange={e => {
                        setProfileData({ ...profileData, zipCode: e.target.value });
                        if (errors.zipCode) setErrors({ ...errors, zipCode: '' });
                      }}
                      className={errors.zipCode ? 'border-red-500 focus:ring-red-500' : ''}
                      placeholder="94102"
                    />
                    {errors.zipCode && (
                      <p className="text-sm text-red-500 mt-1">{errors.zipCode}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="addressCountry" className="text-sm font-semibold mb-2 block">
                    Country <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="addressCountry"
                      value={profileData.addressCountry}
                      onChange={e => {
                        setProfileData({ ...profileData, addressCountry: e.target.value });
                        if (errors.addressCountry) setErrors({ ...errors, addressCountry: '' });
                      }}
                      className={`pl-10 ${errors.addressCountry ? 'border-red-500 focus:ring-red-500' : ''}`}
                      placeholder="United States"
                    />
                  </div>
                  {errors.addressCountry && (
                    <p className="text-sm text-red-500 mt-1">{errors.addressCountry}</p>
                  )}
                </div>
              </div>

              {/* Business Information - Supplier & Vendor Only */}
              {(user?.role === 'supplier' || user?.role === 'vendor') && (
                <>
                  <Separator />
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-muted-foreground uppercase">Business Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="businessName" className="text-sm font-semibold mb-2 block">
                          Business Name <span className="text-red-500">*</span>
                        </Label>
                        <div className="relative">
                          <Building className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="businessName"
                            value={profileData.businessName}
                            onChange={e => {
                              setProfileData({ ...profileData, businessName: e.target.value });
                              if (errors.businessName) setErrors({ ...errors, businessName: '' });
                            }}
                            className={`pl-10 ${errors.businessName ? 'border-red-500 focus:ring-red-500' : ''}`}
                            placeholder="FastDrop Enterprise"
                          />
                        </div>
                        {errors.businessName && (
                          <p className="text-sm text-red-500 mt-1">{errors.businessName}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="businessType" className="text-sm font-semibold mb-2 block">
                          Business Type <span className="text-red-500">*</span>
                        </Label>
                        <select
                          id="businessType"
                          value={profileData.businessType}
                          onChange={e => {
                            setProfileData({ ...profileData, businessType: e.target.value });
                            if (errors.businessType) setErrors({ ...errors, businessType: '' });
                          }}
                          className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${errors.businessType ? 'border-red-500' : ''}`}
                        >
                          <option value="">Select Type</option>
                          <option value="individual">Individual</option>
                          <option value="company">Company</option>
                          <option value="partnership">Partnership</option>
                          <option value="corporation">Corporation</option>
                        </select>
                        {errors.businessType && (
                          <p className="text-sm text-red-500 mt-1">{errors.businessType}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="registrationNumber" className="text-sm font-semibold mb-2 block">
                          Registration Number <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="registrationNumber"
                          value={profileData.registrationNumber}
                          onChange={e => {
                            setProfileData({ ...profileData, registrationNumber: e.target.value });
                            if (errors.registrationNumber) setErrors({ ...errors, registrationNumber: '' });
                          }}
                          className={errors.registrationNumber ? 'border-red-500 focus:ring-red-500' : ''}
                          placeholder="REG-123456"
                        />
                        {errors.registrationNumber && (
                          <p className="text-sm text-red-500 mt-1">{errors.registrationNumber}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="vatNumber" className="text-sm font-semibold mb-2 block">
                          VAT Number <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="vatNumber"
                          value={profileData.vatNumber}
                          onChange={e => {
                            setProfileData({ ...profileData, vatNumber: e.target.value });
                            if (errors.vatNumber) setErrors({ ...errors, vatNumber: '' });
                          }}
                          className={errors.vatNumber ? 'border-red-500 focus:ring-red-500' : ''}
                          placeholder="VAT-123456"
                        />
                        {errors.vatNumber && (
                          <p className="text-sm text-red-500 mt-1">{errors.vatNumber}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="taxId" className="text-sm font-semibold mb-2 block">
                          Tax ID <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="taxId"
                          value={profileData.taxId}
                          onChange={e => {
                            setProfileData({ ...profileData, taxId: e.target.value });
                            if (errors.taxId) setErrors({ ...errors, taxId: '' });
                          }}
                          className={errors.taxId ? 'border-red-500 focus:ring-red-500' : ''}
                          placeholder="TAX-123456"
                        />
                        {errors.taxId && (
                          <p className="text-sm text-red-500 mt-1">{errors.taxId}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="country" className="text-sm font-semibold mb-2 block">
                          Operating Country <span className="text-red-500">*</span>
                        </Label>
                        <div className="relative">
                          <Globe className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="country"
                            value={profileData.country}
                            onChange={e => {
                              setProfileData({ ...profileData, country: e.target.value });
                              if (errors.country) setErrors({ ...errors, country: '' });
                            }}
                            className={`pl-10 ${errors.country ? 'border-red-500 focus:ring-red-500' : ''}`}
                            placeholder="United States"
                          />
                        </div>
                        {errors.country && (
                          <p className="text-sm text-red-500 mt-1">{errors.country}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="currency" className="text-sm font-semibold mb-2 block">Display Currency</Label>
                        <select
                          id="currency"
                          value={profileData.currency}
                          onChange={e => setProfileData({ ...profileData, currency: e.target.value })}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        >
                          <option value="USD">USD - US Dollar</option>
                          <option value="EUR">EUR - Euro</option>
                          <option value="GBP">GBP - British Pound</option>
                          <option value="CAD">CAD - Canadian Dollar</option>
                          <option value="AUD">AUD - Australian Dollar</option>
                        </select>
                      </div>

                      <div>
                        <Label htmlFor="baseCurrency" className="text-sm font-semibold mb-2 block">Base Currency</Label>
                        <select
                          id="baseCurrency"
                          value={profileData.baseCurrency}
                          onChange={e => setProfileData({ ...profileData, baseCurrency: e.target.value })}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        >
                          <option value="USD">USD - US Dollar</option>
                          <option value="EUR">EUR - Euro</option>
                          <option value="GBP">GBP - British Pound</option>
                          <option value="CAD">CAD - Canadian Dollar</option>
                          <option value="AUD">AUD - Australian Dollar</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Supplier Specific Fields */}
              {user?.role === 'supplier' && (
                <>
                  <Separator />
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-muted-foreground uppercase">Supplier Settings</h4>
                    <div>
                      <Label htmlFor="productCategories" className="text-sm font-semibold mb-2 block">Product Categories</Label>
                      <Input
                        id="productCategories"
                        value={profileData.productCategories}
                        onChange={e => {
                          setProfileData({ ...profileData, productCategories: e.target.value });
                          if (errors.productCategories) setErrors({ ...errors, productCategories: '' });
                        }}
                        className={errors.productCategories ? 'border-red-500 focus:ring-red-500' : ''}
                        placeholder="Electronics, Fashion, Home & Garden (comma-separated)"
                      />
                      {errors.productCategories ? (
                        <p className="text-sm text-red-500 mt-1">{errors.productCategories}</p>
                      ) : (
                        <p className="text-xs text-muted-foreground mt-1">Separate multiple categories with commas</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="shippingLocations" className="text-sm font-semibold mb-2 block">
                        Shipping Locations <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="shippingLocations"
                        value={profileData.shippingLocations}
                        onChange={e => {
                          setProfileData({ ...profileData, shippingLocations: e.target.value });
                          if (errors.shippingLocations) setErrors({ ...errors, shippingLocations: '' });
                        }}
                        className={errors.shippingLocations ? 'border-red-500 focus:ring-red-500' : ''}
                        placeholder="USA, Canada, UK, EU (comma-separated)"
                      />
                      {errors.shippingLocations ? (
                        <p className="text-sm text-red-500 mt-1">{errors.shippingLocations}</p>
                      ) : (
                        <p className="text-xs text-muted-foreground mt-1">Countries/regions you ship to</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="minimumOrderValue" className="text-sm font-semibold mb-2 block">
                        Minimum Order Value ($) <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="minimumOrderValue"
                        type="number"
                        value={profileData.minimumOrderValue}
                        onChange={e => {
                          setProfileData({ ...profileData, minimumOrderValue: e.target.value });
                          if (errors.minimumOrderValue) setErrors({ ...errors, minimumOrderValue: '' });
                        }}
                        className={errors.minimumOrderValue ? 'border-red-500 focus:ring-red-500' : ''}
                        placeholder="100"
                      />
                      {errors.minimumOrderValue && (
                        <p className="text-sm text-red-500 mt-1">{errors.minimumOrderValue}</p>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* Vendor Specific Fields */}
              {user?.role === 'vendor' && (
                <>
                  <Separator />
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-muted-foreground uppercase">Vendor Settings</h4>
                    <div>
                      <Label htmlFor="commissionRate" className="text-sm font-semibold mb-2 block">Commission Rate (%)</Label>
                      <Input
                        id="commissionRate"
                        type="number"
                        value={profileData.commissionRate}
                        onChange={e => {
                          setProfileData({ ...profileData, commissionRate: e.target.value });
                          if (errors.commissionRate) setErrors({ ...errors, commissionRate: '' });
                        }}
                        className={errors.commissionRate ? 'border-red-500 focus:ring-red-500' : ''}
                        placeholder="15"
                        min="0"
                        max="100"
                        step="0.1"
                      />
                      {errors.commissionRate && (
                        <p className="text-sm text-red-500 mt-1">{errors.commissionRate}</p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">Platform commission percentage (0-100%)</p>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="flex justify-end mt-6">
              <Button
                onClick={handleSaveProfile}
                disabled={isSaving}
                className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white"
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500">
                <Bell className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Notification Preferences</h3>
                <p className="text-sm text-muted-foreground">
                  Control how you receive updates and alerts
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">Email Notifications</p>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications via email
                  </p>
                </div>
                <Switch
                  checked={notifications.emailNotifications}
                  onCheckedChange={checked =>
                    setNotifications({ ...notifications, emailNotifications: checked })
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">Order Updates</p>
                  <p className="text-sm text-muted-foreground">
                    Get notified about order status changes
                  </p>
                </div>
                <Switch
                  checked={notifications.orderUpdates}
                  onCheckedChange={checked =>
                    setNotifications({ ...notifications, orderUpdates: checked })
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">Promotional Emails</p>
                  <p className="text-sm text-muted-foreground">
                    Receive offers and promotional content
                  </p>
                </div>
                <Switch
                  checked={notifications.promotionalEmails}
                  onCheckedChange={checked =>
                    setNotifications({ ...notifications, promotionalEmails: checked })
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">Weekly Reports</p>
                  <p className="text-sm text-muted-foreground">
                    Get weekly performance summaries
                  </p>
                </div>
                <Switch
                  checked={notifications.weeklyReports}
                  onCheckedChange={checked =>
                    setNotifications({ ...notifications, weeklyReports: checked })
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">Security Alerts</p>
                  <p className="text-sm text-muted-foreground">
                    Important security and account notifications
                  </p>
                </div>
                <Switch
                  checked={notifications.securityAlerts}
                  onCheckedChange={checked =>
                    setNotifications({ ...notifications, securityAlerts: checked })
                  }
                />
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <Button
                onClick={handleSaveNotifications}
                disabled={isSaving}
                className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white"
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Preferences
                  </>
                )}
              </Button>
            </div>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Security Settings</h3>
                <p className="text-sm text-muted-foreground">
                  Manage your password and security preferences
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="currentPassword" className="text-sm font-semibold mb-2 block">
                  Current Password <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="currentPassword"
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => {
                      setPasswordData({ ...passwordData, currentPassword: e.target.value });
                      if (errors.currentPassword) setErrors({ ...errors, currentPassword: '' });
                    }}
                    placeholder="Enter current password"
                    className={`pl-10 ${errors.currentPassword ? 'border-red-500 focus:ring-red-500' : ''}`}
                  />
                </div>
                {errors.currentPassword && (
                  <p className="text-sm text-red-500 mt-1">{errors.currentPassword}</p>
                )}
              </div>

              <div>
                <Label htmlFor="newPassword" className="text-sm font-semibold mb-2 block">
                  New Password <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="newPassword"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => {
                      setPasswordData({ ...passwordData, newPassword: e.target.value });
                      if (errors.newPassword) setErrors({ ...errors, newPassword: '' });
                    }}
                    placeholder="Enter new password"
                    className={`pl-10 ${errors.newPassword ? 'border-red-500 focus:ring-red-500' : ''}`}
                  />
                </div>
                {errors.newPassword && (
                  <p className="text-sm text-red-500 mt-1">{errors.newPassword}</p>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  Must be 8+ characters with uppercase, lowercase, and number
                </p>
              </div>

              <div>
                <Label htmlFor="confirmPassword" className="text-sm font-semibold mb-2 block">
                  Confirm New Password <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => {
                      setPasswordData({ ...passwordData, confirmPassword: e.target.value });
                      if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: '' });
                    }}
                    placeholder="Confirm new password"
                    className={`pl-10 ${errors.confirmPassword ? 'border-red-500 focus:ring-red-500' : ''}`}
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-red-500 mt-1">{errors.confirmPassword}</p>
                )}
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <Button
                onClick={handlePasswordUpdate}
                disabled={isSaving}
                className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white disabled:opacity-50"
              >
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? 'Updating...' : 'Update Password'}
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4">Two-Factor Authentication</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Add an extra layer of security to your account
            </p>
            <Button variant="outline">Enable 2FA</Button>
          </Card>
        </TabsContent>

        {/* Appearance Tab */}
        <TabsContent value="appearance" className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500">
                {theme === 'dark' ? (
                  <Moon className="w-6 h-6 text-white" />
                ) : (
                  <Sun className="w-6 h-6 text-white" />
                )}
              </div>
              <div>
                <h3 className="text-xl font-bold">Appearance</h3>
                <p className="text-sm text-muted-foreground">
                  Customize how FastDrop looks for you
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-sm font-semibold mb-3 block">Theme</Label>
                <div className="grid grid-cols-3 gap-4">
                  <button
                    onClick={() => setTheme('light')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      theme === 'light'
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                        : 'border-border hover:border-purple-300'
                    }`}
                  >
                    <Sun className="w-6 h-6 mx-auto mb-2" />
                    <p className="text-sm font-semibold">Light</p>
                  </button>

                  <button
                    onClick={() => setTheme('dark')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      theme === 'dark'
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                        : 'border-border hover:border-purple-300'
                    }`}
                  >
                    <Moon className="w-6 h-6 mx-auto mb-2" />
                    <p className="text-sm font-semibold">Dark</p>
                  </button>

                  <button
                    onClick={() => setTheme('system')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      theme === 'system'
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                        : 'border-border hover:border-purple-300'
                    }`}
                  >
                    <Globe className="w-6 h-6 mx-auto mb-2" />
                    <p className="text-sm font-semibold">System</p>
                  </button>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
