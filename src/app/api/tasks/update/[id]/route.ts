import { ResponseType, UpdateTask } from '@/app/api/types/types';
import connectToDatabase from '@/app/api/db/db';
import Task from '@/app/api/models/task';
import { NextResponse } from 'next/server';

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const {
      title,
      description,
      priority,
      dueDate,
      categoryId,
      projectId,
      status,
    }: UpdateTask = await req.json();

    if (!title || !description || !priority || !dueDate || !categoryId) {
      return NextResponse.json<ResponseType>({
        success: false,
        message: 'All fields are required',
      });
    }

    const userId = req.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json<ResponseType>({
        success: false,
        message: 'User not authenticated',
      });
    }

    await connectToDatabase();

    const task = await Task.findByIdAndUpdate(params.id, {
      title,
      description,
      priority,
      dueDate,
      categoryId,
      projectId,
      status,
    });

    return NextResponse.json<ResponseType>({
      success: true,
      message: 'Task updated successfully',
      data: task,
    });
  } catch (error) {
    return NextResponse.json<ResponseType>({
      success: false,
      message: 'Failed to update task',
    });
  }
}
