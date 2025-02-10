import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '../../../db/db';
import { UpdateProject } from '../../../types/types';
import Project from '../../../models/project';
import { ResponseType } from '../../../types/types';
export const runtime = 'nodejs';

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { title, description }: UpdateProject = await request.json();
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json<ResponseType>(
        { success: false, message: 'Project ID is required' },
        { status: 400 }
      );
    }

    if (!title || !description) {
      return NextResponse.json<ResponseType>(
        { success: false, message: 'All fields are required' },
        { status: 400 }
      );
    }

    const userId = request.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json<ResponseType>(
        { success: false, message: 'User not authenticated' },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const project = await Project.findOneAndUpdate(
      { _id: id, createdBy: userId },
      { title, description },
      { new: true }
    );

    if (!project) {
      return NextResponse.json<ResponseType>(
        { success: false, message: 'Project not found or unauthorized' },
        { status: 404 }
      );
    }

    return NextResponse.json<ResponseType>(
      {
        success: true,
        message: 'Project updated successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json<ResponseType>(
      { success: false, message: 'Failed to update project' },
      { status: 500 }
    );
  }
}
