'use client'

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Eye,
  Save,
  Settings,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Monitor,
  Smartphone,
  Palette,
  Type,
  Image as ImageIcon,
  Video,
  Layout,
  Power,
  ArrowLeft,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Maximize,
  X,
} from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Switch } from './ui/switch';
import { showToast } from '../../lib/toast';
import { cn } from './ui/utils';
import { sectionLibrary, getSectionConfigByType, StoreType } from '../data/storeTemplates';
import { getSectionComponent } from './store-sections';

interface StoreBuilderProps {
  storeData: any;
  onBack: () => void;
}

export function StoreBuilder({ storeData, onBack }: StoreBuilderProps) {
  // Initialize sections from storeData.sections (from API) or template defaults
  const getInitialSections = () => {
    // First check if sections exist in storeData
    if (storeData.sections && Array.isArray(storeData.sections) && storeData.sections.length > 0) {
      return storeData.sections;
    }
    // If no sections, use template defaults
    if (storeData.template?.sections && Array.isArray(storeData.template.sections)) {
      return storeData.template.sections;
    }
    // Fallback to empty array
    return [];
  };

  const [activeSections, setActiveSections] = useState(getInitialSections());
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [showSectionLibrary, setShowSectionLibrary] = useState(false);
  
  // Theme state
  const [storeTheme, setStoreTheme] = useState({
    primaryColor: storeData.theme?.primaryColor || storeData.primaryColor || '#4F46E5',
    secondaryColor: storeData.theme?.secondaryColor || storeData.secondaryColor || '#06B6D4',
    fontFamily: storeData.theme?.fontFamily || storeData.fontFamily || 'Inter',
  });

  // Track previous store ID to detect when a new store is loaded
  const prevStoreIdRef = useRef<string | null>(null);

  // Update state when storeData changes (when editing existing store)
  useEffect(() => {
    // Only update if storeData has an ID (existing store)
    if (!storeData.id) return;

    // Check if this is a new store being loaded (different ID)
    const isNewStore = prevStoreIdRef.current !== storeData.id;
    prevStoreIdRef.current = storeData.id;

    // Update sections from storeData (only if new store or sections changed)
    if (isNewStore || (storeData.sections && Array.isArray(storeData.sections) && storeData.sections.length > 0)) {
      if (storeData.sections && Array.isArray(storeData.sections) && storeData.sections.length > 0) {
        setActiveSections(storeData.sections);
      } else if (storeData.template?.sections && Array.isArray(storeData.template.sections)) {
        setActiveSections(storeData.template.sections);
      }
    }

    // Update theme from storeData (only if new store or theme changed)
    if (isNewStore) {
      const newPrimaryColor = storeData.theme?.primaryColor || storeData.primaryColor;
      const newSecondaryColor = storeData.theme?.secondaryColor || storeData.secondaryColor;
      const newFontFamily = storeData.theme?.fontFamily || storeData.fontFamily;

      if (newPrimaryColor || newSecondaryColor || newFontFamily) {
        setStoreTheme({
          primaryColor: newPrimaryColor || '#4F46E5',
          secondaryColor: newSecondaryColor || '#06B6D4',
          fontFamily: newFontFamily || 'Inter',
        });
      }
    }
  }, [storeData.id, storeData.sections, storeData.primaryColor, storeData.secondaryColor, storeData.fontFamily, storeData.template]); // Re-run when store data changes
  
  // Collapsible panel states with localStorage persistence
  const [leftPanelCollapsed, setLeftPanelCollapsed] = useState(() => {
    const saved = localStorage.getItem('storeBuilder_leftPanelCollapsed');
    return saved === 'true';
  });
  const [fullPreviewMode, setFullPreviewMode] = useState(false);

  // Save panel state to localStorage
  useEffect(() => {
    localStorage.setItem('storeBuilder_leftPanelCollapsed', String(leftPanelCollapsed));
  }, [leftPanelCollapsed]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // [ key - toggle left panel
      if (e.key === '[') {
        setLeftPanelCollapsed(prev => !prev);
      }
      // ] key - toggle right panel (close settings)
      if (e.key === ']' && selectedSectionId) {
        setSelectedSectionId(null);
      }
      // F key - toggle full preview
      if (e.key === 'f' || e.key === 'F') {
        setFullPreviewMode(prev => !prev);
      }
      // ESC - close modals/settings
      if (e.key === 'Escape') {
        if (showSectionLibrary) {
          setShowSectionLibrary(false);
        } else if (selectedSectionId) {
          setSelectedSectionId(null);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedSectionId, showSectionLibrary]);

  // Find selected section - use useMemo to prevent stale references
  // Also use a ref to maintain the section even during updates
  const selectedSectionRef = useRef<any>(null);
  
  const selectedSection = useMemo(() => {
    const found = activeSections.find((s: any) => s.id === selectedSectionId);
    if (found) {
      selectedSectionRef.current = found;
      return found;
    }
    // If section not found but we have a ref, return the ref (section is being updated)
    if (selectedSectionId && selectedSectionRef.current?.id === selectedSectionId) {
      return selectedSectionRef.current;
    }
    return null;
  }, [activeSections, selectedSectionId]);
  
  const selectedSectionConfig = selectedSection
    ? getSectionConfigByType(selectedSection.type)
    : null;

  const handleUpdateSection = (sectionId: string, updates: any) => {
    setActiveSections((prevSections) => {
      const updatedSections = prevSections.map((section: any) =>
        section.id === sectionId
          ? { ...section, props: { ...section.props, ...updates } }
          : section
      );
      
      // Ensure the selected section still exists after update
      const sectionStillExists = updatedSections.some((s: any) => s.id === sectionId);
      if (!sectionStillExists && selectedSectionId === sectionId) {
        // If section was removed, clear selection
        setSelectedSectionId(null);
      }
      
      return updatedSections;
    });
  };

  // Image upload handler
  const handleImageUpload = async (file: File, sectionId: string, settingName: string) => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif'];

    // Validate file type
    if (!allowedTypes.includes(file.type)) {
      showToast.error('Invalid image format. Please use PNG, JPG, WEBP, or GIF.');
      return;
    }

    // Validate file size
    if (file.size > maxSize) {
      showToast.error('Image is too large. Maximum size is 10MB.');
      return;
    }

    try {
      showToast.info('Uploading image...');
      
      // Convert to base64
      const reader = new FileReader();
      const base64Image = await new Promise<string>((resolve, reject) => {
        reader.onload = (e) => {
          const result = e.target?.result as string;
          if (result) {
            resolve(result);
          } else {
            reject(new Error('Failed to read file'));
          }
        };
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
      });

      // Update section with base64 image
      handleUpdateSection(sectionId, {
        [settingName]: base64Image,
      });

      showToast.success('Image uploaded successfully!');
    } catch (error) {
      console.error('Image upload error:', error);
      showToast.error('Failed to upload image');
    }
  };

  // Video upload handler
  const handleVideoUpload = async (file: File, sectionId: string, settingName: string) => {
    const maxSize = 50 * 1024 * 1024; // 50MB for videos
    const allowedTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];

    // Validate file type
    if (!allowedTypes.includes(file.type)) {
      showToast.error('Invalid video format. Please use MP4, WebM, or OGG.');
      return;
    }

    // Validate file size
    if (file.size > maxSize) {
      showToast.error('Video is too large. Maximum size is 50MB. Please use a video URL for larger files.');
      return;
    }

    try {
      showToast.info('Uploading video...');
      
      // For videos, use blob URL (more efficient than base64 for large files)
      const videoUrl = URL.createObjectURL(file);
      
      // Update section with blob URL
      handleUpdateSection(sectionId, {
        [settingName]: videoUrl,
      });

      showToast.success('Video uploaded successfully!');
    } catch (error) {
      console.error('Video upload error:', error);
      showToast.error('Failed to upload video');
    }
  };

  const handleToggleSection = (sectionId: string) => {
    setActiveSections(
      activeSections.map((section: any) =>
        section.id === sectionId
          ? { ...section, enabled: !section.enabled }
          : section
      )
    );
  };

  const handleMoveSection = (sectionId: string, direction: 'up' | 'down') => {
    const currentIndex = activeSections.findIndex((s: any) => s.id === sectionId);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= activeSections.length) return;

    const newSections = [...activeSections];
    const temp = newSections[currentIndex];
    newSections[currentIndex] = newSections[newIndex];
    newSections[newIndex] = temp;

    // Update order property
    newSections.forEach((section, index) => {
      section.order = index + 1;
    });

    setActiveSections(newSections);
    showToast.success('Section reordered');
  };

  const handleDeleteSection = (sectionId: string) => {
    if (window.confirm('Are you sure you want to delete this section?')) {
      setActiveSections(activeSections.filter((s: any) => s.id !== sectionId));
      setSelectedSectionId(null);
      showToast.success('Section deleted');
    }
  };

  const handleAddSection = (sectionType: string) => {
    const sectionConfig = getSectionConfigByType(sectionType);
    if (!sectionConfig) return;

    const newSection = {
      id: `section-${Date.now()}`,
      type: sectionType,
      order: activeSections.length + 1,
      enabled: true,
      props: { ...sectionConfig.defaultProps },
    };

    setActiveSections([...activeSections, newSection]);
    setShowSectionLibrary(false);
    showToast.success(`${sectionConfig.name} added!`);
  };

  const handleSave = async () => {
    if (!storeData.id) {
      showToast.error('Store ID not found');
      return;
    }

    try {
      const response = await fetch(`/api/vendor/stores/${storeData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          primaryColor: storeTheme.primaryColor,
          secondaryColor: storeTheme.secondaryColor,
          fontFamily: storeTheme.fontFamily,
          sections: activeSections,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save store');
      }

      const data = await response.json();
      
      // Update local state with saved data
      if (data.store) {
        // Update sections if returned
        if (data.store.sections && Array.isArray(data.store.sections)) {
          setActiveSections(data.store.sections);
        }
        
        // Update theme if returned
        if (data.store.primaryColor || data.store.secondaryColor || data.store.fontFamily) {
          setStoreTheme({
            primaryColor: data.store.primaryColor || storeTheme.primaryColor,
            secondaryColor: data.store.secondaryColor || storeTheme.secondaryColor,
            fontFamily: data.store.fontFamily || storeTheme.fontFamily,
          });
        }
      }

      showToast.success('Store saved successfully!');
    } catch (error: any) {
      console.error('Save store error:', error);
      showToast.error(error.message || 'Failed to save store');
    }
  };

  const handlePublish = async () => {
    if (!storeData.id) {
      showToast.error('Store ID not found');
      return;
    }

    try {
      const response = await fetch(`/api/vendor/stores/${storeData.id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vendorId: storeData.vendorId || '', // Will be validated on server
          status: 'active',
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to publish store');
      }

      const data = await response.json();
      showToast.success(data.message || 'Store published successfully!');
      
      // Update local storeData status
      storeData.status = 'active';
    } catch (error: any) {
      console.error('Publish store error:', error);
      showToast.error(error.message || 'Failed to publish store');
    }
  };

  // Normalize storeType: convert underscore to hyphen and lowercase
  const normalizeStoreType = (type: string | undefined): StoreType => {
    if (!type) return '' as StoreType;
    return type.toLowerCase().replace(/_/g, '-') as StoreType;
  };
  
  const normalizedStoreType = normalizeStoreType(storeData.storeType) || normalizeStoreType(storeData.template?.storeType);
  
  const availableSections = sectionLibrary.filter((section) => {
    const isApplicable = normalizedStoreType && section.applicableFor.includes(normalizedStoreType);
    const alreadyAdded = activeSections.some((s: any) => s.type === section.type);
    return isApplicable && !alreadyAdded;
  });

  return (
    <div className="h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      {/* Top Bar */}
      <div className="bg-white dark:bg-slate-900 border-b sticky top-0 z-50">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={onBack}>
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-xl font-bold">{storeData.name}</h1>
              <p className="text-sm text-muted-foreground">{storeData.url}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Full Preview Toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFullPreviewMode(prev => !prev)}
              title="Full Preview Mode (F)"
            >
              <Maximize className="w-4 h-4" />
            </Button>
            
            {/* Preview Mode Toggle */}
            <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
              <Button
                variant={previewMode === 'desktop' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setPreviewMode('desktop')}
                className={previewMode === 'desktop' ? 'bg-white dark:bg-slate-700' : ''}
              >
                <Monitor className="w-4 h-4" />
              </Button>
              <Button
                variant={previewMode === 'mobile' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setPreviewMode('mobile')}
                className={previewMode === 'mobile' ? 'bg-white dark:bg-slate-700' : ''}
              >
                <Smartphone className="w-4 h-4" />
              </Button>
            </div>

            <Button variant="outline" onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
            <Button
              onClick={handlePublish}
              className="bg-gradient-to-r from-purple-600 to-cyan-600 text-white hover:from-purple-700 hover:to-cyan-700"
            >
              <Power className="w-4 h-4 mr-2" />
              Publish
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Floating Toggle Buttons */}
        {!fullPreviewMode && (
          <>
            {/* Left Panel Toggle */}
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="absolute left-2 top-4 z-40 p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 shadow-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
              onClick={() => setLeftPanelCollapsed(prev => !prev)}
              title={leftPanelCollapsed ? 'Show Sections ([)' : 'Hide Sections ([)'}
            >
              {leftPanelCollapsed ? (
                <ChevronRight className="w-5 h-5" />
              ) : (
                <ChevronLeft className="w-5 h-5" />
              )}
            </motion.button>

            {/* Right Panel Toggle (when section selected) */}
            {selectedSection && (
              <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="absolute right-2 top-4 z-40 p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 shadow-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
                onClick={() => setSelectedSectionId(null)}
                title="Close Settings (])"
              >
                <X className="w-5 h-5" />
              </motion.button>
            )}
          </>
        )}

        {/* Left Sidebar - Section List */}
        <AnimatePresence>
          {!leftPanelCollapsed && !fullPreviewMode && (
            <motion.div
              initial={{ x: -320, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -320, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-64 bg-white dark:bg-slate-900 border-r overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold">Sections</h2>
                  <Button
                    size="sm"
                    onClick={() => setShowSectionLibrary(true)}
                    className="bg-gradient-to-r from-purple-600 to-cyan-600 text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add
                  </Button>
                </div>

                {/* Store Theme Settings */}
                <Card className="mb-6 p-4 bg-gradient-to-br from-indigo-50 to-cyan-50 dark:from-indigo-950 dark:to-cyan-950 border-2 border-indigo-200 dark:border-indigo-800">
                  <div className="flex items-center gap-2 mb-4">
                    <Palette className="w-5 h-5 text-indigo-600" />
                    <h3 className="font-bold">Store Theme</h3>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs mb-1 block">Primary Color</Label>
                      <div className="flex gap-2">
                        <Input
                          type="color"
                          value={storeTheme.primaryColor}
                          onChange={(e) => setStoreTheme({ ...storeTheme, primaryColor: e.target.value })}
                          className="w-14 h-9 p-1 cursor-pointer"
                        />
                        <Input
                          type="text"
                          value={storeTheme.primaryColor}
                          onChange={(e) => setStoreTheme({ ...storeTheme, primaryColor: e.target.value })}
                          className="flex-1 text-xs h-9"
                          placeholder="#4F46E5"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-xs mb-1 block">Secondary Color</Label>
                      <div className="flex gap-2">
                        <Input
                          type="color"
                          value={storeTheme.secondaryColor}
                          onChange={(e) => setStoreTheme({ ...storeTheme, secondaryColor: e.target.value })}
                          className="w-14 h-9 p-1 cursor-pointer"
                        />
                        <Input
                          type="text"
                          value={storeTheme.secondaryColor}
                          onChange={(e) => setStoreTheme({ ...storeTheme, secondaryColor: e.target.value })}
                          className="flex-1 text-xs h-9"
                          placeholder="#06B6D4"
                        />
                      </div>
                    </div>
                    
                    {/* Color Presets */}
                    <div>
                      <Label className="text-xs mb-2 block">Quick Presets</Label>
                      <div className="grid grid-cols-4 gap-2">
                        <button
                          onClick={() => setStoreTheme({ ...storeTheme, primaryColor: '#4F46E5', secondaryColor: '#06B6D4' })}
                          className="w-full h-8 rounded border-2 border-transparent hover:border-gray-400 transition-all"
                          style={{ background: 'linear-gradient(135deg, #4F46E5 50%, #06B6D4 50%)' }}
                          title="Indigo/Cyan"
                        />
                        <button
                          onClick={() => setStoreTheme({ ...storeTheme, primaryColor: '#EC4899', secondaryColor: '#8B5CF6' })}
                          className="w-full h-8 rounded border-2 border-transparent hover:border-gray-400 transition-all"
                          style={{ background: 'linear-gradient(135deg, #EC4899 50%, #8B5CF6 50%)' }}
                          title="Pink/Purple"
                        />
                        <button
                          onClick={() => setStoreTheme({ ...storeTheme, primaryColor: '#10B981', secondaryColor: '#3B82F6' })}
                          className="w-full h-8 rounded border-2 border-transparent hover:border-gray-400 transition-all"
                          style={{ background: 'linear-gradient(135deg, #10B981 50%, #3B82F6 50%)' }}
                          title="Green/Blue"
                        />
                        <button
                          onClick={() => setStoreTheme({ ...storeTheme, primaryColor: '#F59E0B', secondaryColor: '#EF4444' })}
                          className="w-full h-8 rounded border-2 border-transparent hover:border-gray-400 transition-all"
                          style={{ background: 'linear-gradient(135deg, #F59E0B 50%, #EF4444 50%)' }}
                          title="Orange/Red"
                        />
                      </div>
                    </div>
                  </div>
                </Card>

                <div className="space-y-2">
                  {activeSections.map((section: any, index: number) => {
                    const sectionConfig = getSectionConfigByType(section.type);
                    if (!sectionConfig) return null;

                    const isSelected = selectedSectionId === section.id;

                    return (
                      <motion.div
                        key={section.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.03 }}
                      >
                        <Card
                          className={cn(
                            'p-4 cursor-pointer transition-all',
                            isSelected
                              ? 'border-2 border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                              : 'hover:border-purple-300'
                          )}
                          onClick={() => setSelectedSectionId(section.id)}
                        >
                          <div className="flex items-center gap-3">
                            <Switch
                              checked={section.enabled}
                              onCheckedChange={() => handleToggleSection(section.id)}
                              onClick={(e) => e.stopPropagation()}
                            />
                            <div className="flex-1">
                              <p className="font-semibold text-sm">{sectionConfig.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {sectionConfig.category}
                              </p>
                            </div>
                            <div className="flex flex-col gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMoveSection(section.id, 'up');
                                }}
                                disabled={index === 0}
                              >
                                <ChevronUp className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMoveSection(section.id, 'down');
                                }}
                                disabled={index === activeSections.length - 1}
                              >
                                <ChevronDown className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Center - Preview */}
        <div className={cn(
          'flex-1 overflow-y-auto bg-slate-100 dark:bg-slate-950 p-8',
          fullPreviewMode && 'w-full'
        )}>
          <div
            className={cn(
              'mx-auto bg-white dark:bg-slate-900 shadow-2xl overflow-hidden',
              previewMode === 'desktop' ? 'max-w-7xl' : 'max-w-md'
            )}
          >
            {activeSections
              .filter((section: any) => section.enabled)
              .map((section: any) => {
                const SectionComponent = getSectionComponent(section.type);
                if (!SectionComponent) return null;

                return (
                  <div
                    key={section.id}
                    className={cn(
                      'relative group',
                      selectedSectionId === section.id && 'ring-4 ring-purple-500'
                    )}
                    onClick={() => setSelectedSectionId(section.id)}
                  >
                    {selectedSectionId === section.id && (
                      <div className="absolute top-2 right-2 z-10">
                        <Badge className="bg-purple-600 text-white">
                          Editing
                        </Badge>
                      </div>
                    )}
                    <SectionComponent {...section.props} theme={storeTheme} />
                  </div>
                );
              })}

            {activeSections.filter((s: any) => s.enabled).length === 0 && (
              <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                  <Layout className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-lg text-muted-foreground mb-4">
                    No sections enabled
                  </p>
                  <Button onClick={() => setShowSectionLibrary(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Section
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar - Section Settings */}
        {selectedSection && selectedSectionConfig && (
          <AnimatePresence>
            <motion.div 
              initial={{ x: 384, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 384, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-80 bg-white dark:bg-slate-900 border-l overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-bold">{selectedSectionConfig.name}</h2>
                    <p className="text-sm text-muted-foreground">
                      {selectedSectionConfig.description}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteSection(selectedSection.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-6">
                  {selectedSectionConfig.settings.map((setting) => (
                    <div key={setting.name}>
                      <Label className="mb-2 block font-semibold">{setting.label}</Label>
                      
                      {setting.type === 'text' && (
                        <Input
                          value={selectedSection.props[setting.name] || ''}
                          onChange={(e) =>
                            handleUpdateSection(selectedSection.id, {
                              [setting.name]: e.target.value,
                            })
                          }
                        />
                      )}

                      {setting.type === 'textarea' && (
                        <textarea
                          value={selectedSection.props[setting.name] || ''}
                          onChange={(e) =>
                            handleUpdateSection(selectedSection.id, {
                              [setting.name]: e.target.value,
                            })
                          }
                          className="w-full min-h-[100px] px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                        />
                      )}

                      {setting.type === 'url' && (
                        <Input
                          type="url"
                          placeholder="https://example.com"
                          value={selectedSection.props[setting.name] || ''}
                          onChange={(e) =>
                            handleUpdateSection(selectedSection.id, {
                              [setting.name]: e.target.value,
                            })
                          }
                        />
                      )}

                      {setting.type === 'select' && (
                        <Select
                          value={selectedSection.props[setting.name]}
                          onValueChange={(value) =>
                            handleUpdateSection(selectedSection.id, {
                              [setting.name]: value,
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {setting.options?.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}

                      {setting.type === 'toggle' && (
                        <Switch
                          checked={selectedSection.props[setting.name]}
                          onCheckedChange={(checked) =>
                            handleUpdateSection(selectedSection.id, {
                              [setting.name]: checked,
                            })
                          }
                        />
                      )}

                      {setting.type === 'color' && (
                        <div className="flex gap-2">
                          <Input
                            type="color"
                            value={selectedSection.props[setting.name] || '#6366f1'}
                            onChange={(e) =>
                              handleUpdateSection(selectedSection.id, {
                                [setting.name]: e.target.value,
                              })
                            }
                            className="w-20 h-10"
                          />
                          <Input
                            type="text"
                            value={selectedSection.props[setting.name] || '#6366f1'}
                            onChange={(e) =>
                              handleUpdateSection(selectedSection.id, {
                                [setting.name]: e.target.value,
                              })
                            }
                            className="flex-1"
                          />
                        </div>
                      )}

                      {setting.type === 'range' && (
                        <div className="space-y-2">
                          <input
                            type="range"
                            min={setting.min}
                            max={setting.max}
                            step={setting.step}
                            value={selectedSection.props[setting.name] || setting.min}
                            onChange={(e) =>
                              handleUpdateSection(selectedSection.id, {
                                [setting.name]: Number(e.target.value),
                              })
                            }
                            className="w-full"
                          />
                          <div className="flex justify-between text-sm text-muted-foreground">
                            <span>{setting.min}</span>
                            <span className="font-semibold text-foreground">
                              {selectedSection.props[setting.name] || setting.min}
                            </span>
                            <span>{setting.max}</span>
                          </div>
                        </div>
                      )}

                      {setting.type === 'image' && (
                        <div className="space-y-2">
                          <Input
                            type="url"
                            placeholder="Image URL"
                            value={selectedSection.props[setting.name] || ''}
                            onChange={(e) =>
                              handleUpdateSection(selectedSection.id, {
                                [setting.name]: e.target.value,
                              })
                            }
                          />
                          <div className="flex gap-2">
                            <input
                              type="file"
                              accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
                              className="hidden"
                              id={`image-upload-${selectedSection.id}-${setting.name}`}
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  handleImageUpload(file, selectedSection.id, setting.name);
                                }
                                // Reset input so same file can be selected again
                                e.target.value = '';
                              }}
                            />
                            <Button
                              variant="outline"
                              className="w-full"
                              onClick={() => {
                                const input = document.getElementById(`image-upload-${selectedSection.id}-${setting.name}`) as HTMLInputElement;
                                input?.click();
                              }}
                            >
                            <ImageIcon className="w-4 h-4 mr-2" />
                            Upload Image
                          </Button>
                          </div>
                          {selectedSection.props[setting.name] && (
                            <div className="mt-2">
                              <img
                                src={selectedSection.props[setting.name]}
                                alt="Preview"
                                className="w-full h-32 object-cover rounded-lg border"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                        </div>
                      )}
                    </div>
                      )}

                      {setting.type === 'video' && (
                        <div className="space-y-2">
                          <Input
                            type="url"
                            placeholder="Video URL (e.g., https://example.com/video.mp4)"
                            value={selectedSection.props[setting.name] || ''}
                            onChange={(e) =>
                              handleUpdateSection(selectedSection.id, {
                                [setting.name]: e.target.value,
                              })
                            }
                          />
                          <div className="flex gap-2">
                            <input
                              type="file"
                              accept="video/mp4,video/webm,video/ogg,video/quicktime"
                              className="hidden"
                              id={`video-upload-${selectedSection.id}-${setting.name}`}
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  handleVideoUpload(file, selectedSection.id, setting.name);
                                }
                                // Reset input so same file can be selected again
                                e.target.value = '';
                              }}
                            />
                            <Button
                              variant="outline"
                              className="w-full"
                              onClick={() => {
                                const input = document.getElementById(`video-upload-${selectedSection.id}-${setting.name}`) as HTMLInputElement;
                                input?.click();
                              }}
                            >
                              <Video className="w-4 h-4 mr-2" />
                              Upload Video
                            </Button>
                          </div>
                          {selectedSection.props[setting.name] && (
                            <div className="mt-2">
                              <video
                                src={selectedSection.props[setting.name]}
                                controls
                                className="w-full h-48 object-cover rounded-lg border"
                                onError={(e) => {
                                  console.error('Video load error:', e);
                                }}
                              >
                                Your browser does not support the video tag.
                              </video>
                              <p className="text-xs text-muted-foreground mt-1">
                                Note: Large videos should use external URLs for better performance
                              </p>
                            </div>
                          )}
                        </div>
                      )}

                      {setting.type === 'testimonials-array' && (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-sm text-muted-foreground">
                              Manage customer testimonials
                            </p>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const currentTestimonials = selectedSection.props.testimonials || [];
                                const newTestimonial = {
                                  name: 'New Customer',
                                  avatar: '',
                                  rating: 5,
                                  text: 'Great product!',
                                  date: new Date().toISOString().split('T')[0],
                                };
                                handleUpdateSection(selectedSection.id, {
                                  testimonials: [...currentTestimonials, newTestimonial],
                                });
                              }}
                            >
                              <Plus className="w-4 h-4 mr-2" />
                              Add Testimonial
                            </Button>
                          </div>
                          
                          {(selectedSection.props.testimonials || []).map((testimonial: any, index: number) => (
                            <Card key={index} className="p-4 space-y-3">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-semibold">Testimonial {index + 1}</span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    const currentTestimonials = selectedSection.props.testimonials || [];
                                    handleUpdateSection(selectedSection.id, {
                                      testimonials: currentTestimonials.filter((_: any, i: number) => i !== index),
                                    });
                                  }}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                              
                              <div>
                                <Label className="text-xs mb-1 block">Customer Name</Label>
                                <Input
                                  value={testimonial.name || ''}
                                  onChange={(e) => {
                                    const currentTestimonials = selectedSection.props.testimonials || [];
                                    const updated = [...currentTestimonials];
                                    updated[index] = { ...updated[index], name: e.target.value };
                                    handleUpdateSection(selectedSection.id, {
                                      testimonials: updated,
                                    });
                                  }}
                                  placeholder="Customer Name"
                                />
                              </div>
                              
                              <div>
                                <Label className="text-xs mb-1 block">Rating (1-5)</Label>
                                <Select
                                  value={String(testimonial.rating || 5)}
                                  onValueChange={(value) => {
                                    const currentTestimonials = selectedSection.props.testimonials || [];
                                    const updated = [...currentTestimonials];
                                    updated[index] = { ...updated[index], rating: parseInt(value) };
                                    handleUpdateSection(selectedSection.id, {
                                      testimonials: updated,
                                    });
                                  }}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {[1, 2, 3, 4, 5].map((rating) => (
                                      <SelectItem key={rating} value={String(rating)}>
                                        {rating} Star{rating !== 1 ? 's' : ''}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              
                              <div>
                                <Label className="text-xs mb-1 block">Testimonial Text</Label>
                                <textarea
                                  value={testimonial.text || ''}
                                  onChange={(e) => {
                                    const currentTestimonials = selectedSection.props.testimonials || [];
                                    const updated = [...currentTestimonials];
                                    updated[index] = { ...updated[index], text: e.target.value };
                                    handleUpdateSection(selectedSection.id, {
                                      testimonials: updated,
                                    });
                                  }}
                                  placeholder="Customer review text..."
                                  className="w-full min-h-[80px] px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
                                />
                              </div>
                              
                              <div>
                                <Label className="text-xs mb-1 block">Date</Label>
                                <Input
                                  type="date"
                                  value={testimonial.date || ''}
                                  onChange={(e) => {
                                    const currentTestimonials = selectedSection.props.testimonials || [];
                                    const updated = [...currentTestimonials];
                                    updated[index] = { ...updated[index], date: e.target.value };
                                    handleUpdateSection(selectedSection.id, {
                                      testimonials: updated,
                                    });
                                  }}
                                />
                              </div>
                            </Card>
                          ))}
                          
                          {(selectedSection.props.testimonials || []).length === 0 && (
                            <div className="text-center py-8 text-sm text-muted-foreground border-2 border-dashed rounded-lg">
                              No testimonials yet. Click "Add Testimonial" to add one.
                            </div>
                          )}
                        </div>
                      )}

                      {setting.type === 'badges-array' && (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-sm text-muted-foreground">
                              Manage trust badges
                            </p>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const currentBadges = selectedSection.props.badges || [];
                                const newBadge = {
                                  icon: 'shield',
                                  text: 'New Badge',
                                };
                                handleUpdateSection(selectedSection.id, {
                                  badges: [...currentBadges, newBadge],
                                });
                              }}
                            >
                              <Plus className="w-4 h-4 mr-2" />
                              Add Badge
                            </Button>
                          </div>
                          
                          {(selectedSection.props.badges || []).map((badge: any, index: number) => (
                            <Card key={index} className="p-4 space-y-3">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-semibold">Badge {index + 1}</span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    const currentBadges = selectedSection.props.badges || [];
                                    handleUpdateSection(selectedSection.id, {
                                      badges: currentBadges.filter((_: any, i: number) => i !== index),
                                    });
                                  }}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                              
                              <div>
                                <Label className="text-xs mb-1 block">Icon</Label>
                                <Select
                                  value={badge.icon || 'shield'}
                                  onValueChange={(value) => {
                                    const currentBadges = selectedSection.props.badges || [];
                                    const updated = [...currentBadges];
                                    updated[index] = { ...updated[index], icon: value };
                                    handleUpdateSection(selectedSection.id, {
                                      badges: updated,
                                    });
                                  }}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="shield">Shield (Security)</SelectItem>
                                    <SelectItem value="truck">Truck (Shipping)</SelectItem>
                                    <SelectItem value="refresh">Refresh (Returns)</SelectItem>
                                    <SelectItem value="headphones">Headphones (Support)</SelectItem>
                                    <SelectItem value="award">Award (Quality)</SelectItem>
                                    <SelectItem value="lock">Lock (Secure)</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              
                              <div>
                                <Label className="text-xs mb-1 block">Badge Text</Label>
                                <Input
                                  value={badge.text || ''}
                                  onChange={(e) => {
                                    const currentBadges = selectedSection.props.badges || [];
                                    const updated = [...currentBadges];
                                    updated[index] = { ...updated[index], text: e.target.value };
                                    handleUpdateSection(selectedSection.id, {
                                      badges: updated,
                                    });
                                  }}
                                  placeholder="Badge text (e.g., Secure Payment)"
                                />
                              </div>
                            </Card>
                          ))}
                          
                          {(selectedSection.props.badges || []).length === 0 && (
                            <div className="text-center py-8 text-sm text-muted-foreground border-2 border-dashed rounded-lg">
                              No badges yet. Click "Add Badge" to add one.
                            </div>
                          )}
                        </div>
                      )}

                      {setting.type === 'features-array' && (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-sm text-muted-foreground">
                              Manage product features
                            </p>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const currentFeatures = selectedSection.props.features || [];
                                const newFeature = {
                                  icon: 'zap',
                                  title: 'New Feature',
                                  description: 'Feature description',
                                };
                                handleUpdateSection(selectedSection.id, {
                                  features: [...currentFeatures, newFeature],
                                });
                              }}
                            >
                              <Plus className="w-4 h-4 mr-2" />
                              Add Feature
                            </Button>
                          </div>
                          
                          {(selectedSection.props.features || []).map((feature: any, index: number) => (
                            <Card key={index} className="p-4 space-y-3">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-semibold">Feature {index + 1}</span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    const currentFeatures = selectedSection.props.features || [];
                                    handleUpdateSection(selectedSection.id, {
                                      features: currentFeatures.filter((_: any, i: number) => i !== index),
                                    });
                                  }}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                              
                              <div>
                                <Label className="text-xs mb-1 block">Icon</Label>
                                <Select
                                  value={feature.icon || 'zap'}
                                  onValueChange={(value) => {
                                    const currentFeatures = selectedSection.props.features || [];
                                    const updated = [...currentFeatures];
                                    updated[index] = { ...updated[index], icon: value };
                                    handleUpdateSection(selectedSection.id, {
                                      features: updated,
                                    });
                                  }}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="zap">⚡ Lightning (Zap)</SelectItem>
                                    <SelectItem value="shield">🛡️ Shield</SelectItem>
                                    <SelectItem value="heart">❤️ Heart</SelectItem>
                                    <SelectItem value="star">⭐ Star</SelectItem>
                                    <SelectItem value="rocket">🚀 Rocket</SelectItem>
                                    <SelectItem value="award">🏆 Award</SelectItem>
                                    <SelectItem value="trending">📈 Trending</SelectItem>
                                    <SelectItem value="users">👥 Users</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              
                              <div>
                                <Label className="text-xs mb-1 block">Title</Label>
                                <Input
                                  value={feature.title || ''}
                                  onChange={(e) => {
                                    const currentFeatures = selectedSection.props.features || [];
                                    const updated = [...currentFeatures];
                                    updated[index] = { ...updated[index], title: e.target.value };
                                    handleUpdateSection(selectedSection.id, {
                                      features: updated,
                                    });
                                  }}
                                  placeholder="Feature title..."
                                  className="w-full"
                                />
                              </div>
                              
                              <div>
                                <Label className="text-xs mb-1 block">Description</Label>
                                <textarea
                                  value={feature.description || ''}
                                  onChange={(e) => {
                                    const currentFeatures = selectedSection.props.features || [];
                                    const updated = [...currentFeatures];
                                    updated[index] = { ...updated[index], description: e.target.value };
                                    handleUpdateSection(selectedSection.id, {
                                      features: updated,
                                    });
                                  }}
                                  placeholder="Feature description..."
                                  className="w-full min-h-[80px] px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
                                />
                              </div>
                            </Card>
                          ))}
                          
                          {(selectedSection.props.features || []).length === 0 && (
                            <div className="text-center py-8 text-sm text-muted-foreground border-2 border-dashed rounded-lg">
                              No features yet. Click "Add Feature" to add one.
                            </div>
                          )}
                        </div>
                      )}

                      {setting.type === 'faqs-array' && (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-sm text-muted-foreground">
                              Manage FAQ items
                            </p>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const currentFAQs = selectedSection.props.faqs || [];
                                const newFAQ = {
                                  question: 'New Question?',
                                  answer: 'Answer to the question...',
                                };
                                handleUpdateSection(selectedSection.id, {
                                  faqs: [...currentFAQs, newFAQ],
                                });
                              }}
                            >
                              <Plus className="w-4 h-4 mr-2" />
                              Add FAQ
                            </Button>
                          </div>
                          
                          {(selectedSection.props.faqs || []).map((faq: any, index: number) => (
                            <Card key={index} className="p-4 space-y-3">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-semibold">FAQ {index + 1}</span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    const currentFAQs = selectedSection.props.faqs || [];
                                    handleUpdateSection(selectedSection.id, {
                                      faqs: currentFAQs.filter((_: any, i: number) => i !== index),
                                    });
                                  }}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                              
                              <div>
                                <Label className="text-xs mb-1 block">Question</Label>
                                <Input
                                  value={faq.question || ''}
                                  onChange={(e) => {
                                    const currentFAQs = selectedSection.props.faqs || [];
                                    const updated = [...currentFAQs];
                                    updated[index] = { ...updated[index], question: e.target.value };
                                    handleUpdateSection(selectedSection.id, {
                                      faqs: updated,
                                    });
                                  }}
                                  placeholder="Enter question..."
                                  className="w-full"
                                />
                              </div>
                              
                              <div>
                                <Label className="text-xs mb-1 block">Answer</Label>
                                <textarea
                                  value={faq.answer || ''}
                                  onChange={(e) => {
                                    const currentFAQs = selectedSection.props.faqs || [];
                                    const updated = [...currentFAQs];
                                    updated[index] = { ...updated[index], answer: e.target.value };
                                    handleUpdateSection(selectedSection.id, {
                                      faqs: updated,
                                    });
                                  }}
                                  placeholder="Enter answer..."
                                  className="w-full min-h-[100px] px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
                                />
                              </div>
                            </Card>
                          ))}
                          
                          {(selectedSection.props.faqs || []).length === 0 && (
                            <div className="text-center py-8 text-sm text-muted-foreground border-2 border-dashed rounded-lg">
                              No FAQs yet. Click "Add FAQ" to add one.
                            </div>
                          )}
                        </div>
                      )}

                      {setting.type === 'stats-array' && (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-sm text-muted-foreground">
                              Manage statistics
                            </p>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const currentStats = selectedSection.props.stats || [];
                                const newStat = {
                                  number: '100',
                                  suffix: '+',
                                  label: 'New Stat',
                                  icon: 'users',
                                };
                                handleUpdateSection(selectedSection.id, {
                                  stats: [...currentStats, newStat],
                                });
                              }}
                            >
                              <Plus className="w-4 h-4 mr-2" />
                              Add Stat
                            </Button>
                          </div>
                          
                          {(selectedSection.props.stats || []).map((stat: any, index: number) => (
                            <Card key={index} className="p-4 space-y-3">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-semibold">Stat {index + 1}</span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    const currentStats = selectedSection.props.stats || [];
                                    handleUpdateSection(selectedSection.id, {
                                      stats: currentStats.filter((_: any, i: number) => i !== index),
                                    });
                                  }}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                              
                              <div>
                                <Label className="text-xs mb-1 block">Icon</Label>
                                <Select
                                  value={stat.icon || 'users'}
                                  onValueChange={(value) => {
                                    const currentStats = selectedSection.props.stats || [];
                                    const updated = [...currentStats];
                                    updated[index] = { ...updated[index], icon: value };
                                    handleUpdateSection(selectedSection.id, {
                                      stats: updated,
                                    });
                                  }}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="users">👥 Users</SelectItem>
                                    <SelectItem value="package">📦 Package</SelectItem>
                                    <SelectItem value="headphones">🎧 Headphones</SelectItem>
                                    <SelectItem value="heart">❤️ Heart</SelectItem>
                                    <SelectItem value="trending">📈 Trending</SelectItem>
                                    <SelectItem value="award">🏆 Award</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              
                              <div>
                                <Label className="text-xs mb-1 block">Number</Label>
                                <Input
                                  value={stat.number || ''}
                                  onChange={(e) => {
                                    const currentStats = selectedSection.props.stats || [];
                                    const updated = [...currentStats];
                                    updated[index] = { ...updated[index], number: e.target.value };
                                    handleUpdateSection(selectedSection.id, {
                                      stats: updated,
                                    });
                                  }}
                                  placeholder="e.g., 10000"
                                  className="w-full"
                                />
                              </div>
                              
                              <div>
                                <Label className="text-xs mb-1 block">Suffix (optional)</Label>
                                <Input
                                  value={stat.suffix || ''}
                                  onChange={(e) => {
                                    const currentStats = selectedSection.props.stats || [];
                                    const updated = [...currentStats];
                                    updated[index] = { ...updated[index], suffix: e.target.value };
                                    handleUpdateSection(selectedSection.id, {
                                      stats: updated,
                                    });
                                  }}
                                  placeholder="e.g., +, %, /7"
                                  className="w-full"
                                />
                              </div>
                              
                              <div>
                                <Label className="text-xs mb-1 block">Label</Label>
                                <Input
                                  value={stat.label || ''}
                                  onChange={(e) => {
                                    const currentStats = selectedSection.props.stats || [];
                                    const updated = [...currentStats];
                                    updated[index] = { ...updated[index], label: e.target.value };
                                    handleUpdateSection(selectedSection.id, {
                                      stats: updated,
                                    });
                                  }}
                                  placeholder="e.g., Happy Customers"
                                  className="w-full"
                                />
                              </div>
                            </Card>
                          ))}
                          
                          {(selectedSection.props.stats || []).length === 0 && (
                            <div className="text-center py-8 text-sm text-muted-foreground border-2 border-dashed rounded-lg">
                              No statistics yet. Click "Add Stat" to add one.
                            </div>
                          )}
                        </div>
                      )}

                      {setting.type === 'collections-array' && (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-sm text-muted-foreground">
                              Manage collections
                            </p>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const currentCollections = selectedSection.props.collections || [];
                                const newCollection = {
                                  name: 'New Collection',
                                  description: 'Collection description',
                                  image: '',
                                  badge: '',
                                  itemCount: 0,
                                };
                                handleUpdateSection(selectedSection.id, {
                                  collections: [...currentCollections, newCollection],
                                });
                              }}
                            >
                              <Plus className="w-4 h-4 mr-2" />
                              Add Collection
                            </Button>
                          </div>
                          
                          {(selectedSection.props.collections || []).map((collection: any, index: number) => (
                            <Card key={index} className="p-4 space-y-3">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-semibold">Collection {index + 1}</span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    const currentCollections = selectedSection.props.collections || [];
                                    handleUpdateSection(selectedSection.id, {
                                      collections: currentCollections.filter((_: any, i: number) => i !== index),
                                    });
                                  }}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                              
                              <div>
                                <Label className="text-xs mb-1 block">Collection Name</Label>
                                <Input
                                  value={collection.name || ''}
                                  onChange={(e) => {
                                    const currentCollections = selectedSection.props.collections || [];
                                    const updated = [...currentCollections];
                                    updated[index] = { ...updated[index], name: e.target.value };
                                    handleUpdateSection(selectedSection.id, {
                                      collections: updated,
                                    });
                                  }}
                                  placeholder="e.g., Summer Collection"
                                  className="w-full"
                                />
                              </div>
                              
                              <div>
                                <Label className="text-xs mb-1 block">Description</Label>
                                <Input
                                  value={collection.description || ''}
                                  onChange={(e) => {
                                    const currentCollections = selectedSection.props.collections || [];
                                    const updated = [...currentCollections];
                                    updated[index] = { ...updated[index], description: e.target.value };
                                    handleUpdateSection(selectedSection.id, {
                                      collections: updated,
                                    });
                                  }}
                                  placeholder="e.g., Hot deals for summer"
                                  className="w-full"
                                />
                              </div>
                              
                              <div>
                                <Label className="text-xs mb-1 block">Image URL</Label>
                                <Input
                                  type="url"
                                  value={collection.image || ''}
                                  onChange={(e) => {
                                    const currentCollections = selectedSection.props.collections || [];
                                    const updated = [...currentCollections];
                                    updated[index] = { ...updated[index], image: e.target.value };
                                    handleUpdateSection(selectedSection.id, {
                                      collections: updated,
                                    });
                                  }}
                                  placeholder="https://example.com/image.jpg"
                                  className="w-full"
                                />
                                <div className="flex gap-2 mt-2">
                                  <input
                                    type="file"
                                    accept="image/png,image/jpeg,image/jpg,image/webp"
                                    className="hidden"
                                    id={`collection-image-upload-${selectedSection.id}-${index}`}
                                    onChange={async (e) => {
                                      const file = e.target.files?.[0];
                                      if (file) {
                                        const maxSize = 10 * 1024 * 1024; // 10MB
                                        const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
                                        
                                        if (!allowedTypes.includes(file.type)) {
                                          showToast.error('Invalid image format. Please use PNG, JPG, or WEBP.');
                                          e.target.value = '';
                                          return;
                                        }
                                        
                                        if (file.size > maxSize) {
                                          showToast.error('Image is too large. Maximum size is 10MB.');
                                          e.target.value = '';
                                          return;
                                        }
                                        
                                        try {
                                          showToast.info('Uploading image...');
                                          const reader = new FileReader();
                                          const base64Image = await new Promise<string>((resolve, reject) => {
                                            reader.onload = (event) => {
                                              const result = event.target?.result as string;
                                              if (result) resolve(result);
                                              else reject(new Error('Failed to read file'));
                                            };
                                            reader.onerror = () => reject(new Error('Failed to read file'));
                                            reader.readAsDataURL(file);
                                          });
                                          
                                          const currentCollections = selectedSection.props.collections || [];
                                          const updated = [...currentCollections];
                                          updated[index] = { ...updated[index], image: base64Image };
                                          handleUpdateSection(selectedSection.id, {
                                            collections: updated,
                                          });
                                          
                                          showToast.success('Image uploaded successfully!');
                                        } catch (error) {
                                          console.error('Image upload error:', error);
                                          showToast.error('Failed to upload image');
                                        }
                                      }
                                      e.target.value = '';
                                    }}
                                  />
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full"
                                    onClick={() => {
                                      const input = document.getElementById(`collection-image-upload-${selectedSection.id}-${index}`) as HTMLInputElement;
                                      input?.click();
                                    }}
                                  >
                                    <ImageIcon className="w-4 h-4 mr-2" />
                                    Upload Image
                                  </Button>
                                </div>
                                {collection.image && (
                                  <div className="mt-2">
                                    <img
                                      src={collection.image}
                                      alt="Preview"
                                      className="w-full h-32 object-cover rounded-lg border"
                                      onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                      }}
                                    />
                                  </div>
                                )}
                              </div>
                              
                              <div>
                                <Label className="text-xs mb-1 block">Badge (optional)</Label>
                                <Input
                                  value={collection.badge || ''}
                                  onChange={(e) => {
                                    const currentCollections = selectedSection.props.collections || [];
                                    const updated = [...currentCollections];
                                    updated[index] = { ...updated[index], badge: e.target.value };
                                    handleUpdateSection(selectedSection.id, {
                                      collections: updated,
                                    });
                                  }}
                                  placeholder="e.g., New, Sale, Popular"
                                  className="w-full"
                                />
                              </div>
                              
                              <div>
                                <Label className="text-xs mb-1 block">Item Count (optional)</Label>
                                <Input
                                  type="number"
                                  value={collection.itemCount || ''}
                                  onChange={(e) => {
                                    const currentCollections = selectedSection.props.collections || [];
                                    const updated = [...currentCollections];
                                    updated[index] = { ...updated[index], itemCount: parseInt(e.target.value) || 0 };
                                    handleUpdateSection(selectedSection.id, {
                                      collections: updated,
                                    });
                                  }}
                                  placeholder="e.g., 48"
                                  className="w-full"
                                />
                              </div>
                            </Card>
                          ))}
                          
                          {(selectedSection.props.collections || []).length === 0 && (
                            <div className="text-center py-8 text-sm text-muted-foreground border-2 border-dashed rounded-lg">
                              No collections yet. Click "Add Collection" to add one.
                            </div>
                          )}
                        </div>
                      )}

                      {setting.type === 'features-list' && (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-sm text-muted-foreground">
                              Manage feature rows
                            </p>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const currentFeatures = selectedSection.props.featureRows || [];
                                handleUpdateSection(selectedSection.id, {
                                  featureRows: [...currentFeatures, 'New Feature'],
                                });
                              }}
                            >
                              <Plus className="w-4 h-4 mr-2" />
                              Add Feature
                            </Button>
                          </div>
                          
                          {(selectedSection.props.featureRows || []).map((feature: string, index: number) => (
                            <Card key={index} className="p-4">
                              <div className="flex items-center gap-2">
                                <Input
                                  value={feature}
                                  onChange={(e) => {
                                    const currentFeatures = selectedSection.props.featureRows || [];
                                    const updated = [...currentFeatures];
                                    updated[index] = e.target.value;
                                    handleUpdateSection(selectedSection.id, {
                                      featureRows: updated,
                                    });
                                  }}
                                  placeholder="Feature name..."
                                  className="flex-1"
                                />
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    const currentFeatures = selectedSection.props.featureRows || [];
                                    handleUpdateSection(selectedSection.id, {
                                      featureRows: currentFeatures.filter((_: any, i: number) => i !== index),
                                    });
                                  }}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </Card>
                          ))}
                          
                          {(selectedSection.props.featureRows || []).length === 0 && (
                            <div className="text-center py-8 text-sm text-muted-foreground border-2 border-dashed rounded-lg">
                              No features yet. Click "Add Feature" to add one.
                            </div>
                          )}
                        </div>
                      )}

                      {setting.type === 'comparison-columns' && (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-sm text-muted-foreground">
                              Manage comparison columns
                            </p>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const currentColumns = selectedSection.props.columns || [];
                                const featureRows = selectedSection.props.featureRows || [];
                                const newFeatures: Record<string, boolean> = {};
                                featureRows.forEach((_: any, idx: number) => {
                                  newFeatures[`feature${idx + 1}`] = false;
                                });
                                const newColumn = {
                                  name: 'New Column',
                                  features: newFeatures,
                                  isHighlighted: false,
                                };
                                handleUpdateSection(selectedSection.id, {
                                  columns: [...currentColumns, newColumn],
                                });
                              }}
                            >
                              <Plus className="w-4 h-4 mr-2" />
                              Add Column
                            </Button>
                          </div>
                          
                          {(selectedSection.props.columns || []).map((column: any, index: number) => (
                            <Card key={index} className="p-4 space-y-3">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-semibold">Column {index + 1}</span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    const currentColumns = selectedSection.props.columns || [];
                                    handleUpdateSection(selectedSection.id, {
                                      columns: currentColumns.filter((_: any, i: number) => i !== index),
                                    });
                                  }}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                              
                              <div>
                                <Label className="text-xs mb-1 block">Column Name</Label>
                                <Input
                                  value={column.name || ''}
                                  onChange={(e) => {
                                    const currentColumns = selectedSection.props.columns || [];
                                    const updated = [...currentColumns];
                                    updated[index] = { ...updated[index], name: e.target.value };
                                    handleUpdateSection(selectedSection.id, {
                                      columns: updated,
                                    });
                                  }}
                                  placeholder="e.g., Our Product"
                                  className="w-full"
                                />
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  checked={column.isHighlighted || false}
                                  onChange={(e) => {
                                    const currentColumns = selectedSection.props.columns || [];
                                    const updated = [...currentColumns];
                                    updated[index] = { ...updated[index], isHighlighted: e.target.checked };
                                    handleUpdateSection(selectedSection.id, {
                                      columns: updated,
                                    });
                                  }}
                                  className="w-4 h-4"
                                />
                                <Label className="text-xs">Highlight this column (Best Choice badge)</Label>
                              </div>
                              
                              <div>
                                <Label className="text-xs mb-2 block">Features</Label>
                                <div className="space-y-2">
                                  {(selectedSection.props.featureRows || []).map((feature: string, featureIndex: number) => {
                                    const featureKey = `feature${featureIndex + 1}`;
                                    const hasFeature = column.features?.[featureKey] || false;
                                    return (
                                      <div key={featureIndex} className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-800 rounded">
                                        <input
                                          type="checkbox"
                                          checked={hasFeature}
                                          onChange={(e) => {
                                            const currentColumns = selectedSection.props.columns || [];
                                            const updated = [...currentColumns];
                                            if (!updated[index].features) {
                                              updated[index].features = {};
                                            }
                                            updated[index].features[featureKey] = e.target.checked;
                                            handleUpdateSection(selectedSection.id, {
                                              columns: updated,
                                            });
                                          }}
                                          className="w-4 h-4"
                                        />
                                        <Label className="text-xs flex-1">{feature}</Label>
                                      </div>
                                    );
                                  })}
                                </div>
                                {(selectedSection.props.featureRows || []).length === 0 && (
                                  <p className="text-xs text-muted-foreground mt-2">
                                    Add features first in the "Features" section above
                                  </p>
                                )}
                              </div>
                            </Card>
                          ))}
                          
                          {(selectedSection.props.columns || []).length === 0 && (
                            <div className="text-center py-8 text-sm text-muted-foreground border-2 border-dashed rounded-lg">
                              No columns yet. Click "Add Column" to add one.
                            </div>
                          )}
                        </div>
                      )}

                      {setting.type === 'steps-array' && (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-sm text-muted-foreground">
                              Manage process steps
                            </p>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const currentSteps = selectedSection.props.steps || [];
                                const newStep = {
                                  title: 'New Step',
                                  description: 'Step description',
                                };
                                handleUpdateSection(selectedSection.id, {
                                  steps: [...currentSteps, newStep],
                                });
                              }}
                            >
                              <Plus className="w-4 h-4 mr-2" />
                              Add Step
                            </Button>
                          </div>
                          
                          {(selectedSection.props.steps || []).map((step: any, index: number) => (
                            <Card key={index} className="p-4 space-y-3">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-cyan-600 flex items-center justify-center text-white font-bold text-sm">
                                    {index + 1}
                                  </div>
                                  <span className="text-sm font-semibold">Step {index + 1}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  {index > 0 && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => {
                                        const currentSteps = selectedSection.props.steps || [];
                                        const updated = [...currentSteps];
                                        const temp = updated[index];
                                        updated[index] = updated[index - 1];
                                        updated[index - 1] = temp;
                                        handleUpdateSection(selectedSection.id, {
                                          steps: updated,
                                        });
                                      }}
                                      className="text-xs"
                                    >
                                      <ChevronUp className="w-4 h-4" />
                                    </Button>
                                  )}
                                  {index < (selectedSection.props.steps || []).length - 1 && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => {
                                        const currentSteps = selectedSection.props.steps || [];
                                        const updated = [...currentSteps];
                                        const temp = updated[index];
                                        updated[index] = updated[index + 1];
                                        updated[index + 1] = temp;
                                        handleUpdateSection(selectedSection.id, {
                                          steps: updated,
                                        });
                                      }}
                                      className="text-xs"
                                    >
                                      <ChevronDown className="w-4 h-4" />
                                    </Button>
                                  )}
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      const currentSteps = selectedSection.props.steps || [];
                                      handleUpdateSection(selectedSection.id, {
                                        steps: currentSteps.filter((_: any, i: number) => i !== index),
                                      });
                                    }}
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                              
                              <div>
                                <Label className="text-xs mb-1 block">Step Title</Label>
                                <Input
                                  value={step.title || ''}
                                  onChange={(e) => {
                                    const currentSteps = selectedSection.props.steps || [];
                                    const updated = [...currentSteps];
                                    updated[index] = { ...updated[index], title: e.target.value };
                                    handleUpdateSection(selectedSection.id, {
                                      steps: updated,
                                    });
                                  }}
                                  placeholder="e.g., Order, Receive, Enjoy"
                                  className="w-full"
                                />
                              </div>
                              
                              <div>
                                <Label className="text-xs mb-1 block">Description</Label>
                                <textarea
                                  value={step.description || ''}
                                  onChange={(e) => {
                                    const currentSteps = selectedSection.props.steps || [];
                                    const updated = [...currentSteps];
                                    updated[index] = { ...updated[index], description: e.target.value };
                                    handleUpdateSection(selectedSection.id, {
                                      steps: updated,
                                    });
                                  }}
                                  placeholder="e.g., Place your order in seconds"
                                  className="w-full min-h-[80px] px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
                                />
                              </div>
                            </Card>
                          ))}
                          
                          {(selectedSection.props.steps || []).length === 0 && (
                            <div className="text-center py-8 text-sm text-muted-foreground border-2 border-dashed rounded-lg">
                              No steps yet. Click "Add Step" to add one.
                            </div>
                          )}
                        </div>
                      )}

                      {setting.type === 'links-array' && (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-sm text-muted-foreground">
                              Manage {setting.label.toLowerCase()}
                            </p>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const currentLinks = selectedSection.props[setting.name] || [];
                                const newLink = {
                                  label: 'New Link',
                                  url: '/',
                                };
                                handleUpdateSection(selectedSection.id, {
                                  [setting.name]: [...currentLinks, newLink],
                                });
                              }}
                            >
                              <Plus className="w-4 h-4 mr-2" />
                              Add Link
                            </Button>
                          </div>
                          
                          {(selectedSection.props[setting.name] || []).map((link: any, index: number) => (
                            <Card key={index} className="p-4 space-y-3">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-semibold">Link {index + 1}</span>
                                <div className="flex items-center gap-2">
                                  {index > 0 && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => {
                                        const currentLinks = selectedSection.props[setting.name] || [];
                                        const updated = [...currentLinks];
                                        const temp = updated[index];
                                        updated[index] = updated[index - 1];
                                        updated[index - 1] = temp;
                                        handleUpdateSection(selectedSection.id, {
                                          [setting.name]: updated,
                                        });
                                      }}
                                      className="text-xs"
                                    >
                                      <ChevronUp className="w-4 h-4" />
                                    </Button>
                                  )}
                                  {index < (selectedSection.props[setting.name] || []).length - 1 && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => {
                                        const currentLinks = selectedSection.props[setting.name] || [];
                                        const updated = [...currentLinks];
                                        const temp = updated[index];
                                        updated[index] = updated[index + 1];
                                        updated[index + 1] = temp;
                                        handleUpdateSection(selectedSection.id, {
                                          [setting.name]: updated,
                                        });
                                      }}
                                      className="text-xs"
                                    >
                                      <ChevronDown className="w-4 h-4" />
                                    </Button>
                                  )}
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      const currentLinks = selectedSection.props[setting.name] || [];
                                      handleUpdateSection(selectedSection.id, {
                                        [setting.name]: currentLinks.filter((_: any, i: number) => i !== index),
                                      });
                                    }}
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                              
                              <div>
                                <Label className="text-xs mb-1 block">Link Label</Label>
                                <Input
                                  value={link.label || ''}
                                  onChange={(e) => {
                                    const currentLinks = selectedSection.props[setting.name] || [];
                                    const updated = [...currentLinks];
                                    updated[index] = { ...updated[index], label: e.target.value };
                                    handleUpdateSection(selectedSection.id, {
                                      [setting.name]: updated,
                                    });
                                  }}
                                  placeholder="e.g., About Us, FAQ"
                                  className="w-full"
                                />
                              </div>
                              
                              <div>
                                <Label className="text-xs mb-1 block">Link URL</Label>
                                <Input
                                  type="url"
                                  value={link.url || ''}
                                  onChange={(e) => {
                                    const currentLinks = selectedSection.props[setting.name] || [];
                                    const updated = [...currentLinks];
                                    updated[index] = { ...updated[index], url: e.target.value };
                                    handleUpdateSection(selectedSection.id, {
                                      [setting.name]: updated,
                                    });
                                  }}
                                  placeholder="e.g., /about, /faq, https://example.com"
                                  className="w-full"
                                />
                              </div>
                            </Card>
                          ))}
                          
                          {(selectedSection.props[setting.name] || []).length === 0 && (
                            <div className="text-center py-8 text-sm text-muted-foreground border-2 border-dashed rounded-lg">
                              No links yet. Click "Add Link" to add one.
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      {/* Section Library Modal */}
      <AnimatePresence>
        {showSectionLibrary && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowSectionLibrary(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-cyan-600 text-white p-6 rounded-t-2xl z-10">
                <h2 className="text-2xl font-bold">Add Section</h2>
                <p className="text-purple-100">
                  Choose from {availableSections.length} available sections
                </p>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {availableSections.map((section) => (
                    <Card
                      key={section.id}
                      className="p-4 cursor-pointer hover:border-purple-500 hover:shadow-lg transition-all"
                      onClick={() => handleAddSection(section.type)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500">
                          <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold mb-1">{section.name}</h3>
                          <p className="text-sm text-muted-foreground mb-2">
                            {section.description}
                          </p>
                          <Badge variant="outline" className="text-xs">
                            {section.category}
                          </Badge>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}