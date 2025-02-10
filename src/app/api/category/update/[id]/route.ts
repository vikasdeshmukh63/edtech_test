import { NextResponse } from 'next/server';
import connectToDatabase from '../../../db/db';
import Category from '../../../models/category';
import { ResponseType } from '@/app/api/types/types';

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { name } = await request.json();
    const { id } = await context.params;

    if (!name) {
      return NextResponse.json<ResponseType>(
        { success: false, message: 'Name is required' },
        { status: 400 }
      );
    }

    if (!id) {
      return NextResponse.json<ResponseType>(
        { success: false, message: 'Category ID is required' },
        { status: 400 }
      );
    }

    const userId = request.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json<ResponseType>(
        { success: false, message: 'User not authenticated' },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const category = await Category.findOneAndUpdate(
      { _id: id },
      { name },
      { new: true }
    );

    if (!category) {
      return NextResponse.json<ResponseType>(
        { success: false, message: 'Category not found' },
        { status: 404 }
      );
    }

    return NextResponse.json<ResponseType>(
      { success: true, message: 'Category updated successfully' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json<ResponseType>(
      { success: false, message: 'Failed to update category' },
      { status: 500 }
    );
  }
}
