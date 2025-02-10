import connectToDatabase from '@/app/api/db/db';
import User from '@/app/api/models/user';
import { ResponseType } from '@/app/api/types/types';
import { NextResponse } from 'next/server';

export async function PUT(req: Request) {
  try {
    const { name, email } = await req.json();

    const userId = req.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json<ResponseType>({
          success: false,
          message: 'User not authenticated',
        },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const user = await User.findByIdAndUpdate(
      userId,
      { name, email },
      { new: true }
    );

    if (!user) {
      return NextResponse.json<ResponseType>({
        success: false,
        message: 'User not found',
      },
        { status: 404 }
      );
    }

    return NextResponse.json<ResponseType>({
      success: true,
      message: 'User updated successfully',
      data: user,
    },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json<ResponseType>({
      success: false,
      message: 'Failed to update user',
    },
      { status: 500 }
    );
  }
}
