import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '../../db/db';
import Category from '../../models/category';
import { ResponseType } from '../../types/types';

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json<ResponseType>(
        { success: false, message: 'User not authenticated' },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const categories = await Category.find();

    return NextResponse.json<ResponseType>(
      {
        success: true,
        message: 'Categories fetched successfully',
        data: categories,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json<ResponseType>(
      { success: false, message: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}
