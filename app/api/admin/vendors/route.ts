import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../src/lib/prisma'
import bcrypt from 'bcryptjs'
import { UserType } from '@prisma/client'

// GET /api/admin/vendors - List all vendors
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status') // Filter by status: active, inactive

    const vendors = await prisma.user.findMany({
      where: {
        role: UserType.VENDOR,
      },
      include: {
        storesAsVendor: {
          select: {
            id: true,
          },
        },
        ordersAsCustomer: {
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

    // Format response to match UI expectations
    const formattedVendors = vendors.map(vendor => {
      const totalRevenue = vendor.ordersAsCustomer.reduce((sum, order) => sum + order.total, 0)
      
      return {
        id: vendor.id,
        fullName: vendor.name,
        email: vendor.email,
        businessName: vendor.businessName || null,
        country: vendor.country || null,
        phoneNumber: vendor.phone || null,
        status: 'active', // Default status
        joinedDate: vendor.createdAt.toISOString().split('T')[0],
        totalStores: vendor.storesAsVendor.length,
        totalOrders: vendor.ordersAsCustomer.length,
        totalRevenue: totalRevenue,
      }
    })

    // Filter by status if provided
    let filteredVendors = formattedVendors
    if (status && status !== 'all') {
      filteredVendors = formattedVendors.filter(v => v.status === status)
    }

    return NextResponse.json({ vendors: filteredVendors })
  } catch (error) {
    console.error('Get vendors error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch vendors' },
      { status: 500 }
    )
  }
}

// POST /api/admin/vendors - Create new vendor
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
      commissionRate,
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

    // Create vendor
    const vendor = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        role: UserType.VENDOR,
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
        commissionRate: commissionRate ? parseFloat(commissionRate) : 15.0,
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
      vendor: {
        id: vendor.id,
        fullName: vendor.name,
        email: vendor.email,
        businessName: vendor.businessName,
        country: vendor.country,
        phoneNumber: vendor.phone,
        status: 'active',
        joinedDate: vendor.createdAt.toISOString().split('T')[0],
        totalStores: 0,
        totalOrders: 0,
        totalRevenue: 0,
      },
    }, { status: 201 })
  } catch (error) {
    console.error('Create vendor error:', error)
    return NextResponse.json(
      { error: 'Failed to create vendor' },
      { status: 500 }
    )
  }
}

