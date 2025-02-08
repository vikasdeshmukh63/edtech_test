import { NextResponse } from 'next/server';
import { AuthResponse, LoginCredentials } from '../../types/types';
import connectToDatabase from '../../db/db';
import { generateToken, verifyPassword } from '../../utils/utils';
import User from '../../models/user';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const { email, password }: LoginCredentials = await req.json();

    if (!email || !password) {
      return NextResponse.json<AuthResponse>(
        {
          success: false,
          message: 'Email and password are required',
        },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return NextResponse.json<AuthResponse>(
        {
          success: false,
          message: 'User not found',
        },
        { status: 404 }
      );
    }

    const isPasswordValid = await verifyPassword(
      password,
      existingUser.password
    );

    if (!isPasswordValid) {
      return NextResponse.json<AuthResponse>(
        {
          success: false,
          message: 'Invalid email or password',
        },
        { status: 401 }
      );
    }

    const token = await generateToken(existingUser._id.toString());

    return NextResponse.json<AuthResponse>(
      {
        success: true,
        message: 'User signed in successfully',
        token,
        user: {
          id: existingUser._id.toString(),
          name: existingUser.name,
          email,
        },
      },
      {
        status: 200,
        headers: {
          'Set-Cookie': `token=${token}; HttpOnly; Path=/; Max-Age=${60 * 60 * 24 * 7}; ${
            process.env.NODE_ENV === 'production' ? 'Secure; ' : ''
          }SameSite=Lax`,
        },
      }
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
