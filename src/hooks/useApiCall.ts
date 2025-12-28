/**
 * Custom Hook to Prevent Duplicate API Calls
 * 
 * This hook prevents duplicate API calls caused by React StrictMode
 * in development mode. Use this for all API calls in components.
 * 
 * Usage:
 * const { callApi, isCalling } = useApiCall();
 * 
 * useEffect(() => {
 *   callApi(async () => {
 *     const response = await fetch('/api/users');
 *     const data = await response.json();
 *     setUsers(data);
 *   });
 * }, []);
 */

import { useRef, useCallback } from 'react';

export function useApiCall() {
  const isCallingRef = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const callApi = useCallback(async (
    apiFunction: (signal?: AbortSignal) => Promise<any>,
    options?: { skipDuplicateCheck?: boolean }
  ) => {
    // Prevent duplicate calls (React StrictMode causes double renders in dev)
    if (!options?.skipDuplicateCheck && isCallingRef.current) {
      return;
    }

    // Abort previous request if any
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const abortController = new AbortController();
    abortControllerRef.current = abortController;
    isCallingRef.current = true;

    try {
      await apiFunction(abortController.signal);
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        throw error;
      }
    } finally {
      // Only reset if this is still the current request
      if (abortControllerRef.current === abortController) {
        isCallingRef.current = false;
        abortControllerRef.current = null;
      }
    }
  }, []);

  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      isCallingRef.current = false;
    }
  }, []);

  return {
    callApi,
    cancel,
    isCalling: isCallingRef.current,
  };
}

