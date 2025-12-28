/**
 * Reusable Currency Select Component
 * 
 * Centralized currency dropdown that can be used anywhere in the application.
 * 
 * Usage:
 * import { CurrencySelect } from '@/app/components/ui/CurrencySelect';
 * 
 * <CurrencySelect
 *   value={currency}
 *   onChange={(value) => setCurrency(value)}
 *   required={true}
 * />
 */

'use client'

import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { currencies, formatCurrency } from '../../../data/currencies';
import { cn } from './utils';

interface CurrencySelectProps {
  value?: string;
  onChange: (value: string) => void;
  required?: boolean;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  showFlag?: boolean;
}

export function CurrencySelect({
  value,
  onChange,
  required = false,
  className,
  placeholder = 'Select currency',
  disabled = false,
  error = false,
  showFlag = true,
}: CurrencySelectProps) {
  const selectedCurrency = value ? currencies.find(c => c.code === value) : null;

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
          {selectedCurrency && formatCurrency(selectedCurrency, showFlag)}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {currencies.map((currency) => (
          <SelectItem key={currency.code} value={currency.code}>
            {formatCurrency(currency, showFlag)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

