import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';

import { authOptions } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const session = (await getServerSession(authOptions)) as {
      user?: { email?: string; client_uid?: string };
    } | null;

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    // Security check - only allow fetching your own client_uid
    if (email !== session.user.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Get client_uid directly from the session
    const clientUid = session.user.client_uid;

    if (!clientUid) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    return NextResponse.json({ clientUid });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching client UID:', error);
    return NextResponse.json(
      { error: 'Failed to fetch client UID' },
      { status: 500 },
    );
  }
}
