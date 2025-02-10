import connectToDatabase from '../../db/db';
import Category from '../../models/category';
import { NextRequest, NextResponse } from 'next/server';
import { ResponseType } from '../../types/types';
import { errorHandler } from '../../utils/errorHandler';
import { BadRequestError, UnauthorizedError } from '../../utils/errors';

export const runtime = 'nodejs';

export const POST = errorHandler(async (request: NextRequest) => {
  const { name } = await request.json();

  if (!name) {
    throw new BadRequestError('Name is required');
  }

  const userId = request.headers.get('x-user-id');
  if (!userId) {
    throw new UnauthorizedError('User not authenticated');
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
});
