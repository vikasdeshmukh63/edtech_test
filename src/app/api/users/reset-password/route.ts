import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '../../db/db';
import User from '../../models/user';
import { ResponseType } from '../../types/types';
import { hashPassword, verifyPassword } from '../../utils/utils';
import { errorHandler } from '../../utils/errorHandler';
import {
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
} from '../../utils/errors';

export const runtime = 'nodejs';

// ! reset password route
export const POST = errorHandler(async (request: NextRequest) => {
  // getting the password
  const { newPassword, oldPassword } = await request.json();

  // if the password is not present
  if (!newPassword || !oldPassword) {
    throw new BadRequestError('All fields are required');
  }

  // getting the user id
  const userId = request.headers.get('x-user-id');

  // if the user id is not present
  if (!userId) {
    throw new UnauthorizedError('User not authenticated');
  }

  // connecting to the database
  await connectToDatabase();

  // getting the user
  const user = await User.findById(userId);

  // if the user is not found
  if (!user) {
    throw new NotFoundError('User not found');
  }

  // checking if the old password is correct
  const isPasswordCorrect = await verifyPassword(oldPassword, user.password);

  // if the old password is not correct
  if (!isPasswordCorrect) {
    throw new UnauthorizedError('Old password is incorrect');
  }

  // hashing the new password
  const hashedPassword = await hashPassword(newPassword);

  // updating the password
  const updatedUser = await User.findByIdAndUpdate(userId, {
    password: hashedPassword,
  });

  // creating the response
  return NextResponse.json<ResponseType>(
    {
      success: true,
      message: 'Password updated successfully',
    },
    { status: 200 }
  );
});
