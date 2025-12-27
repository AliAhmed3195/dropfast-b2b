'use client'

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { cn } from '../ui/utils';

interface AnnouncementBarProps {
  text?: string;
  backgroundColor?: string;
  textColor?: string;
  link?: string;
  isCloseable?: boolean;
  isSticky?: boolean;
}

export function AnnouncementBar({
  text = 'Free Shipping on Orders Over $50! 🚚',
  backgroundColor = '#6366f1',
  textColor = '#ffffff',
  link = '',
  isCloseable = true,
  isSticky = true,
}: AnnouncementBarProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const content = (
    <div
      className={cn(
        'w-full py-3 px-6 flex items-center justify-center relative z-50',
        isSticky && 'sticky top-0'
      )}
      style={{ backgroundColor, color: textColor }}
    >
      <div className="text-center font-medium text-sm">
        {text}
      </div>
      
      {isCloseable && (
        <button
          onClick={() => setIsVisible(false)}
          className="absolute right-4 hover:opacity-70 transition-opacity"
          aria-label="Close announcement"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );

  if (link) {
    return (
      <a href={link} className="block hover:opacity-90 transition-opacity">
        {content}
      </a>
    );
  }

  return content;
}
