import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

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

    // Get client_uid for the property if we're using the new schema
    const { isUsingNewSchema } = await import('@/lib/db');
    const usingNewSchema = await isUsingNewSchema();

    let clientUid = null;

    if (usingNewSchema) {
      // Get the client_uid for this property to associate the showing with the client
      const propertyResult = await pool.query(
        'SELECT client_uid FROM properties WHERE property_uid = $1',
        [propertyUid],
      );

      if (propertyResult.rows.length > 0) {
        clientUid = propertyResult.rows[0].client_uid;
      }
    }

    // Insert the showing record with client_uid if available
    if (usingNewSchema && clientUid) {
      await pool.query(
        `INSERT INTO showings (property_uid, date, time, user_name, user_email, client_uid) 
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [propertyUid, date, time, userName, userEmail, clientUid],
      );
    } else {
      await pool.query(
        `INSERT INTO showings (property_uid, date, time, user_name, user_email) 
         VALUES ($1, $2, $3, $4, $5)`,
        [propertyUid, date, time, userName, userEmail],
      );
    }

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

    let query = 'SELECT * FROM showings';
    const params: string[] = [];

    // Apply filters if provided
    if (propertyUid || clientUid) {
      query += ' WHERE';

      if (propertyUid) {
        query += ' property_uid = $1';
        params.push(propertyUid);
      }

      if (clientUid) {
        if (params.length > 0) {
          query += ' AND';
        }
        query += ` client_uid = $${params.length + 1}`;
        params.push(clientUid);
      }
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
