'use client'

import { AuthProvider } from '../src/app/contexts/AuthContext'
import { AppProvider } from '../src/app/contexts/AppContext'
import { NavigationProvider } from '../src/app/contexts/NavigationContext'
import { ThemeProvider } from '../src/app/components/ThemeProvider'
import { Toaster } from '../src/app/components/ui/sonner'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AppProvider>
        <NavigationProvider>
          <ThemeProvider>
            <Toaster />
            {children}
          </ThemeProvider>
        </NavigationProvider>
      </AppProvider>
    </AuthProvider>
  )
}

