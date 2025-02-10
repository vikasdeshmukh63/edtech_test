import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '../../db/db';
import User from '../../models/user';
import { ResponseType } from '../../types/types';
import { hashPassword } from '../../utils/utils';
import { errorHandler } from '../../utils/errorHandler';
import {
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
} from '../../utils/errors';

export const runtime = 'nodejs';

export const POST = errorHandler(async (request: NextRequest) => {
  const { password } = await request.json();

  if (!password) {
    throw new BadRequestError('Password is required');
  }

  const userId = request.headers.get('x-user-id');
  if (!userId) {
    throw new UnauthorizedError('User not authenticated');
  }

  await connectToDatabase();

  const hashedPassword = await hashPassword(password);
  const user = await User.findByIdAndUpdate(userId, {
    password: hashedPassword,
  });

  if (!user) {
    throw new NotFoundError('User not found');
  }

  return NextResponse.json<ResponseType>(
    {
      success: true,
      message: 'Password updated successfully',
    },
    { status: 200 }
  );
});
