import { getServerSession } from 'next-auth/next';
import { Pool } from 'pg';

import { authOptions } from '@/lib/auth';

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: parseInt(process.env.PGPORT || '5432'),
});

/**
 * Gets the client_uid for an authenticated user, either from session or database if needed
 *
 * @param options.required - If true, throws an error if client_uid can't be found
 * @returns Object with client_uid and source information
 */
export async function getClientUidFromSession(
  options: { required?: boolean } = {},
) {
  const { required = false } = options;

  // Get the session
  const session = (await getServerSession(authOptions)) as {
    user?: { email?: string; client_uid?: string };
  } | null;

  if (!session?.user?.email) {
    if (required) {
      throw new Error('User not authenticated');
    }
    return { clientUid: null, source: 'none', authenticated: false };
  }

  // If client_uid is already in the session, use it
  if (session.user.client_uid) {
    return {
      clientUid: session.user.client_uid,
      source: 'session',
      authenticated: true,
      email: session.user.email,
    };
  }

  // Otherwise try to get it from the database
  try {
    const result = await pool.query(
      'SELECT client_uid FROM clients WHERE email = $1',
      [session.user.email],
    );

    if (result.rows.length > 0 && result.rows[0].client_uid) {
      const clientUid = result.rows[0].client_uid;
      // eslint-disable-next-line no-console
      console.log(
        `Retrieved client_uid ${clientUid} for user ${session.user.email} from database`,
      );

      return {
        clientUid,
        source: 'database',
        authenticated: true,
        email: session.user.email,
      };
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching client_uid for user:', error);
  }

  if (required) {
    throw new Error(`No client_uid found for user ${session.user.email}`);
  }

  return {
    clientUid: null,
    source: 'not_found',
    authenticated: true,
    email: session.user.email,
  };
}
