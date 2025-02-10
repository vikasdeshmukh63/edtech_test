import Project from '../../models/project';
import { CreateProject, ResponseType } from '../../types/types';
import connectToDatabase from '../../db/db';
import { NextRequest, NextResponse } from 'next/server';
import { errorHandler } from '../../utils/errorHandler';
import { BadRequestError, UnauthorizedError } from '../../utils/errors';

export const runtime = 'nodejs';

// ! create project route
export const POST = errorHandler(async (request: NextRequest) => {
  // getting the title and description
  const { title, description }: CreateProject = await request.json();

  // if the title or description is not present
  if (!title || !description) {
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

  // creating the project
  await Project.create({
    title,
    description,
    createdBy: userId,
  });

  // creating the response
  return NextResponse.json<ResponseType>(
    {
      success: true,
      message: 'Project created successfully',
    },
    { status: 201 }
  );
});
