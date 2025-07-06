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

export async function POST(_request: NextRequest) {
  try {
    const session = (await getServerSession(authOptions)) as {
      user: { email: string; name?: string };
    } | null;

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userEmail = session.user.email;

    // Add test notifications for the current user
    const testNotifications = [
      {
        title: 'Welcome to Real Estate Marketplace!',
        message:
          'Thank you for joining our platform. Start browsing properties and making offers today!',
        type: 'system',
        priority: 'normal',
      },
      {
        title: 'New Property Match Found',
        message:
          'We found a 3BR house in Downtown that matches your search criteria. Check it out!',
        type: 'system',
        priority: 'high',
      },
      {
        title: 'Offer Status Update',
        message:
          'Your recent offer on the waterfront condo is being reviewed by the seller.',
        type: 'offer_received',
        priority: 'normal',
      },
    ];

    const insertPromises = testNotifications.map((notification) =>
      pool.query(
        `INSERT INTO user_notifications (user_email, title, message, type, priority)
         VALUES ($1, $2, $3, $4, $5)`,
        [
          userEmail,
          notification.title,
          notification.message,
          notification.type,
          notification.priority,
        ],
      ),
    );

    await Promise.all(insertPromises);

    return NextResponse.json({
      message: 'Test notifications created successfully',
      userEmail,
      count: testNotifications.length,
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Create test notifications error:', error);
    return NextResponse.json(
      { error: 'Failed to create test notifications' },
      { status: 500 },
    );
  }
}
