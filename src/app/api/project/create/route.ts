import Project from '../../models/project';
import { CreateProject, ResponseType } from '../../types/types';
import connectToDatabase from '../../db/db';
import { NextRequest, NextResponse } from 'next/server';
import { errorHandler } from '../../utils/errorHandler';
import { BadRequestError, UnauthorizedError } from '../../utils/errors';

export const runtime = 'nodejs';

export const POST = errorHandler(async (request: NextRequest) => {
  const { title, description }: CreateProject = await request.json();

  if (!title || !description) {
    throw new BadRequestError('All fields are required');
  }

  const userId = request.headers.get('x-user-id');
  if (!userId) {
    throw new UnauthorizedError('User not authenticated');
  }

  await connectToDatabase();

  await Project.create({
    title,
    description,
    createdBy: userId,
  });

  return NextResponse.json<ResponseType>(
    {
      success: true,
      message: 'Project created successfully',
    },
    { status: 201 }
  );
});
