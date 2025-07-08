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
    // Define a unique ID for this connection for debugging purposes
    const connectionId = Math.random().toString(36).substring(2, 15);
    // eslint-disable-next-line no-console
    console.log(
      `SSE connection ${connectionId} established for client_uid: ${clientUid}`,
    );

    try {
      // Set up Server-Sent Events
      const stream = new ReadableStream({
        start(controller) {
          // Track the controller state
          let isControllerActive = true;

          // Use ReturnType<typeof setInterval> to get the correct type for the interval
          let interval: ReturnType<typeof setInterval> | null = null;
          let pingInterval: ReturnType<typeof setInterval> | null = null;

          // Function to clean up all intervals and mark controller as inactive
          const cleanup = () => {
            if (interval) {
              clearInterval(interval);
              interval = null;
            }

            if (pingInterval) {
              clearInterval(pingInterval);
              pingInterval = null;
            }

            isControllerActive = false;
            // eslint-disable-next-line no-console
            console.log(`SSE connection ${connectionId} cleaned up`);
          };

          // Send event with better error handling
          const sendEvent = (
            data: Record<string, unknown>,
            event = 'message',
          ) => {
            try {
              // Double check if the controller is still active before attempting to enqueue
              if (!isControllerActive) {
                return;
              }

              // Try to enqueue data - if this fails, we'll catch it and mark the controller as inactive
              controller.enqueue(
                new TextEncoder().encode(
                  `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`,
                ),
              );
            } catch (error) {
              // If we get an error (like "Controller is already closed"), mark the controller inactive
              isControllerActive = false;

              // Only log if it's not a normal disconnection
              if (
                !(
                  error instanceof TypeError &&
                  error.message.includes('Controller is already closed')
                )
              ) {
                // eslint-disable-next-line no-console
                console.error(
                  `SSE connection ${connectionId} error sending event:`,
                  error,
                );
              }

              // Clean up all intervals
              cleanup();
            }
          };

          // Send initial connection message
          sendEvent(
            {
              type: 'connected',
              message: 'Notification stream connected',
              connectionId,
            },
            'connected',
          );

          // Function to check for new notifications
          const checkNotifications = async () => {
            // Stop checking if controller is not active
            if (!isControllerActive) {
              cleanup();
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
              console.error(
                `SSE connection ${connectionId} error checking notifications:`,
                error,
              );
              // Don't cleanup here, allow the connection to try again
            }
          };

          // Send periodic ping to keep the connection alive and detect disconnects early
          pingInterval = setInterval(() => {
            if (isControllerActive) {
              sendEvent(
                { type: 'ping', timestamp: new Date().toISOString() },
                'ping',
              );
            } else {
              cleanup();
            }
          }, 15000); // Send ping every 15 seconds

          // Initial check for notifications
          checkNotifications();

          // Set up periodic checking (every 30 seconds)
          interval = setInterval(checkNotifications, 30000);

          // Clean up function called when the stream is closed
          return () => {
            // eslint-disable-next-line no-console
            console.log(`SSE connection ${connectionId} closed by client`);
            cleanup();
          };
        },
        cancel() {
          // This is called when the client disconnects
          // eslint-disable-next-line no-console
          console.log(`SSE connection ${connectionId} canceled`);
          // The cleanup function returned by start() will also be called
        },
      });

      return new Response(stream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache, no-transform',
          Connection: 'keep-alive',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Cache-Control',
          'X-Accel-Buffering': 'no', // Prevent Nginx from buffering the SSE stream
        },
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(`SSE connection ${connectionId} stream error:`, error);
      return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
        },
      });
    }
  },
);
