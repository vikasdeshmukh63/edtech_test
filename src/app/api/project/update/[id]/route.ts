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

// ! update project route
export const PUT = errorHandler(
  async (
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
  ) => {
    // getting the title and description
    const { title, description }: UpdateProject = await request.json();

    // getting the id
    const { id } = await context.params;

    // if the id is not present
    if (!id) {
      throw new BadRequestError('Project ID is required');
    }

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

    // updating the project
    const project = await Project.findOneAndUpdate(
      { _id: id, createdBy: userId },
      { title, description },
      { new: true }
    );

    // if the project is not found
    if (!project) {
      throw new NotFoundError('Project not found or unauthorized');
    }

    // creating the response
    return NextResponse.json<ResponseType>(
      {
        success: true,
        message: 'Project updated successfully',
      },
      { status: 200 }
    );
  }
);
