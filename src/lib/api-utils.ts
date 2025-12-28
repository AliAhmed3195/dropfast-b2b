/**
 * API Utility Functions
 * 
 * Centralized utilities to prevent duplicate API calls
 * and handle common API patterns across the application.
 */

// Global tracking for API calls to prevent duplicates
const activeApiCalls = new Map<string, AbortController>();

/**
 * Make an API call with duplicate prevention
 * 
 * @param url - API endpoint URL
 * @param options - Fetch options
 * @param uniqueKey - Unique key for this API call (defaults to URL)
 * @returns Promise with response data
 */
export async function fetchWithDuplicatePrevention(
  url: string,
  options: RequestInit = {},
  uniqueKey?: string
): Promise<any> {
  const key = uniqueKey || url;

  // Check if this API is already being called
  if (activeApiCalls.has(key)) {
    // Cancel previous request
    activeApiCalls.get(key)?.abort();
  }

  // Create new abort controller
  const abortController = new AbortController();
  activeApiCalls.set(key, abortController);

  try {
    const response = await fetch(url, {
      ...options,
      signal: abortController.signal,
    });

    const data = await response.json();

    // Remove from active calls
    activeApiCalls.delete(key);

    if (!response.ok) {
      throw new Error(data.error || 'API request failed');
    }

    return data;
  } catch (error: any) {
    // Remove from active calls on error
    activeApiCalls.delete(key);

    if (error.name === 'AbortError') {
      // Request was cancelled, don't throw
      throw new Error('Request cancelled');
    }

    throw error;
  }
}

/**
 * Cancel an active API call
 */
export function cancelApiCall(uniqueKey: string) {
  const controller = activeApiCalls.get(uniqueKey);
  if (controller) {
    controller.abort();
    activeApiCalls.delete(uniqueKey);
  }
}

/**
 * Cancel all active API calls
 */
export function cancelAllApiCalls() {
  activeApiCalls.forEach((controller) => {
    controller.abort();
  });
  activeApiCalls.clear();
}

