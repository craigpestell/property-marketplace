import { NextRequest, NextResponse } from 'next/server';
import { Session } from 'next-auth';
import { getServerSession } from 'next-auth/next';
import { Pool } from 'pg';

import { authOptions } from '@/lib/auth';

// Set up PostgreSQL connection
const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT ? parseInt(process.env.PGPORT) : 5432,
});

export async function GET() {
  try {
    const session: Session | null = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Get user profile information
    const userResult = await pool.query(
      'SELECT id, name, email, created_at FROM clients WHERE email = $1',
      [session.user.email],
    );

    if (userResult.rows.length === 0) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const user = userResult.rows[0];

    // Get user's property count
    const propertyCountResult = await pool.query(
      'SELECT COUNT(*) as count FROM properties WHERE user_email = $1 AND (deleted IS NULL OR deleted = FALSE)',
      [session.user.email],
    );

    const propertyCount = parseInt(propertyCountResult.rows[0].count);

    return NextResponse.json({
      profile: {
        id: user.id,
        name: user.name,
        email: user.email,
        created_at: user.created_at,
        propertyCount,
      },
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session: Session | null = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { name, email } = await request.json();

    // Validate input
    if (!name || !email) {
      return NextResponse.json(
        { message: 'Name and email are required' },
        { status: 400 },
      );
    }

    // Check if new email already exists (if email is being changed)
    if (email !== session.user.email) {
      const existingUser = await pool.query(
        'SELECT id FROM clients WHERE email = $1 AND email != $2',
        [email, session.user.email],
      );

      if (existingUser.rows.length > 0) {
        return NextResponse.json(
          { message: 'Email already exists' },
          { status: 409 },
        );
      }
    }

    // Update user profile
    const result = await pool.query(
      'UPDATE clients SET name = $1, email = $2, updated_at = NOW() WHERE email = $3 RETURNING id, name, email, created_at',
      [name, email, session.user.email],
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const updatedUser = result.rows[0];

    // Get updated property count
    const propertyCountResult = await pool.query(
      'SELECT COUNT(*) as count FROM properties WHERE user_email = $1 AND (deleted IS NULL OR deleted = FALSE)',
      [email],
    );

    const propertyCount = parseInt(propertyCountResult.rows[0].count);

    return NextResponse.json({
      message: 'Profile updated successfully',
      profile: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        created_at: updatedUser.created_at,
        propertyCount,
      },
    });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 },
    );
  }
}
