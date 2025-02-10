import connectToDatabase from '@/app/api/db/db';
import User from '@/app/api/models/user';
import { ResponseType } from '@/app/api/types/types';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json<ResponseType>(
        {
          success: false,
          message: 'User not authenticated',
        },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const user = await User.findById(userId).select('-password -__v');

    if (!user) {
      return NextResponse.json<ResponseType>(
        {
          success: false,
          message: 'User not authenticated',
        },
        { status: 401 }
      );
    }

    return NextResponse.json<ResponseType>(
      {
        success: true,
        message: 'User fetched successfully',
        data: user,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json<ResponseType>(
      {
        success: false,
        message: 'Failed to fetch user',
      },
      { status: 500 }
    );
  }
}
