import React, { useEffect, useState } from 'react';
import { Users, Package, Headphones, Heart, TrendingUp, Award } from 'lucide-react';
import { motion } from 'motion/react';

interface Stat {
  number: string;
  suffix?: string;
  label: string;
  icon?: string;
}

interface StatsCounterProps {
  heading?: string;
  subheading?: string;
  stats?: Stat[];
  backgroundColor?: string;
  layout?: 'grid' | 'row';
}

const iconMap: Record<string, any> = {
  users: Users,
  package: Package,
  headphones: Headphones,
  heart: Heart,
  trending: TrendingUp,
  award: Award,
};

export function StatsCounter({
  heading = 'Our Achievements',
  subheading = 'Numbers that speak for themselves',
  stats = [
    { number: '10000', suffix: '+', label: 'Happy Customers', icon: 'users' },
    { number: '500', suffix: '+', label: 'Products Sold', icon: 'package' },
    { number: '24', suffix: '/7', label: 'Support', icon: 'headphones' },
    { number: '99', suffix: '%', label: 'Satisfaction', icon: 'heart' },
  ],
  backgroundColor = '#f9fafb',
  layout = 'grid',
}: StatsCounterProps) {
  const [counters, setCounters] = useState<number[]>(stats.map(() => 0));

  useEffect(() => {
    const duration = 2000; // 2 seconds
    const steps = 60;
    const interval = duration / steps;

    stats.forEach((stat, index) => {
      const target = parseInt(stat.number);
      const increment = target / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          setCounters((prev) => {
            const newCounters = [...prev];
            newCounters[index] = target;
            return newCounters;
          });
          clearInterval(timer);
        } else {
          setCounters((prev) => {
            const newCounters = [...prev];
            newCounters[index] = Math.floor(current);
            return newCounters;
          });
        }
      }, interval);
    });
  }, []);

  return (
    <section className="py-20 px-6" style={{ backgroundColor }}>
      <div className="w-full mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="mb-3">{heading}</h2>
          <p className="text-muted-foreground">{subheading}</p>
        </div>

        <div className={layout === 'grid' ? 'grid md:grid-cols-4 gap-8' : 'flex flex-wrap justify-center gap-12'}>
          {stats.map((stat, index) => {
            const IconComponent = stat.icon ? iconMap[stat.icon] || Award : Award;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500">
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent mb-2">
                  {counters[index].toLocaleString()}
                  {stat.suffix}
                </div>
                <p className="text-muted-foreground font-medium">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}