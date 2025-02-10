import { NextRequest, NextResponse } from 'next/server';
import Task from '../../models/task';
import { ResponseType } from '../../types/types';
import connectToDatabase from '../../db/db';
import { errorHandler } from '../../utils/errorHandler';
import { UnauthorizedError } from '../../utils/errors';

export const runtime = 'nodejs';

// ! get all user tasks route
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
  const tasks = await Task.find({ createdBy: userId }).select('-__v');

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
