'use client'

import React from 'react';
import { Check, X } from 'lucide-react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';

interface ComparisonTier {
  name: string;
  features: string[];
  highlighted?: boolean;
}

interface ProductComparisonProps {
  heading?: string;
  tiers?: ComparisonTier[];
  allFeatures?: string[];
}

export function ProductComparison({
  heading = 'Compare Models',
  tiers = [
    {
      name: 'Basic',
      features: ['feature-1', 'feature-2'],
    },
    {
      name: 'Pro',
      features: ['feature-1', 'feature-2', 'feature-3'],
      highlighted: true,
    },
    {
      name: 'Premium',
      features: ['feature-1', 'feature-2', 'feature-3', 'feature-4'],
    },
  ],
  allFeatures = [
    'Feature 1',
    'Feature 2',
    'Feature 3',
    'Feature 4',
  ],
}: ProductComparisonProps) {
  return (
    <section className="py-20 px-6 bg-slate-50 dark:bg-slate-900/30">
      <div className="w-full mx-auto px-4">
        <div className="text-center mb-12">
          <h2>{heading}</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2">
                <th className="text-left py-4 px-4 font-semibold">Features</th>
                {tiers.map((tier, idx) => (
                  <th key={idx} className="py-4 px-4 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <span className="font-bold text-lg">{tier.name}</span>
                      {tier.highlighted && (
                        <Badge className="bg-gradient-to-r from-purple-600 to-cyan-600 text-white">
                          Popular
                        </Badge>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {allFeatures.map((feature, idx) => (
                <tr key={idx} className="border-b hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="py-4 px-4 font-medium">{feature}</td>
                  {tiers.map((tier, tierIdx) => {
                    const hasFeature = tier.features.includes(`feature-${idx + 1}`);
                    return (
                      <td key={tierIdx} className="py-4 px-4 text-center">
                        {hasFeature ? (
                          <Check className="w-6 h-6 text-green-600 mx-auto" />
                        ) : (
                          <X className="w-6 h-6 text-red-400 mx-auto" />
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}