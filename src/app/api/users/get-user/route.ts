import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '../../db/db';
import User from '../../models/user';
import { ResponseType } from '../../types/types';
import { errorHandler } from '../../utils/errorHandler';
import { UnauthorizedError, NotFoundError } from '../../utils/errors';

export const runtime = 'nodejs';

export const GET = errorHandler(async (request: NextRequest) => {
  const userId = request.headers.get('x-user-id');

  if (!userId) {
    throw new UnauthorizedError('User not authenticated');
  }

  await connectToDatabase();

  const user = await User.findById(userId).select('-password -__v');

  if (!user) {
    throw new NotFoundError('User not found');
  }

  return NextResponse.json<ResponseType>(
    {
      success: true,
      message: 'User fetched successfully',
      data: user,
    },
    { status: 200 }
  );
});
