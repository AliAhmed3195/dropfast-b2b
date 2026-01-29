// GET /api/public/stripe-config – Stripe publishable key from server env (runtime)
// Use this so client can get the key without rebuild – server's .env.staging / env_file is read at runtime.
import { NextResponse } from 'next/server';

export async function GET() {
  const publishableKey =
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ||
    process.env.STRIPE_PUBLISHABLE_KEY ||
    '';
  return NextResponse.json({ publishableKey: publishableKey.trim() });
}
