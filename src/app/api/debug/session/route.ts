import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';

import { authOptions } from '@/lib/auth';

export async function GET(_request: NextRequest) {
  try {
    const session = (await getServerSession(authOptions)) as {
      user: { email: string; name?: string };
    } | null;

    return NextResponse.json({
      session,
      userEmail: session?.user?.email || null,
      isAuthenticated: !!session,
    });
  } catch (error) {
    console.error('Session debug error:', error);
    return NextResponse.json(
      { error: 'Failed to get session info' },
      { status: 500 },
    );
  }
}
