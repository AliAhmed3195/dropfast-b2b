import React from 'react';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

interface FooterProps {
  companyName?: string;
  address?: string;
  email?: string;
  phone?: string;
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
  showNewsletter?: boolean;
}

export function Footer({
  companyName = 'Your Store',
  address = '123 Business St, City, Country',
  email = 'contact@store.com',
  phone = '+1 (555) 123-4567',
  socialLinks = {},
  showNewsletter = true,
}: FooterProps) {
  return (
    <footer className="bg-slate-900 text-white mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">{companyName}</h3>
            <div className="space-y-3 text-sm text-slate-300">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                <p>{address}</p>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <a href={`mailto:${email}`} className="hover:text-purple-400 transition-colors">
                  {email}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <a href={`tel:${phone}`} className="hover:text-purple-400 transition-colors">
                  {phone}
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-slate-300">
              <li><a href="/about" className="hover:text-purple-400 transition-colors">About Us</a></li>
              <li><a href="/contact" className="hover:text-purple-400 transition-colors">Contact</a></li>
              <li><a href="/shipping" className="hover:text-purple-400 transition-colors">Shipping Info</a></li>
              <li><a href="/returns" className="hover:text-purple-400 transition-colors">Returns</a></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-bold mb-4">Customer Service</h4>
            <ul className="space-y-2 text-sm text-slate-300">
              <li><a href="/faq" className="hover:text-purple-400 transition-colors">FAQ</a></li>
              <li><a href="/privacy" className="hover:text-purple-400 transition-colors">Privacy Policy</a></li>
              <li><a href="/terms" className="hover:text-purple-400 transition-colors">Terms of Service</a></li>
              <li><a href="/track" className="hover:text-purple-400 transition-colors">Track Order</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          {showNewsletter && (
            <div>
              <h4 className="font-bold mb-4">Stay Updated</h4>
              <p className="text-sm text-slate-300 mb-4">
                Subscribe to get special offers and updates
              </p>
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Your email"
                  className="bg-slate-800 border-slate-700 text-white"
                />
                <Button className="bg-gradient-to-r from-purple-600 to-cyan-600">
                  Subscribe
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Social Links & Copyright */}
        <div className="mt-12 pt-8 border-t border-slate-800">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-400">
              © {new Date().getFullYear()} {companyName}. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              {socialLinks.facebook && (
                <a
                  href={socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-slate-800 hover:bg-purple-600 flex items-center justify-center transition-colors"
                >
                  <Facebook className="w-5 h-5" />
                </a>
              )}
              {socialLinks.instagram && (
                <a
                  href={socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-slate-800 hover:bg-purple-600 flex items-center justify-center transition-colors"
                >
                  <Instagram className="w-5 h-5" />
                </a>
              )}
              {socialLinks.twitter && (
                <a
                  href={socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-slate-800 hover:bg-purple-600 flex items-center justify-center transition-colors"
                >
                  <Twitter className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
