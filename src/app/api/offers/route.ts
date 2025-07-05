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

// GET /api/offers - Get all offers for the authenticated user (as buyer or seller)
export async function GET(request: NextRequest) {
  try {
    const session = (await getServerSession(authOptions)) as {
      user: { email: string; role?: string };
    } | null;
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role'); // 'buyer' or 'seller'
    const status = searchParams.get('status');

    let query = `
      SELECT 
        o.*,
        p.title as property_title,
        p.address as property_address,
        p.price as listing_price,
        p.images as property_images
      FROM offers o
      JOIN properties p ON o.property_uid = p.property_uid
      WHERE p.deleted = false AND (
    `;

    const params: string[] = [session.user.email];

    if (role === 'buyer') {
      query += 'o.buyer_email = $1';
    } else if (role === 'seller') {
      query += 'o.seller_email = $1';
    } else {
      query += 'o.buyer_email = $1 OR o.seller_email = $1';
    }

    query += ')';

    if (status) {
      query += ' AND o.status = $2';
      params.push(status);
    }

    query += ' ORDER BY o.created_at DESC';

    const result = await pool.query(query, params);

    return NextResponse.json({
      offers: result.rows,
    });
  } catch (error) {
    // Log error for debugging
    return NextResponse.json(
      { error: 'Failed to fetch offers' },
      { status: 500 },
    );
  }
}

// POST /api/offers - Create a new offer
export async function POST(request: NextRequest) {
  try {
    const session = (await getServerSession(authOptions)) as {
      user: { email: string; role?: string };
    } | null;
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      property_uid,
      offer_amount,
      message,
      financing_type = 'conventional',
      contingencies = [],
      closing_date,
      earnest_money,
      inspection_period_days = 10,
    } = body;

    // Validate required fields
    if (!property_uid || !offer_amount) {
      return NextResponse.json(
        { error: 'Property UID and offer amount are required' },
        { status: 400 },
      );
    }

    // Get property details and seller email
    const propertyQuery = `
      SELECT user_email, client_email, price, title 
      FROM properties 
      WHERE property_uid = $1 AND deleted = false
    `;
    const propertyResult = await pool.query(propertyQuery, [property_uid]);

    if (propertyResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 },
      );
    }

    const property = propertyResult.rows[0];
    const seller_email = property.user_email || property.client_email;

    // Prevent users from making offers on their own properties
    if (seller_email === session.user.email) {
      return NextResponse.json(
        { error: 'You cannot make an offer on your own property' },
        { status: 400 },
      );
    }

    // Insert the new offer
    const insertQuery = `
      INSERT INTO offers (
        property_uid, buyer_email, seller_email, offer_amount, message,
        financing_type, contingencies, closing_date, earnest_money, inspection_period_days
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `;

    const insertParams = [
      property_uid,
      session.user.email,
      seller_email,
      offer_amount,
      message,
      financing_type,
      contingencies,
      closing_date,
      earnest_money,
      inspection_period_days,
    ];

    const result = await pool.query(insertQuery, insertParams);
    const newOffer = result.rows[0];

    // Create notification for seller
    const notificationQuery = `
      INSERT INTO offer_notifications (offer_id, recipient_email, type, message)
      VALUES ($1, $2, $3, $4)
    `;

    const notificationMessage = `New offer of $${offer_amount.toLocaleString()} received for "${property.title}"`;

    await pool.query(notificationQuery, [
      newOffer.offer_id,
      seller_email,
      'offer_received',
      notificationMessage,
    ]);

    return NextResponse.json({
      message: 'Offer submitted successfully',
      offer: newOffer,
    });
  } catch (error) {
    // Log error for debugging
    return NextResponse.json(
      { error: 'Failed to create offer' },
      { status: 500 },
    );
  }
}
