import { NextRequest, NextResponse } from 'next/server';
import { AuthResponse, LoginCredentials } from '../../types/types';
import connectToDatabase from '../../db/db';
import User from '../../models/user';
import { verifyPassword, generateToken } from '../../utils/utils';
import { errorHandler } from '../../utils/errorHandler';
import { BadRequestError, UnauthorizedError } from '../../utils/errors';

export const runtime = 'nodejs';

// ! signin route
export const POST = errorHandler(async (request: NextRequest) => {
  // getting the email and password
  const { email, password }: LoginCredentials = await request.json();

  // if the email or password is not present
  if (!email || !password) {
    throw new BadRequestError('All fields are required');
  }

  // connecting to the database
  await connectToDatabase();

  // getting the user
  const user = await User.findOne({ email });

  // if the user is not found
  if (!user) {
    throw new UnauthorizedError('Invalid credentials');
  }

  // verifying the password
  const isPasswordValid = await verifyPassword(password, user.password);

  // if the password is invalid
  if (!isPasswordValid) {
    throw new UnauthorizedError('Invalid credentials');
  }

  // generating the token
  const token = await generateToken(user._id.toString());

  // creating the response
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

  // setting the token cookie
  response.cookies.set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
  });

  return response;
});
