/**
 * Store subdomain: {slug}.dropsified.com
 * Use this so links stay on the subdomain (e.g. /cart) instead of /store/[slug]/cart.
 */

import { useState, useEffect } from 'react'

const STORE_ROOT_DOMAIN = process.env.NEXT_PUBLIC_STORE_DOMAIN || 'dropsified.com'

/** Returns store slug from hostname if on store subdomain, else null. "app" is reserved. */
export function getStoreSubdomain(host: string): string | null {
  if (!host || typeof host !== 'string') return null
  if (!host.endsWith('.' + STORE_ROOT_DOMAIN)) return null
  const sub = host.split('.')[0]
  if (sub && sub !== 'app') return sub
  return null
}

/** Whether current host is a store subdomain (e.g. acme.dropsified.com). */
export function isStoreSubdomain(host?: string): boolean {
  const h = host ?? (typeof window !== 'undefined' ? window.location.hostname : '')
  return getStoreSubdomain(h) !== null
}

/**
 * Base path for store links. On subdomain use '' so links are /cart, /product/123.
 * On app use /store/[slug] so links are /store/acme/cart.
 */
export function getStoreBasePath(slug: string, host?: string): string {
  const h = host ?? (typeof window !== 'undefined' ? window.location.hostname : '')
  if (getStoreSubdomain(h)) return ''
  return '/store/' + slug
}

/** Hook: base path for store links. Updates after mount so subdomain is detected on client. */
export function useStoreBasePath(slug: string): string {
  const [basePath, setBasePath] = useState(() => '/store/' + slug)
  useEffect(() => {
    const sub = typeof window !== 'undefined' ? getStoreSubdomain(window.location.hostname) : null
    setBasePath(sub ? '' : '/store/' + slug)
  }, [slug])
  return basePath
}
