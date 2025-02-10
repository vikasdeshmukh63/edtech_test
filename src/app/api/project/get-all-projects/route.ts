import { NextRequest, NextResponse } from 'next/server';
import Project from '../../models/project';
import { ResponseType } from '../../types/types';
import connectToDatabase from '../../db/db';
import { errorHandler } from '../../utils/errorHandler';
import { UnauthorizedError } from '../../utils/errors';

export const runtime = 'nodejs';

export const GET = errorHandler(async (request: NextRequest) => {
  const userId = request.headers.get('x-user-id');

  if (!userId) {
    throw new UnauthorizedError('User not authenticated');
  }

  await connectToDatabase();

  const projects = await Project.find().select('-__v');

  return NextResponse.json<ResponseType>(
    {
      success: true,
      message: 'Projects fetched successfully',
      data: projects,
    },
    { status: 200 }
  );
});
