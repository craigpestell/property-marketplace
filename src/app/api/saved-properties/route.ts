import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { Pool } from 'pg';

import { authOptions } from '@/lib/auth';
import { getClientUidForUser } from '@/lib/db';

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT ? parseInt(process.env.PGPORT) : 5432,
});

// GET /api/saved-properties - Get user's saved properties
export async function GET(_request: Request) {
  try {
    const session = (await getServerSession(authOptions)) as {
      user?: { email?: string };
    } | null;

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Get client_uid for the current user
    const clientUid = await getClientUidForUser(session.user.email);

    if (!clientUid) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    // Get all saved properties for the user with property details
    const query = `
      SELECT 
        sp.created_at as saved_at,
        p.id,
        p.property_uid,
        p.title,
        p.price,
        p.details,
        p.image_url,
        p.created_at,
        p.street_number,
        p.street_name,
        p.unit,
        p.city,
        p.postal_code,
        p.country,
        p.latitude,
        p.longitude,
        p.formatted_address,
        p.address_type,
        p.client_uid,
        c.email as client_email,
        c.name as client_name
      FROM saved_properties sp
      JOIN properties p ON sp.property_uid = p.property_uid
      LEFT JOIN clients c ON p.client_uid = c.client_uid
      WHERE sp.client_uid = $1
      ORDER BY sp.created_at DESC
    `;

    const params = [clientUid];
    const result = await pool.query(query, params);

    return NextResponse.json({
      savedProperties: result.rows,
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching saved properties:', error);
    return NextResponse.json(
      { error: 'Failed to fetch saved properties' },
      { status: 500 },
    );
  }
}

// POST /api/saved-properties - Save a property
export async function POST(request: Request) {
  try {
    const session = (await getServerSession(authOptions)) as {
      user?: { email?: string };
    } | null;

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Get client_uid for the current user
    const clientUid = await getClientUidForUser(session.user.email);

    if (!clientUid) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    const body = await request.json();
    const { propertyUid } = body;

    if (!propertyUid) {
      return NextResponse.json(
        { error: 'Property ID is required' },
        { status: 400 },
      );
    }

    // Verify property exists and is not soft-deleted
    const propertyCheck = await pool.query(
      'SELECT property_uid FROM properties WHERE property_uid = $1 AND (deleted IS NULL OR deleted = FALSE)',
      [propertyUid],
    );

    if (propertyCheck.rows.length === 0) {
      return NextResponse.json(
        { error: 'Property not found or has been deleted' },
        { status: 404 },
      );
    }

    // Save the property
    await pool.query(
      `
      INSERT INTO saved_properties (property_uid, client_uid, user_email)
      VALUES ($1, $2, $3)
      ON CONFLICT (client_uid, property_uid) DO NOTHING
      `,
      [propertyUid, clientUid, session.user.email],
    );

    return NextResponse.json({
      success: true,
      message: 'Property saved successfully',
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error saving property:', error);
    return NextResponse.json(
      { error: 'Failed to save property' },
      { status: 500 },
    );
  }
}

// DELETE /api/saved-properties - Remove a saved property
export async function DELETE(request: Request) {
  try {
    const session = (await getServerSession(authOptions)) as {
      user?: { email?: string };
    } | null;

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Get client_uid for the current user
    const clientUid = await getClientUidForUser(session.user.email);

    const { searchParams } = new URL(request.url);
    const propertyUid = searchParams.get('propertyUid');

    if (!propertyUid) {
      return NextResponse.json(
        { error: 'Property ID is required' },
        { status: 400 },
      );
    }

    // Delete the saved property
    const result = await pool.query(
      `
      DELETE FROM saved_properties 
      WHERE client_uid = $1 AND property_uid = $2
      `,
      [clientUid, propertyUid],
    );

    if (result.rowCount === 0) {
      return NextResponse.json(
        { error: 'Property not found or not saved' },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Property removed from saved list',
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error removing saved property:', error);
    return NextResponse.json(
      { error: 'Failed to remove saved property' },
      { status: 500 },
    );
  }
}
