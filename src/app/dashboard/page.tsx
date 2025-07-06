'use client';

import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

// Import the actual content from existing pages to avoid duplicating logic
// Dynamically import to avoid SSR issues
const ProfileContent = dynamic(() => import('@/app/profile/page'), {
  ssr: false,
});
const SettingsContent = dynamic(() => import('@/app/settings/page'), {
  ssr: false,
});
const OffersContent = dynamic(() => import('@/app/offers/page'), {
  ssr: false,
});
const NotificationsContent = dynamic(() => import('@/app/notifications/page'), {
  ssr: false,
});

type TabType = 'profile' | 'settings' | 'listings' | 'offers' | 'notifications';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('profile');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className='min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4'></div>
          <p className='text-gray-600 dark:text-gray-400'>Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null; // Will redirect
  }

  const tabs = [
    {
      id: 'profile' as TabType,
      name: 'Profile',
      icon: (
        <svg
          className='w-5 h-5'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
          />
        </svg>
      ),
    },
    {
      id: 'settings' as TabType,
      name: 'Settings',
      icon: (
        <svg
          className='w-5 h-5'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z'
          />
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
          />
        </svg>
      ),
    },
    {
      id: 'listings' as TabType,
      name: 'My Listings',
      icon: (
        <svg
          className='w-5 h-5'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z'
          />
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M8 21l4-4 4 4M3 7l9-4 9 4'
          />
        </svg>
      ),
    },
    {
      id: 'offers' as TabType,
      name: 'My Offers',
      icon: (
        <svg
          className='w-5 h-5'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01'
          />
        </svg>
      ),
    },
    {
      id: 'notifications' as TabType,
      name: 'Notifications',
      icon: (
        <svg
          className='w-5 h-5'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M15 17h5l-5 5-5-5h5V3h2v14z'
          />
        </svg>
      ),
    },
  ];

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
      <div className='layout py-8'>
        {/* Header */}
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-900 dark:text-white mb-2'>
            Dashboard
          </h1>
          <p className='text-gray-600 dark:text-gray-400'>
            Manage your profile, listings, offers, and notifications
          </p>
        </div>

        {/* Tab Navigation */}
        <div className='mb-6'>
          <div className='border-b border-gray-200 dark:border-gray-700'>
            <nav className='-mb-px flex space-x-8'>
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  {tab.icon}
                  <span className='ml-2'>{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm min-h-[600px]'>
          {activeTab === 'profile' && <ProfileContent />}
          {activeTab === 'settings' && <SettingsContent />}
          {activeTab === 'listings' && (
            <div className='p-6'>
              <div className='mb-6'>
                <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-2'>
                  My Listings
                </h2>
                <p className='text-gray-600 dark:text-gray-400'>
                  View and manage your property listings from your profile page
                  or create new ones.
                </p>
              </div>
              <div className='space-y-4'>
                <button
                  onClick={() => router.push('/profile')}
                  className='w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors'
                >
                  View My Listings (Profile Page)
                </button>
                <button
                  onClick={() => router.push('/listings/create')}
                  className='w-full bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white px-6 py-3 rounded-lg transition-colors'
                >
                  Create New Listing
                </button>
                <button
                  onClick={() => router.push('/listings')}
                  className='w-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white px-6 py-3 rounded-lg transition-colors'
                >
                  Browse All Properties
                </button>
              </div>
            </div>
          )}
          {activeTab === 'offers' && <OffersContent />}
          {activeTab === 'notifications' && <NotificationsContent />}
        </div>
      </div>
    </div>
  );
}
