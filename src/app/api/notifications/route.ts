import { NextRequest, NextResponse } from 'next/server';
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

// GET /api/notifications - Get user notifications
export async function GET(request: NextRequest) {
  try {
    const session = (await getServerSession(authOptions)) as {
      user: { email: string };
    } | null;

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const unreadOnly = searchParams.get('unread') === 'true';

    let query = `
      SELECT notification_id, title, message, type, related_offer_id, 
             related_property_uid, priority, created_at, read_at
      FROM user_notifications 
      WHERE user_email = $1
    `;

    const params = [session.user.email];

    if (unreadOnly) {
      query += ' AND read_at IS NULL';
    }

    query += ' ORDER BY created_at DESC LIMIT $2';
    params.push(limit.toString());

    const result = await pool.query(query, params);

    // Get unread count
    const unreadResult = await pool.query(
      'SELECT COUNT(*) as count FROM user_notifications WHERE user_email = $1 AND read_at IS NULL',
      [session.user.email],
    );

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
}

// POST /api/notifications - Create a new notification
export async function POST(request: NextRequest) {
  try {
    const session = (await getServerSession(authOptions)) as {
      user: { email: string };
    } | null;

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      message,
      type,
      related_offer_id,
      related_property_uid,
      priority = 'normal',
      target_user_email, // Allow creating notifications for other users (e.g., when making offers)
    } = body;

    if (!title || !message || !type) {
      return NextResponse.json(
        { error: 'Title, message, and type are required' },
        { status: 400 },
      );
    }

    // Use target_user_email if provided (for system notifications), otherwise use current user
    const recipientEmail = target_user_email || session.user.email;

    const result = await pool.query(
      `INSERT INTO user_notifications 
       (user_email, title, message, type, related_offer_id, related_property_uid, priority)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        recipientEmail,
        title,
        message,
        type,
        related_offer_id,
        related_property_uid,
        priority,
      ],
    );

    return NextResponse.json({
      message: 'Notification created successfully',
      notification: result.rows[0],
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Create notification error:', error);
    return NextResponse.json(
      { error: 'Failed to create notification' },
      { status: 500 },
    );
  }
}

// PATCH /api/notifications - Mark notifications as read
export async function PATCH(request: NextRequest) {
  try {
    const session = (await getServerSession(authOptions)) as {
      user: { email: string };
    } | null;

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { notification_ids, mark_all_read } = body;

    if (mark_all_read) {
      // Mark all notifications as read for the user
      await pool.query(
        'UPDATE user_notifications SET read_at = CURRENT_TIMESTAMP WHERE user_email = $1 AND read_at IS NULL',
        [session.user.email],
      );

      return NextResponse.json({
        message: 'All notifications marked as read',
      });
    } else if (notification_ids && Array.isArray(notification_ids)) {
      // Mark specific notifications as read
      await pool.query(
        `UPDATE user_notifications 
         SET read_at = CURRENT_TIMESTAMP 
         WHERE notification_id = ANY($1) AND user_email = $2 AND read_at IS NULL`,
        [notification_ids, session.user.email],
      );

      return NextResponse.json({
        message: 'Notifications marked as read',
        updated_count: notification_ids.length,
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
}
