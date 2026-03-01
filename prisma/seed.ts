import { PrismaClient, UserType } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // Hash passwords
  const adminPassword = await bcrypt.hash('admin123', 10)
  const supplierPassword = await bcrypt.hash('supplier123', 10)
  const vendorPassword = await bcrypt.hash('vendor123', 10)
  const customerPassword = await bcrypt.hash('customer123', 10)

  // Create Admin User
  const admin = await prisma.user.upsert({
    where: { email: 'admin@dropsified.com' },
    update: {},
    create: {
      email: 'admin@dropsified.com',
      password: adminPassword,
      name: 'Sarah Chen',
      role: UserType.ADMIN,
      businessName: 'Dropsified Platform',
      phone: '+1 (555) 100-0001',
    },
  })

  // Create Supplier User
  const supplier = await prisma.user.upsert({
    where: { email: 'supplier@dropsified.com' },
    update: {},
    create: {
      email: 'supplier@dropsified.com',
      password: supplierPassword,
      name: 'Michael Rodriguez',
      role: UserType.SUPPLIER,
      businessName: 'TechSupply Co.',
      phone: '+1 (555) 200-0002',
      productCategories: 'Electronics, Accessories, Gadgets',
      shippingLocations: 'USA, Canada, Mexico',
      minimumOrderValue: 100.0,
    },
  })

  // Create Vendor User
  const vendor = await prisma.user.upsert({
    where: { email: 'vendor@dropsified.com' },
    update: {},
    create: {
      email: 'vendor@dropsified.com',
      password: vendorPassword,
      name: 'Emma Thompson',
      role: UserType.VENDOR,
      businessName: 'Digital Marketplace',
      phone: '+1 (555) 300-0003',
      commissionRate: 15.0,
    },
  })

  // Create Customer User
  const customer = await prisma.user.upsert({
    where: { email: 'customer@dropsified.com' },
    update: {},
    create: {
      email: 'customer@dropsified.com',
      password: customerPassword,
      name: 'James Wilson',
      role: UserType.CUSTOMER,
      phone: '+1 (555) 400-0004',
    },
  })

  console.log('✅ Users created:')
  console.log(`   - Admin: ${admin.email}`)
  console.log(`   - Supplier: ${supplier.email}`)
  console.log(`   - Vendor: ${vendor.email}`)
  console.log(`   - Customer: ${customer.email}`)

  // Seed invoice templates
  const { seedInvoiceTemplates } = await import('../src/lib/invoice-templates-seed')
  const templateResult = await seedInvoiceTemplates()
  if (templateResult.success) {
    console.log('✅ Invoice templates seeded')
  } else {
    console.error('❌ Invoice templates seed failed:', templateResult.error)
  }

  console.log('\n🎉 Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

