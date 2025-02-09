import { ResponseType, UpdateTask } from '@/app/api/types/types';
import connectToDatabase from '@/app/api/db/db';
import Task from '@/app/api/models/task';
import { NextResponse } from 'next/server';

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const updateData: Partial<UpdateTask> = await req.json();

    // Only validate title, description, priority, dueDate, and categoryId if they are provided
    if (
      (updateData.title !== undefined && !updateData.title) ||
      (updateData.description !== undefined && !updateData.description) ||
      (updateData.priority !== undefined && !updateData.priority) ||
      (updateData.dueDate !== undefined && !updateData.dueDate) ||
      (updateData.categoryId !== undefined && !updateData.categoryId)
    ) {
      return NextResponse.json<ResponseType>(
        {
          success: false,
          message: 'Invalid field values provided',
        },
        { status: 400 }
      );
    }

    const userId = req.headers.get('x-user-id');

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

    // Only update the fields that are provided
    const task = await Task.findByIdAndUpdate(
      params.id,
      { $set: updateData },
      { new: true }
    );

    return NextResponse.json<ResponseType>(
      {
        success: true,
        message: 'Task updated successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json<ResponseType>(
      {
        success: false,
        message: 'Failed to update task',
      },
      { status: 500 }
    );
  }
}
