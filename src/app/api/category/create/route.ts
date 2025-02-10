import connectToDatabase from '../../db/db';
import Category from '../../models/category';
import { NextRequest, NextResponse } from 'next/server';
import { ResponseType } from '../../types/types';
import { errorHandler } from '../../utils/errorHandler';
import { BadRequestError, UnauthorizedError } from '../../utils/errors';

export const runtime = 'nodejs';

// ! create category route
export const POST = errorHandler(async (request: NextRequest) => {
  // getting the name
  const { name } = await request.json();

  // if the name is not present
  if (!name) {
    throw new BadRequestError('Name is required');
  }

  // getting the user id
  const userId = request.headers.get('x-user-id');

  // if the user id is not present
  if (!userId) {
    throw new UnauthorizedError('User not authenticated');
  }

  // connecting to the database
  await connectToDatabase();

  // creating the category
  const category = await Category.create({ name });

  // creating the response
  return NextResponse.json<ResponseType>(
    {
      success: true,
      message: 'Category created successfully',
      data: category,
    },
    { status: 201 }
  );
});
