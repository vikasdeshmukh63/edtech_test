import { NextResponse } from 'next/server';
import { ResponseType } from '../../types/types';

export async function POST() {
  try {
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
  } catch (error) {
    return NextResponse.json<ResponseType>(
      {
        success: false,
        message: 'Failed to logout',
      },
      { status: 500 }
    );
  }
}
