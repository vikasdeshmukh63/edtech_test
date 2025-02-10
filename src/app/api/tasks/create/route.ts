import { NextRequest, NextResponse } from 'next/server';
import { CreateTask } from '../../types/types';
import connectToDatabase from '../../db/db';
import Task from '../../models/task';
import { errorHandler } from '../../utils/errorHandler';
import { BadRequestError, UnauthorizedError } from '../../utils/errors';

export const runtime = 'nodejs';

// ! create task route
export const POST = errorHandler(async (request: NextRequest) => {
  const {
    title,
    description,
    priority,
    dueDate,
    categoryId,
    projectId,
    assignedTo,
  }: CreateTask = await request.json();

  // if the title, description, priority, dueDate or categoryId is not present
  if (!title || !description || !priority || !dueDate || !categoryId) {
    throw new BadRequestError('All fields are required');
  }

  // getting the user id
  const userId = request.headers.get('x-user-id');

  // if the user id is not present
  if (!userId) {
    throw new UnauthorizedError('User not authenticated');
  }

  // connecting to the database
  await connectToDatabase();

  // creating the task
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

  // creating the response
  return NextResponse.json(
    { success: true, message: 'Task created successfully' },
    { status: 201 }
  );
});
