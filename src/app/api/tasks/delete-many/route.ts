import { NextRequest, NextResponse } from 'next/server';
import Task from '../../models/task';
import connectToDatabase from '../../db/db';
import { ResponseType } from '../../types/types';
import { errorHandler } from '../../utils/errorHandler';
import { UnauthorizedError, ForbiddenError } from '../../utils/errors';

export const runtime = 'nodejs';

export const DELETE = errorHandler(async (request: NextRequest) => {
  const { taskIds } = await request.json();

  const userId = request.headers.get('x-user-id');
  if (!userId) {
    throw new UnauthorizedError('User not authenticated');
  }

  await connectToDatabase();

  const tasks = await Task.find({ _id: { $in: taskIds } });

  if (tasks.some((task) => task.createdBy.toString() !== userId)) {
    throw new ForbiddenError('You are not authorized to delete these tasks');
  }

  await Task.deleteMany({ _id: { $in: taskIds } });

  return NextResponse.json<ResponseType>(
    {
      success: true,
      message: 'Tasks deleted successfully',
    },
    { status: 200 }
  );
});
