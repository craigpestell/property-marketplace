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

// GET /api/offers/[id] - Get specific offer details
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const session = (await getServerSession(authOptions)) as {
      user: { email: string; role?: string };
    } | null;
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const offerId = params.id;

    const query = `
      SELECT 
        o.*,
        p.title as property_title,
        p.address as property_address,
        p.price as listing_price,
        p.images as property_images
      FROM offers o
      JOIN properties p ON o.property_uid = p.property_uid
      WHERE o.offer_id = $1 
        AND p.deleted = false 
        AND (o.buyer_email = $2 OR o.seller_email = $2)
    `;

    const result = await pool.query(query, [offerId, session.user.email]);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Offer not found' }, { status: 404 });
    }

    return NextResponse.json({ offer: result.rows[0] });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch offer' },
      { status: 500 },
    );
  }
}

// PUT /api/offers/[id] - Update offer status (accept, reject, counter)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const session = (await getServerSession(authOptions)) as {
      user: { email: string; role?: string };
    } | null;
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const offerId = params.id;
    const body = await request.json();
    const { status, counter_amount, counter_terms, message } = body;

    // Validate status
    const validStatuses = ['accepted', 'rejected', 'countered', 'withdrawn'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    // Get current offer to verify permissions
    const offerQuery = `
      SELECT o.*, p.title as property_title
      FROM offers o
      JOIN properties p ON o.property_uid = p.property_uid
      WHERE o.offer_id = $1 AND p.deleted = false
    `;
    const offerResult = await pool.query(offerQuery, [offerId]);

    if (offerResult.rows.length === 0) {
      return NextResponse.json({ error: 'Offer not found' }, { status: 404 });
    }

    const offer = offerResult.rows[0];

    // Check permissions based on action
    if (status === 'withdrawn' && offer.buyer_email !== session.user.email) {
      return NextResponse.json(
        { error: 'Only the buyer can withdraw an offer' },
        { status: 403 },
      );
    }

    if (
      ['accepted', 'rejected', 'countered'].includes(status) &&
      offer.seller_email !== session.user.email
    ) {
      return NextResponse.json(
        { error: 'Only the seller can accept, reject, or counter an offer' },
        { status: 403 },
      );
    }

    // Update offer status
    const updateQuery = `
      UPDATE offers 
      SET status = $1, updated_at = CURRENT_TIMESTAMP
      WHERE offer_id = $2
      RETURNING *
    `;
    const updateResult = await pool.query(updateQuery, [status, offerId]);

    // Handle counter offer
    if (status === 'countered' && counter_amount) {
      const counterQuery = `
        INSERT INTO counter_offers (original_offer_id, counter_amount, counter_terms, created_by)
        VALUES ($1, $2, $3, $4)
        RETURNING *
      `;
      await pool.query(counterQuery, [
        offerId,
        counter_amount,
        counter_terms || '',
        session.user.email,
      ]);
    }

    // Create notification for the other party
    const notificationRecipient =
      status === 'withdrawn' ? offer.seller_email : offer.buyer_email;

    const notificationMessages = {
      accepted: `Your offer of $${offer.offer_amount.toLocaleString()} for "${
        offer.property_title
      }" has been accepted!`,
      rejected: `Your offer of $${offer.offer_amount.toLocaleString()} for "${
        offer.property_title
      }" has been rejected.`,
      countered: `Your offer for "${offer.property_title}" has been countered with $${counter_amount?.toLocaleString()}.`,
      withdrawn: `The offer of $${offer.offer_amount.toLocaleString()} for "${
        offer.property_title
      }" has been withdrawn.`,
    };

    const notificationQuery = `
      INSERT INTO offer_notifications (offer_id, recipient_email, type, message)
      VALUES ($1, $2, $3, $4)
    `;

    await pool.query(notificationQuery, [
      offerId,
      notificationRecipient,
      `offer_${status}`,
      message ||
        notificationMessages[status as keyof typeof notificationMessages],
    ]);

    return NextResponse.json({
      message: `Offer ${status} successfully`,
      offer: updateResult.rows[0],
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update offer' },
      { status: 500 },
    );
  }
}
