import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './app/api/utils/utils';
import { ResponseType } from './app/api/types/types';

export const config = {
  matcher: ['/api/:path*'],
  runtime: 'edge',
};

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  if (path.startsWith('/api/auth')) {
    return NextResponse.next();
  }

  if (path.startsWith('/api')) {
    const tokenCookie = request.cookies.get('token');
    const token = tokenCookie?.value;

    if (!token) {
      return NextResponse.json<ResponseType>(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    try {
      const decoded = await verifyToken(token);

      if (!decoded || !decoded.userId) {
        return NextResponse.json<ResponseType>(
          { success: false, message: 'Invalid token' },
          { status: 401 }
        );
      }

      const headers = new Headers(request.headers);
      headers.set('x-user-id', decoded.userId as string);

      return NextResponse.next({
        request: {
          headers,
        },
      });
    } catch (error) {
      return NextResponse.json<ResponseType>(
        { success: false, message: 'Invalid token' },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const runtime = 'nodejs';
