import React from 'react';
import { Check } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

interface PricingTier {
  name: string;
  price: string;
  period?: string;
  features: string[];
  highlighted?: boolean;
  buttonText?: string;
}

interface PricingTiersProps {
  heading?: string;
  subheading?: string;
  tiers?: PricingTier[];
}

export function PricingTiers({
  heading = 'Choose Your Plan',
  subheading = 'Select the perfect plan for your needs',
  tiers = [
    {
      name: 'Starter',
      price: '$29',
      period: 'month',
      features: ['Feature 1', 'Feature 2', 'Feature 3'],
      buttonText: 'Get Started',
    },
    {
      name: 'Professional',
      price: '$79',
      period: 'month',
      features: ['Everything in Starter', 'Feature 4', 'Feature 5', 'Priority Support'],
      highlighted: true,
      buttonText: 'Get Started',
    },
    {
      name: 'Enterprise',
      price: '$199',
      period: 'month',
      features: ['Everything in Pro', 'Feature 6', 'Feature 7', 'Dedicated Account Manager'],
      buttonText: 'Contact Sales',
    },
  ],
}: PricingTiersProps) {
  return (
    <section className="py-20 px-6">
      <div className="w-full mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="mb-3">{heading}</h2>
          <p className="text-muted-foreground">{subheading}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tiers.map((tier, idx) => (
            <Card
              key={idx}
              className={`p-8 relative ${
                tier.highlighted
                  ? 'border-2 border-purple-500 shadow-2xl scale-105'
                  : ''
              }`}
            >
              {tier.highlighted && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-600 to-cyan-600 text-white">
                  Most Popular
                </Badge>
              )}

              <div className="text-center mb-6">
                <h3 className="font-bold text-xl mb-4">{tier.name}</h3>
                <div className="mb-2">
                  <span className="text-5xl font-bold">{tier.price}</span>
                  {tier.period && (
                    <span className="text-muted-foreground">/{tier.period}</span>
                  )}
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {tier.features.map((feature, fIdx) => (
                  <li key={fIdx} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className={`w-full ${
                  tier.highlighted
                    ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white'
                    : ''
                }`}
                variant={tier.highlighted ? 'default' : 'outline'}
              >
                {tier.buttonText || 'Get Started'}
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}