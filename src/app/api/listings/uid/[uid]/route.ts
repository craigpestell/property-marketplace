import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT ? parseInt(process.env.PGPORT) : 5432,
});

export async function GET(
  request: Request,
  { params }: { params: Promise<{ uid: string }> },
) {
  try {
    const { uid } = await params;
    const result = await pool.query(
      `SELECT 
        id, 
        uuid, 
        property_uid,
        title, 
        price, 
        details,
        image_url, 
        created_at, 
        address,
        client_id,
        (SELECT email FROM clients WHERE clients.id = properties.client_id) as client_email
      FROM properties 
      WHERE property_uid = $1 AND (deleted IS NULL OR deleted = FALSE)`,
      [uid],
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 },
      );
    }

    return NextResponse.json(result.rows[0]);
  } catch (error: any) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: error.message || 'Database error' },
      { status: 500 },
    );
  }
}
