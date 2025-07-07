import { NextResponse } from 'next/server';
import { Pool } from 'pg';

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

export async function GET(request: Request) {
  try {
    const isNew = await checkSchema();
    const { searchParams } = new URL(request.url);

    // Advanced search parameters
    const query = searchParams.get('q') || '';
    const filters = {
      minPrice: searchParams.get('minPrice'),
      maxPrice: searchParams.get('maxPrice'),
      propertyType: searchParams.get('propertyType'),
      minBedrooms: searchParams.get('minBedrooms'),
      maxBedrooms: searchParams.get('maxBedrooms'),
      minBathrooms: searchParams.get('minBathrooms'),
      maxBathrooms: searchParams.get('maxBathrooms'),
      minSquareFootage: searchParams.get('minSquareFootage'),
      maxSquareFootage: searchParams.get('maxSquareFootage'),
      yearBuiltMin: searchParams.get('yearBuiltMin'),
      yearBuiltMax: searchParams.get('yearBuiltMax'),
      features: searchParams.getAll('features'), // Multiple features
      city: searchParams.get('city'),
      radius: searchParams.get('radius'), // For future geo-search
    };

    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const sortBy = searchParams.get('sortBy') || 'created_at';
    const sortOrder = searchParams.get('sortOrder') || 'DESC';

    const whereConditions = ['(p.deleted IS NULL OR p.deleted = FALSE)'];
    const queryParams: any[] = [];
    let paramIndex = 1;

    // Full-text search - adapt based on schema
    if (query) {
      if (isNew) {
        whereConditions.push(`(
          p.title ILIKE $${paramIndex} OR
          p.formatted_address ILIKE $${paramIndex} OR
          CONCAT(p.street_number, ' ', p.street_name) ILIKE $${paramIndex} OR
          p.city ILIKE $${paramIndex} OR
          p.details ILIKE $${paramIndex} OR
          p.search_vector @@ plainto_tsquery('english', $${paramIndex})
        )`);
      } else {
        whereConditions.push(`(
          p.title ILIKE $${paramIndex} OR 
          p.address ILIKE $${paramIndex} OR 
          p.details ILIKE $${paramIndex}
        )`);
      }
      queryParams.push(`%${query}%`);
      paramIndex++;
    }

    // Price range
    if (filters.minPrice) {
      whereConditions.push(`p.price >= $${paramIndex}`);
      queryParams.push(parseFloat(filters.minPrice));
      paramIndex++;
    }

    if (filters.maxPrice) {
      whereConditions.push(`p.price <= $${paramIndex}`);
      queryParams.push(parseFloat(filters.maxPrice));
      paramIndex++;
    }

    // Property type
    if (filters.propertyType) {
      whereConditions.push(
        `p.details::jsonb ->> 'propertyType' = $${paramIndex}`,
      );
      queryParams.push(filters.propertyType);
      paramIndex++;
    }

    // Bedroom range
    if (filters.minBedrooms) {
      whereConditions.push(
        `COALESCE((p.details::jsonb ->> 'bedrooms')::int, 0) >= $${paramIndex}`,
      );
      queryParams.push(parseInt(filters.minBedrooms));
      paramIndex++;
    }

    if (filters.maxBedrooms) {
      whereConditions.push(
        `COALESCE((p.details::jsonb ->> 'bedrooms')::int, 999) <= $${paramIndex}`,
      );
      queryParams.push(parseInt(filters.maxBedrooms));
      paramIndex++;
    }

    // Bathroom range
    if (filters.minBathrooms) {
      whereConditions.push(
        `COALESCE((p.details::jsonb ->> 'bathrooms')::int, 0) >= $${paramIndex}`,
      );
      queryParams.push(parseInt(filters.minBathrooms));
      paramIndex++;
    }

    if (filters.maxBathrooms) {
      whereConditions.push(
        `COALESCE((p.details::jsonb ->> 'bathrooms')::int, 999) <= $${paramIndex}`,
      );
      queryParams.push(parseInt(filters.maxBathrooms));
      paramIndex++;
    }

    // Square footage range
    if (filters.minSquareFootage) {
      whereConditions.push(
        `COALESCE((p.details::jsonb ->> 'squareFootage')::int, 0) >= $${paramIndex}`,
      );
      queryParams.push(parseInt(filters.minSquareFootage));
      paramIndex++;
    }

    if (filters.maxSquareFootage) {
      whereConditions.push(
        `COALESCE((p.details::jsonb ->> 'squareFootage')::int, 999999) <= $${paramIndex}`,
      );
      queryParams.push(parseInt(filters.maxSquareFootage));
      paramIndex++;
    }

    // Year built range
    if (filters.yearBuiltMin) {
      whereConditions.push(
        `COALESCE((p.details::jsonb ->> 'yearBuilt')::int, 0) >= $${paramIndex}`,
      );
      queryParams.push(parseInt(filters.yearBuiltMin));
      paramIndex++;
    }

    if (filters.yearBuiltMax) {
      whereConditions.push(
        `COALESCE((p.details::jsonb ->> 'yearBuilt')::int, 9999) <= $${paramIndex}`,
      );
      queryParams.push(parseInt(filters.yearBuiltMax));
      paramIndex++;
    }

    // Features filtering
    if (filters.features && filters.features.length > 0) {
      const featureConditions = filters.features.map((feature) => {
        const condition = `p.details::jsonb -> 'features' @> $${paramIndex}`;
        queryParams.push(JSON.stringify([feature]));
        paramIndex++;
        return condition;
      });
      whereConditions.push(`(${featureConditions.join(' AND ')})`);
    }

    // City filtering - adapt based on schema
    if (filters.city) {
      if (isNew) {
        whereConditions.push(`p.city ILIKE $${paramIndex}`);
      } else {
        whereConditions.push(`p.address ILIKE $${paramIndex}`);
      }
      queryParams.push(`%${filters.city}%`);
      paramIndex++;
    }

    const offset = (page - 1) * limit;

    // Define allowed sort columns based on schema
    const allowedSortColumns = isNew
      ? ['created_at', 'price', 'title', 'city']
      : ['created_at', 'price', 'title'];

    const validSortBy = allowedSortColumns.includes(sortBy)
      ? sortBy
      : 'created_at';
    const validSortOrder = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    const whereClause =
      whereConditions.length > 0
        ? `WHERE ${whereConditions.join(' AND ')}`
        : '';

    // Conditional SELECT query based on schema
    const mainQuery = isNew
      ? `
      SELECT 
        p.id, 
        p.uuid, 
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
      FROM properties p
      LEFT JOIN clients c ON p.client_uid = c.client_uid
      ${whereClause}
      ORDER BY ${validSortBy === 'city' ? 'p.city' : 'p.' + validSortBy} ${validSortOrder}
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `
      : `
      SELECT 
        p.id, 
        p.uuid, 
        p.property_uid,
        p.title, 
        p.price, 
        p.details,
        p.image_url, 
        p.created_at, 
        p.address,
        p.client_id,
        p.user_email
      FROM properties p
      ${whereClause}
      ORDER BY p.${validSortBy} ${validSortOrder}
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    queryParams.push(limit, offset);

    const countQuery = `
      SELECT COUNT(*) as total 
      FROM properties p
      ${isNew ? 'LEFT JOIN clients c ON p.client_uid = c.client_uid' : ''}
      ${whereClause}
    `;

    const countParams = queryParams.slice(0, -2);

    const [result, countResult] = await Promise.all([
      pool.query(mainQuery, queryParams),
      pool.query(countQuery, countParams),
    ]);

    const total = parseInt(countResult.rows[0].total);
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      properties: result.rows,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
      filters: {
        query,
        ...filters,
        sortBy: validSortBy,
        sortOrder: validSortOrder,
      },
    });
  } catch (error: any) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { error: error.message || 'Search error' },
      { status: 500 },
    );
  }
}
