import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../src/lib/prisma'

// GET /api/vendor/invoice-templates - Get invoice templates and store assignments
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const vendorId = searchParams.get('vendorId')

    if (!vendorId) {
      return NextResponse.json(
        { error: 'Vendor ID is required' },
        { status: 401 }
      )
    }

    // Verify vendor exists and get their stores
    const vendor = await prisma.user.findUnique({
      where: { id: vendorId, role: 'VENDOR' },
      include: {
        storesAsVendor: {
          include: {
            invoiceTemplate: {
              include: {
                template: {
                  select: {
                    id: true,
                    name: true,
                    description: true,
                    layout: true,
                    accentColor: true,
                  },
                },
              },
            },
          },
        },
      },
    })

    if (!vendor) {
      return NextResponse.json(
        { error: 'Vendor not found' },
        { status: 404 }
      )
    }

    // Get only active invoice templates
    const templates = await prisma.invoiceTemplate.findMany({
      where: {
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        description: true,
        layout: true,
        accentColor: true,
      },
      orderBy: {
        name: 'asc',
      },
    })

    // Format stores with their template assignments
    const stores = vendor.storesAsVendor.map(store => ({
      id: store.id,
      name: store.name,
      templateId: store.invoiceTemplate?.templateId || null,
      template: store.invoiceTemplate?.template || null,
    }))

    return NextResponse.json({
      templates,
      stores,
    })
  } catch (error) {
    console.error('Get vendor invoice templates error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch invoice templates' },
      { status: 500 }
    )
  }
}

// PUT /api/vendor/invoice-templates - Update store template assignment
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { vendorId, storeId, templateId } = body

    if (!vendorId || !storeId || !templateId) {
      return NextResponse.json(
        { error: 'Vendor ID, Store ID, and Template ID are required' },
        { status: 400 }
      )
    }

    // Verify store belongs to vendor
    const store = await prisma.store.findFirst({
      where: {
        id: storeId,
        vendorId,
      },
    })

    if (!store) {
      return NextResponse.json(
        { error: 'Store not found or does not belong to vendor' },
        { status: 404 }
      )
    }

    // Verify template exists
    const template = await prisma.invoiceTemplate.findUnique({
      where: { id: templateId },
    })

    if (!template) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      )
    }

    // Update or create StoreInvoiceTemplate
    const storeTemplate = await prisma.storeInvoiceTemplate.upsert({
      where: {
        storeId,
      },
      update: {
        templateId,
      },
      create: {
        storeId,
        templateId,
      },
      include: {
        template: {
          select: {
            id: true,
            name: true,
            description: true,
            layout: true,
            accentColor: true,
          },
        },
      },
    })

    return NextResponse.json({
      message: 'Template assigned successfully',
      storeTemplate,
    })
  } catch (error: any) {
    console.error('Update vendor invoice template error:', error)
    
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Template assignment already exists' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to update template assignment' },
      { status: 500 }
    )
  }
}

