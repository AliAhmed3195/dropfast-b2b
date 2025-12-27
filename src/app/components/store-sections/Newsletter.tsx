'use client'

import React, { useState } from 'react';
import { Mail } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

interface NewsletterProps {
  heading?: string;
  subheading?: string;
  buttonText?: string;
  backgroundColor?: string;
}

export function Newsletter({
  heading = 'Stay Updated',
  subheading = 'Subscribe to get special offers and updates',
  buttonText = 'Subscribe',
  backgroundColor = '#6366f1',
}: NewsletterProps) {
  const [email, setEmail] = useState('');

  return (
    <section
      className="py-20 px-6"
      style={{ backgroundColor }}
    >
      <div className="w-full mx-auto px-4 text-center">
        <div className="mb-6">
          <Mail className="w-12 h-12 mx-auto mb-4 text-white opacity-90" />
          <h2 className="text-white mb-3">{heading}</h2>
          <p className="text-white/80">{subheading}</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 bg-white/90 border-0"
          />
          <Button className="bg-white text-purple-600 hover:bg-white/90 font-semibold">
            {buttonText}
          </Button>
        </div>
      </div>
    </section>
  );
}