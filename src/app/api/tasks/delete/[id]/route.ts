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

export const DELETE = errorHandler(
  async (
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
  ) => {
    const { id } = await context.params;

    if (!id) {
      throw new BadRequestError('Task ID is required');
    }

    const userId = request.headers.get('x-user-id');
    if (!userId) {
      throw new UnauthorizedError('User not authenticated');
    }

    await connectToDatabase();

    const task = await Task.findById(id);

    if (!task) {
      throw new NotFoundError('Task not found');
    }

    if (task.createdBy !== userId) {
      throw new ForbiddenError('You are not authorized to delete this task');
    }

    await Task.deleteOne({ _id: id });

    return NextResponse.json<ResponseType>(
      {
        success: true,
        message: 'Task deleted successfully',
      },
      { status: 200 }
    );
  }
);
