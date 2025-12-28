import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../../src/lib/prisma'

// PUT /api/admin/invoice-templates/[id] - Update invoice template
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { name, description, template, layout, accentColor, isDefault, isActive } = body

    // Check if template exists
    const existingTemplate = await prisma.invoiceTemplate.findUnique({
      where: { id: params.id },
    })

    if (!existingTemplate) {
      return NextResponse.json(
        { error: 'Invoice template not found' },
        { status: 404 }
      )
    }

    // If setting as default, unset other defaults
    if (isDefault && !existingTemplate.isDefault) {
      await prisma.invoiceTemplate.updateMany({
        where: { isDefault: true },
        data: { isDefault: false },
      })
    }

    // Prepare update data
    const updateData: any = {}
    if (name !== undefined) updateData.name = name
    if (description !== undefined) updateData.description = description || null
    if (template !== undefined) updateData.template = template
    if (layout !== undefined) updateData.layout = layout || null
    if (accentColor !== undefined) updateData.accentColor = accentColor || null
    if (isDefault !== undefined) updateData.isDefault = isDefault
    if (isActive !== undefined) updateData.isActive = isActive

    // Update template
    const updatedTemplate = await prisma.invoiceTemplate.update({
      where: { id: params.id },
      data: updateData,
    })

    return NextResponse.json({ template: updatedTemplate })
  } catch (error) {
    console.error('Update invoice template error:', error)
    return NextResponse.json(
      { error: 'Failed to update invoice template' },
      { status: 500 }
    )
  }
}

