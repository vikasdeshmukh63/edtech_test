import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '../../../db/db';
import Category from '../../../models/category';
import { ResponseType } from '../../../types/types';
import { errorHandler } from '../../../utils/errorHandler';
import {
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
} from '../../../utils/errors';

export const runtime = 'nodejs';

// ! delete category route
export const DELETE = errorHandler(
  async (
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
  ) => {
    // getting the id
    const { id } = await context.params;

    // if the id is not present
    if (!id) {
      throw new BadRequestError('Category ID is required');
    }

    // getting the user id
    const userId = request.headers.get('x-user-id');

    // if the user id is not present
    if (!userId) {
      throw new UnauthorizedError('User not authenticated');
    }

    // connecting to the database
    await connectToDatabase();

    // finding and deleting the category
    const category = await Category.findByIdAndDelete(id);

    // if the category is not found
    if (!category) {
      throw new NotFoundError('Category not found');
    }

    // creating the response
    return NextResponse.json<ResponseType>(
      { success: true, message: 'Category deleted successfully' },
      { status: 200 }
    );
  }
);
