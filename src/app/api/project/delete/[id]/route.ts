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

export const DELETE = errorHandler(
  async (
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
  ) => {
    const { id } = await context.params;

    if (!id) {
      throw new BadRequestError('Project ID is required');
    }

    const userId = request.headers.get('x-user-id');
    if (!userId) {
      throw new UnauthorizedError('User not authenticated');
    }

    await connectToDatabase();

    const project = await Project.findOneAndDelete({
      _id: id,
      createdBy: userId,
    });

    if (!project) {
      throw new NotFoundError('Project not found or unauthorized');
    }

    return NextResponse.json<ResponseType>(
      { success: true, message: 'Project deleted successfully' },
      { status: 200 }
    );
  }
);
