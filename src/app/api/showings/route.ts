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
    await pool.query(
      `INSERT INTO showings (property_uid, date, time, user_name, user_email) VALUES ($1, $2, $3, $4, $5)`,
      [propertyUid, date, time, userName, userEmail],
    );
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const result = await pool.query(
      'SELECT * FROM showings ORDER BY created_at DESC',
    );
    return NextResponse.json(result.rows);
  } catch (err) {
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
