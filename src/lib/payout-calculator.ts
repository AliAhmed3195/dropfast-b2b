/**
 * Payout Calculation Utilities
 * All calculations in USD
 */

import { prisma } from './prisma';
import { OrderItem } from '@prisma/client';

/**
 * Calculate supplier payout amount (USD)
 */
export async function calculateSupplierPayout(
  orderItems: OrderItem[]
): Promise<{
  baseAmount: number;
  stripeFee: number;
  netAmount: number;
}> {
  let baseAmount = 0;
  let stripeFee = 0;
  
  for (const item of orderItems) {
    if (item.supplierPrice && item.stripeFeeSupplier) {
      const itemBase = item.supplierPrice * item.quantity;
      const itemStripeFee = item.stripeFeeSupplier * item.quantity;
      
      baseAmount += itemBase;
      stripeFee += itemStripeFee;
    }
  }
  
  return {
    baseAmount,
    stripeFee,
    netAmount: baseAmount - stripeFee,
  };
}

/**
 * Calculate vendor payout amount (USD)
 */
export async function calculateVendorPayout(
  orderItems: OrderItem[]
): Promise<{
  baseAmount: number;
  stripeFee: number;
  platformFee: number;
  netAmount: number;
}> {
  let baseAmount = 0;
  let stripeFee = 0;
  let platformFee = 0;
  
  for (const item of orderItems) {
    if (item.vendorProfit) {
      const itemBase = item.vendorProfit * item.quantity;
      const itemStripeFee = (item.stripeFeeVendor || 0) * item.quantity;
      const itemPlatformFee = (item.platformFee || 0) * item.quantity;
      
      baseAmount += itemBase;
      stripeFee += itemStripeFee;
      platformFee += itemPlatformFee;
    }
  }
  
  return {
    baseAmount,
    stripeFee,
    platformFee,
    netAmount: baseAmount - stripeFee - platformFee,
  };
}

/**
 * Get pending payout amounts for a supplier
 */
export async function getSupplierPendingPayout(supplierId: string) {
  const orderItems = await prisma.orderItem.findMany({
    where: {
      supplierId,
      order: {
        paymentStatus: 'PAID',
      },
    },
    include: {
      order: {
        select: {
          id: true,
        },
      },
    },
  });
  
  return calculateSupplierPayout(orderItems);
}

/**
 * Get pending payout amounts for a vendor
 */
export async function getVendorPendingPayout(vendorId: string) {
  // Get vendor's stores
  const vendor = await prisma.user.findUnique({
    where: { id: vendorId },
    include: {
      storesAsVendor: {
        select: { id: true },
      },
    },
  });
  
  if (!vendor || vendor.storesAsVendor.length === 0) {
    return {
      baseAmount: 0,
      stripeFee: 0,
      platformFee: 0,
      netAmount: 0,
    };
  }
  
  const storeIds = vendor.storesAsVendor.map((s) => s.id);
  
  const orderItems = await prisma.orderItem.findMany({
    where: {
      order: {
        storeId: { in: storeIds },
        paymentStatus: 'PAID',
      },
    },
    include: {
      order: {
        select: {
          id: true,
        },
      },
    },
  });
  
  return calculateVendorPayout(orderItems);
}

