import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../src/lib/prisma'
import { StoreType, StoreStatus, StoreTemplate } from '@prisma/client'
import { getTemplateEnumFromId, initializeStoreSections, getTemplateIdFromEnum } from '../../../../src/lib/store-helpers'

// GET /api/vendor/stores - List all stores for a vendor
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const vendorId = searchParams.get('vendorId')
    const status = searchParams.get('status') // all, draft, active, inactive

    if (!vendorId) {
      return NextResponse.json(
        { error: 'Vendor ID is required' },
        { status: 401 }
      )
    }

    // Verify vendor exists
    const vendor = await prisma.user.findUnique({
      where: { id: vendorId, role: 'VENDOR' },
    })

    if (!vendor) {
      return NextResponse.json(
        { error: 'Vendor not found' },
        { status: 404 }
      )
    }

    const where: any = {
      vendorId,
    }

    if (status && status !== 'all') {
      where.status = status.toUpperCase() as StoreStatus
    }

    const stores = await prisma.store.findMany({
      where,
      include: {
        storeProducts: {
          select: {
            id: true,
            status: true,
          },
        },
        orders: {
          select: {
            id: true,
            total: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // Calculate statistics for each store
    const formattedStores = stores.map(store => {
      const productsCount = store.storeProducts.length
      const activeProductsCount = store.storeProducts.filter(sp => sp.status === 'active').length
      const ordersCount = store.orders.length
      const revenue = store.orders.reduce((sum, order) => sum + order.total, 0)

      return {
        id: store.id,
        name: store.name,
        slug: store.slug,
        url: `/store/${store.slug}`, // Public URL
        storeType: store.storeType.toLowerCase(),
        template: store.template.toLowerCase(),
        templateId: getTemplateIdFromEnum(store.template, store.storeType), // For UI
        status: store.status.toLowerCase(),
        industry: store.industry || 'N/A',
        logo: store.logo || '',
        banner: store.banner || '',
        primaryColor: store.primaryColor,
        secondaryColor: store.secondaryColor,
        fontFamily: store.fontFamily,
        stats: {
          products: productsCount,
          activeProducts: activeProductsCount,
          orders: ordersCount,
          revenue: parseFloat(revenue.toFixed(2)),
          views: 0, // TODO: Add analytics tracking
        },
        createdAt: store.createdAt.toISOString().split('T')[0],
        updatedAt: store.updatedAt.toISOString().split('T')[0],
      }
    })

    return NextResponse.json({ stores: formattedStores })
  } catch (error) {
    console.error('Get vendor stores error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stores' },
      { status: 500 }
    )
  }
}

// POST /api/vendor/stores - Create new store
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      vendorId,
      name,
      storeType,
      industry,
      templateId,
      description,
    } = body

    if (!vendorId || !name || !storeType || !industry || !templateId) {
      return NextResponse.json(
        { error: 'Missing required fields: vendorId, name, storeType, industry, templateId' },
        { status: 400 }
      )
    }

    // Verify vendor exists
    const vendor = await prisma.user.findUnique({
      where: { id: vendorId, role: 'VENDOR' },
    })

    if (!vendor) {
      return NextResponse.json(
        { error: 'Vendor not found' },
        { status: 404 }
      )
    }

    // Generate slug from name
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    // Check if slug already exists
    const existingStore = await prisma.store.findUnique({
      where: { slug },
    })

    if (existingStore) {
      return NextResponse.json(
        { error: 'Store name already exists. Please choose a different name.' },
        { status: 400 }
      )
    }

    // Map template ID to enum
    const templateEnum = getTemplateEnumFromId(templateId)

    // Map storeType string to enum
    const storeTypeEnum = storeType === 'single-product' 
      ? StoreType.SINGLE_PRODUCT 
      : StoreType.MULTI_PRODUCT

    // Initialize sections from template
    const initialSections = initializeStoreSections(templateId)

    // Create store
    const newStore = await prisma.store.create({
      data: {
        name,
        slug,
        description: description || null,
        industry: industry || null,
        storeType: storeTypeEnum,
        template: templateEnum,
        status: StoreStatus.DRAFT,
        vendorId,
        // Default theme colors
        primaryColor: '#6366f1',
        secondaryColor: '#06b6d4',
        fontFamily: 'Inter',
        // Initialize sections from template
        sections: initialSections,
      },
    })

    // Parse sections for response
    let parsedSections = []
    if (newStore.sections) {
      try {
        parsedSections = typeof newStore.sections === 'string'
          ? JSON.parse(newStore.sections)
          : newStore.sections
      } catch (e) {
        parsedSections = initialSections
      }
    } else {
      parsedSections = initialSections
    }

    return NextResponse.json(
      {
        store: {
          id: newStore.id,
          name: newStore.name,
          slug: newStore.slug,
          url: `/store/${newStore.slug}`,
          storeType: newStore.storeType.toLowerCase(),
          template: newStore.template.toLowerCase(),
          templateId: getTemplateIdFromEnum(newStore.template, newStore.storeType),
          status: newStore.status.toLowerCase(),
          industry: newStore.industry,
          sections: parsedSections,
          createdAt: newStore.createdAt.toISOString(),
        },
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Create store error:', error)
    
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Store slug already exists. Please choose a different name.' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create store', details: error.message },
      { status: 500 }
    )
  }
}

