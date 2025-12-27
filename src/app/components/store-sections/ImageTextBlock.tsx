import React from 'react';
import { Button } from '../ui/button';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface ImageTextBlockProps {
  heading?: string;
  text?: string;
  image?: string;
  imagePosition?: 'left' | 'right';
  buttonText?: string;
  buttonLink?: string;
  showButton?: boolean;
  backgroundColor?: string;
}

export function ImageTextBlock({
  heading = 'Our Story',
  text = 'Share your brand story and connect with your customers. Tell them what makes your business unique and why they should choose you.',
  image = '',
  imagePosition = 'left',
  buttonText = 'Learn More',
  buttonLink = '',
  showButton = true,
  backgroundColor = '#ffffff',
}: ImageTextBlockProps) {
  return (
    <section className="py-20 px-6" style={{ backgroundColor }}>
      <div className="w-full mx-auto px-4">
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-12 items-center ${imagePosition === 'right' ? 'md:grid-flow-dense' : ''}`}>
          {/* Text Content */}
          <div className={imagePosition === 'right' ? 'md:col-start-1' : ''}>
            <h2 className="mb-4">{heading}</h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              {text}
            </p>
            {showButton && buttonText && (
              <Button
                className="bg-gradient-to-r from-purple-600 to-cyan-600 text-white"
                onClick={() => buttonLink && (window.location.href = buttonLink)}
              >
                {buttonText}
              </Button>
            )}
          </div>

          {/* Image */}
          <div className={`relative ${imagePosition === 'right' ? 'md:col-start-2' : ''}`}>
            {image ? (
              <ImageWithFallback
                src={image}
                alt={heading}
                className="w-full h-96 object-cover rounded-2xl shadow-2xl"
              />
            ) : (
              <div className="w-full h-96 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 rounded-2xl flex items-center justify-center">
                <p className="text-muted-foreground">Add an image</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}