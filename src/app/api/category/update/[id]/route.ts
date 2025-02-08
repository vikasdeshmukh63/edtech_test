import { NextResponse } from 'next/server';
import connectToDatabase from '../../../db/db';
import Category from '../../../models/category';
import { ResponseType } from '@/app/api/types/types';

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { name } = await req.json();

    if (!name) {
      return NextResponse.json(
        { success: false, message: 'Name is required' },
        { status: 400 }
      );
    }

    if (!params.id) {
      return NextResponse.json(
        { success: false, message: 'Category ID is required' },
        { status: 400 }
      );
    }

    const userId = req.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'User not authenticated' },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const category = await Category.findOneAndUpdate(
      { _id: params.id },
      { name },
      { new: true }
    );

    if (!category) {
      return NextResponse.json(
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
