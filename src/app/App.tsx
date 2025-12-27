import React from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AppProvider } from './contexts/AppContext';
import { NavigationProvider } from './contexts/NavigationContext';
import { ThemeProvider } from './components/ThemeProvider';
import { Toaster } from './components/ui/sonner';
import { Login } from './components/Login';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { AdminRouter } from './components/AdminRouter';
import { SupplierRouter } from './components/SupplierRouter';
import { VendorRouter } from './components/VendorRouter';
import { CustomerRouter } from './components/CustomerRouter';
import '../styles/index.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

function AppContent() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Login />;
  }

  const renderDashboard = () => {
    switch (user?.role) {
      case 'admin':
        return <AdminRouter />;
      case 'supplier':
        return <SupplierRouter />;
      case 'vendor':
        return <VendorRouter />;
      case 'customer':
        return <CustomerRouter />;
      default:
        return <div>Invalid role</div>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8 overflow-auto h-[calc(100vh-4rem)] custom-scrollbar">
          <div className="max-w-7xl mx-auto">
            {renderDashboard()}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <NavigationProvider>
          <ThemeProvider>
            <Toaster />
            <AppContent />
          </ThemeProvider>
        </NavigationProvider>
      </AppProvider>
    </AuthProvider>
  );
}