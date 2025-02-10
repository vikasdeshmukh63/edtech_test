import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '../../db/db';
import Category from '../../models/category';
import { ResponseType } from '../../types/types';
import { errorHandler } from '../../utils/errorHandler';
import { BadRequestError, UnauthorizedError } from '../../utils/errors';

export const runtime = 'nodejs';

// ! delete many categories route
export const DELETE = errorHandler(async (request: NextRequest) => {
  // getting the category ids
  const { categoryIds } = await request.json();

  // if the category ids are not present
  if (!categoryIds) {
    throw new BadRequestError('Category IDs are required');
  }

  // getting the user id
  const userId = request.headers.get('x-user-id');

  // if the user id is not present
  if (!userId) {
    throw new UnauthorizedError('User not authenticated');
  }

  // connecting to the database
  await connectToDatabase();

  // deleting the categories
  await Category.deleteMany({ _id: { $in: categoryIds } });

  // creating the response
  return NextResponse.json<ResponseType>(
    {
      success: true,
      message: 'Categories deleted successfully',
    },
    { status: 200 }
  );
});
