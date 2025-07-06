import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { Pool } from 'pg';

import { authOptions } from '@/lib/auth';

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: parseInt(process.env.PGPORT || '5432'),
});

// GET /api/notifications/stream - Server-Sent Events for real-time notifications
export async function GET(_request: NextRequest) {
  try {
    const session = (await getServerSession(authOptions)) as {
      user: { email: string };
    } | null;

    if (!session?.user?.email) {
      return new Response('Unauthorized', { status: 401 });
    }

    const userEmail = session.user.email;

    // Set up Server-Sent Events
    const stream = new ReadableStream({
      start(controller) {
        // Send initial connection message
        const sendEvent = (
          data: Record<string, unknown>,
          event = 'message',
        ) => {
          controller.enqueue(
            new TextEncoder().encode(
              `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`,
            ),
          );
        };

        sendEvent(
          { type: 'connected', message: 'Notification stream connected' },
          'connected',
        );

        // Function to check for new notifications
        const checkNotifications = async () => {
          try {
            const result = await pool.query(
              `SELECT notification_id, title, message, type, 
                      related_offer_uid, related_property_uid, priority, created_at, read_at
               FROM user_notifications 
               WHERE user_email = $1 AND read_at IS NULL 
               ORDER BY created_at DESC 
               LIMIT 10`,
              [userEmail],
            );

            if (result.rows.length > 0) {
              sendEvent(
                {
                  type: 'notifications',
                  count: result.rows.length,
                  notifications: result.rows,
                },
                'notifications',
              );
            }

            // Also check for unread offer updates
            const offerUpdates = await pool.query(
              `SELECT o.offer_uid, o.status, o.updated_at, p.title as property_title
               FROM offers o
               JOIN properties p ON o.property_uid = p.property_uid
               WHERE (o.buyer_email = $1 OR o.seller_email = $1)
               AND o.updated_at > NOW() - INTERVAL '5 minutes'
               ORDER BY o.updated_at DESC`,
              [userEmail],
            );

            if (offerUpdates.rows.length > 0) {
              sendEvent(
                {
                  type: 'offer_updates',
                  updates: offerUpdates.rows,
                },
                'offer_updates',
              );
            }
          } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Error checking notifications:', error);
          }
        };

        // Initial check
        checkNotifications();

        // Set up periodic checking (every 30 seconds)
        const interval = setInterval(checkNotifications, 30000);

        // Clean up function
        return () => {
          clearInterval(interval);
        };
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Cache-Control',
      },
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('SSE stream error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
