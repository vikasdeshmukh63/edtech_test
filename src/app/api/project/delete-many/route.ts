import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '../../db/db';
import Project from '../../models/project';
import { ResponseType } from '../../types/types';
import { errorHandler } from '../../utils/errorHandler';
import { UnauthorizedError } from '../../utils/errors';

export const runtime = 'nodejs';

// ! delete many projects route
export const DELETE = errorHandler(async (request: NextRequest) => {
  // getting the project ids
  const { projectIds } = await request.json();

  // if the project ids are not present
  const userId = request.headers.get('x-user-id');
  if (!userId) {
    throw new UnauthorizedError('User not authenticated');
  }

  // connecting to the database
  await connectToDatabase();

  // deleting the projects
  await Project.deleteMany({ _id: { $in: projectIds } });

  // creating the response
  return NextResponse.json<ResponseType>(
    { success: true, message: 'Projects deleted successfully' },
    { status: 200 }
  );
});
