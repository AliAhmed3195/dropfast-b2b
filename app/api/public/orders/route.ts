import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../src/lib/prisma'
import { OrderStatus, PaymentStatus } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { convertToUSD, getExchangeRate } from '../../../../src/lib/currency'
import { calculatePlatformFee, calculateStripeFee, getPlatformConfig } from '../../../../src/lib/platform-config'
import { updatePaymentIntentMetadata } from '../../../../src/lib/stripe'

// POST /api/public/orders - Create order from public store
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      storeId,
      customerEmail,
      customerPhone,
      customerName,
      // Shipping
      shippingFullName,
      shippingAddress,
      shippingCity,
      shippingState,
      shippingZipCode,
      shippingCountry,
      shippingPhone,
      // Payment
      paymentMethod,
      paymentIntentId, // Stripe PaymentIntent ID (optional)
      // Items
      items, // Array of { productId, storeProductId, quantity, price, productName, productImage, currency }
      // Totals
      subtotal,
      shipping,
      shippingMethod,
      tax,
      total,
      customerCurrency, // Customer's currency (for display only)
    } = body

    // Validation
    if (!storeId || !customerEmail || !items || items.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields: storeId, customerEmail, items' },
        { status: 400 }
      )
    }

    // Verify store exists and is active
    const store = await prisma.store.findUnique({
      where: { id: storeId },
      select: { id: true, status: true },
    })

    if (!store) {
      return NextResponse.json(
        { error: 'Store not found' },
        { status: 404 }
      )
    }

    if (store.status !== 'ACTIVE') {
      return NextResponse.json(
        { error: 'Store is not available for orders' },
        { status: 403 }
      )
    }

    // Find or create customer (guest customer)
    let customer = await prisma.user.findUnique({
      where: { email: customerEmail },
    })

    if (!customer) {
      // Create guest customer with random password (they can reset later)
      const randomPassword = Math.random().toString(36).slice(-12) + Date.now().toString(36)
      const hashedPassword = await bcrypt.hash(randomPassword, 10)
      
      customer = await prisma.user.create({
        data: {
          email: customerEmail,
          name: customerName || 'Guest Customer',
          phone: customerPhone || null,
          role: 'CUSTOMER',
          password: hashedPassword,
        },
      })
    }

    // Get platform config for fee calculations
    const platformConfig = await getPlatformConfig()
    const currency = customerCurrency || 'USD'
    const exchangeRate = getExchangeRate(currency, 'USD')

    // Convert totals to USD
    const subtotalUSD = convertToUSD(parseFloat(subtotal) || 0, currency)
    const shippingUSD = convertToUSD(parseFloat(shipping) || 0, currency)
    const taxUSD = convertToUSD(parseFloat(tax) || 0, currency)
    const totalUSD = convertToUSD(parseFloat(total) || 0, currency)

    // Validate shipping country for all products
    const productIds = items.map((item: any) => item.productId).filter(Boolean)
    if (productIds.length > 0) {
      const products = await prisma.product.findMany({
        where: { id: { in: productIds } },
        select: { id: true, name: true, shippingCountries: true },
      })

      // Check if shipping country is valid for all products
      const invalidProducts = products.filter((product) => {
        if (!product.shippingCountries || product.shippingCountries.length === 0) {
          return false // Empty array means all countries allowed
        }
        return !product.shippingCountries.includes(shippingCountry)
      })

      if (invalidProducts.length > 0) {
        const productNames = invalidProducts.map(p => p.name).join(', ')
        return NextResponse.json(
          { error: `The following products cannot be shipped to ${shippingCountry}: ${productNames}` },
          { status: 400 }
        )
      }
    }

    // Process order items with fee calculations
    const orderItemsData = await Promise.all(
      items.map(async (item: any) => {
        // Fetch product and storeProduct data
        const productId = item.productId
        let storeProductId = item.storeProductId

        // Get product details
        const product = await prisma.product.findUnique({
          where: { id: productId },
          select: {
            id: true,
            sellingPrice: true,
            supplierId: true,
          },
        })

        if (!product) {
          throw new Error(`Product not found: ${item.productName}`)
        }

        // If storeProductId not provided, find it from storeId and productId
        if (!storeProductId) {
          const storeProduct = await prisma.storeProduct.findFirst({
            where: {
              storeId: store.id,
              productId: productId,
            },
            select: {
              id: true,
              sellingPrice: true,
            },
          })

          if (!storeProduct) {
            throw new Error(`StoreProduct not found for product: ${item.productName}`)
          }

          storeProductId = storeProduct.id
        }

        // Get storeProduct details
        const storeProduct = await prisma.storeProduct.findUnique({
          where: { id: storeProductId },
          select: {
            id: true,
            sellingPrice: true,
          },
        })

        if (!storeProduct) {
          throw new Error(`StoreProduct not found: ${storeProductId}`)
        }

        // Convert prices to USD
        const itemPriceUSD = convertToUSD(parseFloat(item.price) || 0, currency)
        const supplierPriceUSD = product.sellingPrice // Already in USD
        const vendorPriceUSD = storeProduct.sellingPrice // Already in USD
        const vendorProfitUSD = vendorPriceUSD - supplierPriceUSD

        // Calculate fees (all in USD)
        const itemTotalUSD = itemPriceUSD * parseInt(item.quantity)
        const stripeFeeUSD = await calculateStripeFee(itemTotalUSD)

        // Split Stripe fee proportionally based on price contribution
        // If vendorPrice is 0 or invalid, assign all fee to supplier
        let stripeFeeSupplierUSD = 0
        let stripeFeeVendorUSD = 0
        
        if (vendorPriceUSD > 0 && itemTotalUSD > 0) {
          const supplierPortion = supplierPriceUSD / itemTotalUSD
          const vendorPortion = vendorPriceUSD / itemTotalUSD
          
          stripeFeeSupplierUSD = supplierPortion * stripeFeeUSD
          stripeFeeVendorUSD = vendorPortion * stripeFeeUSD
        } else {
          // Fallback: assign all fee to supplier if calculation fails
          stripeFeeSupplierUSD = stripeFeeUSD
        }

        // Platform fee only from vendor profit
        const platformFeeUSD = await calculatePlatformFee(vendorProfitUSD)

        return {
          quantity: parseInt(item.quantity),
          price: itemPriceUSD, // Store in USD
          productName: item.productName,
          productImage: item.productImage || null,
          productId: product.id,
          storeProductId: storeProduct.id,
          supplierId: product.supplierId,
          // Price breakdown (all USD)
          supplierPrice: supplierPriceUSD,
          vendorPrice: vendorPriceUSD,
          vendorProfit: vendorProfitUSD,
          stripeFeeSupplier: stripeFeeSupplierUSD,
          stripeFeeVendor: stripeFeeVendorUSD,
          platformFee: platformFeeUSD,
          // Currency info
          customerCurrency: currency,
          exchangeRate,
        }
      })
    )

    // Generate order number
    const date = new Date()
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '')
    const randomStr = Math.random().toString(36).substring(2, 7).toUpperCase()
    const orderNumber = `ORD-${dateStr}-${randomStr}`

    // Create order
    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerId: customer.id,
        storeId,
        // Pricing (all in USD)
        subtotal: subtotalUSD,
        shipping: shippingUSD,
        shippingMethod: shippingMethod || null,
        tax: taxUSD,
        total: totalUSD,
        // Status
        status: OrderStatus.PENDING,
        paymentMethod: paymentMethod || 'credit_card',
        paymentStatus: PaymentStatus.PENDING,
        // Payment Intent
        paymentIntentId: paymentIntentId || null,
        // Shipping
        shippingFullName,
        shippingAddress,
        shippingCity,
        shippingState,
        shippingZipCode,
        shippingCountry,
        shippingPhone: shippingPhone || customerPhone || '',
        // Contact
        customerEmail,
        customerPhone: customerPhone || null,
        // Currency
        customerCurrency: currency,
        // Order items
        items: {
          create: orderItemsData,
        },
      },
      include: {
        items: true,
        store: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    })

    // Update PaymentIntent metadata with orderId (if paymentIntentId exists)
    if (paymentIntentId) {
      try {
        await updatePaymentIntentMetadata(paymentIntentId, {
          orderId: order.id,
          orderNumber: order.orderNumber,
          customerEmail: customerEmail,
          customerName: customerName || '',
        })
      } catch (error) {
        // Log error but don't fail order creation
        console.error('Failed to update PaymentIntent metadata:', error)
      }
    }

    return NextResponse.json(
      {
        order: {
          id: order.id,
          orderNumber: order.orderNumber,
          total: order.total,
          status: order.status.toLowerCase(),
          paymentStatus: order.paymentStatus.toLowerCase(),
          items: order.items,
          store: order.store,
        },
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Create public order error:', error)
    return NextResponse.json(
      { error: 'Failed to create order', details: error.message },
      { status: 500 }
    )
  }
}

