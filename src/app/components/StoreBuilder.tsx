'use client'

import React, { useState, useEffect } from 'react';
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
import { toast } from 'sonner';
import { cn } from './ui/utils';
import { sectionLibrary, getSectionConfigByType, StoreType } from '../data/storeTemplates';
import { getSectionComponent } from './store-sections';

interface StoreBuilderProps {
  storeData: any;
  onBack: () => void;
}

export function StoreBuilder({ storeData, onBack }: StoreBuilderProps) {
  const [activeSections, setActiveSections] = useState(
    storeData.template?.sections || []
  );
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [showSectionLibrary, setShowSectionLibrary] = useState(false);
  
  // Theme state
  const [storeTheme, setStoreTheme] = useState({
    primaryColor: storeData.theme?.primaryColor || '#4F46E5',
    secondaryColor: storeData.theme?.secondaryColor || '#06B6D4',
    fontFamily: storeData.theme?.fontFamily || 'Inter',
  });
  
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

  const selectedSection = activeSections.find((s: any) => s.id === selectedSectionId);
  const selectedSectionConfig = selectedSection
    ? getSectionConfigByType(selectedSection.type)
    : null;

  const handleUpdateSection = (sectionId: string, updates: any) => {
    setActiveSections(
      activeSections.map((section: any) =>
        section.id === sectionId
          ? { ...section, props: { ...section.props, ...updates } }
          : section
      )
    );
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
    toast.success('Section reordered');
  };

  const handleDeleteSection = (sectionId: string) => {
    if (window.confirm('Are you sure you want to delete this section?')) {
      setActiveSections(activeSections.filter((s: any) => s.id !== sectionId));
      setSelectedSectionId(null);
      toast.success('Section deleted');
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
    toast.success(`${sectionConfig.name} added!`);
  };

  const handleSave = () => {
    console.log('Saving store configuration:', {
      storeData,
      sections: activeSections,
      theme: storeTheme,
    });
    
    // In real app, this would update database
    // For now, update storeData in memory
    storeData.theme = storeTheme;
    storeData.template.sections = activeSections;
    
    toast.success('Store saved successfully!', {
      description: 'Your theme colors and sections have been saved',
    });
  };

  const handlePublish = () => {
    toast.success('Store published!', {
      description: 'Your store is now live',
    });
  };

  const availableSections = sectionLibrary.filter(
    (section) =>
      section.applicableFor.includes(storeData.storeType as StoreType) &&
      !activeSections.some((s: any) => s.type === section.type)
  );

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
                          <Button variant="outline" className="w-full">
                            <ImageIcon className="w-4 h-4 mr-2" />
                            Upload Image
                          </Button>
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