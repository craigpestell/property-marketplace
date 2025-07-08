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
      user: { email: string; role?: string; client_uid?: string };
    } | null;
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role'); // 'buyer' or 'seller'
    const status = searchParams.get('status');

    // Get client_uid directly from the session
    const clientUid = session.user.client_uid;

    let query = `
      SELECT 
        o.*,
        p.title as property_title,
        COALESCE(p.formatted_address, 
          CONCAT_WS(', ', 
            CONCAT_WS(' ', p.street_number, p.street_name),
            p.unit,
            p.city,
            p.province,
            p.postal_code,
            p.country
          )) as property_address,
        p.street_number, p.street_name, p.unit, p.city, p.province, p.postal_code, p.country,
        p.client_uid,
        p.price as listing_price,
        p.image_url as property_image_url
      FROM offers o
      JOIN properties p ON o.property_uid = p.property_uid
      WHERE (p.deleted IS NULL OR p.deleted = false) AND (
    `;

    let params: string[] = [];

    // Use client_uid for lookups when available, otherwise fall back to email
    if (clientUid) {
      // Use client_uid for both buyer and seller lookups, with type conversion for safety
      if (role === 'buyer') {
        query += 'o.buyer_client_uid::text = $1::text';
        params = [clientUid];
      } else if (role === 'seller') {
        query += 'o.seller_client_uid::text = $1::text';
        params = [clientUid];
      } else {
        query +=
          '(o.buyer_client_uid::text = $1::text OR o.seller_client_uid::text = $1::text)';
        params = [clientUid];
      }
    } else {
      // Fall back to email-based lookups if client_uid is unavailable
      params = [session.user.email];
      if (role === 'buyer') {
        query += 'o.buyer_email = $1';
      } else if (role === 'seller') {
        query += 'o.seller_email = $1';
      } else {
        query += 'o.buyer_email = $1 OR o.seller_email = $1';
      }
    }

    query += ')';

    if (status) {
      query += ` AND o.status = $${params.length + 1}`;
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
      user: { email: string; role?: string; client_uid?: string };
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

    // Get buyer's client_uid directly from the session
    const buyerClientUid = session.user.client_uid;

    // Get property details, seller email, and seller's client_uid
    const propertyQuery = `
      SELECT user_email, price, title, client_uid as seller_client_uid
      FROM properties 
      WHERE property_uid = $1 AND (deleted IS NULL OR deleted = false)
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
    const insertQuery = `
      INSERT INTO offers (
        offer_uid, property_uid, buyer_email, seller_email, offer_amount, message,
        financing_type, contingencies, closing_date, earnest_money, inspection_period_days,
        seller_client_uid, buyer_client_uid
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *`;

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
      property.seller_client_uid || null,
      buyerClientUid || null,
    ];

    const result = await pool.query(insertQuery, insertParams);
    const newOffer = result.rows[0];

    // Create notification for seller
    const notificationMessage = `New offer of $${offer_amount.toLocaleString()} received for "${property.title}"`;

    // Create notification with client_uid fields
    await pool.query(
      `INSERT INTO user_notifications 
        (user_email, title, message, type, related_offer_uid, related_property_uid, priority, client_uid, related_client_uid)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        seller_email,
        'New Offer Received!',
        notificationMessage,
        'offer_received',
        newOffer.offer_uid,
        property_uid,
        'high',
        property.seller_client_uid || null,
        buyerClientUid || null,
      ],
    );

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
