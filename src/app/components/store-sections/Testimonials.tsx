'use client'

import React from 'react';
import { motion } from 'motion/react';
import { Star, Quote } from 'lucide-react';
import { Card } from '../ui/card';

interface TestimonialsProps {
  heading?: string;
  testimonials?: Array<{
    name: string;
    avatar?: string;
    rating: number;
    text: string;
    date?: string;
  }>;
}

export function Testimonials({
  heading = 'What Our Customers Say',
  testimonials = [
    {
      name: 'John Doe',
      avatar: '',
      rating: 5,
      text: 'Amazing product! Exceeded all my expectations. The quality is outstanding and customer service was exceptional.',
      date: '2024-12-20',
    },
    {
      name: 'Jane Smith',
      avatar: '',
      rating: 5,
      text: 'Best purchase I made this year! Highly recommend to everyone looking for quality products.',
      date: '2024-12-18',
    },
    {
      name: 'Mike Johnson',
      avatar: '',
      rating: 4,
      text: 'Great value for money. Fast shipping and excellent packaging. Will definitely buy again!',
      date: '2024-12-15',
    },
  ],
}: TestimonialsProps) {
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
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Don't just take our word for it - hear from our happy customers
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 h-full relative hover:shadow-xl transition-all duration-300 border-2 hover:border-purple-300 dark:hover:border-purple-700">
                {/* Quote Icon */}
                <div className="absolute top-6 right-6 opacity-10">
                  <Quote className="w-16 h-16 text-purple-600" />
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < testimonial.rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-slate-300'
                      }`}
                    />
                  ))}
                </div>

                {/* Testimonial Text */}
                <p className="text-slate-700 dark:text-slate-300 mb-6 italic leading-relaxed">
                  "{testimonial.text}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-3 mt-auto">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-white font-bold text-lg">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold">{testimonial.name}</p>
                    {testimonial.date && (
                      <p className="text-sm text-muted-foreground">
                        {new Date(testimonial.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
