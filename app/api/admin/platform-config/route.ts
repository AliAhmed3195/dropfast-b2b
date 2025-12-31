import { NextRequest, NextResponse } from 'next/server'
import { getPlatformConfig, updatePlatformConfig } from '../../../../src/lib/platform-config'

// GET /api/admin/platform-config - Get platform configuration
export async function GET(request: NextRequest) {
  try {
    const config = await getPlatformConfig()
    return NextResponse.json(config)
  } catch (error: any) {
    console.error('Get platform config error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch platform config', details: error.message },
      { status: 500 }
    )
  }
}

// PUT /api/admin/platform-config - Update platform configuration
export async function PUT(request: NextRequest) {
  try {
    // TODO: Add admin authentication check
    const body = await request.json()
    const { platformFeePercentage, stripeFeePercentage } = body

    const config = await updatePlatformConfig(
      platformFeePercentage,
      stripeFeePercentage
    )

    return NextResponse.json(config)
  } catch (error: any) {
    console.error('Update platform config error:', error)
    return NextResponse.json(
      { error: 'Failed to update platform config', details: error.message },
      { status: 500 }
    )
  }
}

