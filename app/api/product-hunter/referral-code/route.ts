import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../src/lib/prisma'

// GET /api/product-hunter/referral-code - Get or create referral code for invite link
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const hunterId = searchParams.get('hunterId')
    if (!hunterId) {
      return NextResponse.json({ error: 'Hunter ID is required' }, { status: 401 })
    }

    let hunter = await prisma.user.findUnique({
      where: { id: hunterId, role: 'PRODUCT_HUNTER' },
      select: { hunterReferralCode: true },
    })
    if (!hunter) {
      return NextResponse.json({ error: 'Hunter not found' }, { status: 404 })
    }

    let code = hunter.hunterReferralCode
    if (!code) {
      code = 'HUNTER-' + hunterId.slice(-8).toUpperCase()
      await prisma.user.update({
        where: { id: hunterId },
        data: { hunterReferralCode: code },
      })
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '') || ''
    const path = `/signup?ref=${encodeURIComponent(code)}`
    const inviteLink = baseUrl && baseUrl !== 'undefined' ? `${baseUrl}${path}` : path

    return NextResponse.json({ referralCode: code, code, inviteLink })
  } catch (error: any) {
    console.error('Product hunter referral code error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to get referral code' },
      { status: 500 }
    )
  }
}
