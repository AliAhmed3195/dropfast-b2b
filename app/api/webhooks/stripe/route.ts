import { NextRequest, NextResponse } from 'next/server'
import { verifyWebhookSignature } from '../../../../src/lib/stripe'
import { prisma } from '../../../../src/lib/prisma'
import { PaymentStatus } from '@prisma/client'

// POST /api/webhooks/stripe - Handle Stripe webhooks
export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      )
    }

    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      return NextResponse.json(
        { error: 'STRIPE_WEBHOOK_SECRET not configured' },
        { status: 500 }
      )
    }

    // Verify webhook signature
    let event
    try {
      event = verifyWebhookSignature(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      )
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message)
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      )
    }

    // Handle different event types
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as any
        const orderId = paymentIntent.metadata?.orderId

        if (orderId) {
          // Update order payment status
          await prisma.order.update({
            where: { id: orderId },
            data: {
              paymentStatus: PaymentStatus.PAID,
            },
          })
        }
        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as any
        const orderId = paymentIntent.metadata?.orderId

        if (orderId) {
          // Update order payment status
          await prisma.order.update({
            where: { id: orderId },
            data: {
              paymentStatus: PaymentStatus.FAILED,
            },
          })
        }
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('Stripe webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed', details: error.message },
      { status: 500 }
    )
  }
}

