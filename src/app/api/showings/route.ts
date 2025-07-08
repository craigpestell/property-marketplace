import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

import { getClientUidForUser } from '@/lib/db';

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT ? parseInt(process.env.PGPORT) : 5432,
});

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { propertyUid, date, time, user } = data;

    if (!propertyUid || !date || !time) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      );
    }

    const userName = user?.name || null;
    const userEmail = user?.email || null;

    // Get both client_uid values - one for the property owner and one for the user
    let propertyClientUid = null;
    let userClientUid = null;

    // Get the client_uid for the property owner
    const propertyResult = await pool.query(
      'SELECT client_uid FROM properties WHERE property_uid = $1',
      [propertyUid],
    );

    if (propertyResult.rows.length > 0) {
      propertyClientUid = propertyResult.rows[0].client_uid;
    }

    // Get the client_uid for the user booking the showing (if they have an email)
    if (userEmail) {
      userClientUid = await getClientUidForUser(userEmail);
    }

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
    const { searchParams } = new URL(request.url);
    const propertyUid = searchParams.get('propertyUid');
    const clientUid = searchParams.get('clientUid');
    const userEmail = searchParams.get('userEmail');

    // If user email is provided but no client_uid, try to get client_uid
    let effectiveClientUid = clientUid;

    if (!effectiveClientUid && userEmail) {
      effectiveClientUid = await getClientUidForUser(userEmail);
    }

    let query = 'SELECT * FROM showings';
    const params: string[] = [];
    const conditions: string[] = [];

    // Apply filters if provided
    if (propertyUid) {
      conditions.push(`property_uid = $${params.length + 1}`);
      params.push(propertyUid);
    }

    if (effectiveClientUid) {
      conditions.push(
        `(client_uid = $${params.length + 1} OR viewer_client_uid = $${params.length + 1})`,
      );
      params.push(effectiveClientUid);
    } else if (userEmail) {
      conditions.push(`user_email = $${params.length + 1}`);
      params.push(userEmail);
    }

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
