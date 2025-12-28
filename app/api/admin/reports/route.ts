import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../src/lib/prisma'
import { ReportType, ReportFormat, ReportStatus } from '@prisma/client'

// GET /api/admin/reports - List all reports
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const type = searchParams.get('type')
    const status = searchParams.get('status')

    const where: any = {}
    if (type && type !== 'all') {
      where.type = type.toUpperCase() as ReportType
    }
    if (status && status !== 'all') {
      where.status = status.toUpperCase() as ReportStatus
    }

    const reports = await prisma.report.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // Format response
    const formattedReports = reports.map(report => ({
      id: report.reportNumber,
      reportNumber: report.reportNumber,
      type: report.type,
      dateRange: `${report.dateFrom.toISOString().split('T')[0]} - ${report.dateTo.toISOString().split('T')[0]}`,
      format: report.format,
      status: report.status.toLowerCase(),
      fileSize: report.fileSize || '0 MB',
      generatedAt: report.generatedAt?.toISOString() || null,
      createdAt: report.createdAt.toISOString(),
    }))

    return NextResponse.json({ reports: formattedReports })
  } catch (error) {
    console.error('Get reports error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch reports' },
      { status: 500 }
    )
  }
}

// POST /api/admin/reports - Generate new report
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, dateFrom, dateTo, format, userId } = body

    // Validate required fields
    if (!type || !dateFrom || !dateTo || !format) {
      return NextResponse.json(
        { error: 'Type, date range, and format are required' },
        { status: 400 }
      )
    }

    // Generate report number
    const date = new Date()
    const dateStr = date.toISOString().split('T')[0].replace(/-/g, '')
    const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
    const reportNumber = `RPT-${dateStr}-${randomNum}`

    // Create report
    const report = await prisma.report.create({
      data: {
        reportNumber,
        type: type.toUpperCase() as ReportType,
        dateFrom: new Date(dateFrom),
        dateTo: new Date(dateTo),
        format: format.toUpperCase() as ReportFormat,
        status: ReportStatus.GENERATING,
        userId: userId || null,
      },
    })

    // In a real app, you would trigger report generation here
    // For now, we'll just return the created report

    return NextResponse.json({ report }, { status: 201 })
  } catch (error) {
    console.error('Generate report error:', error)
    return NextResponse.json(
      { error: 'Failed to generate report' },
      { status: 500 }
    )
  }
}

