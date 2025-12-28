import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../src/lib/prisma'

// GET /api/admin/categories - List all categories
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        products: {
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        displayOrder: 'asc',
      },
    })

    // Format response
    const formattedCategories = categories.map(category => ({
      id: category.id,
      name: category.name,
      description: category.description || '',
      displayOrder: category.displayOrder,
      productCount: category.products.length,
      createdAt: category.createdAt.toISOString().split('T')[0],
      image: category.image || null,
    }))

    return NextResponse.json({ categories: formattedCategories })
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

