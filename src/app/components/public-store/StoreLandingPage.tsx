'use client'

import React from 'react';
import { motion } from 'motion/react';
import { getSectionComponent } from '../store-sections';

interface StoreLandingPageProps {
  storeConfig: {
    name: string;
    slug: string;
    template: 'modern' | 'classic' | 'minimal' | 'bold';
    theme: {
      primaryColor: string;
      secondaryColor: string;
      fontFamily: string;
    };
    sections: Array<{
      id: string;
      type: string;
      enabled: boolean;
      order: number;
      props: any;
    }>;
  };
  onProductClick?: (productId: string) => void;
}

export function StoreLandingPage({ storeConfig, onProductClick }: StoreLandingPageProps) {
  // Filter only enabled sections and sort by order
  const enabledSections = storeConfig.sections
    .filter((section) => section.enabled)
    .sort((a, b) => a.order - b.order);

  return (
    <div className="min-h-screen bg-white">
      {/* Render sections dynamically */}
      {enabledSections.map((section, index) => {
        const SectionComponent = getSectionComponent(section.type);
        
        if (!SectionComponent) {
          console.warn(`Section type "${section.type}" not found`);
          return null;
        }

        return (
          <motion.div
            key={section.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <SectionComponent 
              {...section.props} 
              theme={storeConfig.theme}
              onProductClick={onProductClick}
            />
          </motion.div>
        );
      })}
    </div>
  );
}