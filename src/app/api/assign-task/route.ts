import { NextResponse } from 'next/server';
import connectToDatabase from '../db/db';
import Task from '../models/task';
import TaskAssignment from '../models/taskAssignment';
import { AssignTask, ResponseType } from '../types/types';

export async function POST(req: Request) {
  try {
    const { taskId, userId }: AssignTask = await req.json();

    if (!taskId || !userId) {
      return NextResponse.json<ResponseType>(
        {
          success: false,
          message: 'Task ID and user ID are required',
        },
        { status: 400 }
      );
    }

    const reqUserId = req.headers.get('x-user-id');

    if (!reqUserId) {
      return NextResponse.json<ResponseType>(
        {
          success: false,
          message: 'User ID is required',
        },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const task = await Task.findById(taskId);

    if (!task) {
      return NextResponse.json<ResponseType>(
        {
          success: false,
          message: 'Task not found',
        },
        { status: 404 }
      );
    }

    const isAssigned = await TaskAssignment.findOne({ taskId, userId });

    if (isAssigned) {
      return NextResponse.json<ResponseType>(
        {
          success: false,
          message: 'Task already assigned',
        },
        { status: 400 }
      );
    }

    await TaskAssignment.create({
      taskId,
      userId,
    });

    return NextResponse.json<ResponseType>(
      {
        success: true,
        message: 'Task assigned successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json<ResponseType>(
      {
        success: false,
        message: 'Failed to connect to database',
      },
      { status: 500 }
    );
  }
}
