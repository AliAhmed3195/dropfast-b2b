/**
 * Deduplicated fetch for Product Hunter APIs.
 * Prevents duplicate/canceled requests from React Strict Mode and repeated mounts.
 */

import { useState, useEffect, useRef, useCallback } from 'react'

type CacheEntry = { promise: Promise<any>; abort: () => void }

const inFlight = new Map<string, CacheEntry>()
const cleanupTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

function getCachedOrFetch(url: string): Promise<any> {
  const existing = inFlight.get(url)
  if (existing) return existing.promise

  const controller = new AbortController()
  const promise = fetch(url, { signal: controller.signal })
    .then((r) => r.json())
    .then((d) => {
      if (d.error) throw new Error(d.error)
      return d
    })
    .finally(() => {
      setTimeout(() => inFlight.delete(url), 150)
    })

  inFlight.set(url, { promise, abort: () => controller.abort() })
  return promise
}

function abortAndRemove(url: string) {
  const entry = inFlight.get(url)
  if (entry) {
    entry.abort()
    inFlight.delete(url)
  }
}

/**
 * Fetch Product Hunter API once per URL; deduplicates when effect runs twice (Strict Mode).
 * Cleanup aborts after a short delay so Strict Mode re-mount can cancel the abort.
 */
export function useProductHunterApi<T = any>(
  url: string | null,
  options: {
    enabled?: boolean
    extract?: (data: any) => T
    onError?: () => void
  } = {}
) {
  const { enabled = true, extract = (d) => d as T, onError } = options
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchUrl = useCallback(() => {
    if (!url || !enabled) {
      setLoading(false)
      return
    }

    setLoading(true)

    const entry = inFlight.get(url)
    if (entry) {
      entry.promise
        .then((d) => {
          setData(extract(d))
        })
        .catch((e) => {
          if (e.name !== 'AbortError') onError?.()
        })
        .finally(() => setLoading(false))
      return
    }

    getCachedOrFetch(url)
      .then((d) => {
        setData(extract(d))
      })
      .catch((e) => {
        if (e.name !== 'AbortError') onError?.()
      })
      .finally(() => {
        setLoading(false)
      })
  }, [url, enabled, extract, onError])

  useEffect(() => {
    if (!url || !enabled) {
      setLoading(false)
      return
    }

    const prevTimeout = cleanupTimeouts.get(url)
    if (prevTimeout) {
      clearTimeout(prevTimeout)
      cleanupTimeouts.delete(url)
    }

    fetchUrl()

    return () => {
      const t = setTimeout(() => {
        abortAndRemove(url)
        cleanupTimeouts.delete(url)
      }, 80)
      cleanupTimeouts.set(url, t)
    }
  }, [url, enabled])

  return { data, loading, refetch: fetchUrl }
}
