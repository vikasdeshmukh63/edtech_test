import { NextResponse } from 'next/server';
import { ResponseType } from '../../types/types';
import { errorHandler } from '../../utils/errorHandler';

export const runtime = 'nodejs';

// ! logout route
export const POST = errorHandler(async () => {
  // creating the response
  const response = NextResponse.json<ResponseType>(
    {
      success: true,
      message: 'Logged out successfully',
    },
    { status: 200 }
  );

  // clearing the token cookie
  response.cookies.set('token', '', {
    expires: new Date(0),
    path: '/',
  });

  return response;
});
