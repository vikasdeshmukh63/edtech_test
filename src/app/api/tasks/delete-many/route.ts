import { NextRequest, NextResponse } from 'next/server';
import Task from '../../models/task';
import connectToDatabase from '../../db/db';
import { ResponseType } from '../../types/types';

export async function DELETE(request: NextRequest) {
  try {
    const { taskIds } = await request.json();

    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json<ResponseType>(
        {
          success: false,
          message: 'User not authenticated',
        },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const tasks = await Task.find({ _id: { $in: taskIds } });

    if (tasks.some((task) => task.createdBy.toString() !== userId)) {
      return NextResponse.json<ResponseType>(
        {
          success: false,
          message: 'You are not authorized to delete these tasks',
        },
        { status: 403 }
      );
    }

    await Task.deleteMany({ _id: { $in: taskIds } });

    return NextResponse.json<ResponseType>(
      {
        success: true,
        message: 'Tasks deleted successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json<ResponseType>(
      {
        success: false,
        message: 'Failed to delete tasks',
      },
      { status: 500 }
    );
  }
}
