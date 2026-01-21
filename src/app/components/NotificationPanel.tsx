'use client'

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useRouter } from 'next/navigation';
import {
  Bell,
  Check,
  X,
  Mail,
  ShoppingCart,
  Package,
  AlertCircle,
  CheckCircle,
  Info,
  Clock,
} from 'lucide-react';
import { Button } from './ui/button';
import { Separator } from './ui/separator';

interface Notification {
  id: string;
  type: 'order' | 'system' | 'message' | 'alert' | 'success';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onCountChange?: (count: number) => void;
}

export function NotificationPanel({ isOpen, onClose, onCountChange }: NotificationPanelProps) {
  const router = useRouter();
  
  // Sample notifications - In real app, this would come from API/state
  const [notifications, setNotifications] = React.useState<Notification[]>([
    {
      id: '1',
      type: 'order',
      title: 'New Order Received',
      message: 'Order #1234 has been placed',
      time: '5 min ago',
      read: false,
    },
    {
      id: '2',
      type: 'system',
      title: 'System Update',
      message: 'New features are now available',
      time: '1 hour ago',
      read: false,
    },
    {
      id: '3',
      type: 'message',
      title: 'New Message',
      message: 'You have a new message from supplier',
      time: '2 hours ago',
      read: false,
    },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Notify parent about initial count
  React.useEffect(() => {
    if (onCountChange) {
      onCountChange(unreadCount);
    }
  }, []);

  const markAsRead = (id: string) => {
    setNotifications(prev => {
      const updated = prev.map(n => (n.id === id ? { ...n, read: true } : n));
      const newUnreadCount = updated.filter(n => !n.read).length;
      onCountChange?.(newUnreadCount);
      return updated;
    });
  };

  const markAllAsRead = () => {
    setNotifications(prev => {
      const updated = prev.map(n => ({ ...n, read: true }));
      onCountChange?.(0);
      return updated;
    });
  };

  const clearAll = () => {
    setNotifications([]);
    onCountChange?.(0);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'order':
        return <ShoppingCart className="w-4 h-4" />;
      case 'system':
        return <Info className="w-4 h-4" />;
      case 'message':
        return <Mail className="w-4 h-4" />;
      case 'alert':
        return <AlertCircle className="w-4 h-4" />;
      case 'success':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case 'order':
        return 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400';
      case 'system':
        return 'bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400';
      case 'message':
        return 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400';
      case 'alert':
        return 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400';
      case 'success':
        return 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400';
      default:
        return 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400';
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="absolute top-full right-0 mt-2 w-[380px] max-w-[calc(100vw-2rem)] bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 z-50 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-slate-700 dark:text-slate-300" />
            <h3 className="font-semibold text-slate-900 dark:text-white">
              Notifications
            </h3>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-semibold rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4 text-slate-500" />
          </button>
        </div>

        {/* Actions */}
        {notifications.length > 0 && (
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-800/50">
            <button
              onClick={markAllAsRead}
              className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium"
            >
              Mark all as read
            </button>
            <span className="text-slate-300 dark:text-slate-600">•</span>
            <button
              onClick={clearAll}
              className="text-xs text-red-600 hover:text-red-700 dark:text-red-400 font-medium"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Notifications List */}
        <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3">
                <Bell className="w-8 h-8 text-slate-400" />
              </div>
              <p className="text-sm font-medium text-slate-900 dark:text-white mb-1">
                No notifications
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
                You're all caught up! We'll notify you when something new arrives.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {notifications.map((notification) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={`p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer ${
                    !notification.read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex gap-3">
                    {/* Icon */}
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${getIconColor(notification.type)}`}>
                      {getIcon(notification.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className="font-medium text-sm text-slate-900 dark:text-white truncate">
                          {notification.title}
                        </h4>
                        {!notification.read && (
                          <div className="w-2 h-2 rounded-full bg-blue-600 flex-shrink-0 mt-1" />
                        )}
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mb-1">
                        {notification.message}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-500">
                        <Clock className="w-3 h-3" />
                        <span>{notification.time}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <>
            <Separator />
            <div className="p-3">
              <button
                onClick={() => {
                  router.push('/notifications');
                  onClose();
                }}
                className="w-full py-2 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
              >
                View All Notifications
              </button>
            </div>
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
