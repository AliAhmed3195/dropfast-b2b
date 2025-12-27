'use client'

import React from 'react';
import { motion } from 'motion/react';
import { Zap, Shield, Heart, Star, Rocket, Award, TrendingUp, Users } from 'lucide-react';
import { Card } from '../ui/card';

const iconMap = {
  zap: Zap,
  shield: Shield,
  heart: Heart,
  star: Star,
  rocket: Rocket,
  award: Award,
  trending: TrendingUp,
  users: Users,
};

interface FeaturesGridProps {
  heading?: string;
  features?: Array<{
    icon: keyof typeof iconMap;
    title: string;
    description: string;
  }>;
}

export function FeaturesGrid({
  heading = 'Key Features',
  features = [
    {
      icon: 'zap',
      title: 'Lightning Fast',
      description: 'Get results in seconds with our optimized performance',
    },
    {
      icon: 'shield',
      title: 'Secure & Safe',
      description: 'Your data is protected with enterprise-grade security',
    },
    {
      icon: 'heart',
      title: 'Easy to Use',
      description: 'No learning curve needed - intuitive from day one',
    },
    {
      icon: 'star',
      title: 'Premium Quality',
      description: 'Built to last with the finest materials',
    },
  ],
}: FeaturesGridProps) {
  return (
    <section className="py-16 bg-white dark:bg-slate-900">
      <div className="container mx-auto px-4">
        {/* Heading */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">
            {heading}
          </h2>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = iconMap[feature.icon] || Zap;
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 text-center h-full hover:shadow-xl transition-all duration-300 border-2 hover:border-purple-300 dark:hover:border-purple-700 group">
                  {/* Icon */}
                  <div className="mb-4 flex justify-center">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-purple-500/30">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>

                  {/* Description */}
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
