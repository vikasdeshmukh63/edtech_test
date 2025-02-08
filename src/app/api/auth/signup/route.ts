import { NextResponse } from 'next/server';
import connectToDatabase from '../../db/db';
import User from '../../models/user';
import { AuthResponse, RegisterCredentials } from '../../types/types';
import { hashPassword } from '../../utils/utils';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const { name, email, password }: RegisterCredentials = await req.json();

    if (!email || !password || !name) {
      return NextResponse.json<AuthResponse>(
        {
          success: false,
          message: 'All fields are required',
        },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return NextResponse.json<AuthResponse>(
        {
          success: false,
          message: 'User already exists',
        },
        { status: 400 }
      );
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
  } catch (error) {
    return NextResponse.json<AuthResponse>(
      {
        success: false,
        message: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
