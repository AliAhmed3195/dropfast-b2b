'use client'

import React, { useState, useEffect, useRef } from 'react';
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
import { showToast } from '../../lib/toast';

export function Settings() {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const savingProfileRef = useRef(false);
  const savingNotificationsRef = useRef(false);
  const savingPasswordRef = useRef(false);
  const fetchingUserRef = useRef(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Profile Settings
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    address: '',
    city: '',
    country: '',
  });

  // Notification Settings
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    orderUpdates: true,
    promotionalEmails: false,
    weeklyReports: true,
    securityAlerts: true,
  });

  // Fetch full user details from API
  useEffect(() => {
    if (!user?.id || fetchingUserRef.current) return;
    
    const fetchUserDetails = async () => {
      fetchingUserRef.current = true;
      setLoading(true);
      
      try {
        const response = await fetch(`/api/admin/users/${user.id}`);
        const data = await response.json();
        
        if (response.ok && data.user) {
          const userData = data.user;
          setProfileData({
            name: userData.name || '',
            email: userData.email || '',
            phone: userData.phone || '',
            company: userData.businessName || '',
            address: userData.streetAddress || '',
            city: userData.city || '',
            country: userData.country || userData.addressCountry || '',
          });
        } else {
          showToast.error(data.error || 'Failed to load user details');
        }
      } catch (error) {
        console.error('Fetch user details error:', error);
        showToast.error('Failed to load user details');
      } finally {
        setLoading(false);
        fetchingUserRef.current = false;
      }
    };

    fetchUserDetails();
  }, [user?.id]);

  const handleSaveProfile = async () => {
    if (savingProfileRef.current || !user) return;
    
    // Validation
    if (!profileData.name || !profileData.email) {
      showToast.error('Name and email are required');
      return;
    }

    if (profileData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileData.email)) {
      showToast.error('Please enter a valid email address');
      return;
    }
    
    savingProfileRef.current = true;
    setIsSaving(true);
    
    try {
      const response = await fetch(`/api/admin/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: profileData.name,
          email: profileData.email,
          phone: profileData.phone || null,
          businessName: profileData.company || null,
          streetAddress: profileData.address || null,
          city: profileData.city || null,
          country: profileData.country || null,
          addressCountry: profileData.country || null,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        showToast.success('Profile updated successfully');
        // Refresh user data
        fetchingUserRef.current = false;
        const refreshResponse = await fetch(`/api/admin/users/${user.id}`);
        const refreshData = await refreshResponse.json();
        if (refreshResponse.ok && refreshData.user) {
          const userData = refreshData.user;
          setProfileData({
            name: userData.name || '',
            email: userData.email || '',
            phone: userData.phone || '',
            company: userData.businessName || '',
            address: userData.streetAddress || '',
            city: userData.city || '',
            country: userData.country || userData.addressCountry || '',
          });
        }
      } else {
        showToast.error(data.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Save profile error:', error);
      showToast.error('Failed to update profile');
    } finally {
      setIsSaving(false);
      savingProfileRef.current = false;
    }
  };

  const handleSaveNotifications = async () => {
    if (savingNotificationsRef.current) return;
    
    savingNotificationsRef.current = true;
    setIsSaving(true);
    
    try {
      // TODO: Create API endpoint for notification preferences
      // For now, save to localStorage
      localStorage.setItem('notificationPreferences', JSON.stringify(notifications));
      
      await new Promise(resolve => setTimeout(resolve, 500));
      showToast.success('Notification preferences saved');
    } catch (error) {
      console.error('Save notifications error:', error);
      showToast.error('Failed to save notification preferences');
    } finally {
      setIsSaving(false);
      savingNotificationsRef.current = false;
    }
  };

  const handleUpdatePassword = async () => {
    if (savingPasswordRef.current || !user) return;

    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      showToast.error('Please fill all password fields');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showToast.error('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      showToast.error('Password must be at least 6 characters long');
      return;
    }

    savingPasswordRef.current = true;
    setIsSaving(true);
    
    try {
      const response = await fetch(`/api/admin/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          password: passwordData.newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        showToast.success('Password updated successfully');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      } else {
        showToast.error(data.error || 'Failed to update password');
      }
    } catch (error) {
      console.error('Update password error:', error);
      showToast.error('Failed to update password');
    } finally {
      setIsSaving(false);
      savingPasswordRef.current = false;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading settings...</p>
        </div>
      </div>
    );
  }

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

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="text-sm font-semibold mb-2 block">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="name"
                      value={profileData.name}
                      onChange={e => setProfileData({ ...profileData, name: e.target.value })}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email" className="text-sm font-semibold mb-2 block">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={e => setProfileData({ ...profileData, email: e.target.value })}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone" className="text-sm font-semibold mb-2 block">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      value={profileData.phone}
                      onChange={e => setProfileData({ ...profileData, phone: e.target.value })}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="company" className="text-sm font-semibold mb-2 block">Company</Label>
                  <div className="relative">
                    <Building className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="company"
                      value={profileData.company}
                      onChange={e => setProfileData({ ...profileData, company: e.target.value })}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="address" className="text-sm font-semibold mb-2 block">Address</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="address"
                    value={profileData.address}
                    onChange={e => setProfileData({ ...profileData, address: e.target.value })}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city" className="text-sm font-semibold mb-2 block">City</Label>
                  <Input
                    id="city"
                    value={profileData.city}
                    onChange={e => setProfileData({ ...profileData, city: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="country" className="text-sm font-semibold mb-2 block">Country</Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="country"
                      value={profileData.country}
                      onChange={e => setProfileData({ ...profileData, country: e.target.value })}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
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
                  Current Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="currentPassword"
                    type="password"
                    placeholder="Enter current password"
                    className="pl-10"
                    value={passwordData.currentPassword}
                    onChange={e => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="newPassword" className="text-sm font-semibold mb-2 block">
                  New Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="Enter new password"
                    className="pl-10"
                    value={passwordData.newPassword}
                    onChange={e => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="confirmPassword" className="text-sm font-semibold mb-2 block">
                  Confirm New Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm new password"
                    className="pl-10"
                    value={passwordData.confirmPassword}
                    onChange={e => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <Button
                onClick={handleUpdatePassword}
                disabled={isSaving}
                className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white"
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Update Password
                  </>
                )}
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
