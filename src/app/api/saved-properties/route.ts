import { NextResponse } from 'next/server';
import { Pool } from 'pg';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT ? parseInt(process.env.PGPORT) : 5432,
});

// Check if the new schema has been migrated
let isNewSchema: boolean | null = null;

async function checkSchema(): Promise<boolean> {
  if (isNewSchema !== null) return isNewSchema;

  try {
    await pool.query('SELECT client_uid FROM properties LIMIT 1');
    isNewSchema = true;
  } catch {
    isNewSchema = false;
  }

  return isNewSchema;
}

// GET /api/saved-properties - Get user's saved properties
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const isNew = await checkSchema();

    // Get all saved properties for the user with property details
    const query = isNew
      ? `
      SELECT 
        sp.saved_at,
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
        p.province,
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
      WHERE sp.user_email = $1
      ORDER BY sp.saved_at DESC
    `
      : `
      SELECT 
        sp.saved_at,
        p.id,
        p.property_uid,
        p.title,
        p.price,
        p.details,
        p.image_url,
        p.created_at,
        p.address,
        p.client_id,
        p.user_email as client_email
      FROM saved_properties sp
      JOIN properties p ON sp.property_uid = p.property_uid
      WHERE sp.user_email = $1
      ORDER BY sp.saved_at DESC
    `;

    const result = await pool.query(query, [session.user.email]);

    return NextResponse.json({
      savedProperties: result.rows,
    });
  } catch (error) {
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
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = await request.json();
    const { propertyUid } = body;

    if (!propertyUid) {
      return NextResponse.json(
        { error: 'Property ID is required' },
        { status: 400 },
      );
    }

    // Verify property exists
    const propertyCheck = await pool.query(
      'SELECT property_uid FROM properties WHERE property_uid = $1',
      [propertyUid],
    );

    if (propertyCheck.rows.length === 0) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 },
      );
    }

    // Save the property
    await pool.query(
      `
      INSERT INTO saved_properties (user_email, property_uid)
      VALUES ($1, $2)
      ON CONFLICT (user_email, property_uid) DO NOTHING
      `,
      [session.user.email, propertyUid],
    );

    return NextResponse.json({
      success: true,
      message: 'Property saved successfully',
    });
  } catch (error) {
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
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

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
      WHERE user_email = $1 AND property_uid = $2
      `,
      [session.user.email, propertyUid],
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
    console.error('Error removing saved property:', error);
    return NextResponse.json(
      { error: 'Failed to remove saved property' },
      { status: 500 },
    );
  }
}
