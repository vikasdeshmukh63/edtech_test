import { NextRequest, NextResponse } from 'next/server';
import { CreateTask } from '../../types/types';
import connectToDatabase from '../../db/db';
import Task from '../../models/task';
import { errorHandler } from '../../utils/errorHandler';
import { BadRequestError, UnauthorizedError } from '../../utils/errors';

export const runtime = 'nodejs';

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

  if (!title || !description || !priority || !dueDate || !categoryId) {
    throw new BadRequestError('All fields are required');
  }

  const userId = request.headers.get('x-user-id');
  if (!userId) {
    throw new UnauthorizedError('User not authenticated');
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

  return NextResponse.json(
    { success: true, message: 'Task created successfully' },
    { status: 201 }
  );
});
