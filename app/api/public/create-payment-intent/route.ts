import { NextRequest, NextResponse } from 'next/server'
import { createPaymentIntent } from '../../../../src/lib/stripe'
import { convertToUSD } from '../../../../src/lib/currency'

// POST /api/public/create-payment-intent - Create Stripe PaymentIntent
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { amount, currency = 'USD', metadata } = body

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      )
    }

    // Convert to USD if needed (Stripe will handle currency conversion)
    // But we store everything in USD internally
    const amountUSD = convertToUSD(amount, currency)

    // Create PaymentIntent
    const paymentIntent = await createPaymentIntent(
      amountUSD,
      'usd', // Always use USD for Stripe
      metadata
    )

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: amountUSD,
      currency: 'USD',
    })
  } catch (error: any) {
    console.error('Create payment intent error:', error)
    return NextResponse.json(
      { error: 'Failed to create payment intent', details: error.message },
      { status: 500 }
    )
  }
}

