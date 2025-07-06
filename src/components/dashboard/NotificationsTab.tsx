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

export default function NotificationsTab() {
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

  // Mark all notifications as read when tab is viewed
  useEffect(() => {
    if (!session?.user?.email || loading || notifications.length === 0) {
      return;
    }

    const unreadNotifications = notifications.filter((n) => !n.read_at);
    if (unreadNotifications.length > 0) {
      // Small delay to ensure user actually views the tab
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
      }, 1500); // 1.5 second delay

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

  const getNotificationStats = () => {
    const unreadCount = notifications.filter((n) => !n.read_at).length;
    const urgentCount = notifications.filter(
      (n) => n.priority === 'urgent',
    ).length;
    const todayCount = notifications.filter((n) => {
      const notificationDate = new Date(n.created_at);
      const today = new Date();
      return notificationDate.toDateString() === today.toDateString();
    }).length;

    return { unreadCount, urgentCount, todayCount };
  };

  const stats = getNotificationStats();

  return (
    <div className='p-6'>
      {/* Notifications Header */}
      <div className='mb-8'>
        <div className='flex items-center justify-between'>
          <div>
            <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-2'>
              Notifications
            </h2>
            <p className='text-gray-600 dark:text-gray-400'>
              Stay updated with your property activity
            </p>
          </div>
          <Link
            href='/notifications'
            className='text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium'
          >
            View Full Page →
          </Link>
        </div>
      </div>

      {/* Statistics */}
      {notifications.length > 0 && (
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-8'>
          <div className='bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800'>
            <div className='flex items-center'>
              <div className='p-2 bg-blue-100 dark:bg-blue-800 rounded-lg'>
                <svg
                  className='w-5 h-5 text-blue-600 dark:text-blue-400'
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
              </div>
              <div className='ml-3'>
                <div className='text-lg font-bold text-blue-900 dark:text-blue-100'>
                  {stats.unreadCount}
                </div>
                <div className='text-sm text-blue-700 dark:text-blue-300'>
                  Unread
                </div>
              </div>
            </div>
          </div>

          <div className='bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800'>
            <div className='flex items-center'>
              <div className='p-2 bg-red-100 dark:bg-red-800 rounded-lg'>
                <svg
                  className='w-5 h-5 text-red-600 dark:text-red-400'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z'
                  />
                </svg>
              </div>
              <div className='ml-3'>
                <div className='text-lg font-bold text-red-900 dark:text-red-100'>
                  {stats.urgentCount}
                </div>
                <div className='text-sm text-red-700 dark:text-red-300'>
                  Urgent
                </div>
              </div>
            </div>
          </div>

          <div className='bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800'>
            <div className='flex items-center'>
              <div className='p-2 bg-green-100 dark:bg-green-800 rounded-lg'>
                <svg
                  className='w-5 h-5 text-green-600 dark:text-green-400'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
                  />
                </svg>
              </div>
              <div className='ml-3'>
                <div className='text-lg font-bold text-green-900 dark:text-green-100'>
                  {stats.todayCount}
                </div>
                <div className='text-sm text-green-700 dark:text-green-300'>
                  Today
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className='flex items-center justify-center py-12'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3'></div>
          <span className='text-gray-600 dark:text-gray-400'>
            Loading notifications...
          </span>
        </div>
      ) : error ? (
        <div className='text-center py-8'>
          <div className='text-red-600 dark:text-red-400 mb-4'>
            Error: {error}
          </div>
          <button
            onClick={() => window.location.reload()}
            className='bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors'
          >
            Retry
          </button>
        </div>
      ) : notifications.length === 0 ? (
        /* Empty State */
        <div className='text-center py-12'>
          <div className='h-24 w-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6'>
            <svg
              className='h-12 w-12 text-gray-400 dark:text-gray-500'
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
          </div>
          <h3 className='text-xl font-semibold text-gray-900 dark:text-white mb-3'>
            No notifications yet
          </h3>
          <p className='text-gray-600 dark:text-gray-400 mb-6'>
            You'll receive notifications about offers, property updates, and
            important account activity.
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <Link
              href='/listings'
              className='bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors'
            >
              Browse Properties
            </Link>
            <Link
              href='/listings/create'
              className='bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white px-6 py-3 rounded-lg transition-colors'
            >
              Create Listing
            </Link>
          </div>
        </div>
      ) : (
        /* Notifications List */
        <div className='space-y-4 max-h-[600px] overflow-y-auto'>
          {notifications.slice(0, 10).map((notification) => {
            const link = getNotificationLink(notification);
            const isClickable = !!link;

            return (
              <div
                key={notification.notification_id}
                className={`p-4 border rounded-lg transition-colors ${
                  !notification.read_at
                    ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                } ${
                  isClickable
                    ? 'hover:bg-blue-100 dark:hover:bg-blue-900/30 cursor-pointer'
                    : ''
                }`}
                onClick={() => isClickable && (window.location.href = link)}
              >
                <div className='flex items-start space-x-3'>
                  {/* Icon */}
                  <div className='text-2xl flex-shrink-0'>
                    {getNotificationIcon(notification.type)}
                  </div>

                  {/* Content */}
                  <div className='flex-1 min-w-0'>
                    <div className='flex items-start justify-between mb-2'>
                      <h4 className='text-md font-semibold text-gray-900 dark:text-white line-clamp-1'>
                        {notification.title}
                      </h4>
                      <div className='flex items-center space-x-2 flex-shrink-0'>
                        <span
                          className={`px-2 py-1 text-xs rounded-full border ${getPriorityColor(notification.priority)}`}
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

                    <p className='text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2'>
                      {notification.message}
                    </p>

                    <div className='flex items-center justify-between'>
                      <div className='text-xs text-gray-500 dark:text-gray-400'>
                        {formatTimeAgo(notification.created_at)}
                      </div>
                      {isClickable && (
                        <button className='text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium'>
                          View{' '}
                          {notification.related_offer_uid
                            ? 'Offer'
                            : 'Property'}{' '}
                          →
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {notifications.length > 10 && (
            <div className='text-center pt-4'>
              <Link
                href='/notifications'
                className='text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium'
              >
                View all {notifications.length} notifications →
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
