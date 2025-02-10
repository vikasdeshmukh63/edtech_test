import connectToDatabase from '@/app/api/db/db';
import User from '@/app/api/models/user';
import { ResponseType } from '@/app/api/types/types';
import { NextRequest, NextResponse } from 'next/server';

// ! update user route
export async function PUT(request: NextRequest) {
  try {
    // getting the update data
    const { name, email } = await request.json();

    // getting the user id
    const userId = request.headers.get('x-user-id');

    // if the user id is not present
    if (!userId) {
      return NextResponse.json<ResponseType>(
        {
          success: false,
          message: 'User not authenticated',
        },
        { status: 401 }
      );
    }

    // connecting to the database
    await connectToDatabase();

    // updating the user
    const user = await User.findByIdAndUpdate(
      userId,
      { name, email },
      { new: true }
    );

    // if the user is not found
    if (!user) {
      return NextResponse.json<ResponseType>(
        {
          success: false,
          message: 'User not found',
        },
        { status: 404 }
      );
    }

    // creating the response
    return NextResponse.json<ResponseType>(
      {
        success: true,
        message: 'User updated successfully',
        data: user,
      },
      { status: 200 }
    );
  } catch (error) {
    // creating the response
    return NextResponse.json<ResponseType>(
      {
        success: false,
        message: 'Failed to update user',
      },
      { status: 500 }
    );
  }
}
