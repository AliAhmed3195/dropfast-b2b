import { NextRequest, NextResponse } from 'next/server'
import { verifyWebhookSignature } from '../../../../src/lib/stripe'
import { prisma } from '../../../../src/lib/prisma'
import { PaymentStatus, PayoutStatus } from '@prisma/client'

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
          await prisma.order.update({
            where: { id: orderId },
            data: {
              paymentStatus: PaymentStatus.FAILED,
            },
          })
        }
        break
      }

      case 'payment_intent.canceled': {
        const paymentIntent = event.data.object as any
        const orderId = paymentIntent.metadata?.orderId

        if (orderId) {
          await prisma.order.update({
            where: { id: orderId },
            data: {
              paymentStatus: PaymentStatus.FAILED,
            },
          })
        }
        break
      }

      case 'account.updated': {
        const account = event.data.object as any
        const accountId = account.id

        const user = await prisma.user.findFirst({
          where: { stripeAccountId: accountId },
        })

        if (user) {
          // Determine KYC status
          let kycStatus = 'pending'
          if (account.charges_enabled && account.payouts_enabled) {
            kycStatus = 'verified'
          } else if (account.details_submitted === false) {
            kycStatus = 'pending'
          }

          await prisma.user.update({
            where: { id: user.id },
            data: {
              stripeKycStatus: kycStatus,
              stripeOnboardingComplete: account.details_submitted || false,
              stripeChargesEnabled: account.charges_enabled || false,
              stripePayoutsEnabled: account.payouts_enabled || false,
            },
          })
        }
        break
      }

      case 'capability.updated': {
        const capability = event.data.object as any
        const accountId = capability.account

        const user = await prisma.user.findFirst({
          where: { stripeAccountId: accountId },
        })

        if (user) {
          const updateData: any = {}
          if (capability.type === 'card_payments') {
            updateData.stripeChargesEnabled = capability.status === 'active'
          } else if (capability.type === 'transfers') {
            updateData.stripePayoutsEnabled = capability.status === 'active'
          }

          if (Object.keys(updateData).length > 0) {
            await prisma.user.update({
              where: { id: user.id },
              data: updateData,
            })
          }
        }
        break
      }

      case 'transfer.created': {
        const transfer = event.data.object as any
        const transferId = transfer.id

        // Find payout by transferId
        const payout = await prisma.payout.findFirst({
          where: { transferId: transferId },
        })

        if (payout) {
          // Transfer created, status should already be PROCESSING
          // But update transferId if not set
          await prisma.payout.update({
            where: { id: payout.id },
            data: {
              transferId: transferId,
              status: PayoutStatus.PROCESSING,
            },
          })
        }
        break
      }

      case 'transfer.updated': {
        const transfer = event.data.object as any
        const transferId = transfer.id
        const transferStatus = transfer.status

        const payout = await prisma.payout.findFirst({
          where: { transferId: transferId },
        })

        if (payout) {
          // Update payout status based on transfer status
          if (transferStatus === 'paid') {
            await prisma.payout.update({
              where: { id: payout.id },
              data: {
                status: PayoutStatus.COMPLETED,
                processedAt: new Date(),
              },
            })
          } else if (transferStatus === 'failed' || transferStatus === 'canceled') {
            await prisma.payout.update({
              where: { id: payout.id },
              data: {
                status: PayoutStatus.FAILED,
              },
            })
          } else if (transferStatus === 'pending') {
            await prisma.payout.update({
              where: { id: payout.id },
              data: {
                status: PayoutStatus.PROCESSING,
              },
            })
          }
        }
        break
      }

      case 'transfer.reversed': {
        const transfer = event.data.object as any
        const transferId = transfer.id

        const payout = await prisma.payout.findFirst({
          where: { transferId: transferId },
        })

        if (payout) {
          await prisma.payout.update({
            where: { id: payout.id },
            data: {
              status: PayoutStatus.FAILED,
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

