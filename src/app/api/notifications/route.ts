import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

import { withClientUid } from '@/lib/api-middleware';

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: parseInt(process.env.PGPORT || '5432'),
});

// GET /api/notifications - Get user notifications
export const GET = withClientUid(
  async (request: NextRequest, { clientUid }) => {
    try {
      const { searchParams } = new URL(request.url);
      const limit = parseInt(searchParams.get('limit') || '20');
      const unreadOnly = searchParams.get('unread') === 'true';

      let query = `
      SELECT notification_id, title, message, type, 
             related_offer_uid, related_property_uid, priority, created_at, read_at
      FROM user_notifications 
      WHERE client_uid = $1
    `;

      const params = [clientUid];

      if (unreadOnly) {
        query += ' AND read_at IS NULL';
      }

      query += ' ORDER BY created_at DESC LIMIT $' + (params.length + 1);
      params.push(limit.toString());

      const result = await pool.query(query, params);

      // Get unread count using only client_uid
      let unreadQuery =
        'SELECT COUNT(*) as count FROM user_notifications WHERE client_uid = $1';
      const unreadParams = [clientUid];

      unreadQuery += ' AND read_at IS NULL';

      const unreadResult = await pool.query(unreadQuery, unreadParams);

      return NextResponse.json({
        notifications: result.rows,
        unreadCount: parseInt(unreadResult.rows[0].count),
        total: result.rows.length,
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Get notifications error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch notifications' },
        { status: 500 },
      );
    }
  },
);

// POST /api/notifications - Create a new notification
export const POST = withClientUid(
  async (request: NextRequest, { clientUid, email }) => {
    try {
      const body = await request.json();
      const {
        title,
        message,
        type,
        related_offer_uid,
        related_property_uid,
        priority = 'normal',
        target_user_email, // Allow creating notifications for other users (e.g., when making offers)
        client_uid: providedClientUid, // Client_uid can be provided directly
      } = body;

      if (!title || !message || !type) {
        return NextResponse.json(
          { error: 'Title, message, and type are required' },
          { status: 400 },
        );
      }

      // Use target_user_email if provided, otherwise use current user
      const recipientEmail = target_user_email || email;

      // Get the client_uid either from the provided value or session
      let targetClientUid = providedClientUid;

      if (!targetClientUid && (!recipientEmail || recipientEmail === email)) {
        // Use client_uid from middleware if creating notification for current user
        targetClientUid = clientUid;
      }

      // Require a client_uid for all notifications
      if (!targetClientUid) {
        return NextResponse.json(
          { error: 'A client_uid is required for the notification recipient' },
          { status: 400 },
        );
      }

      // Insert with the client_uid
      await pool.query(
        `INSERT INTO user_notifications 
       (user_email, title, message, type, related_offer_uid, related_property_uid, priority, client_uid)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
        [
          recipientEmail,
          title,
          message,
          type,
          related_offer_uid,
          related_property_uid,
          priority,
          targetClientUid,
        ],
      );

      return NextResponse.json({
        message: 'Notification created successfully',
        notification: {
          user_email: recipientEmail,
          title,
          message,
          type,
          related_offer_uid,
          related_property_uid,
          priority,
          client_uid: targetClientUid,
        },
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Create notification error:', error);
      return NextResponse.json(
        { error: 'Failed to create notification' },
        { status: 500 },
      );
    }
  },
);

// PATCH /api/notifications - Mark notifications as read
export const PATCH = withClientUid(
  async (request: NextRequest, { clientUid }) => {
    try {
      const body = await request.json();
      const { notification_ids, mark_all_read } = body;

      let updateResult;
      let updatedRowsCount = 0;

      // Check if mark_all_read is true - handle different formats from frontend
      if (
        mark_all_read === true ||
        mark_all_read === 'true' ||
        mark_all_read === 1
      ) {
        // Use client_uid as the only identifier
        const query = `
        UPDATE user_notifications 
        SET read_at = CURRENT_TIMESTAMP 
        WHERE client_uid = $1
        AND read_at IS NULL
        RETURNING notification_id
      `;

        const params = [clientUid];

        updateResult = await pool.query(query, params);
        updatedRowsCount = updateResult.rowCount || 0;

        return NextResponse.json({
          message: `All notifications marked as read (${updatedRowsCount} updated)`,
          updated_count: updatedRowsCount,
        });
      } else if (notification_ids && Array.isArray(notification_ids)) {
        // Use client_uid as the only identifier
        const query = `
        UPDATE user_notifications 
        SET read_at = CURRENT_TIMESTAMP 
        WHERE notification_id = ANY($1::int[]) 
        AND client_uid = $2
        AND read_at IS NULL
        RETURNING notification_id
      `;

        const params = [notification_ids, clientUid];

        updateResult = await pool.query(query, params);
        updatedRowsCount = updateResult.rowCount || 0;

        return NextResponse.json({
          message: 'Notifications marked as read',
          updated_count: updatedRowsCount,
        });
      } else {
        return NextResponse.json(
          { error: 'Either notification_ids or mark_all_read is required' },
          { status: 400 },
        );
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Update notifications error:', error);
      return NextResponse.json(
        { error: 'Failed to update notifications' },
        { status: 500 },
      );
    }
  },
);
