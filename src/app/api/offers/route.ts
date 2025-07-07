import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { Pool } from 'pg';

import { authOptions } from '@/lib/auth';
import { generateOfferUID } from '@/lib/uid';

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

    // Check if we're using the new schema
    const { isUsingNewSchema, formatAddress } = await import('@/lib/db');
    const usingNewSchema = await isUsingNewSchema();

    let query = `
      SELECT 
        o.*,
        p.title as property_title,
        ${
          usingNewSchema
            ? `COALESCE(p.formatted_address, 
               ${formatAddress.name}(p.street_number, p.street_name, p.unit, p.city, p.province, p.postal_code, p.country)) as property_address,
               p.street_number, p.street_name, p.unit, p.city, p.province, p.postal_code, p.country,
               p.client_uid,`
            : 'p.formatted_address as property_address,'
        }
        p.price as listing_price,
        p.image_url as property_image_url
      FROM offers o
      JOIN properties p ON o.property_uid = p.property_uid
      WHERE (p.deleted IS NULL OR p.deleted = false) AND (
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
    // eslint-disable-next-line no-console
    console.error('GET /api/offers error:', error);
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

    // Check if we're using the new schema
    const { isUsingNewSchema } = await import('@/lib/db');
    const usingNewSchema = await isUsingNewSchema();

    // Get property details and seller email
    const propertyQuery = usingNewSchema
      ? `
        SELECT user_email, price, title, client_uid
        FROM properties 
        WHERE property_uid = $1 AND (deleted IS NULL OR deleted = false)
      `
      : `
        SELECT user_email, price, title 
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
    const seller_email = property.user_email;

    // Prevent users from making offers on their own properties
    if (seller_email === session.user.email) {
      return NextResponse.json(
        { error: 'You cannot make an offer on your own property' },
        { status: 400 },
      );
    }

    // Generate offer UID
    const offer_uid = generateOfferUID();

    // Insert the new offer
    let insertQuery = `
      INSERT INTO offers (
        offer_uid, property_uid, buyer_email, seller_email, offer_amount, message,
        financing_type, contingencies, closing_date, earnest_money, inspection_period_days
    `;

    // Add client_uid field if using new schema
    if (usingNewSchema && property.client_uid) {
      insertQuery += `, client_uid`;
    }

    insertQuery += `) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11`;

    // Add client_uid value if using new schema
    if (usingNewSchema && property.client_uid) {
      insertQuery += `, $12`;
    }

    insertQuery += `) RETURNING *`;

    const insertParams = [
      offer_uid,
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

    // Add client_uid param if using new schema
    if (usingNewSchema && property.client_uid) {
      insertParams.push(property.client_uid);
    }

    const result = await pool.query(insertQuery, insertParams);
    const newOffer = result.rows[0];

    // Create notification for seller
    const notificationMessage = `New offer of $${offer_amount.toLocaleString()} received for "${property.title}"`;

    // Create notification with client_uid if available
    if (usingNewSchema && property.client_uid) {
      await pool.query(
        `INSERT INTO user_notifications 
         (user_email, title, message, type, related_offer_uid, related_property_uid, priority, client_uid)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          seller_email,
          'New Offer Received!',
          notificationMessage,
          'offer_received',
          newOffer.offer_uid,
          property_uid,
          'high',
          property.client_uid,
        ],
      );
    } else {
      // New notification system (only using offer_uid)
      await pool.query(
        `INSERT INTO user_notifications 
         (user_email, title, message, type, related_offer_uid, related_property_uid, priority)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          seller_email,
          'New Offer Received!',
          notificationMessage,
          'offer_received',
          newOffer.offer_uid,
          property_uid,
          'high',
        ],
      );
    }

    return NextResponse.json({
      message: 'Offer submitted successfully',
      offer: newOffer,
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('POST /api/offers error:', error);
    return NextResponse.json(
      { error: 'Failed to create offer' },
      { status: 500 },
    );
  }
}
