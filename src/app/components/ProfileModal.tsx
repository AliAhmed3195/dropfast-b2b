'use client'

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useRouter } from 'next/navigation';
import {
  X,
  User,
  Mail,
  Phone,
  Building,
  MapPin,
  Calendar,
  Shield,
  Settings,
  LogOut,
  CreditCard,
  Bell,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { Separator } from './ui/separator';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleSettingsClick = () => {
    if (user?.role) {
      router.push(`/dashboard/${user.role}/settings`);
      onClose();
    }
  };

  const handleLogout = () => {
    logout();
    onClose();
  };

  if (!user) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: 'spring', duration: 0.3 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85vw] max-w-sm bg-white dark:bg-slate-900 rounded-xl shadow-2xl z-[60] overflow-hidden max-h-[80vh] overflow-y-auto"
          >
            {/* Header with Gradient */}
            <div className="relative bg-gradient-to-r from-purple-500 to-cyan-500 p-4 text-white">
              <button
                onClick={onClose}
                className="absolute top-2.5 right-2.5 p-1.5 rounded-lg hover:bg-white/20 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2.5">
                {/* Avatar */}
                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-xl font-bold flex-shrink-0">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    user.name.charAt(0).toUpperCase()
                  )}
                </div>

                {/* User Info */}
                <div className="flex-1 min-w-0">
                  <h2 className="text-base font-bold mb-0.5 truncate">{user.name}</h2>
                  <p className="text-white/80 text-xs capitalize">{user.role}</p>
                  {user.company && (
                    <div className="mt-0.5">
                      <span className="px-1.5 py-0.5 bg-white/20 backdrop-blur-sm rounded text-[9px] font-medium">
                        {user.company}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-3.5 space-y-2.5">
              {/* Contact Information */}
              <div className="space-y-1.5">
                <h3 className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Contact</h3>
                
                <div className="flex items-center gap-2 text-xs">
                  <Mail className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <span className="text-slate-700 dark:text-slate-300 truncate">{user.email}</span>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <Phone className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <span className="text-slate-700 dark:text-slate-300">+1 (555) 123-4567</span>
                </div>
              </div>

              <Separator className="my-2" />

              {/* Quick Actions */}
              <div className="space-y-1">
                <h3 className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">Quick Actions</h3>
                
                <button
                  onClick={handleSettingsClick}
                  className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left"
                >
                  <Settings className="w-4 h-4 text-slate-600 dark:text-slate-400 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm text-slate-900 dark:text-white">Settings</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">Manage profile</p>
                  </div>
                </button>

                <button
                  onClick={() => {
                    router.push(`/dashboard/${user.role}/settings`);
                    onClose();
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left"
                >
                  <Bell className="w-4 h-4 text-slate-600 dark:text-slate-400 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm text-slate-900 dark:text-white">Notifications</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">Manage preferences</p>
                  </div>
                </button>

                <button
                  onClick={() => {
                    router.push(`/dashboard/${user.role}/settings`);
                    onClose();
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left"
                >
                  <Shield className="w-4 h-4 text-slate-600 dark:text-slate-400 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm text-slate-900 dark:text-white">Security</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">Password & 2FA</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="px-3.5 py-2 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700">
              <p className="text-[10px] text-center text-slate-500 dark:text-slate-400">
                Member since {new Date().getFullYear()} • FastDrop
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
