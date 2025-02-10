import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '../../db/db';
import Category from '../../models/category';
import { ResponseType } from '../../types/types';

export async function DELETE(req: NextRequest) {
  try {
    const { categoryIds } = await req.json();

    const userId = req.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json<ResponseType>(
        { success: false, message: 'User not authenticated' },
        { status: 401 }
      );
    }

    await connectToDatabase();

    await Category.deleteMany({ _id: { $in: categoryIds } });

    return NextResponse.json<ResponseType>(
      {
        success: true,
        message: 'Categories deleted successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json<ResponseType>(
      {
        success: false,
        message: 'Failed to delete categories',
      },
      { status: 500 }
    );
  }
}
