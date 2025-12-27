import React, { useEffect, useState } from 'react';
import { Clock, Star } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

interface DealOfDayProps {
  heading?: string;
  productName?: string;
  productImage?: string;
  originalPrice?: string;
  salePrice?: string;
  rating?: number;
  reviewCount?: number;
  endTime?: string; // ISO date string
}

export function DealOfDay({
  heading = 'Deal of the Day',
  productName = 'Amazing Product',
  productImage = '',
  originalPrice = '$99.99',
  salePrice = '$49.99',
  rating = 4.5,
  reviewCount = 234,
  endTime = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
}: DealOfDayProps) {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(endTime).getTime() - Date.now();
      
      if (difference > 0) {
        setTimeLeft({
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [endTime]);

  const discount = Math.round(
    ((parseFloat(originalPrice.replace('$', '')) - parseFloat(salePrice.replace('$', ''))) /
      parseFloat(originalPrice.replace('$', ''))) *
      100
  );

  return (
    <section className="py-20 px-6 bg-gradient-to-br from-purple-600/10 to-cyan-600/10">
      <div className="w-full mx-auto px-4">
        <div className="text-center mb-12">
          <Badge className="bg-gradient-to-r from-purple-600 to-cyan-600 text-white mb-4">
            Limited Time Offer
          </Badge>
          <h2>{heading}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="relative">
            {productImage ? (
              <ImageWithFallback
                src={productImage}
                alt={productName}
                className="w-full h-96 object-cover rounded-2xl shadow-2xl"
              />
            ) : (
              <div className="w-full h-96 bg-gradient-to-br from-purple-500/30 to-cyan-500/30 rounded-2xl flex items-center justify-center">
                <span className="text-6xl">🎁</span>
              </div>
            )}
            <Badge className="absolute top-4 right-4 bg-red-600 text-white text-lg px-4 py-2">
              -{discount}%
            </Badge>
          </div>

          <div>
            <h3 className="text-3xl font-bold mb-4">{productName}</h3>
            
            <div className="flex items-center gap-2 mb-6">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-slate-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-muted-foreground">({reviewCount} reviews)</span>
            </div>

            <div className="mb-6">
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-4xl font-bold text-green-600">{salePrice}</span>
                <span className="text-2xl text-muted-foreground line-through">
                  {originalPrice}
                </span>
              </div>
              <p className="text-green-600 font-semibold">Save {discount}% today!</p>
            </div>

            <div className="bg-slate-100 dark:bg-slate-800 rounded-xl p-6 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-red-600" />
                <span className="font-semibold">Offer ends in:</span>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: 'Hours', value: timeLeft.hours },
                  { label: 'Minutes', value: timeLeft.minutes },
                  { label: 'Seconds', value: timeLeft.seconds },
                ].map((item) => (
                  <div key={item.label} className="text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-1">
                      {String(item.value).padStart(2, '0')}
                    </div>
                    <div className="text-sm text-muted-foreground">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <Button
              size="lg"
              className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 text-white text-lg"
            >
              Grab This Deal Now
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}