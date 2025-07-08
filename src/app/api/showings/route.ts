import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { Pool } from 'pg';

import { authOptions } from '@/lib/auth';

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT ? parseInt(process.env.PGPORT) : 5432,
});

export async function POST(req: NextRequest) {
  try {
    // Get authenticated user's session
    const session = (await getServerSession(authOptions)) as {
      user?: { name?: string; email?: string; client_uid?: string };
    } | null;

    if (!session?.user?.client_uid) {
      return NextResponse.json(
        { error: 'Not authenticated or missing client ID' },
        { status: 401 },
      );
    }

    const data = await req.json();
    const { propertyUid, date, time } = data;

    if (!propertyUid || !date || !time) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      );
    }

    // Use authenticated user information
    const userName = session.user.name || null;
    const userEmail = session.user.email;

    // Get both client_uid values - one for the property owner and one for the user
    let propertyClientUid = null;
    const userClientUid = session.user.client_uid; // We already verified this exists

    // Get the client_uid for the property owner
    const propertyResult = await pool.query(
      'SELECT client_uid FROM properties WHERE property_uid = $1',
      [propertyUid],
    );

    if (propertyResult.rows.length > 0) {
      propertyClientUid = propertyResult.rows[0].client_uid;
    }

    // No need to look up client_uid as we already verified it exists in the session

    // Insert the showing record with client_uid values
    await pool.query(
      `INSERT INTO showings (property_uid, date, time, user_name, user_email, client_uid, viewer_client_uid) 
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        propertyUid,
        date,
        time,
        userName,
        userEmail,
        propertyClientUid,
        userClientUid,
      ],
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Error creating showing:', err);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get authenticated user's session
    const session = (await getServerSession(authOptions)) as {
      user?: { email?: string; client_uid?: string };
    } | null;

    // Require authentication for viewing showings - check for client_uid directly
    if (!session?.user?.client_uid) {
      return NextResponse.json(
        { error: 'Not authenticated or missing client ID' },
        { status: 401 },
      );
    }

    const { searchParams } = new URL(request.url);
    const propertyUid = searchParams.get('propertyUid');

    // Get client_uid from the session - we know it exists since we checked above
    const effectiveClientUid = session.user.client_uid;

    let query = 'SELECT * FROM showings';
    const params: string[] = [];
    const conditions: string[] = [];

    // Apply filters if provided
    if (propertyUid) {
      conditions.push(`property_uid = $${params.length + 1}`);
      params.push(propertyUid);
    }

    // We should always have a client_uid by this point
    conditions.push(
      `(client_uid = $${params.length + 1} OR viewer_client_uid = $${params.length + 1})`,
    );
    params.push(effectiveClientUid);

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY created_at DESC';

    const result = await pool.query(query, params);
    return NextResponse.json(result.rows);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Error fetching showings:', err);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
