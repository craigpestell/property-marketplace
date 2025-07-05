/* eslint-disable @typescript-eslint/ban-ts-comment */
import formidable from 'formidable';
import fs from 'fs';
import { NextResponse } from 'next/server';
import path from 'path';
import { Pool } from 'pg';
import { Readable } from 'stream';
import { v4 as uuidv4 } from 'uuid';

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT ? parseInt(process.env.PGPORT) : 5432,
});

function generatePropertyUID(): string {
  const prefix = 'PROP';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // Extract query parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const sortBy = searchParams.get('sortBy') || 'created_at';
    const sortOrder = searchParams.get('sortOrder') || 'DESC';
    const propertyType = searchParams.get('propertyType');
    const bedrooms = searchParams.get('bedrooms');
    const bathrooms = searchParams.get('bathrooms');
    const city = searchParams.get('city');
    const clientId = searchParams.get('clientId');
    const userEmail = searchParams.get('userEmail'); // Add user email filter

    const offset = (page - 1) * limit;

    const whereConditions = ['(deleted IS NULL OR deleted = FALSE)'];
    const queryParams: any[] = [];
    let paramIndex = 1;

    // Search in title, address, and details (instead of description)
    if (search) {
      whereConditions.push(`(
        title ILIKE $${paramIndex} OR 
        address ILIKE $${paramIndex} OR 
        details ILIKE $${paramIndex}
      )`);
      queryParams.push(`%${search}%`);
      paramIndex++;
    }

    // Price range filtering
    if (minPrice) {
      whereConditions.push(`price >= $${paramIndex}`);
      queryParams.push(parseFloat(minPrice));
      paramIndex++;
    }

    if (maxPrice) {
      whereConditions.push(`price <= $${paramIndex}`);
      queryParams.push(parseFloat(maxPrice));
      paramIndex++;
    }

    // City filtering
    if (city) {
      whereConditions.push(`address ILIKE $${paramIndex}`);
      queryParams.push(`%${city}%`);
      paramIndex++;
    }

    // Client filtering
    if (clientId) {
      whereConditions.push(`client_id = $${paramIndex}`);
      queryParams.push(parseInt(clientId));
      paramIndex++;
    }

    // User email filtering (for user's own listings)
    if (userEmail) {
      whereConditions.push(`user_email = $${paramIndex}`);
      queryParams.push(userEmail);
      paramIndex++;
    }

    // Property type filtering
    if (propertyType) {
      whereConditions.push(
        `details::jsonb ->> 'propertyType' = $${paramIndex}`,
      );
      queryParams.push(propertyType);
      paramIndex++;
    }

    // Bedrooms filtering
    if (bedrooms) {
      whereConditions.push(
        `(details::jsonb ->> 'bedrooms')::int = $${paramIndex}`,
      );
      queryParams.push(parseInt(bedrooms));
      paramIndex++;
    }

    // Bathrooms filtering
    if (bathrooms) {
      whereConditions.push(
        `(details::jsonb ->> 'bathrooms')::int = $${paramIndex}`,
      );
      queryParams.push(parseInt(bathrooms));
      paramIndex++;
    }

    const allowedSortColumns = ['created_at', 'price', 'title', 'address'];
    const validSortBy = allowedSortColumns.includes(sortBy)
      ? sortBy
      : 'created_at';
    const validSortOrder = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    const whereClause =
      whereConditions.length > 0
        ? `WHERE ${whereConditions.join(' AND ')}`
        : '';

    // Remove description from SELECT query
    const mainQuery = `
      SELECT 
        id, 
        uuid, 
        COALESCE(property_uid, CONCAT('PROP-', EXTRACT(EPOCH FROM created_at)::text, '-', SUBSTRING(id::text, 1, 6))) as property_uid,
        title, 
        price, 
        details,
        image_url, 
        created_at, 
        address,
        client_id,
        user_email,
        (SELECT email FROM clients WHERE clients.id = properties.client_id) as client_email
      FROM properties 
      ${whereClause}
      ORDER BY ${validSortBy} ${validSortOrder}
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    queryParams.push(limit, offset);

    const countQuery = `
      SELECT COUNT(*) as total
      FROM properties 
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
        search,
        minPrice,
        maxPrice,
        sortBy: validSortBy,
        sortOrder: validSortOrder,
        propertyType,
        bedrooms,
        bathrooms,
        city,
        clientId,
      },
    });
  } catch (error: any) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: error.message || 'Database error' },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const { fields, files } = await parseForm(req);

    const email = Array.isArray(fields.email) ? fields.email[0] : fields.email;
    const title = Array.isArray(fields.title) ? fields.title[0] : fields.title;
    const price = Array.isArray(fields.price) ? fields.price[0] : fields.price;
    const address = Array.isArray(fields.address)
      ? fields.address[0]
      : fields.address;
    // Remove description field handling
    const details = Array.isArray(fields.details)
      ? fields.details[0]
      : fields.details;
    const imageFile = files.image;
    let image_url = '';

    if (imageFile && imageFile[0]) {
      image_url = '/uploads/' + path.basename(imageFile[0].filepath);
    }

    const propertyUID = generatePropertyUID();
    const uuid = uuidv4();

    const clientResult = await pool.query(
      'SELECT id FROM clients WHERE email = $1',
      [email],
    );
    const client = clientResult.rows[0];
    if (!client) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Remove description from INSERT query
    const insertResult = await pool.query(
      `INSERT INTO properties (uuid, property_uid, title, price, details, image_url, address, client_id, user_email) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING id, property_uid`,
      [
        uuid,
        propertyUID,
        title,
        price,
        details,
        image_url,
        address,
        client.id,
        email,
      ],
    );

    return NextResponse.json({
      success: true,
      propertyUID: insertResult.rows[0].property_uid,
      id: insertResult.rows[0].id,
    });
  } catch (error: any) {
    console.error('Error adding property:', error);
    return NextResponse.json(
      { error: error.message || 'Database error' },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const propertyUid = searchParams.get('uid');
    const userEmail = searchParams.get('userEmail');

    if (!propertyUid || !userEmail) {
      return NextResponse.json(
        { error: 'Property UID and user email are required' },
        { status: 400 },
      );
    }

    // First, verify the property belongs to the user
    const propertyResult = await pool.query(
      'SELECT id, property_uid, user_email, title FROM properties WHERE property_uid = $1 AND (deleted IS NULL OR deleted = FALSE)',
      [propertyUid],
    );

    if (propertyResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 },
      );
    }

    const property = propertyResult.rows[0];

    // Check if the user owns this property
    if (property.user_email !== userEmail) {
      return NextResponse.json(
        { error: 'Unauthorized: You can only delete your own listings' },
        { status: 403 },
      );
    }

    // Soft delete the property by setting deleted flag
    await pool.query(
      'UPDATE properties SET deleted = TRUE WHERE property_uid = $1',
      [propertyUid],
    );

    return NextResponse.json({
      success: true,
      message: `Property "${property.title}" has been deleted successfully`,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete property' },
      { status: 500 },
    );
  }
}

// Helper functions remain the same...
async function parseForm(req: Request) {
  const uploadDir = path.join(process.cwd(), 'public/uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  const form = formidable({
    multiples: false,
    uploadDir,
    keepExtensions: true,
  });
  return new Promise<{ fields: any; files: any }>((resolve, reject) => {
    const stream = requestToNodeStreamWithHeaders(req);
    form.parse(stream, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
}

function requestToNodeStreamWithHeaders(req: Request): any {
  const reader = req.body?.getReader();
  const stream = new Readable({
    async read() {
      if (!reader) return this.push(null);
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        this.push(value);
      }
      this.push(null);
    },
  });
  // @ts-ignore
  stream.headers = {};
  req.headers.forEach((value, key) => {
    // @ts-ignore
    stream.headers[key.toLowerCase()] = value;
  });
  return stream;
}
