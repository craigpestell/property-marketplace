import Link from 'next/link';

import DebugPageWrapper from '@/components/DebugPageWrapper';

export default function TestPage() {
  return (
    <DebugPageWrapper>
      <main className='layout py-20'>
        <div className='text-center'>
          <h1 className='text-4xl font-bold text-gray-900 dark:text-gray-100 mb-6'>
            Test Page
          </h1>
          <p className='text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto'>
            This is a test page for debugging and testing various
            functionalities. Only test users and developers can access this
            page.
          </p>

          <div className='grid md:grid-cols-2 gap-6 mt-12'>
            <div className='bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700'>
              <h3 className='text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3'>
                API Testing
              </h3>
              <p className='text-gray-600 dark:text-gray-400 mb-4'>
                Test API endpoints, authentication, and data flow.
              </p>
              <div className='space-y-2'>
                <Link
                  href='/api/listings'
                  className='block text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium'
                >
                  Test Listings API →
                </Link>
                <Link
                  href='/api/hello'
                  className='block text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium'
                >
                  Test Hello API →
                </Link>
              </div>
            </div>

            <div className='bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700'>
              <h3 className='text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3'>
                Component Testing
              </h3>
              <p className='text-gray-600 dark:text-gray-400 mb-4'>
                Test individual components and their interactions.
              </p>
              <div className='space-y-2'>
                <Link
                  href='/demo'
                  className='block text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium'
                >
                  Demo Components →
                </Link>
                <Link
                  href='/notifications'
                  className='block text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium'
                >
                  Test Notifications →
                </Link>
              </div>
            </div>
          </div>

          <div className='mt-12 p-6 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800'>
            <h3 className='text-lg font-semibold text-red-900 dark:text-red-400 mb-2'>
              Test Environment Notice
            </h3>
            <p className='text-red-700 dark:text-red-300'>
              This page is only visible to authorized test users and in
              development mode. Do not use this in production environment.
            </p>
          </div>
        </div>
      </main>
    </DebugPageWrapper>
  );
}
