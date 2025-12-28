import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../src/lib/prisma'
import bcrypt from 'bcryptjs'
import { UserType } from '@prisma/client'

// GET /api/admin/suppliers - List all suppliers
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status') // Filter by status: active, inactive

    const suppliers = await prisma.user.findMany({
      where: {
        role: UserType.SUPPLIER,
      },
      include: {
        productsAsSupplier: {
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // Calculate total revenue (would need to join with orders, simplified for now)
    const formattedSuppliers = suppliers.map(supplier => ({
      id: supplier.id,
      fullName: supplier.name,
      email: supplier.email,
      businessName: supplier.businessName || null,
      country: supplier.country || null,
      phoneNumber: supplier.phone || null,
      status: 'active', // Default status
      joinedDate: supplier.createdAt.toISOString().split('T')[0],
      totalProducts: supplier.productsAsSupplier.length,
      totalRevenue: 0, // Would need to calculate from orders
    }))

    // Filter by status if provided
    let filteredSuppliers = formattedSuppliers
    if (status && status !== 'all') {
      filteredSuppliers = formattedSuppliers.filter(s => s.status === status)
    }

    return NextResponse.json({ suppliers: filteredSuppliers })
  } catch (error) {
    console.error('Get suppliers error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch suppliers' },
      { status: 500 }
    )
  }
}

// POST /api/admin/suppliers - Create new supplier
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      name,
      email,
      password,
      phone,
      businessName,
      businessType,
      streetAddress,
      city,
      stateProvince,
      zipCode,
      addressCountry,
      country,
      currency,
      productCategories,
      shippingLocations,
      minimumOrderValue,
    } = body

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      )
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create supplier
    const supplier = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        role: UserType.SUPPLIER,
        phone: phone || null,
        businessName: businessName || null,
        businessType: businessType || null,
        streetAddress: streetAddress || null,
        city: city || null,
        stateProvince: stateProvince || null,
        zipCode: zipCode || null,
        addressCountry: addressCountry || null,
        country: country || null,
        currency: currency || null,
        productCategories: productCategories || null,
        shippingLocations: shippingLocations || null,
        minimumOrderValue: minimumOrderValue ? parseFloat(minimumOrderValue) : null,
      },
      select: {
        id: true,
        email: true,
        name: true,
        businessName: true,
        country: true,
        phone: true,
        createdAt: true,
      },
    })

    return NextResponse.json({
      supplier: {
        id: supplier.id,
        fullName: supplier.name,
        email: supplier.email,
        businessName: supplier.businessName,
        country: supplier.country,
        phoneNumber: supplier.phone,
        status: 'active',
        joinedDate: supplier.createdAt.toISOString().split('T')[0],
        totalProducts: 0,
        totalRevenue: 0,
      },
    }, { status: 201 })
  } catch (error) {
    console.error('Create supplier error:', error)
    return NextResponse.json(
      { error: 'Failed to create supplier' },
      { status: 500 }
    )
  }
}

