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
    where: { email: 'admin@fastdrop.com' },
    update: {},
    create: {
      email: 'admin@fastdrop.com',
      password: adminPassword,
      name: 'Sarah Chen',
      role: UserType.ADMIN,
      businessName: 'FastDrop Platform',
      phone: '+1 (555) 100-0001',
    },
  })

  // Create Supplier User
  const supplier = await prisma.user.upsert({
    where: { email: 'supplier@fastdrop.com' },
    update: {},
    create: {
      email: 'supplier@fastdrop.com',
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
    where: { email: 'vendor@fastdrop.com' },
    update: {},
    create: {
      email: 'vendor@fastdrop.com',
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
    where: { email: 'customer@fastdrop.com' },
    update: {},
    create: {
      email: 'customer@fastdrop.com',
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

