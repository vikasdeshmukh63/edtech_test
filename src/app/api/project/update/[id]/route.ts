import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '../../../db/db';
import { UpdateProject } from '../../../types/types';
import Project from '../../../models/project';
import { ResponseType } from '../../../types/types';
import { errorHandler } from '../../../utils/errorHandler';
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from '../../../utils/errors';

export const runtime = 'nodejs';

export const PUT = errorHandler(
  async (
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
  ) => {
    const { title, description }: UpdateProject = await request.json();
    const { id } = await context.params;

    if (!id) {
      throw new BadRequestError('Project ID is required');
    }

    if (!title || !description) {
      throw new BadRequestError('All fields are required');
    }

    const userId = request.headers.get('x-user-id');
    if (!userId) {
      throw new UnauthorizedError('User not authenticated');
    }

    await connectToDatabase();

    const project = await Project.findOneAndUpdate(
      { _id: id, createdBy: userId },
      { title, description },
      { new: true }
    );

    if (!project) {
      throw new NotFoundError('Project not found or unauthorized');
    }

    return NextResponse.json<ResponseType>(
      {
        success: true,
        message: 'Project updated successfully',
      },
      { status: 200 }
    );
  }
);
