/**
 * Custom Hook for API Data Fetching
 * 
 * Features:
 * - Duplicate call prevention
 * - Automatic loading state
 * - Error handling
 * - Centralized toast messages
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { useApiCall } from './useApiCall';
import { useLoading } from '../app/contexts/LoadingContext';
import { showToast } from '../lib/toast';

interface UseApiDataOptions<T> {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: any;
  headers?: Record<string, string>;
  enabled?: boolean; // Auto-fetch or manual
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  showLoading?: boolean; // Show global loading spinner
  showErrorToast?: boolean; // Show error toast automatically
  skipDuplicateCheck?: boolean;
}

interface UseApiDataReturn<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  mutate: (newData: T) => void; // Optimistic update
}

// Track active requests to prevent duplicates
const activeRequests = new Map<string, AbortController>();

export function useApiData<T = any>(options: UseApiDataOptions<T>): UseApiDataReturn<T> {
  const {
    url,
    method = 'GET',
    body,
    headers = {},
    enabled = true,
    onSuccess,
    onError,
    showLoading = true,
    showErrorToast = true,
    skipDuplicateCheck = false,
  } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { startLoading, stopLoading } = useLoading();
  const { callApi } = useApiCall();
  const mountedRef = useRef(true);

  // Generate unique key for this request
  const requestKey = `${url}_${method}_${JSON.stringify(body || {}).slice(0, 50)}`;

  const fetchData = useCallback(async () => {
    // Check if request is already in progress
    if (!skipDuplicateCheck && activeRequests.has(requestKey)) {
      return;
    }

    setLoading(true);
    setError(null);

    if (showLoading) {
      startLoading();
    }

    // Create abort controller
    const abortController = new AbortController();
    if (!skipDuplicateCheck) {
      activeRequests.set(requestKey, abortController);
    }

    try {
      let responseData: any = null;

      await callApi(
        async (signal) => {
          const fetchOptions: RequestInit = {
            method,
            headers: {
              'Content-Type': 'application/json',
              ...headers,
            },
            signal,
          };

          if (body && method !== 'GET') {
            fetchOptions.body = JSON.stringify(body);
          }

          const response = await fetch(url, fetchOptions);

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: 'Request failed' }));
            throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
          }

          const result = await response.json();
          responseData = result?.data || result;
        },
        { skipDuplicateCheck }
      );

      if (!mountedRef.current) return;

      setData(responseData);
      setError(null);

      if (onSuccess && responseData) {
        onSuccess(responseData);
      }
    } catch (err: any) {
      if (!mountedRef.current) return;
      if (err.name === 'AbortError') return;

      const error = err instanceof Error ? err : new Error('An error occurred');
      setError(error);
      setData(null);

      if (showErrorToast) {
        showToast.error(error.message || 'Failed to fetch data');
      }

      if (onError) {
        onError(error);
      }
    } finally {
      if (!skipDuplicateCheck) {
        activeRequests.delete(requestKey);
      }

      if (mountedRef.current) {
        setLoading(false);
        if (showLoading) {
          stopLoading();
        }
      }
    }
  }, [url, method, JSON.stringify(body), enabled, showLoading, showErrorToast, skipDuplicateCheck]);

  const refetch = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  const mutate = useCallback((newData: T) => {
    setData(newData);
  }, []);

  // Auto-fetch when enabled
  useEffect(() => {
    if (enabled && url) {
      fetchData();
    }

    return () => {
      mountedRef.current = false;
      // Cleanup: abort request if component unmounts
      if (!skipDuplicateCheck && activeRequests.has(requestKey)) {
        activeRequests.get(requestKey)?.abort();
        activeRequests.delete(requestKey);
      }
    };
  }, [enabled, url]);

  return {
    data,
    loading,
    error,
    refetch,
    mutate,
  };
}

