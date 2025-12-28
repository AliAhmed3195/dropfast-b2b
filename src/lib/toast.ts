/**
 * Centralized Toast Utility
 * 
 * This file provides a centralized toast system for the entire application.
 * All toast configuration (position, styling, duration) is managed here.
 * 
 * To change toast position globally, update the position in:
 * - src/app/components/ui/sonner.tsx (Toaster component)
 * 
 * Usage in components:
 * import { showToast } from '@/lib/toast';
 * 
 * showToast.success('User updated successfully');
 * showToast.error('Failed to update user');
 * showToast.info('Processing...');
 * showToast.warning('Please check your input');
 */

import { toast as sonnerToast } from 'sonner';

// Toast configuration - can be customized here
const TOAST_CONFIG = {
  duration: 3000, // 3 seconds
  position: 'top-right' as const, // Can be: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'
};

/**
 * Centralized Toast Functions
 * All toast messages should use these functions instead of calling sonner directly
 */
export const showToast = {
  /**
   * Show success toast
   * @param message - Success message to display
   * @param options - Optional toast options (duration, etc.)
   */
  success: (message: string, options?: { duration?: number }) => {
    return sonnerToast.success(message, {
      duration: options?.duration || TOAST_CONFIG.duration,
    });
  },

  /**
   * Show error toast
   * @param message - Error message to display
   * @param options - Optional toast options (duration, etc.)
   */
  error: (message: string, options?: { duration?: number }) => {
    return sonnerToast.error(message, {
      duration: options?.duration || TOAST_CONFIG.duration,
    });
  },

  /**
   * Show info toast
   * @param message - Info message to display
   * @param options - Optional toast options (duration, etc.)
   */
  info: (message: string, options?: { duration?: number }) => {
    return sonnerToast.info(message, {
      duration: options?.duration || TOAST_CONFIG.duration,
    });
  },

  /**
   * Show warning toast
   * @param message - Warning message to display
   * @param options - Optional toast options (duration, etc.)
   */
  warning: (message: string, options?: { duration?: number }) => {
    return sonnerToast.warning(message, {
      duration: options?.duration || TOAST_CONFIG.duration,
    });
  },

  /**
   * Show loading toast (returns a toast ID that can be used to dismiss)
   * @param message - Loading message to display
   */
  loading: (message: string) => {
    return sonnerToast.loading(message);
  },

  /**
   * Dismiss a specific toast by ID
   * @param toastId - Toast ID returned from loading/success/error/etc.
   */
  dismiss: (toastId: string | number) => {
    sonnerToast.dismiss(toastId);
  },

  /**
   * Show promise toast (for async operations)
   * @param promise - Promise to track
   * @param messages - Messages for loading, success, and error states
   */
  promise: <T,>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: any) => string);
    }
  ) => {
    return sonnerToast.promise(promise, messages);
  },
};

// Export default for convenience
export default showToast;

