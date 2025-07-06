'use client';

import { useState } from 'react';

import Button from '@/components/buttons/Button';

import { useToast } from '@/contexts/ToastContext';

export default function ToastTestPage() {
  const { showSuccess, showError, showWarning, showInfo } = useToast();
  const [counter, setCounter] = useState(1);

  const testSuccess = () => {
    showSuccess(
      'Success!',
      `This is success toast #${counter}. Your action was completed successfully.`,
      5000,
    );
    setCounter((c) => c + 1);
  };

  const testError = () => {
    showError(
      'Error Occurred',
      `This is error toast #${counter}. Something went wrong with your request.`,
      5000,
    );
    setCounter((c) => c + 1);
  };

  const testWarning = () => {
    showWarning(
      'Warning',
      `This is warning toast #${counter}. Please review your input.`,
      5000,
    );
    setCounter((c) => c + 1);
  };

  const testInfo = () => {
    showInfo(
      'Information',
      `This is info toast #${counter}. Here's some useful information.`,
      5000,
    );
    setCounter((c) => c + 1);
  };

  const testMultiple = () => {
    showInfo('Multiple Toasts', 'First toast', 3000);
    setTimeout(() => showSuccess('Multiple Toasts', 'Second toast', 3000), 500);
    setTimeout(() => showWarning('Multiple Toasts', 'Third toast', 3000), 1000);
    setTimeout(() => showError('Multiple Toasts', 'Fourth toast', 3000), 1500);
    setCounter((c) => c + 4);
  };

  const testLongMessage = () => {
    showInfo(
      'Long Message Test',
      `This is a very long message to test how the toast handles lengthy content. It should wrap properly and maintain good readability. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`,
      8000,
    );
    setCounter((c) => c + 1);
  };

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='max-w-2xl mx-auto'>
        <h1 className='text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8'>
          Toast Notification Testing
        </h1>

        <div className='bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 space-y-4 border border-gray-200 dark:border-gray-700'>
          <h2 className='text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4'>
            Test Different Toast Types
          </h2>

          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <Button onClick={testSuccess} variant='primary'>
              Test Success Toast
            </Button>

            <Button
              onClick={testError}
              variant='outline'
              className='border-red-500 text-red-600 hover:bg-red-50'
            >
              Test Error Toast
            </Button>

            <Button onClick={testWarning} variant='outline'>
              Test Warning Toast
            </Button>

            <Button onClick={testInfo} variant='ghost'>
              Test Info Toast
            </Button>

            <Button
              onClick={testMultiple}
              variant='primary'
              className='sm:col-span-2'
            >
              Test Multiple Toasts
            </Button>

            <Button
              onClick={testLongMessage}
              variant='outline'
              className='sm:col-span-2'
            >
              Test Long Message
            </Button>
          </div>

          <div className='mt-8 p-4 bg-gray-50 rounded-lg'>
            <h3 className='font-semibold text-gray-700 mb-2'>
              Integration Notes:
            </h3>
            <ul className='text-sm text-gray-600 space-y-1'>
              <li>
                • Toast notifications are automatically shown when offers are
                submitted
              </li>
              <li>
                • New notifications trigger info toasts when received via SSE
              </li>
              <li>• Error handling in forms shows error toasts</li>
              <li>• Toasts auto-dismiss after 5 seconds by default</li>
              <li>• Multiple toasts stack vertically for visibility</li>
            </ul>
          </div>

          <div className='mt-4 p-4 bg-blue-50 rounded-lg'>
            <h3 className='font-semibold text-blue-700 mb-2'>
              Real-Time Features:
            </h3>
            <ul className='text-sm text-blue-600 space-y-1'>
              <li>
                • Offer creation triggers notifications to property owners
              </li>
              <li>
                • Server-Sent Events deliver real-time notification updates
              </li>
              <li>• Notification center shows unread count in header</li>
              <li>• Toast notifications provide immediate user feedback</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
