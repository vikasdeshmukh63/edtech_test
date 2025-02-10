import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '../../db/db';
import User from '../../models/user';
import { AuthResponse, RegisterCredentials } from '../../types/types';
import { hashPassword } from '../../utils/utils';
import { errorHandler } from '../../utils/errorHandler';
import { BadRequestError } from '../../utils/errors';

export const runtime = 'nodejs';

// ! signup route
export const POST = errorHandler(async (request: NextRequest) => {
  // getting the name, email and password
  const { name, email, password }: RegisterCredentials = await request.json();

  // if the email, password or name is not present
  if (!email || !password || !name) {
    throw new BadRequestError('All fields are required');
  }

  // connecting to the database
  await connectToDatabase();

  // getting the existing user
  const existingUser = await User.findOne({ email });

  // if the user already exists
  if (existingUser) {
    throw new BadRequestError('User already exists');
  }

  // hashing the password
  const hashedPassword = await hashPassword(password);

  // inserting the user
  const user = await User.insertOne({
    email,
    password: hashedPassword,
    name,
  });

  // creating the response
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
