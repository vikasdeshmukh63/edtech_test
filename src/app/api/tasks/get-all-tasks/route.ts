import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/app/api/db/db';
import Task from '@/app/api/models/task';
import { ResponseType } from '@/app/api/types/types';
import { errorHandler } from '@/app/api/utils/errorHandler';
import { UnauthorizedError } from '@/app/api/utils/errors';

export const runtime = 'nodejs';

// ! get all tasks route
export const GET = errorHandler(async (request: NextRequest) => {
  // getting the user id
  const userId = request.headers.get('x-user-id');

  // if the user id is not present
  if (!userId) {
    throw new UnauthorizedError('User not authenticated');
  }

  // connecting to the database
  await connectToDatabase();

  // getting the tasks
  const tasks = await Task.find().select('-__v');

  // creating the response
  return NextResponse.json<ResponseType>(
    {
      success: true,
      message: 'Tasks fetched successfully',
      data: tasks,
    },
    { status: 200 }
  );
});
