import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const STORE_ROOT_DOMAIN = process.env.NEXT_PUBLIC_STORE_DOMAIN || 'dropsified.com'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  // Use Host header when behind proxy (nginx); nextUrl.hostname is 127.0.0.1 then
  const hostRaw = request.headers.get('host') || request.nextUrl.hostname || ''
  const hostname = hostRaw.split(':')[0].toLowerCase()

  // Store subdomain: {slug}.dropsified.com → rewrite to /store/[slug]/...
  // Reserve "app" so app.dropsified.com is not treated as a store
  // Do NOT rewrite /api/ or /_next/ – they must hit the real routes
  if (hostname.endsWith('.' + STORE_ROOT_DOMAIN)) {
    const sub = hostname.split('.')[0]
    if (sub && sub !== 'app' && !pathname.startsWith('/api/') && !pathname.startsWith('/_next/')) {
      const slug = sub
      const newPath = '/store/' + slug + (pathname === '/' ? '' : pathname)
      const url = request.nextUrl.clone()
      url.pathname = newPath
      return NextResponse.rewrite(url)
    }
  }

  // Public routes - no protection needed
  if (pathname === '/' || pathname.startsWith('/api/')) {
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

