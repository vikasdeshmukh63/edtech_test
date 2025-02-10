import { NextResponse } from 'next/server';
import { ResponseType } from './types/types';

export async function GET() {
  return NextResponse.json<ResponseType>(
    {
      success: false,
      message: 'API endpoint not found',
    },
    { status: 404 }
  );
}

export async function POST() {
  return NextResponse.json<ResponseType>(
    {
      success: false,
      message: 'API endpoint not found',
    },
    { status: 404 }
  );
}

export async function PUT() {
  return NextResponse.json<ResponseType>(
    {
      success: false,
      message: 'API endpoint not found',
    },
    { status: 404 }
  );
}

export async function DELETE() {
  return NextResponse.json<ResponseType>(
    {
      success: false,
      message: 'API endpoint not found',
    },
    { status: 404 }
  );
} 