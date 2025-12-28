import { NextResponse } from 'next/server'
import { prisma } from '../../../../src/lib/prisma'
import { seedInvoiceTemplates } from '../../../../src/lib/invoice-templates-seed'

// GET /api/admin/invoice-templates - List all invoice templates
export async function GET() {
  try {
    // Auto-seed templates if database is empty
    const templateCount = await prisma.invoiceTemplate.count()
    if (templateCount === 0) {
      console.log('📦 No templates found, seeding from code...')
      await seedInvoiceTemplates()
    }

    const templates = await prisma.invoiceTemplate.findMany({
      include: {
        storeTemplates: {
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // Format response to match UI expectations
    const formattedTemplates = templates.map(template => ({
      id: template.id,
      name: template.name,
      description: template.description || '',
      layout: template.layout || '',
      isDefault: template.isDefault,
      isActive: template.isActive,
      accentColor: template.accentColor || '',
      usedBy: template.storeTemplates.length,
      createdAt: template.createdAt.toISOString(),
      updatedAt: template.updatedAt.toISOString(),
    }))

    return NextResponse.json({ templates: formattedTemplates })
  } catch (error) {
    console.error('Get invoice templates error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch invoice templates' },
      { status: 500 }
    )
  }
}

