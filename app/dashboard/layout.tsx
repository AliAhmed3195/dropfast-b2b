'use client'

import { useAuth } from '../../src/app/contexts/AuthContext'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { Header } from '../../src/app/components/Header'
import { Sidebar } from '../../src/app/components/Sidebar'
import { Login } from '../../src/app/components/Login'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isAuthenticated, user } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/')
      return
    }

    // If on /dashboard, redirect to role-specific overview
    if (pathname === '/dashboard' && user?.role) {
      router.push(`/dashboard/${user.role}/overview`)
    }
  }, [isAuthenticated, user, router, pathname])

  if (!isAuthenticated) {
    return <Login />
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8 overflow-auto h-[calc(100vh-4rem)] custom-scrollbar">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

