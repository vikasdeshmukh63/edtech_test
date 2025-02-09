import { NextResponse } from 'next/server';
import connectToDatabase from '../../db/db';
import User from '../../models/user';
import { ResponseType } from '../../types/types';

export async function GET(req: Request) {
  try {
    const userId = req.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json<ResponseType>({
        success: false,
        message: 'User not authenticated',
      });
    }

    await connectToDatabase();

    const users = await User.find().select('-password -__v');

    return NextResponse.json<ResponseType>({
      success: true,
      message: 'Users fetched successfully',
      data: users,
    });
  } catch (error) {
    return NextResponse.json<ResponseType>({
      success: false,
      message: 'Failed to fetch users',
    });
  }
}
