import connectToDatabase from '../../db/db';
import Category from '../../models/category';
import { NextResponse } from 'next/server';
import { ResponseType } from '../../types/types';

export async function POST(req: Request) {
  try {
    const { name } = await req.json();

    if (!name) {
      return NextResponse.json<ResponseType>(
        { success: false, message: 'Name is required' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const category = await Category.create({ name });

    return NextResponse.json<ResponseType>(
      {
        success: true,
        message: 'Category created successfully',
        data: category,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json<ResponseType>(
      { success: false, message: 'Failed to create category' },
      { status: 500 }
    );
  }
}
