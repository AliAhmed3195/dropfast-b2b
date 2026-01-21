'use client'

import { useAuth } from '../../src/app/contexts/AuthContext'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
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
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)

  useEffect(() => {
    // Check if user is loaded from localStorage
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('fastdrop_user')
      // Give a small delay to ensure AuthContext has loaded the user
      const timer = setTimeout(() => {
        setIsCheckingAuth(false)
      }, 100)
      return () => clearTimeout(timer)
    } else {
      setIsCheckingAuth(false)
    }
  }, [])

  useEffect(() => {
    if (isCheckingAuth) return

    if (!isAuthenticated) {
      router.replace('/')
      return
    }

    // If on /dashboard, redirect to role-specific dashboard
    if (pathname === '/dashboard' && user?.role) {
      if (user.role === 'customer') {
        router.replace('/dashboard/customer/browse')
      } else {
        router.replace(`/dashboard/${user.role}/overview`)
      }
    }
  }, [isAuthenticated, user, router, pathname, isCheckingAuth])

  // Show loading state while checking authentication
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

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

