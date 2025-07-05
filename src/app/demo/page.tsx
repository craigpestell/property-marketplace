'use client';

import { useSession } from 'next-auth/react';
import { useState } from 'react';

import Button from '@/components/buttons/Button';

import { useToast } from '@/contexts/ToastContext';

export default function OfferFlowDemoPage() {
  const { data: session } = useSession();
  const { showSuccess, showError, showInfo } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const simulateOfferFlow = async () => {
    if (!session) {
      showError(
        'Authentication Required',
        'Please sign in to test the offer flow',
      );
      return;
    }

    setIsSubmitting(true);

    try {
      showInfo(
        'Offer Flow Started',
        'Simulating a complete offer flow with notifications...',
      );

      // Step 1: Create a test offer
      await new Promise((resolve) => setTimeout(resolve, 1000));
      showSuccess(
        'Offer Submitted',
        'Your offer has been submitted to the property owner',
      );

      // Step 2: Simulate property owner receiving notification
      await new Promise((resolve) => setTimeout(resolve, 1500));
      showInfo(
        'Owner Notified',
        'The property owner has been notified of your offer',
      );

      // Step 3: Simulate offer response
      await new Promise((resolve) => setTimeout(resolve, 2000));
      showSuccess(
        'Offer Response',
        'The property owner has responded to your offer',
      );

      // Step 4: Create a real notification via API
      try {
        const notificationResponse = await fetch('/api/notifications', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_email: session.user?.email,
            type: 'offer_accepted',
            title: 'Offer Accepted!',
            message:
              'Great news! Your offer on the Modern Downtown Condo has been accepted.',
            priority: 'high',
            metadata: {
              property_uid: 'SEED-PROP-001',
              offer_amount: 285000,
            },
          }),
        });

        if (notificationResponse.ok) {
          showSuccess(
            'Real Notification Created',
            'A real notification has been added to your notification center',
          );
        }
      } catch (error) {
        console.error('Failed to create notification:', error);
      }
    } catch (error) {
      showError('Demo Failed', 'Something went wrong with the demo');
    } finally {
      setIsSubmitting(false);
    }
  };

  const createTestNotifications = async () => {
    if (!session) {
      showError(
        'Authentication Required',
        'Please sign in to create test notifications',
      );
      return;
    }

    const testNotifications = [
      {
        type: 'offer_received',
        title: 'New Offer Received',
        message: 'You have received a new offer on your Luxury Villa property.',
        priority: 'high',
        metadata: { property_uid: 'SEED-PROP-002', offer_amount: 850000 },
      },
      {
        type: 'offer_countered',
        title: 'Counter Offer',
        message:
          'The seller has made a counter offer on your Cozy Suburban Home offer.',
        priority: 'normal',
        metadata: { property_uid: 'SEED-PROP-003', offer_amount: 425000 },
      },
      {
        type: 'reminder',
        title: 'Inspection Reminder',
        message:
          "Don't forget: Your property inspection is scheduled for tomorrow.",
        priority: 'normal',
        metadata: { property_uid: 'SEED-PROP-004' },
      },
    ];

    for (const notification of testNotifications) {
      try {
        await fetch('/api/notifications', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_email: session.user?.email,
            ...notification,
          }),
        });

        await new Promise((resolve) => setTimeout(resolve, 500)); // Small delay between notifications
      } catch (error) {
        console.error('Failed to create notification:', error);
      }
    }

    showSuccess(
      'Test Notifications Created',
      'Multiple test notifications have been added to your notification center',
    );
  };

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='max-w-3xl mx-auto'>
        <h1 className='text-3xl font-bold text-gray-900 mb-8'>
          Offer Flow Demo with Real-Time Notifications
        </h1>

        <div className='bg-white rounded-lg shadow-lg p-6 space-y-6'>
          {!session ? (
            <div className='text-center py-8'>
              <h2 className='text-xl font-semibold text-gray-700 mb-4'>
                Authentication Required
              </h2>
              <p className='text-gray-600 mb-4'>
                Please sign in to test the offer flow and notifications.
              </p>
              <Button
                onClick={() => (window.location.href = '/api/auth/signin')}
                variant='primary'
              >
                Sign In
              </Button>
            </div>
          ) : (
            <>
              <div className='text-center'>
                <h2 className='text-xl font-semibold text-gray-800 mb-4'>
                  Welcome, {session.user?.email}!
                </h2>
                <p className='text-gray-600 mb-6'>
                  Test the complete offer flow with real-time notifications and
                  toast feedback.
                </p>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <Button
                  onClick={simulateOfferFlow}
                  variant='primary'
                  isLoading={isSubmitting}
                  disabled={isSubmitting}
                  className='h-24 text-lg'
                >
                  {isSubmitting
                    ? 'Running Demo...'
                    : 'Simulate Complete Offer Flow'}
                </Button>

                <Button
                  onClick={createTestNotifications}
                  variant='outline'
                  className='h-24 text-lg'
                >
                  Create Test Notifications
                </Button>
              </div>

              <div className='mt-8 space-y-4'>
                <h3 className='text-lg font-semibold text-gray-800'>
                  Demo Features:
                </h3>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm'>
                  <div className='bg-blue-50 p-4 rounded-lg'>
                    <h4 className='font-semibold text-blue-800 mb-2'>
                      Toast Notifications
                    </h4>
                    <ul className='text-blue-700 space-y-1'>
                      <li>• Immediate user feedback</li>
                      <li>• Success/error/info/warning types</li>
                      <li>• Auto-dismiss after timeout</li>
                      <li>• Multiple toast stacking</li>
                    </ul>
                  </div>

                  <div className='bg-green-50 p-4 rounded-lg'>
                    <h4 className='font-semibold text-green-800 mb-2'>
                      Real-Time Notifications
                    </h4>
                    <ul className='text-green-700 space-y-1'>
                      <li>• Server-Sent Events (SSE)</li>
                      <li>• Notification center updates</li>
                      <li>• Unread count in header</li>
                      <li>• Database persistence</li>
                    </ul>
                  </div>

                  <div className='bg-purple-50 p-4 rounded-lg'>
                    <h4 className='font-semibold text-purple-800 mb-2'>
                      Offer Integration
                    </h4>
                    <ul className='text-purple-700 space-y-1'>
                      <li>• Automatic notification creation</li>
                      <li>• Property owner alerts</li>
                      <li>• Offer status tracking</li>
                      <li>• Email integration ready</li>
                    </ul>
                  </div>

                  <div className='bg-orange-50 p-4 rounded-lg'>
                    <h4 className='font-semibold text-orange-800 mb-2'>
                      User Experience
                    </h4>
                    <ul className='text-orange-700 space-y-1'>
                      <li>• Contextual feedback</li>
                      <li>• Error handling</li>
                      <li>• Loading states</li>
                      <li>• Responsive design</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className='mt-6 p-4 bg-gray-50 rounded-lg'>
                <h3 className='font-semibold text-gray-700 mb-2'>
                  How to Test:
                </h3>
                <ol className='text-sm text-gray-600 space-y-1 list-decimal list-inside'>
                  <li>
                    Click "Simulate Complete Offer Flow" to see a step-by-step
                    toast sequence
                  </li>
                  <li>
                    Click "Create Test Notifications" to add notifications to
                    your notification center
                  </li>
                  <li>
                    Check the bell icon in the header for your notification
                    count
                  </li>
                  <li>
                    Try submitting an actual offer on a property to see the real
                    integration
                  </li>
                  <li>
                    Test the toast system on the{' '}
                    <a
                      href='/test-toasts'
                      className='text-blue-600 hover:underline'
                    >
                      /test-toasts
                    </a>{' '}
                    page
                  </li>
                </ol>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
