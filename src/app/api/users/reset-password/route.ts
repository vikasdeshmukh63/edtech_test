import User from '@/app/api/models/user';
import { ResponseType } from '@/app/api/types/types';
import { NextResponse } from 'next/server';
import connectToDatabase from '../../db/db';
import { hashPassword, verifyPassword } from '../../utils/utils';

export async function POST(req: Request) {
  try {
    const { email, newPassword, oldPassword } = await req.json();

    if (!email || !newPassword || !oldPassword) {
      return NextResponse.json<ResponseType>({
        success: false,
        message: 'All fields are required',
      });
    }

    await connectToDatabase();

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json<ResponseType>({
        success: false,
        message: 'User not found',
      });
    }

    const isPasswordCorrect = await verifyPassword(oldPassword, user.password);

    if (!isPasswordCorrect) {
      return NextResponse.json<ResponseType>({
        success: false,
        message: 'Invalid old password',
      });
    }

    const hashedNewPassword = await hashPassword(newPassword);
    user.password = hashedNewPassword;
    await user.save();

    return NextResponse.json<ResponseType>({
      success: true,
      message: 'Password updated successfully',
    });
  } catch (error) {
    return NextResponse.json<ResponseType>({
      success: false,
      message: 'Failed to update password',
    });
  }
}
