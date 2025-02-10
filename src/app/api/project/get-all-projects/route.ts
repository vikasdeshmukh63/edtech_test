import { NextRequest, NextResponse } from 'next/server';
import Project from '../../models/project';
import { ResponseType } from '../../types/types';
import connectToDatabase from '../../db/db';
import { errorHandler } from '../../utils/errorHandler';
import { UnauthorizedError } from '../../utils/errors';

export const runtime = 'nodejs';

// ! get all projects route
export const GET = errorHandler(async (request: NextRequest) => {
  // getting the user id
  const userId = request.headers.get('x-user-id');

  // if the user id is not present
  if (!userId) {
    throw new UnauthorizedError('User not authenticated');
  }

  // connecting to the database
  await connectToDatabase();

  // getting the projects
  const projects = await Project.find().select('-__v');

  // creating the response
  return NextResponse.json<ResponseType>(
    {
      success: true,
      message: 'Projects fetched successfully',
      data: projects,
    },
    { status: 200 }
  );
});
