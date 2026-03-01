// GET /api/public/stripe-config – Stripe publishable key from server env (runtime)
// Prefer STRIPE_PUBLISHABLE_KEY so runtime env is used (NEXT_PUBLIC_* can be inlined empty at build time in Docker).
import { NextResponse } from 'next/server';

export async function GET() {
  const publishableKey =
    process.env.STRIPE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ||
    '';
  return NextResponse.json({ publishableKey: publishableKey.trim() });
}
