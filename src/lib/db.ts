import { Pool } from 'pg';

// Set up your PostgreSQL connection
const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT ? parseInt(process.env.PGPORT) : 5432,
});

// Cache for schema check result
let isNewSchema: boolean | null = null;

/**
 * Checks if the database is using the new schema with granular address fields
 * @returns Promise<boolean> - true if using new schema, false otherwise
 */
export async function isUsingNewSchema(): Promise<boolean> {
  if (isNewSchema !== null) return isNewSchema;

  try {
    // Check for columns specific to the new schema
    await pool.query(
      'SELECT client_uid, street_name, city FROM properties LIMIT 1',
    );
    isNewSchema = true;
  } catch {
    isNewSchema = false;
  }

  return isNewSchema;
}

/**
 * Formats an address from granular fields
 * @param streetNumber - Street number
 * @param streetName - Street name
 * @param unit - Unit/apartment/suite
 * @param city - City name
 * @param province - Province/state
 * @param postalCode - Postal/ZIP code
 * @param country - Country
 * @returns Formatted address string
 */
export function formatAddress(
  streetNumber?: string | null,
  streetName?: string | null,
  unit?: string | null,
  city?: string | null,
  province?: string | null,
  postalCode?: string | null,
  country?: string | null,
): string {
  const addressParts = [
    streetNumber && streetName ? `${streetNumber} ${streetName}` : null,
    unit,
    city,
    province,
    postalCode,
    country,
  ].filter(Boolean);

  return addressParts.join(', ');
}

/**
 * Get the client_uid for a given property_uid
 * @param propertyUid - The property UID to lookup
 * @returns Promise<string | null> - The client UID if found, null otherwise
 */
export async function getClientUidForProperty(
  propertyUid: string,
): Promise<string | null> {
  if (!(await isUsingNewSchema())) return null;

  try {
    const result = await pool.query(
      'SELECT client_uid FROM properties WHERE property_uid = $1',
      [propertyUid],
    );

    if (result.rows.length > 0 && result.rows[0].client_uid) {
      return result.rows[0].client_uid;
    }
    return null;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching client_uid for property:', error);
    return null;
  }
}

/**
 * Get the client_uid for a user email
 * @param email - The user's email address
 * @returns Promise<string | null> - The client UID if found, null otherwise
 */
export async function getClientUidForUser(
  email: string,
): Promise<string | null> {
  if (!(await isUsingNewSchema())) return null;

  try {
    const result = await pool.query(
      'SELECT client_uid FROM clients WHERE email = $1',
      [email],
    );

    if (result.rows.length > 0 && result.rows[0].client_uid) {
      return result.rows[0].client_uid;
    }
    return null;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching client_uid for user:', error);
    return null;
  }
}

// Export the pool for direct database access
export { pool };

// Export database query helper
export async function query(text: string, params: unknown[]) {
  return pool.query(text, params);
}
