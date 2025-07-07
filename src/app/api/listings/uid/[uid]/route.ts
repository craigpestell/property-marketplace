/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import formidable from 'formidable';
import fs from 'fs';
import { NextResponse } from 'next/server';
import path from 'path';
import { Pool } from 'pg';
import { Readable } from 'stream';

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

    // Check if we're using the new schema with granular address fields
    const { isUsingNewSchema } = await import('@/lib/db');
    const usingNewSchema = await isUsingNewSchema();

    let query;
    if (usingNewSchema) {
      query = `SELECT 
        id, 
        uuid, 
        property_uid,
        title, 
        price, 
        details,
        image_url, 
        created_at, 
        street_number,
        street_name,
        unit,
        city,
        province,
        postal_code,
        country,
        latitude,
        longitude,
        formatted_address,
        client_uid,
        user_email,
        (SELECT email FROM clients WHERE clients.client_uid = properties.client_uid) as client_email
      FROM properties 
      WHERE property_uid = $1 AND (deleted IS NULL OR deleted = FALSE)`;
    } else {
      // Legacy schema query
      query = `SELECT 
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
        user_email,
        (SELECT email FROM clients WHERE clients.id = properties.client_id) as client_email
      FROM properties 
      WHERE property_uid = $1 AND (deleted IS NULL OR deleted = FALSE)`;
    }

    const result = await pool.query(query, [uid]);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 },
      );
    }

    return NextResponse.json(result.rows[0]);
  } catch (error: unknown) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Database error' },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ uid: string }> },
) {
  try {
    const { uid } = await params;
    const { fields, files } = await parseForm(request);

    const userEmail = Array.isArray(fields.userEmail)
      ? fields.userEmail[0]
      : fields.userEmail;
    const title = Array.isArray(fields.title) ? fields.title[0] : fields.title;
    const price = Array.isArray(fields.price) ? fields.price[0] : fields.price;
    const details = Array.isArray(fields.details)
      ? fields.details[0]
      : fields.details;

    // Get granular address fields
    const streetNumber = Array.isArray(fields.streetNumber)
      ? fields.streetNumber[0]
      : fields.streetNumber;
    const streetName = Array.isArray(fields.streetName)
      ? fields.streetName[0]
      : fields.streetName;
    const unit = Array.isArray(fields.unit) ? fields.unit[0] : fields.unit;
    const city = Array.isArray(fields.city) ? fields.city[0] : fields.city;
    const province = Array.isArray(fields.province)
      ? fields.province[0]
      : fields.province;
    const postalCode = Array.isArray(fields.postalCode)
      ? fields.postalCode[0]
      : fields.postalCode;
    const country = Array.isArray(fields.country)
      ? fields.country[0]
      : fields.country || 'Canada';

    // Legacy address field for backward compatibility
    const address = Array.isArray(fields.address)
      ? fields.address[0]
      : fields.address;
    const imageFile = files.image;

    if (!userEmail) {
      return NextResponse.json(
        { error: 'User email is required' },
        { status: 400 },
      );
    }

    // First, verify the property exists and belongs to the user
    const propertyResult = await pool.query(
      'SELECT id, property_uid, user_email, image_url FROM properties WHERE property_uid = $1 AND (deleted IS NULL OR deleted = FALSE)',
      [uid],
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
        { error: 'Unauthorized: You can only edit your own listings' },
        { status: 403 },
      );
    }

    // Handle image upload if a new image is provided
    let image_url = property.image_url; // Keep existing image by default
    if (imageFile && imageFile[0]) {
      image_url = '/uploads/' + path.basename(imageFile[0].filepath);
    }

    // Check if we're using the new schema
    const { isUsingNewSchema, formatAddress } = await import('@/lib/db');
    const usingNewSchema = await isUsingNewSchema();

    let updateResult;

    if (usingNewSchema) {
      // Calculate formatted address
      const formattedAddress = formatAddress(
        streetNumber,
        streetName,
        unit,
        city,
        province,
        postalCode,
        country,
      );

      // Update with the new schema
      updateResult = await pool.query(
        `UPDATE properties 
         SET title = $1, price = $2, details = $3, image_url = $4,
             street_number = $5, street_name = $6, unit = $7, 
             city = $8, province = $9, postal_code = $10, country = $11,
             formatted_address = $12
         WHERE property_uid = $13
         RETURNING id, property_uid`,
        [
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
          formattedAddress,
          uid,
        ],
      );
    } else {
      // Update with the legacy schema
      updateResult = await pool.query(
        `UPDATE properties 
         SET title = $1, price = $2, details = $3, image_url = $4, address = $5
         WHERE property_uid = $6
         RETURNING id, property_uid`,
        [title, price, details, image_url, address, uid],
      );
    }

    return NextResponse.json({
      success: true,
      propertyUID: updateResult.rows[0].property_uid,
      id: updateResult.rows[0].id,
      message: 'Property updated successfully',
    });
  } catch (error: unknown) {
    console.error('Error updating property:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Database error' },
      { status: 500 },
    );
  }
}

// Helper functions
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
