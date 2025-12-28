'use client'

import { AuthProvider } from '../src/app/contexts/AuthContext'
import { AppProvider } from '../src/app/contexts/AppContext'
import { NavigationProvider } from '../src/app/contexts/NavigationContext'
import { LoadingProvider } from '../src/app/contexts/LoadingContext'
import { ThemeProvider } from '../src/app/components/ThemeProvider'
import { GlobalLoadingSpinner } from '../src/app/components/GlobalLoadingSpinner'
import { Toaster } from '../src/app/components/ui/sonner'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AppProvider>
        <NavigationProvider>
          <LoadingProvider>
            <ThemeProvider>
              <GlobalLoadingSpinner />
              <Toaster />
              {children}
            </ThemeProvider>
          </LoadingProvider>
        </NavigationProvider>
      </AppProvider>
    </AuthProvider>
  )
}

