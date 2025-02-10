import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '../../../db/db';
import Category from '../../../models/category';
import { ResponseType } from '@/app/api/types/types';
import { errorHandler } from '../../../utils/errorHandler';
import {
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
} from '../../../utils/errors';

export const runtime = 'nodejs';

export const PUT = errorHandler(
  async (
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
  ) => {
    const { name } = await request.json();
    const { id } = await context.params;

    if (!name) {
      throw new BadRequestError('Name is required');
    }

    if (!id) {
      throw new BadRequestError('Category ID is required');
    }

    const userId = request.headers.get('x-user-id');
    if (!userId) {
      throw new UnauthorizedError('User not authenticated');
    }

    await connectToDatabase();

    const category = await Category.findOneAndUpdate(
      { _id: id },
      { name },
      { new: true }
    );

    if (!category) {
      throw new NotFoundError('Category not found');
    }

    return NextResponse.json<ResponseType>(
      { success: true, message: 'Category updated successfully' },
      { status: 200 }
    );
  }
);
