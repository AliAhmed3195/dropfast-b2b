/**
 * Reusable Empty State Component
 * 
 * Usage:
 * <EmptyState
 *   icon={Package}
 *   title="No orders yet"
 *   description="Start shopping to see your orders here"
 *   action={{
 *     label: "Browse Stores",
 *     onClick: () => navigate('/browse')
 *   }}
 * />
 */

import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Card } from './card';
import { Button } from './button';

interface EmptyStateProps {
  icon?: LucideIcon | React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  variant?: 'default' | 'error' | 'no-results';
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  variant = 'default',
}: EmptyStateProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'error':
        return {
          iconBg: 'from-red-500/10 to-rose-500/10',
          iconColor: 'text-red-500',
        };
      case 'no-results':
        return {
          iconBg: 'from-gray-500/10 to-slate-500/10',
          iconColor: 'text-gray-500',
        };
      default:
        return {
          iconBg: 'from-purple-500/10 to-cyan-500/10',
          iconColor: 'text-muted-foreground',
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <Card className="p-12 text-center">
      <div className="max-w-md mx-auto">
        {Icon && (
          <div
            className={`w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br ${styles.iconBg} flex items-center justify-center`}
          >
            {typeof Icon === 'function' ? (
              <Icon className={`w-10 h-10 ${styles.iconColor}`} />
            ) : (
              Icon
            )}
          </div>
        )}
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        {description && (
          <p className="text-muted-foreground mb-6">{description}</p>
        )}
        {action && (
          <Button
            onClick={action.onClick}
            className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white"
          >
            {action.label}
          </Button>
        )}
      </div>
    </Card>
  );
}

