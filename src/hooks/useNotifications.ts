'use client';

import { useSession } from 'next-auth/react';
import { useCallback, useEffect, useRef, useState } from 'react';

export interface Notification {
  notification_id: number;
  title: string;
  message: string;
  type:
    | 'offer_received'
    | 'offer_accepted'
    | 'offer_rejected'
    | 'offer_countered'
    | 'offer_withdrawn'
    | 'offer_expired'
    | 'system'
    | 'reminder';
  related_offer_uid?: string;
  related_property_uid?: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  created_at: string;
  read_at?: string;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isConnected: boolean;
  isLoading: boolean;
}

export function useNotifications() {
  const { data: session } = useSession();
  const [state, setState] = useState<NotificationState>({
    notifications: [],
    unreadCount: 0,
    isConnected: false,
    isLoading: true,
  });

  const eventSourceRef = useRef<EventSource | null>(null);

  // Fetch initial notifications
  const fetchNotifications = useCallback(
    async (unreadOnly = false) => {
      if (!session?.user?.email) return;

      try {
        setState((prev) => ({ ...prev, isLoading: true }));

        const params = new URLSearchParams({
          limit: '20',
          ...(unreadOnly && { unread: 'true' }),
        });

        const response = await fetch(`/api/notifications?${params}`);
        const data = await response.json();

        if (response.ok) {
          setState((prev) => ({
            ...prev,
            notifications: data.notifications,
            unreadCount: data.unreadCount,
            isLoading: false,
          }));
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to fetch notifications:', error);
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    },
    [session?.user?.email],
  );

  // Mark notifications as read
  const markAsRead = useCallback(
    async (notificationIds?: number[]) => {
      if (!session?.user?.email) return;

      try {
        const response = await fetch('/api/notifications', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(
            notificationIds
              ? { notification_ids: notificationIds }
              : { mark_all_read: true },
          ),
        });

        if (response.ok) {
          // Refresh notifications after marking as read
          await fetchNotifications();
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to mark notifications as read:', error);
      }
    },
    [session?.user?.email, fetchNotifications],
  );

  // Create a new notification
  const createNotification = useCallback(
    async (notification: {
      title: string;
      message: string;
      type: Notification['type'];
      related_offer_uid?: string;
      related_property_uid?: string;
      priority?: Notification['priority'];
      target_user_email?: string;
    }) => {
      if (!session?.user?.email) return;

      try {
        const response = await fetch('/api/notifications', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(notification),
        });

        if (response.ok) {
          await fetchNotifications();
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to create notification:', error);
      }
    },
    [session?.user?.email, fetchNotifications],
  );

  // Set up Server-Sent Events connection
  useEffect(() => {
    if (!session?.user?.email) return;

    const connectSSE = () => {
      eventSourceRef.current = new EventSource('/api/notifications/stream');

      eventSourceRef.current.onopen = () => {
        setState((prev) => ({ ...prev, isConnected: true }));
      };

      eventSourceRef.current.addEventListener('connected', () => {
        // eslint-disable-next-line no-console
        console.log('Notification stream connected');
      });

      eventSourceRef.current.addEventListener('notifications', (event) => {
        const data = JSON.parse(event.data);
        setState((prev) => ({
          ...prev,
          notifications: data.notifications,
          unreadCount: data.count,
        }));
      });

      eventSourceRef.current.addEventListener('offer_updates', (event) => {
        const data = JSON.parse(event.data);
        // eslint-disable-next-line no-console
        console.log('Offer updates received:', data.updates);
        // Could trigger a notification toast here
      });

      eventSourceRef.current.onerror = () => {
        setState((prev) => ({ ...prev, isConnected: false }));
        // Reconnect after 5 seconds
        setTimeout(connectSSE, 5000);
      };
    };

    connectSSE();
    fetchNotifications();

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, [session?.user?.email, fetchNotifications]);

  return {
    ...state,
    fetchNotifications,
    markAsRead,
    createNotification,
    refreshNotifications: () => fetchNotifications(),
  };
}
