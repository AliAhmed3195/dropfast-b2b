/**
 * Runs once when the Node server starts (main process).
 * Sets Stripe publishable key from env so API route can read it (avoids worker context not having env).
 * No fs/path so webpack can bundle this file without Node built-ins.
 */
const STRIPE_KEY_GLOBAL = '__STRIPE_PUBLISHABLE_KEY__';

export function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs') return;
  const key = (process.env.STRIPE_PUBLISHABLE_KEY ?? '').trim();
  (globalThis as unknown as Record<string, string>)[STRIPE_KEY_GLOBAL] = key;
}
