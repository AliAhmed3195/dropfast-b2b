/**
 * Platform Configuration Utilities
 * Centralized platform fee management
 */

import { prisma } from './prisma';

export interface PlatformConfig {
  id: string;
  platformFeePercentage: number;
  stripeFeePercentage: number;
  hunterCommissionPercentage: number;
  updatedAt: Date;
  createdAt: Date;
}

/**
 * Get current platform configuration
 * Creates default config if not exists
 */
export async function getPlatformConfig(): Promise<PlatformConfig> {
  let config = await prisma.platformConfig.findFirst();
  
  if (!config) {
    config = await prisma.platformConfig.create({
      data: {
        platformFeePercentage: 2.5,
        stripeFeePercentage: 2.9,
        hunterCommissionPercentage: 5,
      },
    });
  }
  
  return config;
}

/**
 * Calculate platform fee from vendor profit (USD)
 */
export async function calculatePlatformFee(vendorProfit: number): Promise<number> {
  const config = await getPlatformConfig();
  return (vendorProfit * config.platformFeePercentage) / 100;
}

/**
 * Calculate Stripe fee from amount (USD)
 */
export async function calculateStripeFee(amount: number): Promise<number> {
  const config = await getPlatformConfig();
  return (amount * config.stripeFeePercentage) / 100;
}

/**
 * Update platform configuration (admin only)
 */
export async function updatePlatformConfig(
  platformFeePercentage?: number,
  stripeFeePercentage?: number,
  hunterCommissionPercentage?: number
): Promise<PlatformConfig> {
  const existing = await prisma.platformConfig.findFirst();
  
  if (existing) {
    return await prisma.platformConfig.update({
      where: { id: existing.id },
      data: {
        ...(platformFeePercentage !== undefined && { platformFeePercentage }),
        ...(stripeFeePercentage !== undefined && { stripeFeePercentage }),
        ...(hunterCommissionPercentage !== undefined && { hunterCommissionPercentage }),
      },
    });
  } else {
    return await prisma.platformConfig.create({
      data: {
        platformFeePercentage: platformFeePercentage ?? 2.5,
        stripeFeePercentage: stripeFeePercentage ?? 2.9,
        hunterCommissionPercentage: hunterCommissionPercentage ?? 5,
      },
    });
  }
}

