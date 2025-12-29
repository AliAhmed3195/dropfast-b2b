import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../../src/lib/prisma'

// DELETE /api/vendor/products/[id] - Remove product from store
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const storeProductId = params.id

    if (!storeProductId) {
      return NextResponse.json(
        { error: 'Store Product ID is required' },
        { status: 400 }
      )
    }

    await prisma.storeProduct.delete({
      where: { id: storeProductId },
    })

    return NextResponse.json({
      message: 'Product removed from store successfully',
    })
  } catch (error: any) {
    console.error('Delete vendor product error:', error)
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to remove product' },
      { status: 500 }
    )
  }
}

