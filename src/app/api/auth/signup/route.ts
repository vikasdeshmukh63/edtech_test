import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '../../db/db';
import User from '../../models/user';
import { AuthResponse, RegisterCredentials } from '../../types/types';
import { hashPassword } from '../../utils/utils';
import { errorHandler } from '../../utils/errorHandler';
import { BadRequestError } from '../../utils/errors';

export const runtime = 'nodejs';

export const POST = errorHandler(async (request: NextRequest) => {
  const { name, email, password }: RegisterCredentials = await request.json();

  if (!email || !password || !name) {
    throw new BadRequestError('All fields are required');
  }

  await connectToDatabase();

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new BadRequestError('User already exists');
  }

  const hashedPassword = await hashPassword(password);

  const user = await User.insertOne({
    email,
    password: hashedPassword,
    name,
  });

  return NextResponse.json<AuthResponse>(
    {
      success: true,
      message: 'User registered successfully',
      user: {
        id: user.insertedId,
        name,
        email,
      },
    },
    { status: 201 }
  );
});
