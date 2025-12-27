import React, { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

interface CountdownTimerProps {
  heading?: string;
  subheading?: string;
  endDate?: string; // ISO date string
  backgroundColor?: string;
}

export function CountdownTimer({
  heading = 'Limited Time Offer!',
  subheading = 'Hurry! This deal ends soon',
  endDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  backgroundColor = '#6366f1',
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(endDate).getTime() - Date.now();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [endDate]);

  return (
    <section className="py-16 px-6" style={{ backgroundColor }}>
      <div className="w-full mx-auto px-4 text-center">
        <Clock className="w-12 h-12 mx-auto mb-4 text-white" />
        <h2 className="text-white mb-2">{heading}</h2>
        <p className="text-white/80 mb-8">{subheading}</p>

        <div className="grid grid-cols-4 gap-4 md:gap-8">
          {[
            { label: 'Days', value: timeLeft.days },
            { label: 'Hours', value: timeLeft.hours },
            { label: 'Minutes', value: timeLeft.minutes },
            { label: 'Seconds', value: timeLeft.seconds },
          ].map((item) => (
            <div
              key={item.label}
              className="bg-white/10 backdrop-blur rounded-xl p-4 md:p-6"
            >
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                {String(item.value).padStart(2, '0')}
              </div>
              <div className="text-sm md:text-base text-white/80">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}