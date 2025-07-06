'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

import { showDebugFeatures } from '@/lib/debug';

interface DebugPageWrapperProps {
  children: React.ReactNode;
}

export default function DebugPageWrapper({ children }: DebugPageWrapperProps) {
  const { data: session, status } = useSession();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') return;

    const authorized = showDebugFeatures(session?.user?.email);
    setIsAuthorized(authorized);
    setIsLoading(false);
  }, [session, status]);

  if (isLoading) {
    return (
      <main className='layout py-20'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600 mx-auto'></div>
          <p className='text-gray-600 dark:text-gray-400 mt-4'>Loading...</p>
        </div>
      </main>
    );
  }

  if (!isAuthorized) {
    return (
      <main className='layout py-20'>
        <div className='text-center'>
          <h1 className='text-4xl font-bold text-red-600 dark:text-red-400 mb-6'>
            Access Denied
          </h1>
          <p className='text-lg text-gray-600 dark:text-gray-400 mb-8'>
            You don't have permission to access this page.
          </p>
          <p className='text-sm text-gray-500 dark:text-gray-500'>
            This page is only available to authorized test users and in
            development mode.
          </p>
          <div className='mt-8'>
            <a
              href='/'
              className='bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors'
            >
              Return to Home
            </a>
          </div>
        </div>
      </main>
    );
  }

  return <>{children}</>;
}
