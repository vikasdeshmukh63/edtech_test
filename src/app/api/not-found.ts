import { NextResponse } from 'next/server';
import { ResponseType } from './types/types';

// ! get not found route
export async function GET() {
  return NextResponse.json<ResponseType>(
    {
      success: false,
      message: 'API endpoint not found',
    },
    { status: 404 }
  );
}

// ! post not found route
export async function POST() {
  return NextResponse.json<ResponseType>(
    {
      success: false,
      message: 'API endpoint not found',
    },
    { status: 404 }
  );
}

// ! put not found route
export async function PUT() {
  return NextResponse.json<ResponseType>(
    {
      success: false,
      message: 'API endpoint not found',
    },
    { status: 404 }
  );
}

// ! delete not found route
export async function DELETE() {
  return NextResponse.json<ResponseType>(
    {
      success: false,
      message: 'API endpoint not found',
    },
    { status: 404 }
  );
}
