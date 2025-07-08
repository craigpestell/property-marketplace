import { NextRequest } from 'next/server';
import { Pool } from 'pg';

import { withClientUid } from '@/lib/api-middleware';

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: parseInt(process.env.PGPORT || '5432'),
});

// GET /api/notifications/stream - Server-Sent Events for real-time notifications
export const GET = withClientUid(
  async (_request: NextRequest, { clientUid }) => {
    try {
      // Set up Server-Sent Events
      const stream = new ReadableStream({
        start(controller) {
          let isControllerActive = true;

          // Send initial connection message
          const sendEvent = (
            data: Record<string, unknown>,
            event = 'message',
          ) => {
            try {
              if (!isControllerActive) {
                return;
              }
              controller.enqueue(
                new TextEncoder().encode(
                  `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`,
                ),
              );
            } catch (error) {
              // eslint-disable-next-line no-console
              console.error('Error sending SSE event:', error);
              isControllerActive = false;
            }
          };

          sendEvent(
            { type: 'connected', message: 'Notification stream connected' },
            'connected',
          );

          // Function to check for new notifications
          const checkNotifications = async () => {
            if (!isControllerActive) {
              return;
            }

            try {
              // Query for notifications using only client_uid with explicit type casting
              const result = await pool.query(
                `SELECT notification_id, title, message, type, 
                      related_offer_uid, related_property_uid, priority, created_at, read_at
               FROM user_notifications 
               WHERE client_uid::text = $1::text AND read_at IS NULL 
               ORDER BY created_at DESC 
               LIMIT 10`,
                [clientUid],
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

              // Only check for offer updates using client_uid with explicit type casting
              const offerUpdates = await pool.query(
                `SELECT o.offer_uid, o.status, o.updated_at, p.title as property_title
               FROM offers o
               JOIN properties p ON o.property_uid = p.property_uid
               WHERE (o.buyer_client_uid::text = $1::text OR o.seller_client_uid::text = $1::text)
               AND o.updated_at > NOW() - INTERVAL '5 minutes'
               ORDER BY o.updated_at DESC`,
                [clientUid],
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
            isControllerActive = false;
            clearInterval(interval);
          };
        },
        cancel() {
          // This is called when the client disconnects
          // The cleanup function returned by start() will also be called
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
  },
);
