import connectToDatabase from '@/app/api/db/db';
import Task from '@/app/api/models/task';
import { ResponseType } from '@/app/api/types/types';
import { NextResponse } from 'next/server';

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json<ResponseType>({
        success: false,
        message: 'Task ID is required',
      });
    }

    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json<ResponseType>({
        success: false,
        message: 'User not authenticated',
      });
    }

    await connectToDatabase();

    const task = await Task.findById(id);

    if (task.createdBy !== userId) {
      return NextResponse.json<ResponseType>(
        {
          success: false,
          message: 'You are not authorized to delete this task',
        },
        { status: 403 }
      );
    }

    await Task.deleteOne({ _id: id });

    if (!task) {
      return NextResponse.json<ResponseType>(
        {
          success: false,
          message: 'Task not found',
        },
        { status: 404 }
      );
    }
    return NextResponse.json<ResponseType>(
      {
        success: true,
        message: 'Task deleted successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json<ResponseType>(
      {
        success: false,
        message: 'Failed to delete task',
      },
      { status: 500 }
    );
  }
}
