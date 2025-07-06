'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

interface Notification {
  notification_id: number;
  title: string;
  message: string;
  type: string;
  related_offer_uid?: string;
  related_property_uid?: string;
  priority: string;
  created_at: string;
  read_at?: string;
}

export default function NotificationsPage() {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!session?.user?.email) {
      setLoading(false);
      return;
    }

    const fetchNotifications = async () => {
      try {
        const response = await fetch('/api/notifications');
        if (!response.ok) {
          throw new Error('Failed to fetch notifications');
        }
        const data = await response.json();
        setNotifications(data.notifications || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [session]);

  // Mark all notifications as read when page is viewed
  useEffect(() => {
    if (!session?.user?.email || loading || notifications.length === 0) {
      return;
    }

    const unreadNotifications = notifications.filter((n) => !n.read_at);
    if (unreadNotifications.length > 0) {
      // Small delay to ensure user actually views the page
      const timer = setTimeout(async () => {
        try {
          await fetch('/api/notifications', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mark_all_read: true }),
          });

          // Update local state to mark all as read
          setNotifications((prev) =>
            prev.map((notification) => ({
              ...notification,
              read_at: notification.read_at || new Date().toISOString(),
            })),
          );
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error('Failed to mark notifications as read:', error);
        }
      }, 1500); // 1.5 second delay to ensure user actually sees the notifications

      return () => clearTimeout(timer);
    }
  }, [session, loading, notifications]);

  // Generate link for notification
  const getNotificationLink = (notification: Notification) => {
    if (notification.related_offer_uid) {
      return `/offers`;
    }
    if (notification.related_property_uid) {
      return `/property/${notification.related_property_uid}`;
    }
    return null;
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'offer_received':
        return '💰';
      case 'offer_accepted':
        return '✅';
      case 'offer_rejected':
        return '❌';
      case 'offer_countered':
        return '🔄';
      case 'offer_withdrawn':
        return '↩️';
      case 'offer_expired':
        return '⏰';
      case 'system':
        return '🔔';
      case 'reminder':
        return '📅';
      default:
        return '📄';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 dark:bg-red-900/30 border-red-200 dark:border-red-800 text-red-800 dark:text-red-300';
      case 'high':
        return 'bg-orange-100 dark:bg-orange-900/30 border-orange-200 dark:border-orange-800 text-orange-800 dark:text-orange-300';
      case 'normal':
        return 'bg-blue-100 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300';
      case 'low':
        return 'bg-gray-100 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-300';
      default:
        return 'bg-blue-100 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300';
    }
  };

  if (!session?.user?.email) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <div className='max-w-2xl mx-auto text-center'>
          <h1 className='text-3xl font-bold text-gray-900 dark:text-white mb-4'>
            Notifications
          </h1>
          <p className='text-gray-600 dark:text-gray-400'>
            Please sign in to view your notifications.
          </p>
          <Link
            href='/auth/signin'
            className='inline-block mt-4 px-6 py-2 bg-blue-500 dark:bg-blue-600 text-white rounded hover:bg-blue-600 dark:hover:bg-blue-500 transition-colors'
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='max-w-4xl mx-auto'>
        {/* Header */}
        <div className='flex justify-between items-center mb-8'>
          <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>
            All Notifications
          </h1>
          <Link
            href='/'
            className='px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 border border-gray-300 dark:border-gray-600 rounded hover:border-gray-400 dark:hover:border-gray-500 transition-colors'
          >
            ← Back to Home
          </Link>
        </div>

        {/* Content */}
        {loading ? (
          <div className='text-center py-12'>
            <div className='text-gray-500 dark:text-gray-400'>
              Loading notifications...
            </div>
          </div>
        ) : error ? (
          <div className='text-center py-12'>
            <div className='text-red-600 dark:text-red-400'>Error: {error}</div>
            <button
              onClick={() => window.location.reload()}
              className='mt-4 px-4 py-2 bg-blue-500 dark:bg-blue-600 text-white rounded hover:bg-blue-600 dark:hover:bg-blue-500 transition-colors'
            >
              Retry
            </button>
          </div>
        ) : notifications.length === 0 ? (
          <div className='text-center py-12'>
            <div className='text-gray-500 dark:text-gray-400 mb-4'>
              No notifications yet
            </div>
            <Link
              href='/demo'
              className='px-4 py-2 bg-green-500 dark:bg-green-600 text-white rounded hover:bg-green-600 dark:hover:bg-green-500 transition-colors'
            >
              Create Test Notifications
            </Link>
          </div>
        ) : (
          <div className='space-y-4'>
            {notifications.map((notification) => {
              const link = getNotificationLink(notification);
              const isClickable = !!link;

              return (
                <div
                  key={notification.notification_id}
                  className={`p-6 border rounded-lg ${
                    !notification.read_at
                      ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                      : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                  } ${
                    isClickable
                      ? 'hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors'
                      : ''
                  }`}
                >
                  <div className='flex items-start space-x-4'>
                    {/* Icon */}
                    <div className='text-3xl flex-shrink-0'>
                      {getNotificationIcon(notification.type)}
                    </div>

                    {/* Content */}
                    <div className='flex-1 min-w-0'>
                      <div className='flex items-start justify-between mb-2'>
                        <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
                          {notification.title}
                        </h3>
                        <div className='flex items-center space-x-2'>
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(notification.priority)}`}
                          >
                            {notification.priority}
                          </span>
                          {!notification.read_at && (
                            <span className='px-2 py-1 text-xs bg-blue-500 dark:bg-blue-600 text-white rounded-full'>
                              New
                            </span>
                          )}
                        </div>
                      </div>

                      <p className='text-gray-600 dark:text-gray-400 mb-4'>
                        {notification.message}
                      </p>

                      <div className='flex items-center justify-between'>
                        <div className='text-sm text-gray-500 dark:text-gray-400'>
                          {formatTimeAgo(notification.created_at)}
                        </div>
                      </div>

                      {/* Action button */}
                      {isClickable && (
                        <div className='mt-4'>
                          <Link
                            href={link}
                            className='inline-flex items-center px-4 py-2 bg-primary-600 dark:bg-primary-700 text-white rounded hover:bg-primary-700 dark:hover:bg-primary-600 text-sm font-medium transition-colors'
                          >
                            View{' '}
                            {notification.related_offer_uid
                              ? 'Offer'
                              : 'Property'}{' '}
                            →
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
