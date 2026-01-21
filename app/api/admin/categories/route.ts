import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../src/lib/prisma'

// GET /api/admin/categories - List all categories
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get('search') // Search query
    const status = searchParams.get('status') // Filter by status: active, inactive
    const sortBy = searchParams.get('sortBy') || 'displayOrder' // Sort by: displayOrder, name, createdAt, productCount
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    const where: any = {}

    // Add status filter (filter by whether category has products)
    if (status && status !== 'all') {
      if (status === 'active') {
        // Categories with products
        where.products = { some: {} }
      } else if (status === 'inactive') {
        // Categories without products
        where.products = { none: {} }
      }
    }

    // Add search filter
    if (search && search.trim()) {
      const searchTerm = search.trim()
      const searchConditions = [
        { name: { contains: searchTerm, mode: 'insensitive' } },
        { description: { contains: searchTerm, mode: 'insensitive' } },
      ]
      
      // Combine status filter with search using AND
      if (Object.keys(where).length > 0 && where.products) {
        const baseFilters = { products: where.products }
        where.AND = [
          baseFilters,
          { OR: searchConditions }
        ]
        delete where.products
      } else {
        where.OR = searchConditions
      }
    }

    // Get total count for pagination
    const total = await prisma.category.count({ where })

    // Build orderBy clause
    let orderBy: any = {}
    if (sortBy === 'name') {
      orderBy = { name: 'asc' }
    } else if (sortBy === 'createdAt') {
      orderBy = { createdAt: 'desc' }
    } else if (sortBy === 'productCount') {
      // For productCount, we need to sort after fetching
      orderBy = { displayOrder: 'asc' }
    } else {
      orderBy = { displayOrder: 'asc' }
    }

    const categories = await prisma.category.findMany({
      where,
      include: {
        products: {
          select: {
            id: true,
          },
        },
      },
      orderBy,
      skip,
      take: limit,
    })

    // Sort by productCount if needed (client-side sorting after fetching)
    let sortedCategories = categories
    if (sortBy === 'productCount') {
      sortedCategories = [...categories].sort((a, b) => b.products.length - a.products.length)
    }

    // Format response
    const formattedCategories = sortedCategories.map(category => ({
      id: category.id,
      name: category.name,
      description: category.description || '',
      displayOrder: category.displayOrder,
      productCount: category.products.length,
      createdAt: category.createdAt.toISOString().split('T')[0],
      image: category.image || null,
    }))

    return NextResponse.json({ 
      categories: formattedCategories,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      }
    })
  } catch (error) {
    console.error('Get categories error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}

// POST /api/admin/categories - Create new category
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, displayOrder, image } = body

    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { error: 'Category name is required' },
        { status: 400 }
      )
    }

    // Generate slug from name
    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

    // Check if category already exists
    const existingCategory = await prisma.category.findUnique({
      where: { name },
    })

    if (existingCategory) {
      return NextResponse.json(
        { error: 'Category already exists' },
        { status: 400 }
      )
    }

    // Create category
    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description: description || null,
        displayOrder: displayOrder || 0,
        image: image || null,
      },
    })

    return NextResponse.json({ category }, { status: 201 })
  } catch (error) {
    console.error('Create category error:', error)
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    )
  }
}

