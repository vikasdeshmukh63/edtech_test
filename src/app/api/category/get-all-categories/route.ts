import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '../../db/db';
import Category from '../../models/category';
import { ResponseType } from '../../types/types';
import { errorHandler } from '../../utils/errorHandler';
import { UnauthorizedError } from '../../utils/errors';

export const runtime = 'nodejs';

// ! get all categories route
export const GET = errorHandler(async (request: NextRequest) => {
  // getting the user id
  const userId = request.headers.get('x-user-id');

  // if the user id is not present
  if (!userId) {
    throw new UnauthorizedError('User not authenticated');
  }

  // connecting to the database
  await connectToDatabase();

  // getting the categories
  const categories = await Category.find();

  // creating the response
  return NextResponse.json<ResponseType>(
    {
      success: true,
      message: 'Categories fetched successfully',
      data: categories,
    },
    { status: 200 }
  );
});
