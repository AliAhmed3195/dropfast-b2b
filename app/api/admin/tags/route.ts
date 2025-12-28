import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../src/lib/prisma'

// GET /api/admin/tags - List all tags
export async function GET() {
  try {
    const tags = await prisma.tag.findMany({
      include: {
        products: {
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // Format response
    const formattedTags = tags.map(tag => ({
      id: tag.id,
      name: tag.name,
      color: tag.color || '#9333ea',
      productCount: tag.products.length,
      createdAt: tag.createdAt.toISOString().split('T')[0],
    }))

    return NextResponse.json({ tags: formattedTags })
  } catch (error) {
    console.error('Get tags error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tags' },
      { status: 500 }
    )
  }
}

// POST /api/admin/tags - Create new tag
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, color } = body

    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { error: 'Tag name is required' },
        { status: 400 }
      )
    }

    // Generate slug from name
    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

    // Check if tag already exists
    const existingTag = await prisma.tag.findUnique({
      where: { name },
    })

    if (existingTag) {
      return NextResponse.json(
        { error: 'Tag already exists' },
        { status: 400 }
      )
    }

    // Create tag
    const tag = await prisma.tag.create({
      data: {
        name,
        slug,
        color: color || null,
      },
    })

    return NextResponse.json({ tag }, { status: 201 })
  } catch (error) {
    console.error('Create tag error:', error)
    return NextResponse.json(
      { error: 'Failed to create tag' },
      { status: 500 }
    )
  }
}

