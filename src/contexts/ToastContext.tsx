'use client';

import { createContext, ReactNode, useContext, useState } from 'react';

import ToastContainer, { Toast } from '@/components/ToastContainer';

interface ToastContextType {
  showToast: (toast: Omit<Toast, 'id'>) => void;
  showSuccess: (title: string, message: string, duration?: number) => void;
  showError: (title: string, message: string, duration?: number) => void;
  showWarning: (title: string, message: string, duration?: number) => void;
  showInfo: (title: string, message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

interface ToastProviderProps {
  children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (toast: Omit<Toast, 'id'>) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const newToast: Toast = { ...toast, id };
    setToasts((prev) => [...prev, newToast]);
  };

  const showSuccess = (title: string, message: string, duration?: number) => {
    showToast({ title, message, type: 'success', duration });
  };

  const showError = (title: string, message: string, duration?: number) => {
    showToast({ title, message, type: 'error', duration });
  };

  const showWarning = (title: string, message: string, duration?: number) => {
    showToast({ title, message, type: 'warning', duration });
  };

  const showInfo = (title: string, message: string, duration?: number) => {
    showToast({ title, message, type: 'info', duration });
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider
      value={{ showToast, showSuccess, showError, showWarning, showInfo }}
    >
      {children}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </ToastContext.Provider>
  );
}
