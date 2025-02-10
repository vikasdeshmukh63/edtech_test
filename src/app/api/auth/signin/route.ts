import { NextRequest, NextResponse } from 'next/server';
import { AuthResponse, LoginCredentials } from '../../types/types';
import connectToDatabase from '../../db/db';
import User from '../../models/user';
import { comparePasswords, generateToken } from '../../utils/utils';
import { errorHandler } from '../../utils/errorHandler';
import { BadRequestError, UnauthorizedError } from '../../utils/errors';

export const runtime = 'nodejs';

export const POST = errorHandler(async (request: NextRequest) => {
  const { email, password }: LoginCredentials = await request.json();

  if (!email || !password) {
    throw new BadRequestError('All fields are required');
  }

  await connectToDatabase();

  const user = await User.findOne({ email });

  if (!user) {
    throw new UnauthorizedError('Invalid credentials');
  }

  const isPasswordValid = await comparePasswords(password, user.password);

  if (!isPasswordValid) {
    throw new UnauthorizedError('Invalid credentials');
  }

  const token = await generateToken(user._id.toString());

  const response = NextResponse.json<AuthResponse>(
    {
      success: true,
      message: 'Logged in successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    },
    { status: 200 }
  );

  response.cookies.set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
  });

  return response;
});
