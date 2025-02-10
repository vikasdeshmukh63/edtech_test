import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '../../db/db';
import Project from '../../models/project';
import { ResponseType } from '../../types/types';
import { errorHandler } from '../../utils/errorHandler';
import { UnauthorizedError } from '../../utils/errors';

export const runtime = 'nodejs';

export const DELETE = errorHandler(async (request: NextRequest) => {
  const { projectIds } = await request.json();

  const userId = request.headers.get('x-user-id');
  if (!userId) {
    throw new UnauthorizedError('User not authenticated');
  }

  await connectToDatabase();

  await Project.deleteMany({ _id: { $in: projectIds } });

  return NextResponse.json<ResponseType>(
    { success: true, message: 'Projects deleted successfully' },
    { status: 200 }
  );
});
