import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './app/api/utils/utils';
import type { JwtPayload } from 'jsonwebtoken'; // Import JwtPayload type

export const config = {
  matcher: ['/api/:path*'],
  runtime: 'nodejs', // Specify Node.js runtime
};

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname; // Get the current request path

  // Skip middleware for `/api/auth` routes
  if (path.startsWith('/api/auth')) {
    return NextResponse.next();
  }

  // Check authentication for all other `/api` routes
  if (path.startsWith('/api')) {
    const tokenCookie = request.cookies.get('token');
    const token = tokenCookie?.value; // Extract the token value

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    try {
      const decoded = verifyToken(token);

      if (!decoded || typeof decoded === 'string') {
        return NextResponse.json(
          { success: false, message: 'Invalid token' },
          { status: 401 }
        );
      }

      // Attach user info to the request headers
      const headers = new Headers(request.headers);
      headers.set('x-user-id', decoded.userId);

      // Continue to the next middleware or route handler
      return NextResponse.next({
        request: {
          headers,
        },
      });
    } catch (error) {
      return NextResponse.json(
        { success: false, message: 'Invalid token' },
        { status: 401 }
      );
    }
  }

  // Continue to the next middleware or route handler for non-API routes
  return NextResponse.next();
}
