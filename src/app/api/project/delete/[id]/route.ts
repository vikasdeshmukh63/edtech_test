import connectToDatabase from '@/app/api/db/db';
import Project from '@/app/api/models/project';
import { NextResponse } from 'next/server';
import { ResponseType } from '@/app/api/types/types';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json<ResponseType>(
        { success: false, message: 'Project ID is required' },
        { status: 400 }
      );
    }

    const userId = request.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json<ResponseType>(
        { success: false, message: 'User not authenticated' },
        { status: 403 }
      );
    }

    await connectToDatabase();

    const project = await Project.findOneAndDelete({
      _id: id,
      createdBy: userId,
    });

    if (!project) {
      return NextResponse.json<ResponseType>(
        { success: false, message: 'Project not found or unauthorized' },
        { status: 404 }
      );
    }

    return NextResponse.json<ResponseType>(
      { success: true, message: 'Project deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json<ResponseType>(
      { success: false, message: 'Failed to delete project' },
      { status: 500 }
    );
  }
}
