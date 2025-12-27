import React from 'react';
import { Shield, Truck, RefreshCw, Headphones, Award, Lock } from 'lucide-react';

interface TrustBadgesProps {
  badges?: Array<{
    icon: string;
    text: string;
  }>;
}

const iconMap: Record<string, any> = {
  shield: Shield,
  truck: Truck,
  refresh: RefreshCw,
  headphones: Headphones,
  award: Award,
  lock: Lock,
};

export function TrustBadges({
  badges = [
    { icon: 'shield', text: 'Secure Payment' },
    { icon: 'truck', text: 'Free Shipping' },
    { icon: 'refresh', text: '30-Day Returns' },
    { icon: 'headphones', text: '24/7 Support' },
  ],
}: TrustBadgesProps) {
  return (
    <section className="py-12 px-6 bg-slate-50 dark:bg-slate-900/50">
      <div className="w-full mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {badges.map((badge, index) => {
            const IconComponent = iconMap[badge.icon] || Shield;
            return (
              <div
                key={index}
                className="flex flex-col items-center text-center gap-3 p-4"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
                <p className="font-semibold text-sm">{badge.text}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}