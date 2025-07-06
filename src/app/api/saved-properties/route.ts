import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { Pool } from 'pg';

import { authOptions } from '@/lib/auth';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// GET /api/saved-properties - Get user's saved properties
export async function GET(request: NextRequest) {
  try {
    const session = (await getServerSession(authOptions)) as {
      user: { email: string };
    } | null;

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 },
      );
    }

    const userEmail = session.user.email;

    // Get all saved properties for the user with property details
    const query = `
      SELECT 
        sp.id as saved_id,
        sp.created_at as saved_at,
        p.*
      FROM saved_properties sp
      JOIN properties p ON sp.property_uid = p.property_uid
      WHERE sp.user_email = $1
      ORDER BY sp.created_at DESC
    `;

    const result = await pool.query(query, [userEmail]);

    return NextResponse.json({
      success: true,
      savedProperties: result.rows,
      count: result.rowCount,
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
export async function POST(request: NextRequest) {
  try {
    const session = (await getServerSession(authOptions)) as {
      user: { email: string };
    } | null;

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 },
      );
    }

    const { propertyUid } = await request.json();

    if (!propertyUid) {
      return NextResponse.json(
        { error: 'Property UID is required' },
        { status: 400 },
      );
    }

    const userEmail = session.user.email;

    // Check if property exists
    const propertyCheck = await pool.query(
      'SELECT property_uid FROM properties WHERE property_uid = $1',
      [propertyUid],
    );

    if (propertyCheck.rowCount === 0) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 },
      );
    }

    // Save the property (ON CONFLICT DO NOTHING handles duplicates)
    const insertQuery = `
      INSERT INTO saved_properties (user_email, property_uid)
      VALUES ($1, $2)
      ON CONFLICT (user_email, property_uid) DO NOTHING
      RETURNING id, created_at
    `;

    const result = await pool.query(insertQuery, [userEmail, propertyUid]);

    if (result.rowCount === 0) {
      // Property was already saved
      return NextResponse.json({
        success: true,
        message: 'Property already saved',
        alreadySaved: true,
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Property saved successfully',
      savedProperty: result.rows[0],
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
export async function DELETE(request: NextRequest) {
  try {
    const session = (await getServerSession(authOptions)) as {
      user: { email: string };
    } | null;

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 },
      );
    }

    const { searchParams } = new URL(request.url);
    const propertyUid = searchParams.get('propertyUid');

    if (!propertyUid) {
      return NextResponse.json(
        { error: 'Property UID is required' },
        { status: 400 },
      );
    }

    const userEmail = session.user.email;

    // Remove the saved property
    const deleteQuery = `
      DELETE FROM saved_properties 
      WHERE user_email = $1 AND property_uid = $2
      RETURNING id
    `;

    const result = await pool.query(deleteQuery, [userEmail, propertyUid]);

    if (result.rowCount === 0) {
      return NextResponse.json(
        { error: 'Saved property not found' },
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
