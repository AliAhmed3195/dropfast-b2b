import React from 'react';
import { motion } from 'motion/react';
import {
  LogOut,
  User,
  Settings,
  Bell,
  Zap,
  Moon,
  Sun,
  ShoppingCart,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import { useNavigation } from '../contexts/NavigationContext';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Badge } from './ui/badge';

export function Header() {
  const { user, logout } = useAuth();
  const { cart } = useApp();
  const { setView } = useNavigation();
  const [isDark, setIsDark] = React.useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-600 text-white border-0';
      case 'supplier':
        return 'bg-blue-600 text-white border-0';
      case 'vendor':
        return 'bg-cyan-600 text-white border-0';
      case 'customer':
        return 'bg-green-600 text-white border-0';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="sticky top-0 z-50 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm"
    >
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo - Clean and minimal */}
        <motion.div 
          className="flex items-center gap-3"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center shadow-sm">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              FastDrop
            </h1>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
              Enterprise Platform
            </p>
          </div>
        </motion.div>

        {/* Right side with enhanced spacing and animations */}
        <div className="flex items-center gap-3">
          {/* Cart - Only for customers */}
          {user?.role === 'customer' && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
            >
              <Button 
                variant="ghost" 
                size="sm" 
                className="relative h-11 w-11 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all group" 
                onClick={() => setView('cart')}
              >
                <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                {cart.length > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-indigo-600 rounded-full text-[10px] text-white flex items-center justify-center font-semibold shadow-sm"
                  >
                    {cart.length}
                  </motion.span>
                )}
              </Button>
            </motion.div>
          )}

          {/* Notifications with pulse animation */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
          >
            <Button 
              variant="ghost" 
              size="sm" 
              className="relative h-11 w-11 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all group"
            >
              <Bell className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <motion.span 
                className="absolute -top-1 -right-1 w-[18px] h-[18px] bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center font-semibold shadow-sm"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                3
              </motion.span>
            </Button>
          </motion.div>

          {/* Theme Toggle with smooth icon transition */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4, type: "spring" }}
          >
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={toggleTheme}
              className="h-11 w-11 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all relative overflow-hidden group"
            >
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: isDark ? 180 : 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                {isDark ? (
                  <Sun className="w-5 h-5 text-yellow-500 group-hover:scale-110 transition-transform" />
                ) : (
                  <Moon className="w-5 h-5 text-indigo-600 group-hover:scale-110 transition-transform" />
                )}
              </motion.div>
            </Button>
          </motion.div>

          {/* User Menu with enhanced glassmorphism */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5, type: "spring" }}
          >
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="flex items-center gap-3 h-11 px-3 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all group"
                >
                  <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold shadow-sm">
                    <span className="text-sm">{user?.name?.charAt(0)}</span>
                  </div>
                  <div className="text-left hidden md:block">
                    <p className="text-sm font-semibold leading-none mb-1.5">{user?.name}</p>
                    <Badge className={`${getRoleBadgeColor(user?.role || '')} text-[10px] px-2 py-0.5 h-5 shadow-sm`}>
                      {user?.role}
                    </Badge>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end" 
                className="w-64 p-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 shadow-2xl rounded-2xl"
              >
                <div className="px-3 py-3 mb-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <p className="text-sm font-semibold">{user?.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{user?.email}</p>
                  <p className="text-xs text-muted-foreground mt-1 font-medium">{user?.company}</p>
                </div>
                <DropdownMenuSeparator className="my-2" />
                <DropdownMenuItem className="rounded-lg py-2.5 cursor-pointer hover:bg-purple-50 dark:hover:bg-purple-900/20">
                  <User className="w-4 h-4 mr-3 text-purple-600" />
                  <span className="font-medium">Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="rounded-lg py-2.5 cursor-pointer hover:bg-cyan-50 dark:hover:bg-cyan-900/20">
                  <Settings className="w-4 h-4 mr-3 text-cyan-600" />
                  <span className="font-medium">Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="my-2" />
                <DropdownMenuItem 
                  onClick={logout} 
                  className="rounded-lg py-2.5 cursor-pointer text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 font-medium"
                >
                  <LogOut className="w-4 h-4 mr-3" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
}