import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '../../db/db';
import User from '../../models/user';
import { ResponseType } from '../../types/types';
import { errorHandler } from '../../utils/errorHandler';
import { UnauthorizedError, NotFoundError } from '../../utils/errors';

export const runtime = 'nodejs';

// ! get user route
export const GET = errorHandler(async (request: NextRequest) => {
  // getting the user id
  const userId = request.headers.get('x-user-id');

  // if the user id is not present
  if (!userId) {
    throw new UnauthorizedError('User not authenticated');
  }

  // connecting to the database
  await connectToDatabase();

  // getting the user
  const user = await User.findById(userId).select('-password -__v');

  // if the user is not found
  if (!user) {
    throw new NotFoundError('User not found');
  }

  // creating the response
  return NextResponse.json<ResponseType>(
    {
      success: true,
      message: 'User fetched successfully',
      data: user,
    },
    { status: 200 }
  );
});
