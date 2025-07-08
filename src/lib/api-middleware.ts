import { NextRequest, NextResponse } from 'next/server';

import { getClientUidFromSession } from './session';

type ApiHandler<T = unknown> = (
  req: NextRequest,
  context: { clientUid: string; email: string; params?: T },
) => Promise<NextResponse | Response>;

/**
 * Middleware to ensure client_uid is available for API routes
 * Automatically gets client_uid from session or database
 */
export function withClientUid<T = unknown>(handler: ApiHandler<T>) {
  return async (req: NextRequest, context?: { params: T }) => {
    try {
      // Try to get client_uid from session or database
      const { clientUid, authenticated, email, source } =
        await getClientUidFromSession();

      // If not authenticated at all
      if (!authenticated) {
        return NextResponse.json(
          { error: 'Not authenticated' },
          { status: 401 },
        );
      }

      // If authenticated but no client_uid found
      if (!clientUid) {
        // Log the issue for debugging
        // eslint-disable-next-line no-console
        console.error(`No client_uid found for authenticated user ${email}`);

        return NextResponse.json(
          {
            error: 'User account not properly configured - missing client ID',
            details: 'Please contact support to fix your account',
          },
          { status: 400 },
        );
      }

      // Call the handler with client_uid in context
      return handler(req, {
        clientUid,
        email: email || '',
        ...context, // Pass along any route params
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in withClientUid middleware:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 },
      );
    }
  };
}
