import { ResponseType, UpdateTask } from '@/app/api/types/types';
import connectToDatabase from '@/app/api/db/db';
import Task from '@/app/api/models/task';
import { NextRequest, NextResponse } from 'next/server';

// ! update task route
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // getting the update data
    const updateData: Partial<UpdateTask> = await request.json();

    // getting the id
    const { id } = await context.params;

    // validate title, etc..  if they are provided
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

    // getting the user id
    const userId = request.headers.get('x-user-id');

    // if the user id is not present
    if (!userId) {
      return NextResponse.json<ResponseType>(
        {
          success: false,
          message: 'User not authenticated',
        },
        { status: 401 }
      );
    }

    // connecting to the database
    await connectToDatabase();

    // update the fields that are provided
    await Task.findByIdAndUpdate(id, { $set: updateData }, { new: true });

    // creating the response
    return NextResponse.json<ResponseType>(
      {
        success: true,
        message: 'Task updated successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    // creating the response
    return NextResponse.json<ResponseType>(
      {
        success: false,
        message: 'Failed to update task',
      },
      { status: 500 }
    );
  }
}
