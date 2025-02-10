import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '../../db/db';
import User from '../../models/user';
import { ResponseType } from '../../types/types';
import { errorHandler } from '../../utils/errorHandler';
import { UnauthorizedError } from '../../utils/errors';

export const runtime = 'nodejs';

export const GET = errorHandler(async (request: NextRequest) => {
  const userId = request.headers.get('x-user-id');

  if (!userId) {
    throw new UnauthorizedError('User not authenticated');
  }

  await connectToDatabase();

  const users = await User.find().select('-password -__v');

  return NextResponse.json<ResponseType>(
    {
      success: true,
      message: 'Users fetched successfully',
      data: users,
    },
    { status: 200 }
  );
});
