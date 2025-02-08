import { NextResponse } from 'next/server';
import connectToDatabase from '../../../db/db';
import Category from '../../../models/category';
import { ResponseType } from '../../../types/types';

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json<ResponseType>(
        { success: false, message: 'Category ID is required' },
        { status: 400 }
      );
    }

    const userId = req.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json<ResponseType>(
        { success: false, message: 'User not authenticated' },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      return NextResponse.json<ResponseType>(
        { success: false, message: 'Category not found' },
        { status: 404 }
      );
    }

    return NextResponse.json<ResponseType>(
      { success: true, message: 'Category deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json<ResponseType>(
      { success: false, message: 'Failed to delete category' },
      { status: 500 }
    );
  }
}
