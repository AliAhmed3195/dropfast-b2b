import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../src/lib/prisma'
import { createConnectAccount, createOnboardingLink } from '../../../../src/lib/stripe'

// POST /api/supplier/stripe-connect/create-account - Create Stripe Connect account
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, returnUrl, refreshUrl } = body

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Get supplier
    const supplier = await prisma.user.findUnique({
      where: { id: userId, role: 'SUPPLIER' },
      select: {
        id: true,
        email: true,
        stripeAccountId: true,
        addressCountry: true,
        country: true,
      },
    })

    if (!supplier) {
      return NextResponse.json(
        { error: 'Supplier not found' },
        { status: 404 }
      )
    }

    // Check if account already exists
    if (supplier.stripeAccountId) {
      return NextResponse.json(
        { error: 'Stripe account already exists', accountId: supplier.stripeAccountId },
        { status: 400 }
      )
    }

    // Create Stripe Connect account
    const account = await createConnectAccount(
      supplier.email,
      supplier.country || supplier.addressCountry || 'US',
      'express'
    )

    // Save account ID to database
    await prisma.user.update({
      where: { id: userId },
      data: {
        stripeAccountId: account.id,
        stripeKycStatus: 'pending',
        stripeOnboardingComplete: false,
      },
    })

    // Create onboarding link if URLs provided
    let onboardingUrl = null
    if (returnUrl && refreshUrl) {
      const accountLink = await createOnboardingLink(
        account.id,
        returnUrl,
        refreshUrl
      )
      onboardingUrl = accountLink.url
    }

    return NextResponse.json({
      accountId: account.id,
      onboardingUrl,
    })
  } catch (error: any) {
    console.error('Create Stripe Connect account error:', error)
    return NextResponse.json(
      { error: 'Failed to create Stripe account', details: error.message },
      { status: 500 }
    )
  }
}

// GET /api/supplier/stripe-connect/onboarding-link - Get onboarding link
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId')
    const returnUrl = searchParams.get('returnUrl')
    const refreshUrl = searchParams.get('refreshUrl')

    if (!userId || !returnUrl || !refreshUrl) {
      return NextResponse.json(
        { error: 'userId, returnUrl, and refreshUrl are required' },
        { status: 400 }
      )
    }

    // Get supplier
    const supplier = await prisma.user.findUnique({
      where: { id: userId, role: 'SUPPLIER' },
      select: {
        id: true,
        stripeAccountId: true,
      },
    })

    if (!supplier) {
      return NextResponse.json(
        { error: 'Supplier not found' },
        { status: 404 }
      )
    }

    if (!supplier.stripeAccountId) {
      return NextResponse.json(
        { error: 'Stripe account not created. Please create account first.' },
        { status: 400 }
      )
    }

    // Create onboarding link
    const accountLink = await createOnboardingLink(
      supplier.stripeAccountId,
      returnUrl,
      refreshUrl
    )

    return NextResponse.json({
      onboardingUrl: accountLink.url,
    })
  } catch (error: any) {
    console.error('Create onboarding link error:', error)
    return NextResponse.json(
      { error: 'Failed to create onboarding link', details: error.message },
      { status: 500 }
    )
  }
}

