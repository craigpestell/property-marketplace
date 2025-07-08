import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

import { withClientUid } from '@/lib/api-middleware';

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT ? parseInt(process.env.PGPORT) : 5432,
});

export const POST = withClientUid(
  async (req: NextRequest, { clientUid, email }) => {
    try {
      const data = await req.json();
      const { propertyUid, date, time } = data;

      if (!propertyUid || !date || !time) {
        return NextResponse.json(
          { error: 'Missing required fields' },
          { status: 400 },
        );
      }

      // Get name from data or use email as fallback
      const userName = data.userName || email;

      // Get both client_uid values - one for the property owner and one for the user
      let propertyClientUid = null;
      const userClientUid = clientUid; // From middleware

      // Get the client_uid for the property owner
      const propertyResult = await pool.query(
        'SELECT client_uid FROM properties WHERE property_uid = $1',
        [propertyUid],
      );

      if (propertyResult.rows.length > 0) {
        propertyClientUid = propertyResult.rows[0].client_uid;
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
          email,
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
  },
);

export const GET = withClientUid(
  async (request: NextRequest, { clientUid }) => {
    try {
      const { searchParams } = new URL(request.url);
      const propertyUid = searchParams.get('propertyUid');

      let query = 'SELECT * FROM showings';
      const params: string[] = [];
      const conditions: string[] = [];

      // Apply filters if provided
      if (propertyUid) {
        conditions.push(`property_uid = $${params.length + 1}`);
        params.push(propertyUid);
      }

      // Filter by client_uid from middleware
      conditions.push(
        `(client_uid = $${params.length + 1} OR viewer_client_uid = $${params.length + 1})`,
      );
      params.push(clientUid);

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
  },
);
