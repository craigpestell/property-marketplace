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
    const clientUid = searchParams.get('clientUid');
    const userEmail = searchParams.get('userEmail');

    const offset = (page - 1) * limit;

    const whereConditions = ['(p.deleted IS NULL OR p.deleted = FALSE)'];
    const queryParams: (string | number)[] = [];
    let paramIndex = 1;

    // Search logic - adapt based on schema
    if (search) {
      whereConditions.push(`(
        p.title ILIKE $${paramIndex} OR 
        p.formatted_address ILIKE $${paramIndex} OR 
        p.search_location ILIKE $${paramIndex} OR 
        p.details ILIKE $${paramIndex}
      )`);
      queryParams.push(`%${search}%`);
      paramIndex++;
    }

    // Price range filtering
    if (minPrice) {
      whereConditions.push(`p.price >= $${paramIndex}`);
      queryParams.push(parseFloat(minPrice));
      paramIndex++;
    }

    if (maxPrice) {
      whereConditions.push(`p.price <= $${paramIndex}`);
      queryParams.push(parseFloat(maxPrice));
      paramIndex++;
    }

    // City filtering
    if (city) {
      whereConditions.push(`p.city ILIKE $${paramIndex}`);
      queryParams.push(`%${city}%`);
      paramIndex++;
    }

    // Client filtering - always use client_uid
    if (clientId) {
      whereConditions.push(`p.client_uid = $${paramIndex}`);
      queryParams.push(clientId);
      paramIndex++;
    }

    // User filtering - always use client_uid for ownership lookup
    if (clientUid) {
      whereConditions.push(`p.client_uid = $${paramIndex}`);
      queryParams.push(clientUid);
      paramIndex++;
    } else if (userEmail) {
      // Look up client_uid from the user's email
      whereConditions.push(
        `p.client_uid IN (SELECT client_uid FROM clients WHERE email = $${paramIndex})`,
      );
      queryParams.push(userEmail);
      paramIndex++;
    }

    // Property type filtering
    if (propertyType) {
      whereConditions.push(
        `p.details::jsonb ->> 'propertyType' = $${paramIndex}`,
      );
      queryParams.push(propertyType);
      paramIndex++;
    }

    // Bedrooms filtering
    if (bedrooms) {
      whereConditions.push(
        `(p.details::jsonb ->> 'bedrooms')::int = $${paramIndex}`,
      );
      queryParams.push(parseInt(bedrooms));
      paramIndex++;
    }

    // Bathrooms filtering
    if (bathrooms) {
      whereConditions.push(
        `(p.details::jsonb ->> 'bathrooms')::int = $${paramIndex}`,
      );
      queryParams.push(parseInt(bathrooms));
      paramIndex++;
    }

    const allowedSortColumns = [
      'created_at',
      'price',
      'title',
      'city',
      'saves',
    ];
    const validSortBy = allowedSortColumns.includes(sortBy)
      ? sortBy
      : 'created_at';
    const validSortOrder = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    const whereClause =
      whereConditions.length > 0
        ? `WHERE ${whereConditions.join(' AND ')}`
        : '';

    // SELECT query using new schema with client_uid
    const mainQuery = `
      SELECT 
        p.id, 
        p.uuid, 
        COALESCE(p.property_uid, CONCAT('PROP-', EXTRACT(EPOCH FROM p.created_at)::text, '-', SUBSTRING(p.id::text, 1, 6))) as property_uid,
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
        c.name as client_name,
        COALESCE(COUNT(sp.property_uid), 0) as saves
      FROM properties p
      LEFT JOIN clients c ON p.client_uid = c.client_uid
      LEFT JOIN saved_properties sp ON COALESCE(p.property_uid, CONCAT('PROP-', EXTRACT(EPOCH FROM p.created_at)::text, '-', SUBSTRING(p.id::text, 1, 6))) = sp.property_uid
      ${whereClause}
      GROUP BY p.id, p.uuid, p.property_uid, p.title, p.price, p.details, p.image_url, p.created_at, 
               p.street_number, p.street_name, p.unit, p.city, p.province, p.postal_code, p.country,
               p.latitude, p.longitude, p.formatted_address, p.address_type, p.client_uid, c.email, c.name
      ORDER BY ${validSortBy === 'saves' ? 'saves' : 'p.' + validSortBy} ${validSortOrder}
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    queryParams.push(limit, offset);

    const countQuery = `
      SELECT COUNT(DISTINCT p.id) as total
      FROM properties p
      LEFT JOIN clients c ON p.client_uid = c.client_uid
      LEFT JOIN saved_properties sp ON COALESCE(p.property_uid, CONCAT('PROP-', EXTRACT(EPOCH FROM p.created_at)::text, '-', SUBSTRING(p.id::text, 1, 6))) = sp.property_uid
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
  } catch (error: unknown) {
    // eslint-disable-next-line no-console
    console.error('Database error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Database error' },
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

    // Extract granular address fields
    const streetNumber = Array.isArray(fields.streetNumber)
      ? fields.streetNumber[0]
      : fields.streetNumber;
    const streetName = Array.isArray(fields.streetName)
      ? fields.streetName[0]
      : fields.streetName;
    const unit = Array.isArray(fields.unit) ? fields.unit[0] : fields.unit;
    const city = Array.isArray(fields.city)
      ? fields.city[0]
      : fields.city || 'Vancouver';
    const province = Array.isArray(fields.province)
      ? fields.province[0]
      : fields.province || 'British Columbia';
    const postalCode = Array.isArray(fields.postalCode)
      ? fields.postalCode[0]
      : fields.postalCode;
    const country = Array.isArray(fields.country)
      ? fields.country[0]
      : fields.country || 'Canada';
    const latitude = Array.isArray(fields.latitude)
      ? fields.latitude[0]
      : fields.latitude;
    const longitude = Array.isArray(fields.longitude)
      ? fields.longitude[0]
      : fields.longitude;
    const addressType = Array.isArray(fields.addressType)
      ? fields.addressType[0]
      : fields.addressType || 'residential';

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

    // Get client by email and retrieve client_uid
    const clientResult = await pool.query(
      'SELECT client_uid FROM clients WHERE email = $1',
      [email],
    );
    const client = clientResult.rows[0];
    if (!client) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Generate formatted address
    const formattedAddress = [
      streetNumber && streetName ? `${streetNumber} ${streetName}` : null,
      unit,
      city,
      province,
      postalCode,
      country,
    ]
      .filter(Boolean)
      .join(', ');

    // Insert with new schema
    const insertResult = await pool.query(
      `INSERT INTO properties (
        uuid, property_uid, title, price, details, image_url, 
        street_number, street_name, unit, city, province, postal_code, country,
        latitude, longitude, formatted_address, address_type, client_uid
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
       RETURNING id, property_uid`,
      [
        uuid,
        propertyUID,
        title,
        price,
        details,
        image_url,
        streetNumber,
        streetName,
        unit,
        city,
        province,
        postalCode,
        country,
        latitude ? parseFloat(latitude) : null,
        longitude ? parseFloat(longitude) : null,
        formattedAddress,
        addressType,
        client.client_uid,
      ],
    );

    return NextResponse.json({
      success: true,
      propertyUID: insertResult.rows[0].property_uid,
      id: insertResult.rows[0].id,
    });
  } catch (error: unknown) {
    // eslint-disable-next-line no-console
    console.error('Error adding property:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Database error' },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const propertyUid = searchParams.get('uid');
    const userEmail = searchParams.get('userEmail');
    const clientUid = searchParams.get('clientUid');

    if (!propertyUid || (!userEmail && !clientUid)) {
      return NextResponse.json(
        {
          error:
            'Property UID and either user email or client UID are required',
        },
        { status: 400 },
      );
    }

    // First, verify the property belongs to the user via client_uid
    const propertyResult = await pool.query(
      `SELECT p.id, p.property_uid, p.title, p.client_uid, c.email as client_email 
       FROM properties p 
       JOIN clients c ON p.client_uid = c.client_uid 
       WHERE p.property_uid = $1 AND (p.deleted IS NULL OR p.deleted = FALSE)`,
      [propertyUid],
    );

    if (propertyResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 },
      );
    }

    const property = propertyResult.rows[0];

    // Check if the user owns this property - prefer client_uid for authorization
    if (clientUid) {
      // Direct client_uid comparison for authorization
      if (property.client_uid !== clientUid) {
        return NextResponse.json(
          { error: 'Unauthorized: You can only delete your own listings' },
          { status: 403 },
        );
      }
    } else if (userEmail && property.client_email !== userEmail) {
      // Fall back to email only if client_uid is not available
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
  return new Promise<{ fields: formidable.Fields; files: formidable.Files }>(
    (resolve, reject) => {
      const stream = requestToNodeStreamWithHeaders(req);
      form.parse(stream, (err, fields, files) => {
        if (err) reject(err);
        else resolve({ fields, files });
      });
    },
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
