import type { Metadata } from 'next'
import '../src/styles/index.css'

export const metadata: Metadata = {
  title: 'FastDrop B2B Platform',
  description: 'B2B E-commerce Platform for Suppliers, Vendors, and Customers',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}
