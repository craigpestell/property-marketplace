import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT ? parseInt(process.env.PGPORT) : 5432,
});

export async function GET(request: Request) {
  try {
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

    const whereConditions = ['(deleted IS NULL OR deleted = FALSE)'];
    const queryParams: any[] = [];
    let paramIndex = 1;

    // Full-text search
    if (query) {
      whereConditions.push(`(
        title ILIKE $${paramIndex} OR 
        address ILIKE $${paramIndex} OR 
        details ILIKE $${paramIndex}
      )`);
      queryParams.push(`%${query}%`);
      paramIndex++;
    }

    // Price range
    if (filters.minPrice) {
      whereConditions.push(`price >= $${paramIndex}`);
      queryParams.push(parseFloat(filters.minPrice));
      paramIndex++;
    }

    if (filters.maxPrice) {
      whereConditions.push(`price <= $${paramIndex}`);
      queryParams.push(parseFloat(filters.maxPrice));
      paramIndex++;
    }

    // Property type
    if (filters.propertyType) {
      whereConditions.push(
        `details::jsonb ->> 'propertyType' = $${paramIndex}`,
      );
      queryParams.push(filters.propertyType);
      paramIndex++;
    }

    // Bedroom range
    if (filters.minBedrooms) {
      whereConditions.push(
        `COALESCE((details::jsonb ->> 'bedrooms')::int, 0) >= $${paramIndex}`,
      );
      queryParams.push(parseInt(filters.minBedrooms));
      paramIndex++;
    }

    if (filters.maxBedrooms) {
      whereConditions.push(
        `COALESCE((details::jsonb ->> 'bedrooms')::int, 999) <= $${paramIndex}`,
      );
      queryParams.push(parseInt(filters.maxBedrooms));
      paramIndex++;
    }

    // Bathroom range
    if (filters.minBathrooms) {
      whereConditions.push(
        `COALESCE((details::jsonb ->> 'bathrooms')::int, 0) >= $${paramIndex}`,
      );
      queryParams.push(parseInt(filters.minBathrooms));
      paramIndex++;
    }

    if (filters.maxBathrooms) {
      whereConditions.push(
        `COALESCE((details::jsonb ->> 'bathrooms')::int, 999) <= $${paramIndex}`,
      );
      queryParams.push(parseInt(filters.maxBathrooms));
      paramIndex++;
    }

    // Square footage range
    if (filters.minSquareFootage) {
      whereConditions.push(
        `COALESCE((details::jsonb ->> 'squareFootage')::int, 0) >= $${paramIndex}`,
      );
      queryParams.push(parseInt(filters.minSquareFootage));
      paramIndex++;
    }

    if (filters.maxSquareFootage) {
      whereConditions.push(
        `COALESCE((details::jsonb ->> 'squareFootage')::int, 999999) <= $${paramIndex}`,
      );
      queryParams.push(parseInt(filters.maxSquareFootage));
      paramIndex++;
    }

    // Year built range
    if (filters.yearBuiltMin) {
      whereConditions.push(
        `COALESCE((details::jsonb ->> 'yearBuilt')::int, 0) >= $${paramIndex}`,
      );
      queryParams.push(parseInt(filters.yearBuiltMin));
      paramIndex++;
    }

    if (filters.yearBuiltMax) {
      whereConditions.push(
        `COALESCE((details::jsonb ->> 'yearBuilt')::int, 9999) <= $${paramIndex}`,
      );
      queryParams.push(parseInt(filters.yearBuiltMax));
      paramIndex++;
    }

    // Features filtering
    if (filters.features && filters.features.length > 0) {
      const featureConditions = filters.features.map((feature) => {
        const condition = `details::jsonb -> 'features' @> $${paramIndex}`;
        queryParams.push(JSON.stringify([feature]));
        paramIndex++;
        return condition;
      });
      whereConditions.push(`(${featureConditions.join(' AND ')})`);
    }

    // City filtering
    if (filters.city) {
      whereConditions.push(`address ILIKE $${paramIndex}`);
      queryParams.push(`%${filters.city}%`);
      paramIndex++;
    }

    const offset = (page - 1) * limit;
    const allowedSortColumns = ['created_at', 'price', 'title'];
    const validSortBy = allowedSortColumns.includes(sortBy)
      ? sortBy
      : 'created_at';
    const validSortOrder = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    const whereClause =
      whereConditions.length > 0
        ? `WHERE ${whereConditions.join(' AND ')}`
        : '';

    const mainQuery = `
      SELECT 
        id, 
        uuid, 
        property_uid,
        title, 
        price, 
        details,
        image_url, 
        created_at, 
        address,
        client_id
      FROM properties 
      ${whereClause}
      ORDER BY ${validSortBy} ${validSortOrder}
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    queryParams.push(limit, offset);

    const countQuery = `SELECT COUNT(*) as total FROM properties ${whereClause}`;
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
      appliedFilters: filters,
      searchQuery: query,
    });
  } catch (error: any) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: error.message || 'Search error' },
      { status: 500 },
    );
  }
}
