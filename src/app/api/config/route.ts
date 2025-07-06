import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT ? parseInt(process.env.PGPORT) : 5432,
});

// GET - Retrieve configuration values
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');

    let query: string;
    let params: string[] = [];

    if (key) {
      query = 'SELECT * FROM app_config WHERE config_key = $1';
      params = [key];
    } else {
      query = 'SELECT * FROM app_config ORDER BY config_key';
    }

    const result = await pool.query(query, params);

    return NextResponse.json({
      config: key ? result.rows[0] || null : result.rows,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch configuration' },
      { status: 500 },
    );
  }
}

// PUT - Update configuration value
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { key, value, description } = body;

    if (!key || value === undefined) {
      return NextResponse.json(
        { error: 'Key and value are required' },
        { status: 400 },
      );
    }

    const query = `
      INSERT INTO app_config (config_key, config_value, description) 
      VALUES ($1, $2, $3)
      ON CONFLICT (config_key) 
      DO UPDATE SET 
        config_value = EXCLUDED.config_value,
        description = COALESCE(EXCLUDED.description, app_config.description),
        updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `;

    const result = await pool.query(query, [key, value, description]);

    return NextResponse.json({
      success: true,
      config: result.rows[0],
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update configuration' },
      { status: 500 },
    );
  }
}
