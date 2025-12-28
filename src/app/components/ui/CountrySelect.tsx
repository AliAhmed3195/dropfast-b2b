/**
 * Reusable Country Select Component
 * 
 * Centralized country dropdown that can be used anywhere in the application.
 * 
 * Usage:
 * import { CountrySelect } from '@/app/components/ui/CountrySelect';
 * 
 * <CountrySelect
 *   value={country}
 *   onChange={(value) => setCountry(value)}
 *   required={true}
 * />
 */

'use client'

import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { countries } from '../../../data/countries';
import { cn } from './utils';

interface CountrySelectProps {
  value?: string;
  onChange: (value: string) => void;
  required?: boolean;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
}

export function CountrySelect({
  value,
  onChange,
  required = false,
  className,
  placeholder = 'Select country',
  disabled = false,
  error = false,
}: CountrySelectProps) {
  return (
    <Select
      value={value}
      onValueChange={onChange}
      disabled={disabled}
    >
      <SelectTrigger
        className={cn(
          'h-11',
          error && 'border-red-500',
          className
        )}
      >
        <SelectValue placeholder={placeholder}>
          {value && countries.find(c => c.name === value) && (
            <span>
              {countries.find(c => c.name === value)?.flag} {value}
            </span>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {countries.map((country) => (
          <SelectItem key={country.code} value={country.name}>
            {country.flag} {country.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

