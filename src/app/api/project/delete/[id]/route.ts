import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/app/api/db/db';
import Project from '@/app/api/models/project';
import { ResponseType } from '@/app/api/types/types';
import { errorHandler } from '@/app/api/utils/errorHandler';
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from '@/app/api/utils/errors';

export const runtime = 'nodejs';

// ! delete project route
export const DELETE = errorHandler(
  async (
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
  ) => {
    // getting the id
    const { id } = await context.params;

    // if the id is not present
    if (!id) {
      throw new BadRequestError('Project ID is required');
    }

    // getting the user id
    const userId = request.headers.get('x-user-id');

    // if the user id is not present
    if (!userId) {
      throw new UnauthorizedError('User not authenticated');
    }

    // connecting to the database
    await connectToDatabase();

    // finding and deleting the project
    const project = await Project.findOneAndDelete({
      _id: id,
      createdBy: userId,
    });

    // if the project is not found
    if (!project) {
      throw new NotFoundError('Project not found or unauthorized');
    }

    // creating the response
    return NextResponse.json<ResponseType>(
      { success: true, message: 'Project deleted successfully' },
      { status: 200 }
    );
  }
);
