import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/app/api/db/db';
import Task from '@/app/api/models/task';
import { ResponseType } from '@/app/api/types/types';
import { errorHandler } from '@/app/api/utils/errorHandler';
import {
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
} from '@/app/api/utils/errors';

export const runtime = 'nodejs';

// ! delete task route
export const DELETE = errorHandler(
  async (
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
  ) => {
    // getting the id
    const { id } = await context.params;

    // if the id is not present
    if (!id) {
      throw new BadRequestError('Task ID is required');
    }

    // getting the user id
    const userId = request.headers.get('x-user-id');

    // if the user id is not present
    if (!userId) {
      throw new UnauthorizedError('User not authenticated');
    }

    // connecting to the database
    await connectToDatabase();

    // finding the task
    const task = await Task.findById(id);

    // if the task is not found
    if (!task) {
      throw new NotFoundError('Task not found');
    }

    // if the task is not created by the user
    if (task.createdBy !== userId) {
      throw new ForbiddenError('You are not authorized to delete this task');
    }

    // deleting the task
    await Task.deleteOne({ _id: id });

    // creating the response
    return NextResponse.json<ResponseType>(
      {
        success: true,
        message: 'Task deleted successfully',
      },
      { status: 200 }
    );
  }
);
