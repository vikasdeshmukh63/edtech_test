import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '../../db/db';
import Category from '../../models/category';
import { ResponseType } from '../../types/types';
import { errorHandler } from '../../utils/errorHandler';
import { UnauthorizedError } from '../../utils/errors';

export const runtime = 'nodejs';

export const DELETE = errorHandler(async (request: NextRequest) => {
  const { categoryIds } = await request.json();

  const userId = request.headers.get('x-user-id');
  if (!userId) {
    throw new UnauthorizedError('User not authenticated');
  }

  await connectToDatabase();

  await Category.deleteMany({ _id: { $in: categoryIds } });

  return NextResponse.json<ResponseType>(
    {
      success: true,
      message: 'Categories deleted successfully',
    },
    { status: 200 }
  );
});
