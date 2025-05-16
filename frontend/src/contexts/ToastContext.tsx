'use client';

import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Toast } from '@/components/ui/StatusComponents';

// Define Toast types
export type ToastType = 'success' | 'error' | 'info';

// Define Toast item interface
interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
}

// Define context interface
interface ToastContextType {
  showToast: (type: ToastType, message: string, duration?: number) => void;
  hideToast: (id: string) => void;
}

// Create Toast Context
const ToastContext = createContext<ToastContextType | undefined>(undefined);

// Create Toast Provider component
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = (type: ToastType, message: string, duration = 5000) => {
    const id = Date.now().toString();
    
    // Add new toast to the array
    setToasts(prev => [...prev, { id, type, message }]);
    
    // Auto-remove toast after duration
    if (duration > 0) {
      setTimeout(() => {
        hideToast(id);
      }, duration);
    }
    
    return id;
  };

  const hideToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      
      {/* Toast container */}
      <div className="fixed top-20 right-4 z-50 flex flex-col gap-3">
        {toasts.map(toast => (
          <Toast 
            key={toast.id}
            type={toast.type} 
            message={toast.message} 
            onClose={() => hideToast(toast.id)} 
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

// Custom hook to use the toast context
export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
