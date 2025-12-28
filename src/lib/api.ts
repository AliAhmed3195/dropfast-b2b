/**
 * Global API fetch wrapper with automatic loading state management
 * and duplicate API call prevention
 * 
 * Features:
 * 1. Automatic loading spinner for all /api/* calls
 * 2. Prevents duplicate API calls (React StrictMode fix)
 * 3. Automatically cancels previous duplicate requests
 * 4. Works globally across entire application
 * 
 * This is automatically applied to all fetch() calls in the application.
 * No component changes needed!
 */

import React from 'react';
import { useLoading } from '../app/contexts/LoadingContext';

// Global loading state manager
let globalLoadingManager: {
  startLoading: () => void;
  stopLoading: () => void;
} | null = null;

// Track active API calls to prevent duplicates (React StrictMode fix)
// Key format: `${url}_${method}_${bodyHash}` to uniquely identify requests
const activeApiCalls = new Map<string, AbortController>();

/**
 * Generate a unique key for an API request
 */
function getRequestKey(url: string, method: string = 'GET', body?: string): string {
  // For GET requests, body is ignored
  if (method === 'GET' || method === 'HEAD') {
    return `${url}_${method}`;
  }
  
  // For POST/PUT/PATCH, include body hash to differentiate requests
  // Simple hash of body (first 50 chars) to identify similar requests
  const bodyHash = body ? body.substring(0, 50).replace(/\s/g, '') : '';
  return `${url}_${method}_${bodyHash}`;
}

/**
 * Initialize global loading manager (called from LoadingProvider)
 */
export function setGlobalLoadingManager(manager: {
  startLoading: () => void;
  stopLoading: () => void;
}) {
  globalLoadingManager = manager;
  
  // Override global fetch to automatically show loading
  if (typeof window !== 'undefined' && !(window as any).__fetchIntercepted) {
    const originalFetch = window.fetch;
    
    window.fetch = async (url: string | URL | Request, init?: RequestInit): Promise<Response> => {
      // Extract URL string
      const urlString = typeof url === 'string' 
        ? url 
        : url instanceof URL 
          ? url.pathname 
          : (url as Request).url;
      
      // Only apply duplicate prevention and loading for API calls
      const isApiCall = urlString.startsWith('/api/');
      
      if (isApiCall) {
        // Get request method and body
        const method = init?.method || 'GET';
        const body = init?.body ? (typeof init.body === 'string' ? init.body : JSON.stringify(init.body)) : undefined;
        
        // Generate unique key for this request
        const requestKey = getRequestKey(urlString, method, body);
        
        // Cancel previous duplicate request if exists (React StrictMode fix)
        if (activeApiCalls.has(requestKey)) {
          const previousController = activeApiCalls.get(requestKey);
          if (previousController) {
            previousController.abort();
          }
          activeApiCalls.delete(requestKey);
        }
        
        // Create new abort controller for this request
        const abortController = new AbortController();
        activeApiCalls.set(requestKey, abortController);
        
        // Merge with existing signal if provided (for manual cancellation)
        let finalSignal = abortController.signal;
        if (init?.signal) {
          // If both signals exist, create a combined signal
          const combinedController = new AbortController();
          const abort = () => combinedController.abort();
          
          abortController.signal.addEventListener('abort', abort);
          if (init.signal instanceof AbortSignal) {
            init.signal.addEventListener('abort', abort);
          }
          
          finalSignal = combinedController.signal;
        }
        
        const mergedInit = {
          ...init,
          signal: finalSignal,
        };

        try {
          // Show loading spinner
          if (globalLoadingManager) {
            globalLoadingManager.startLoading();
          }

          // Make the actual API call
          const response = await originalFetch(url, mergedInit);
          
          // Remove from active calls on success
          activeApiCalls.delete(requestKey);
          
          return response;
        } catch (error: any) {
          // Remove from active calls on error
          activeApiCalls.delete(requestKey);
          
          // Handle AbortError (expected for cancelled duplicates)
          if (error.name === 'AbortError') {
            // Silently handle abort errors from duplicate prevention
            // This is expected behavior when React StrictMode cancels duplicate calls
            throw error;
          }
          throw error;
        } finally {
          // Hide loading spinner with small delay to prevent flickering
          if (globalLoadingManager) {
            setTimeout(() => {
              globalLoadingManager?.stopLoading();
            }, 100);
          }
        }
      } else {
        // Non-API call (external URLs, static assets, etc.) - proceed normally
        return originalFetch(url, init);
      }
    };
    
    (window as any).__fetchIntercepted = true;
  }
}

/**
 * Hook to use API fetch with automatic loading management
 * Usage in components:
 * const { apiFetch } = useApi();
 * const response = await apiFetch('/api/admin/users');
 * const data = await response.json();
 */
export function useApi() {
  const { startLoading, stopLoading } = useLoading();

  const apiFetch = async (
    url: string,
    options?: RequestInit,
    showLoading: boolean = true
  ): Promise<Response> => {
    try {
      if (showLoading) {
        startLoading();
      }

      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
      });

      return response;
    } catch (error) {
      throw error;
    } finally {
      if (showLoading) {
        stopLoading();
      }
    }
  };

  return { apiFetch };
}

