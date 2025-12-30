import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../../../src/lib/prisma'
import { StoreStatus } from '@prisma/client'

// PUT /api/vendor/stores/[id]/status - Update store status (publish/unpublish)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { vendorId, status } = body

    if (!status) {
      return NextResponse.json(
        { error: 'Status is required' },
        { status: 400 }
      )
    }

    // Validate status
    const validStatuses = ['DRAFT', 'ACTIVE', 'INACTIVE']
    const statusUpper = status.toUpperCase()
    if (!validStatuses.includes(statusUpper)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be DRAFT, ACTIVE, or INACTIVE' },
        { status: 400 }
      )
    }

    // Check if store exists and belongs to vendor
    const store = await prisma.store.findUnique({
      where: { id: params.id },
    })

    if (!store) {
      return NextResponse.json(
        { error: 'Store not found' },
        { status: 404 }
      )
    }

    // Verify vendor owns this store
    if (vendorId && store.vendorId !== vendorId) {
      return NextResponse.json(
        { error: 'Unauthorized: Store does not belong to vendor' },
        { status: 403 }
      )
    }

    // Validation before publishing (ACTIVE)
    if (statusUpper === 'ACTIVE') {
      if (!store.name) {
        return NextResponse.json(
          { error: 'Store name is required before publishing' },
          { status: 400 }
        )
      }
      // Optional: Check if at least one product exists
      // const productCount = await prisma.storeProduct.count({
      //   where: { storeId: params.id, status: 'active' },
      // })
      // if (productCount === 0) {
      //   return NextResponse.json(
      //     { error: 'Add at least one product before publishing' },
      //     { status: 400 }
      //   )
      // }
    }

    // Update status
    const updatedStore = await prisma.store.update({
      where: { id: params.id },
      data: {
        status: statusUpper as StoreStatus,
      },
    })

    return NextResponse.json({
      message: statusUpper === 'ACTIVE' 
        ? 'Store published successfully!' 
        : statusUpper === 'DRAFT'
        ? 'Store saved as draft'
        : 'Store deactivated',
      store: {
        id: updatedStore.id,
        name: updatedStore.name,
        status: updatedStore.status.toLowerCase(),
      },
    })
  } catch (error) {
    console.error('Update store status error:', error)
    return NextResponse.json(
      { error: 'Failed to update store status' },
      { status: 500 }
    )
  }
}

