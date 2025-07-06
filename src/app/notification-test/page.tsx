'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

// Mock notification data - exactly what should be coming from the API
const mockNotifications = [
  {
    notification_id: 1,
    title: 'Test Offer Notification',
    message: 'This should link to offers page',
    type: 'offer_received' as const,
    related_offer_uid: 'OFFER-ABC123-123',
    related_property_uid: null,
    priority: 'high' as const,
    created_at: new Date().toISOString(),
    read_at: null,
  },
  {
    notification_id: 2,
    title: 'Test Property Notification',
    message: 'This should link to property page',
    type: 'reminder' as const,
    related_offer_uid: null,
    related_property_uid: 'SEED-PROP-001',
    priority: 'normal' as const,
    created_at: new Date().toISOString(),
    read_at: null,
  },
  {
    notification_id: 3,
    title: 'Non-Clickable Notification',
    message: 'This should NOT be clickable',
    type: 'system' as const,
    related_offer_uid: null,
    related_property_uid: null,
    priority: 'low' as const,
    created_at: new Date().toISOString(),
    read_at: null,
  },
];

export default function NotificationTestPage() {
  const router = useRouter();
  const [testResults, setTestResults] = useState<string[]>([]);

  const addResult = (message: string) => {
    setTestResults((prev) => [
      ...prev,
      `${new Date().toLocaleTimeString()}: ${message}`,
    ]);
  };

  // Simple link generation logic - same as NotificationCenter
  const getNotificationLink = (notification: (typeof mockNotifications)[0]) => {
    if (notification.related_offer_uid) {
      return `/offers#offer-${notification.related_offer_uid}`;
    }
    if (notification.related_property_uid) {
      return `/property/${notification.related_property_uid}`;
    }
    return null;
  };

  // Test 1: Basic click handler
  const testBasicClick = (notification: (typeof mockNotifications)[0]) => {
    addResult(`Clicked notification: ${notification.title}`);

    const link = getNotificationLink(notification);
    addResult(`Generated link: ${link || 'NULL'}`);

    if (link) {
      addResult(`Attempting router.push to: ${link}`);
      try {
        router.push(link);
        addResult(`Router.push executed successfully`);
      } catch (error) {
        addResult(`Router.push failed: ${error}`);
      }
    } else {
      addResult(`No link generated - not clickable`);
    }
  };

  // Test 2: Direct window.location navigation
  const testWindowLocation = (notification: (typeof mockNotifications)[0]) => {
    const link = getNotificationLink(notification);
    if (link) {
      addResult(`Testing window.location.href to: ${link}`);
      window.location.href = link;
    } else {
      addResult(`No link for window.location test`);
    }
  };

  // Test 3: Simple router test
  const testRouterOnly = () => {
    addResult(`Testing router.push('/offers')`);
    router.push('/offers');
  };

  // Test 4: Detailed router debugging
  const testRouterDetails = async () => {
    addResult(`Router object: ${typeof router}`);
    addResult(`Router.push function: ${typeof router.push}`);

    try {
      addResult(`Testing router.push with await...`);
      await router.push('/offers');
      addResult(`Await router.push completed`);
    } catch (error) {
      addResult(`Await router.push error: ${error}`);
    }

    try {
      addResult(`Testing router.push without await...`);
      router.push('/property/SEED-PROP-001');
      addResult(`Non-await router.push executed`);
    } catch (error) {
      addResult(`Non-await router.push error: ${error}`);
    }
  };

  // Test 5: Alternative navigation methods
  const testAlternatives = () => {
    // Test router.replace
    try {
      addResult(`Testing router.replace...`);
      router.replace('/offers');
      addResult(`Router.replace executed`);
    } catch (error) {
      addResult(`Router.replace error: ${error}`);
    }
  };

  const clearResults = () => setTestResults([]);

  return (
    <div className='container mx-auto px-4 py-8 max-w-4xl'>
      <h1 className='text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8'>
        Notification Click Test
      </h1>

      {/* Test Results */}
      <div className='mb-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700'>
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-xl font-semibold text-gray-900 dark:text-gray-100'>
            Test Results:
          </h2>
          <button
            onClick={clearResults}
            className='px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600'
          >
            Clear
          </button>
        </div>
        <div className='space-y-1 max-h-60 overflow-y-auto'>
          {testResults.length === 0 ? (
            <p className='text-gray-500 dark:text-gray-400'>
              No tests run yet...
            </p>
          ) : (
            testResults.map((result, index) => (
              <div
                key={index}
                className='text-sm font-mono bg-white dark:bg-gray-700 p-2 rounded border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100'
              >
                {result}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Router Test */}
      <div className='mb-8 p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800'>
        <h2 className='text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4'>
          Router Tests
        </h2>
        <div className='space-x-2 mb-4'>
          <button
            onClick={testRouterOnly}
            className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
          >
            Test Router.push('/offers')
          </button>
          <button
            onClick={testRouterDetails}
            className='px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600'
          >
            Detailed Router Debug
          </button>
          <button
            onClick={testAlternatives}
            className='px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600'
          >
            Test Router.replace
          </button>
        </div>
      </div>

      {/* Mock Notifications */}
      <div className='space-y-4'>
        <h2 className='text-xl font-semibold text-gray-900 dark:text-gray-100'>
          Mock Notifications:
        </h2>

        {mockNotifications.map((notification) => {
          const link = getNotificationLink(notification);
          const isClickable = !!link;

          return (
            <div
              key={notification.notification_id}
              className={`p-4 border rounded-lg ${
                isClickable
                  ? 'border-blue-300 bg-blue-50 cursor-pointer hover:bg-blue-100'
                  : 'border-gray-300 bg-gray-50'
              }`}
            >
              <div className='flex justify-between items-start mb-2'>
                <h3 className='font-semibold'>{notification.title}</h3>
                <span
                  className={`px-2 py-1 text-xs rounded ${
                    isClickable
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {isClickable ? 'Clickable' : 'Not Clickable'}
                </span>
              </div>

              <p className='text-gray-600 mb-3'>{notification.message}</p>

              <div className='text-sm text-gray-500 mb-3'>
                <div>
                  related_offer_uid: {notification.related_offer_uid || 'null'}
                </div>
                <div>
                  related_property_uid:{' '}
                  {notification.related_property_uid || 'null'}
                </div>
                <div>Generated link: {link || 'null'}</div>
              </div>

              <div className='space-x-2'>
                <button
                  onClick={() => testBasicClick(notification)}
                  className='px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600'
                >
                  Test Router Click
                </button>
                <button
                  onClick={() => testWindowLocation(notification)}
                  className='px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600'
                >
                  Test Window Location
                </button>
              </div>
            </div>
          );
        })}
      </div>
      {/* Navigation Links for Manual Testing */}
      <div className='mt-8 p-4 border rounded-lg'>
        <h2 className='text-xl font-semibold mb-4'>Manual Navigation Tests:</h2>
        <div className='space-x-2'>
          <a
            href='/offers'
            className='inline-block px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600'
          >
            Go to /offers (href)
          </a>
          <a
            href='/property/SEED-PROP-001'
            className='inline-block px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600'
          >
            Go to /property/SEED-PROP-001 (href)
          </a>
          <a
            href='/offers#offer-123'
            className='inline-block px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600'
          >
            Go to /offers#offer-123 (href)
          </a>
        </div>
      </div>
    </div>
  );
}
