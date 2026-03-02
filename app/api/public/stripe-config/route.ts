// GET /api/public/stripe-config – Stripe publishable key (file + globalThis + env for worker/main process)
import { NextResponse } from 'next/server';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const GLOBAL_KEY = '__STRIPE_PUBLISHABLE_KEY__';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  let publishableKey =
    (typeof globalThis !== 'undefined' && (globalThis as Record<string, unknown>)[GLOBAL_KEY]) as
      | string
      | undefined;
  if (publishableKey) {
    return NextResponse.json(
      { publishableKey: String(publishableKey).trim() },
      { headers: { 'Cache-Control': 'no-store' } }
    );
  }
  publishableKey = '';
  const paths = [
    '/app/.stripe-publishable-key',
    join(process.cwd(), '.stripe-publishable-key'),
    join(process.cwd(), '.next', '.stripe-publishable-key'),
  ];
  for (const filePath of paths) {
    try {
      if (existsSync(filePath)) {
        publishableKey = readFileSync(filePath, 'utf8').trim();
        if (publishableKey) break;
      }
    } catch {
      // ignore
    }
  }
  if (!publishableKey) {
    publishableKey = process.env.STRIPE_PUBLISHABLE_KEY ?? '';
  }
  return NextResponse.json(
    { publishableKey: publishableKey.trim() },
    { headers: { 'Cache-Control': 'no-store' } }
  );
}
