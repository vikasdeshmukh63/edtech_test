import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '../../db/db';
import User from '../../models/user';
import { ResponseType } from '../../types/types';
import { errorHandler } from '../../utils/errorHandler';
import { UnauthorizedError } from '../../utils/errors';

export const runtime = 'nodejs';

// ! get all users route
export const GET = errorHandler(async (request: NextRequest) => {
  // getting the user id
  const userId = request.headers.get('x-user-id');

  // if the user id is not present
  if (!userId) {
    throw new UnauthorizedError('User not authenticated');
  }

  // connecting to the database
  await connectToDatabase();

  // getting the users
  const users = await User.find().select('-password -__v');

  // creating the response
  return NextResponse.json<ResponseType>(
    {
      success: true,
      message: 'Users fetched successfully',
      data: users,
    },
    { status: 200 }
  );
});
