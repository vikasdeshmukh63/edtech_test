import { NextRequest, NextResponse } from 'next/server';
import Task from '../../models/task';
import connectToDatabase from '../../db/db';
import { ResponseType } from '../../types/types';
import { errorHandler } from '../../utils/errorHandler';
import { UnauthorizedError, ForbiddenError } from '../../utils/errors';

export const runtime = 'nodejs';

// ! delete many tasks route
export const DELETE = errorHandler(async (request: NextRequest) => {
  // getting the task ids
  const { taskIds } = await request.json();

  // if the task ids are not present
  const userId = request.headers.get('x-user-id');

  // if the user id is not present
  if (!userId) {
    throw new UnauthorizedError('User not authenticated');
  }

  // connecting to the database
  await connectToDatabase();

  // getting the tasks
  const tasks = await Task.find({ _id: { $in: taskIds } });

  // if the tasks are not found
  if (tasks.some((task) => task.createdBy.toString() !== userId)) {
    throw new ForbiddenError('You are not authorized to delete these tasks');
  }

  // deleting the tasks
  await Task.deleteMany({ _id: { $in: taskIds } });

  // creating the response
  return NextResponse.json<ResponseType>(
    {
      success: true,
      message: 'Tasks deleted successfully',
    },
    { status: 200 }
  );
});
