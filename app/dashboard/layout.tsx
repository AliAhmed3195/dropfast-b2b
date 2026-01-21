'use client'

import { AuthProvider } from '../../src/app/contexts/AuthContext'
import { AppProvider } from '../../src/app/contexts/AppContext'
import { NavigationProvider } from '../../src/app/contexts/NavigationContext'
import { ThemeProvider } from '../../src/app/components/ThemeProvider'
import { Toaster } from '../../src/app/components/ui/sonner'
import { Header } from '../../src/app/components/Header'
import { Sidebar } from '../../src/app/components/Sidebar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <AppProvider>
        <NavigationProvider>
          <ThemeProvider>
            <Toaster />
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
          </ThemeProvider>
        </NavigationProvider>
      </AppProvider>
    </AuthProvider>
  )
}
