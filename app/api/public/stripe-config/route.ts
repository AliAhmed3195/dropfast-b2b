// GET /api/public/stripe-config – Stripe publishable key from server env (runtime only)
// Only STRIPE_PUBLISHABLE_KEY – no NEXT_PUBLIC_* here so Next.js never inlines; value always from runtime.
import { NextResponse } from 'next/server';

export async function GET() {
  const publishableKey = process.env.STRIPE_PUBLISHABLE_KEY ?? '';
  return NextResponse.json({ publishableKey: publishableKey.trim() });
}
