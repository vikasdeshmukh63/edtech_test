import { NextResponse } from 'next/server';
import { CreateTask, ResponseType } from '../../types/types';
import connectToDatabase from '../../db/db';
import Task from '../../models/task';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const {
      title,
      description,
      priority,
      dueDate,
      categoryId,
      projectId,
      assignedTo,
    }: CreateTask = await req.json();

    if (!title || !description || !priority || !dueDate || !categoryId) {
      return NextResponse.json<ResponseType>(
        {
          success: false,
          message: 'All fields are required',
        },
        { status: 400 }
      );
    }

    const userId = req.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json<ResponseType>(
        { success: false, message: 'User not authenticated' },
        { status: 401 }
      );
    }
    await connectToDatabase();

    const task = await Task.create({
      title,
      description,
      priority,
      dueDate,
      categoryId,
      createdBy: userId,
      projectId,
      assignedTo,
    });

    return NextResponse.json<ResponseType>(
      { success: true, message: 'Task created successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json<ResponseType>(
      { success: false, message: 'Failed to create task' },
      { status: 500 }
    );
  }
}
