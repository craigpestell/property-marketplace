import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT ? parseInt(process.env.PGPORT) : 5432,
});

export async function GET() {
  try {
    // Get the featured properties limit from configuration
    const configResult = await pool.query(
      "SELECT config_value FROM app_config WHERE config_key = 'featured_properties_limit'",
    );

    const limit =
      configResult.rows.length > 0
        ? parseInt(configResult.rows[0].config_value)
        : 6; // fallback to 6 if config not found

    let properties = [];
    let timeFrame = '';

    // Try to get most loved properties from the last day
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);

    const dayQuery = `
      SELECT 
        p.id, 
        p.uuid, 
        COALESCE(p.property_uid, CONCAT('PROP-', EXTRACT(EPOCH FROM p.created_at)::text, '-', SUBSTRING(p.id::text, 1, 6))) as property_uid,
        p.title, 
        p.price, 
        p.details,
        p.image_url, 
        p.created_at, 
        p.address,
        p.client_id,
        p.user_email,
        (SELECT email FROM clients WHERE clients.id = p.client_id) as client_email,
        COUNT(sp.property_uid) as saves
      FROM properties p
      LEFT JOIN saved_properties sp ON COALESCE(p.property_uid, CONCAT('PROP-', EXTRACT(EPOCH FROM p.created_at)::text, '-', SUBSTRING(p.id::text, 1, 6))) = sp.property_uid 
        AND sp.created_at >= $1
      WHERE (p.deleted IS NULL OR p.deleted = FALSE)
      GROUP BY p.id, p.uuid, p.property_uid, p.title, p.price, p.details, p.image_url, p.created_at, p.address, p.client_id, p.user_email
      HAVING COUNT(sp.property_uid) > 0
      ORDER BY saves DESC, p.created_at DESC
      LIMIT $2
    `;

    const dayResult = await pool.query(dayQuery, [
      oneDayAgo.toISOString(),
      limit,
    ]);

    if (dayResult.rows.length >= limit) {
      properties = dayResult.rows;
      timeFrame = 'day';
    } else {
      // Try to get most loved properties from the last week
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      const weekQuery = `
          SELECT 
            p.id, 
            p.uuid, 
            COALESCE(p.property_uid, CONCAT('PROP-', EXTRACT(EPOCH FROM p.created_at)::text, '-', SUBSTRING(p.id::text, 1, 6))) as property_uid,
            p.title, 
            p.price, 
            p.details,
            p.image_url, 
            p.created_at, 
            p.address,
            p.client_id,
            p.user_email,
            (SELECT email FROM clients WHERE clients.id = p.client_id) as client_email,
            COUNT(sp.property_uid) as saves
          FROM properties p
          LEFT JOIN saved_properties sp ON COALESCE(p.property_uid, CONCAT('PROP-', EXTRACT(EPOCH FROM p.created_at)::text, '-', SUBSTRING(p.id::text, 1, 6))) = sp.property_uid 
            AND sp.created_at >= $1
          WHERE (p.deleted IS NULL OR p.deleted = FALSE)
          GROUP BY p.id, p.uuid, p.property_uid, p.title, p.price, p.details, p.image_url, p.created_at, p.address, p.client_id, p.user_email
          HAVING COUNT(sp.property_uid) > 0
          ORDER BY saves DESC, p.created_at DESC
          LIMIT $2
        `;

      const weekResult = await pool.query(weekQuery, [
        oneWeekAgo.toISOString(),
        limit,
      ]);

      if (weekResult.rows.length >= limit) {
        properties = weekResult.rows;
        timeFrame = 'week';
      } else {
        // Try to get most loved properties from the last month
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        const monthQuery = `
            SELECT 
              p.id, 
              p.uuid, 
              COALESCE(p.property_uid, CONCAT('PROP-', EXTRACT(EPOCH FROM p.created_at)::text, '-', SUBSTRING(p.id::text, 1, 6))) as property_uid,
              p.title, 
              p.price, 
              p.details,
              p.image_url, 
              p.created_at, 
              p.address,
              p.client_id,
              p.user_email,
              (SELECT email FROM clients WHERE clients.id = p.client_id) as client_email,
              COUNT(sp.property_uid) as saves
            FROM properties p
            LEFT JOIN saved_properties sp ON COALESCE(p.property_uid, CONCAT('PROP-', EXTRACT(EPOCH FROM p.created_at)::text, '-', SUBSTRING(p.id::text, 1, 6))) = sp.property_uid 
              AND sp.created_at >= $1
            WHERE (p.deleted IS NULL OR p.deleted = FALSE)
            GROUP BY p.id, p.uuid, p.property_uid, p.title, p.price, p.details, p.image_url, p.created_at, p.address, p.client_id, p.user_email
            HAVING COUNT(sp.property_uid) > 0
            ORDER BY saves DESC, p.created_at DESC
            LIMIT $2
          `;

        const monthResult = await pool.query(monthQuery, [
          oneMonthAgo.toISOString(),
          limit,
        ]);

        if (monthResult.rows.length >= limit) {
          properties = monthResult.rows;
          timeFrame = 'month';
        } else {
          // Fall back to all-time most loved properties
          const allTimeQuery = `
              SELECT 
                p.id, 
                p.uuid, 
                COALESCE(p.property_uid, CONCAT('PROP-', EXTRACT(EPOCH FROM p.created_at)::text, '-', SUBSTRING(p.id::text, 1, 6))) as property_uid,
                p.title, 
                p.price, 
                p.details,
                p.image_url, 
                p.created_at, 
                p.address,
                p.client_id,
                p.user_email,
                (SELECT email FROM clients WHERE clients.id = p.client_id) as client_email,
                COUNT(sp.property_uid) as saves
              FROM properties p
              LEFT JOIN saved_properties sp ON COALESCE(p.property_uid, CONCAT('PROP-', EXTRACT(EPOCH FROM p.created_at)::text, '-', SUBSTRING(p.id::text, 1, 6))) = sp.property_uid
              WHERE (p.deleted IS NULL OR p.deleted = FALSE)
              GROUP BY p.id, p.uuid, p.property_uid, p.title, p.price, p.details, p.image_url, p.created_at, p.address, p.client_id, p.user_email
              HAVING COUNT(sp.property_uid) > 0
              ORDER BY saves DESC, p.created_at DESC
              LIMIT $1
            `;

          const allTimeResult = await pool.query(allTimeQuery, [limit]);
          properties = allTimeResult.rows;
          timeFrame = 'all-time';
        }
      }
    }

    return NextResponse.json({
      properties,
      timeFrame,
      limit,
      count: properties.length,
    });
  } catch (error) {
    console.error('Database error fetching most loved properties:', error);
    return NextResponse.json(
      { error: 'Failed to fetch most loved properties' },
      { status: 500 },
    );
  }
}
