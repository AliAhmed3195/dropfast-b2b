/**
 * Route Mapping Utility
 * Maps NavigationContext views to Next.js routes
 */

export const routeMap: Record<string, Record<string, string>> = {
  admin: {
    'dashboard': '/dashboard/admin/overview',
    'users': '/dashboard/admin/users',
    'vendor-management': '/dashboard/admin/vendors',
    'supplier-management': '/dashboard/admin/suppliers',
    'orders': '/dashboard/admin/orders',
    'payouts': '/dashboard/admin/payouts',
    'inventory': '/dashboard/admin/inventory',
    'inventory-products': '/dashboard/admin/inventory/products',
    'inventory-categories': '/dashboard/admin/inventory/categories',
    'inventory-tags': '/dashboard/admin/inventory/tags',
    'categories': '/dashboard/admin/categories',
    'tags': '/dashboard/admin/tags',
    'invoice-templates': '/dashboard/admin/invoices',
    'analytics': '/dashboard/admin/analytics',
    'reports': '/dashboard/admin/reports',
    'settings': '/dashboard/admin/settings',
  },
  supplier: {
    'dashboard': '/dashboard/supplier/overview',
    'products': '/dashboard/supplier/products',
    'orders': '/dashboard/supplier/orders',
    'payouts': '/dashboard/supplier/payouts',
    'analytics': '/dashboard/supplier/analytics',
    'settings': '/dashboard/supplier/settings',
  },
  vendor: {
    'dashboard': '/dashboard/vendor/overview',
    'stores': '/dashboard/vendor/stores',
    'inventory': '/dashboard/vendor/inventory',
    'products': '/dashboard/vendor/products',
    'orders': '/dashboard/vendor/orders',
    'invoices': '/dashboard/vendor/invoices',
    'invoice-templates': '/dashboard/vendor/templates',
    'account-details': '/dashboard/vendor/account-details',
    'customers': '/dashboard/vendor/customers',
    'settings': '/dashboard/vendor/settings',
  },
  customer: {
    'browse': '/dashboard/customer/browse',
    'my-orders': '/dashboard/customer/orders',
    'wishlist': '/dashboard/customer/wishlist',
    'settings': '/dashboard/customer/settings',
    'cart': '/dashboard/customer/cart',
    'checkout': '/dashboard/customer/checkout',
  },
}

export function getRoute(role: string, view: string): string {
  return routeMap[role]?.[view] || '/dashboard'
}

