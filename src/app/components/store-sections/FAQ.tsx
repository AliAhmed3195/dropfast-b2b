'use client'

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Card } from '../ui/card';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQProps {
  heading?: string;
  faqs?: FAQItem[];
}

export function FAQ({
  heading = 'Frequently Asked Questions',
  faqs = [
    { question: 'What is your return policy?', answer: 'We offer 30-day money-back guarantee.' },
    { question: 'How long does shipping take?', answer: 'Standard shipping takes 5-7 business days.' },
    { question: 'Do you ship internationally?', answer: 'Yes, we ship to over 100 countries worldwide.' },
  ],
}: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-20 px-6 bg-slate-50 dark:bg-slate-900/30">
      <div className="w-full max-w-3xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2>{heading}</h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <Card key={index} className="overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <span className="font-semibold pr-4">{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 transition-transform flex-shrink-0 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-4 text-muted-foreground">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}