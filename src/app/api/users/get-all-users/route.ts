import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '../../db/db';
import User from '../../models/user';
import { ResponseType } from '../../types/types';

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

    const users = await User.find().select('-password -__v');

    return NextResponse.json<ResponseType>(
      {
        success: true,
        message: 'Users fetched successfully',
        data: users,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json<ResponseType>(
      {
        success: false,
        message: 'Failed to fetch users',
      },
      { status: 500 }
    );
  }
}
