import User from '@/app/api/models/user';
import { ResponseType } from '@/app/api/types/types';
import { NextResponse } from 'next/server';
import connectToDatabase from '../../db/db';
import { hashPassword, verifyPassword } from '../../utils/utils';

export async function POST(req: Request) {
  try {
    const { newPassword, oldPassword } = await req.json();

    if (!newPassword || !oldPassword) {
      return NextResponse.json<ResponseType>(
        {
          success: false,
          message: 'All fields are required',
        },
        { status: 400 }
      );
    }

    const userId = req.headers.get('x-user-id');

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

    const user = await User.findOne({ _id: userId });

    if (!user) {
      return NextResponse.json<ResponseType>(
        {
          success: false,
          message: 'User not found',
        },
        { status: 404 }
      );
    }

    const isPasswordCorrect = await verifyPassword(oldPassword, user.password);

    if (!isPasswordCorrect) {
      return NextResponse.json<ResponseType>(
        {
          success: false,
          message: 'Invalid old password',
        },
        { status: 401 }
      );
    }

    const hashedNewPassword = await hashPassword(newPassword);
    user.password = hashedNewPassword;
    await user.save();

    return NextResponse.json<ResponseType>(
      {
        success: true,
        message: 'Password updated successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json<ResponseType>(
      {
        success: false,
        message: 'Failed to update password',
      },
      { status: 500 }
    );
  }
}
