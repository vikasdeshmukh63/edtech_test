import connectToDatabase from '@/app/api/db/db';
import User from '@/app/api/models/user';
import { ResponseType } from '@/app/api/types/types';
import { NextResponse } from 'next/server';

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const { name, email } = await req.json();

    if (!id) {
      return NextResponse.json<ResponseType>({
        success: false,
        message: 'User ID is required',
      });
    }

    const userId = req.headers.get('x-user-id');

    if (userId !== id) {
      return NextResponse.json<ResponseType>({
        success: false,
        message: 'User not authorized',
      });
    }

    if (!userId) {
      return NextResponse.json<ResponseType>({
        success: false,
        message: 'User not authenticated',
      });
    }

    await connectToDatabase();

    const user = await User.findByIdAndUpdate(
      id,
      { name, email },
      { new: true }
    );

    if (!user) {
      return NextResponse.json<ResponseType>({
        success: false,
        message: 'User not found',
      });
    }

    return NextResponse.json<ResponseType>({
      success: true,
      message: 'User updated successfully',
      data: user,
    });
  } catch (error) {
    return NextResponse.json<ResponseType>({
      success: false,
      message: 'Failed to update user',
    });
  }
}
