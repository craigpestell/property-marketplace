'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function SettingsPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to dashboard settings tab
    router.replace('/dashboard?tab=settings');
  }, [router]);

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center'>
      <div className='text-center'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4'></div>
        <p className='text-gray-600 dark:text-gray-400'>
          Redirecting to dashboard...
        </p>
      </div>
    </div>
  );
}
