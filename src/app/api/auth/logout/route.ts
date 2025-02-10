import { NextResponse } from 'next/server';
import { ResponseType } from '../../types/types';
import { errorHandler } from '../../utils/errorHandler';

export const runtime = 'nodejs';

export const POST = errorHandler(async () => {
  const response = NextResponse.json<ResponseType>(
    {
      success: true,
      message: 'Logged out successfully',
    },
    { status: 200 }
  );

  // Clear the token cookie
  response.cookies.set('token', '', {
    expires: new Date(0),
    path: '/',
  });

  return response;
});
