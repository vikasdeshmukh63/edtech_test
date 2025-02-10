import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/app/api/db/db';
import Task from '@/app/api/models/task';
import { ResponseType } from '@/app/api/types/types';
import { errorHandler } from '@/app/api/utils/errorHandler';
import { UnauthorizedError } from '@/app/api/utils/errors';

export const runtime = 'nodejs';

export const GET = errorHandler(async (request: NextRequest) => {
  const userId = request.headers.get('x-user-id');

  if (!userId) {
    throw new UnauthorizedError('User not authenticated');
  }

  await connectToDatabase();

  const tasks = await Task.find().select('-__v');

  return NextResponse.json<ResponseType>(
    {
      success: true,
      message: 'Tasks fetched successfully',
      data: tasks,
    },
    { status: 200 }
  );
});
