'use client'

import React from 'react';
import { Check } from 'lucide-react';

interface Step {
  title: string;
  description: string;
}

interface HowItWorksProps {
  heading?: string;
  steps?: Step[];
}

export function HowItWorks({
  heading = 'How It Works',
  steps = [
    { title: 'Step 1', description: 'Sign up for an account' },
    { title: 'Step 2', description: 'Choose your plan' },
    { title: 'Step 3', description: 'Start using the product' },
  ],
}: HowItWorksProps) {
  return (
    <section className="py-20 px-6">
      <div className="w-full mx-auto px-4">
        <div className="text-center mb-16">
          <h2>{heading}</h2>
        </div>

        <div className="relative">
          {/* Connection Line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500 to-cyan-500 hidden md:block" />

          <div className="space-y-12">
            {steps.map((step, idx) => (
              <div
                key={idx}
                className={`flex flex-col md:flex-row items-center gap-8 ${
                  idx % 2 === 0 ? '' : 'md:flex-row-reverse'
                }`}
              >
                {/* Content */}
                <div className="flex-1 text-center md:text-left">
                  <h3 className="font-bold text-2xl mb-3">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>

                {/* Step Number */}
                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-cyan-600 flex items-center justify-center text-white font-bold text-2xl shadow-xl">
                    {idx + 1}
                  </div>
                </div>

                {/* Spacer */}
                <div className="flex-1 hidden md:block" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}