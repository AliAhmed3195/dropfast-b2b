"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, ToasterProps } from "sonner";

/**
 * Centralized Toaster Component
 * 
 * To change toast position globally, update the 'position' prop below.
 * Available positions: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'
 * 
 * To change other global settings (duration, etc.), update:
 * - src/lib/toast.ts (TOAST_CONFIG)
 */
const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="top-right" // Change this to change toast position globally
      richColors // Enable rich colors for better visual feedback
      closeButton // Show close button on toasts
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
