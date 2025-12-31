'use client'

import { useAuth } from '../../src/app/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/')
      return
    }

    // Redirect to role-specific dashboard
    if (user?.role) {
      if (user.role === 'customer') {
        router.push('/dashboard/customer/browse')
      } else {
        router.push(`/dashboard/${user.role}/overview`)
      }
    }
  }, [isAuthenticated, user, router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Redirecting...</p>
      </div>
    </div>
  )
}

