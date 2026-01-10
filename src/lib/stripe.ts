/**
 * Stripe Payment Utilities
 */

import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set in environment variables')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-12-15.clover',
})

/**
 * Create a PaymentIntent
 * @param amount Amount in USD (will be converted to cents)
 * @param currency Currency code (default: 'usd')
 * @param metadata Additional metadata
 */
export async function createPaymentIntent(
  amount: number,
  currency: string = 'usd',
  metadata?: Record<string, string>
): Promise<Stripe.PaymentIntent> {
  // Convert amount to cents (Stripe uses smallest currency unit)
  const amountInCents = Math.round(amount * 100)

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amountInCents,
    currency: currency.toLowerCase(),
    metadata: metadata || {},
    automatic_payment_methods: {
      enabled: true,
    },
  })

  return paymentIntent
}

/**
 * Confirm a PaymentIntent
 */
export async function confirmPaymentIntent(
  paymentIntentId: string,
  paymentMethodId: string
): Promise<Stripe.PaymentIntent> {
  return await stripe.paymentIntents.confirm(paymentIntentId, {
    payment_method: paymentMethodId,
  })
}

/**
 * Retrieve a PaymentIntent
 */
export async function getPaymentIntent(
  paymentIntentId: string
): Promise<Stripe.PaymentIntent> {
  return await stripe.paymentIntents.retrieve(paymentIntentId)
}

/**
 * Update PaymentIntent metadata
 */
export async function updatePaymentIntentMetadata(
  paymentIntentId: string,
  metadata: Record<string, string>
): Promise<Stripe.PaymentIntent> {
  return await stripe.paymentIntents.update(paymentIntentId, {
    metadata,
  })
}

/**
 * Create Stripe Connect account
 */
export async function createConnectAccount(
  email: string,
  country: string = 'US',
  type: 'express' | 'standard' = 'express'
): Promise<Stripe.Account> {
  return await stripe.accounts.create({
    type: type,
    country: country,
    email: email,
    capabilities: {
      card_payments: { requested: true },
      transfers: { requested: true },
    },
  })
}

/**
 * Create Stripe Connect onboarding link
 */
export async function createOnboardingLink(
  accountId: string,
  returnUrl: string,
  refreshUrl: string
): Promise<Stripe.AccountLink> {
  return await stripe.accountLinks.create({
    account: accountId,
    return_url: returnUrl,
    refresh_url: refreshUrl,
    type: 'account_onboarding',
  })
}

/**
 * Retrieve Stripe Connect account
 */
export async function getConnectAccount(
  accountId: string
): Promise<Stripe.Account> {
  return await stripe.accounts.retrieve(accountId)
}

/**
 * Create Stripe Transfer to connected account
 */
export async function createTransfer(
  amount: number,
  destination: string,
  currency: string = 'usd',
  metadata?: Record<string, string>
): Promise<Stripe.Transfer> {
  const amountInCents = Math.round(amount * 100)
  return await stripe.transfers.create({
    amount: amountInCents,
    currency: currency.toLowerCase(),
    destination: destination,
    metadata: metadata || {},
  })
}

/**
 * Verify webhook signature
 */
export function verifyWebhookSignature(
  payload: string | Buffer,
  signature: string,
  secret: string
): Stripe.Event {
  return stripe.webhooks.constructEvent(payload, signature, secret)
}

