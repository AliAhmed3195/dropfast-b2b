import React from 'react';
import { Check, X } from 'lucide-react';
import { Badge } from '../ui/badge';

interface ComparisonColumn {
  name: string;
  features: Record<string, boolean>;
  isHighlighted?: boolean;
}

interface ComparisonTableProps {
  heading?: string;
  columns?: ComparisonColumn[];
  featureRows?: string[];
}

export function ComparisonTable({
  heading = 'How We Compare',
  columns = [
    {
      name: 'Competitor A',
      features: { feature1: true, feature2: false, feature3: false, feature4: true },
    },
    {
      name: 'Our Product',
      features: { feature1: true, feature2: true, feature3: true, feature4: true },
      isHighlighted: true,
    },
    {
      name: 'Competitor B',
      features: { feature1: true, feature2: true, feature3: false, feature4: false },
    },
  ],
  featureRows = [
    'Premium Quality',
    'Free Shipping',
    '24/7 Support',
    'Money-back Guarantee',
  ],
}: ComparisonTableProps) {
  return (
    <section className="py-20 px-6 bg-slate-50 dark:bg-slate-900/30">
      <div className="w-full mx-auto px-4">
        <div className="text-center mb-12">
          <h2>{heading}</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="text-left py-4 px-4 font-semibold border-b-2">Features</th>
                {columns.map((column, idx) => (
                  <th
                    key={idx}
                    className={`py-4 px-4 text-center border-b-2 ${
                      column.isHighlighted ? 'bg-gradient-to-br from-purple-500/10 to-cyan-500/10' : ''
                    }`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <span className="font-bold text-lg">{column.name}</span>
                      {column.isHighlighted && (
                        <Badge className="bg-gradient-to-r from-purple-600 to-cyan-600 text-white">
                          Best Choice
                        </Badge>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {featureRows.map((feature, idx) => (
                <tr key={idx} className="border-b hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="py-4 px-4 font-medium">{feature}</td>
                  {columns.map((column, colIdx) => {
                    const hasFeature = column.features[`feature${idx + 1}`];
                    return (
                      <td
                        key={colIdx}
                        className={`py-4 px-4 text-center ${
                          column.isHighlighted ? 'bg-gradient-to-br from-purple-500/5 to-cyan-500/5' : ''
                        }`}
                      >
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