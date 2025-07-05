'use client';

import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';

export interface Toast {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

interface ToastNotificationProps {
  toast: Toast;
  onClose: (id: string) => void;
}

function ToastNotification({ toast, onClose }: ToastNotificationProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);

    if (toast.duration !== 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => onClose(toast.id), 300);
      }, toast.duration || 5000);

      return () => clearTimeout(timer);
    }
  }, [toast.id, toast.duration, onClose]);

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircleIcon className='h-6 w-6 text-green-400' />;
      case 'error':
        return <XCircleIcon className='h-6 w-6 text-red-400' />;
      case 'warning':
        return <ExclamationTriangleIcon className='h-6 w-6 text-yellow-400' />;
      case 'info':
        return <InformationCircleIcon className='h-6 w-6 text-blue-400' />;
    }
  };

  const getBorderColor = () => {
    switch (toast.type) {
      case 'success':
        return 'border-green-400';
      case 'error':
        return 'border-red-400';
      case 'warning':
        return 'border-yellow-400';
      case 'info':
        return 'border-blue-400';
    }
  };

  return (
    <div
      className={`transform transition-all duration-300 ease-out ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
    >
      <div
        className={`max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto border-l-4 ${getBorderColor()}`}
      >
        <div className='p-4'>
          <div className='flex items-start'>
            <div className='flex-shrink-0'>{getIcon()}</div>
            <div className='ml-3 w-0 flex-1'>
              <p className='text-sm font-medium text-gray-900'>{toast.title}</p>
              <p className='mt-1 text-sm text-gray-500'>{toast.message}</p>
            </div>
            <div className='ml-4 flex-shrink-0 flex'>
              <button
                onClick={() => {
                  setIsVisible(false);
                  setTimeout(() => onClose(toast.id), 300);
                }}
                className='bg-white rounded-md inline-flex text-gray-400 hover:text-gray-600 focus:outline-none'
              >
                <XMarkIcon className='h-5 w-5' />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface ToastContainerProps {
  toasts: Toast[];
  onClose: (id: string) => void;
}

export default function ToastContainer({
  toasts,
  onClose,
}: ToastContainerProps) {
  return (
    <div className='fixed top-4 right-4 z-50 space-y-4'>
      {toasts.map((toast) => (
        <ToastNotification key={toast.id} toast={toast} onClose={onClose} />
      ))}
    </div>
  );
}
