import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '../../db/db';
import Project from '../../models/project';
import { ResponseType } from '../../types/types';

export async function DELETE(request: NextRequest) {
  try {
    const { projectIds } = await request.json();

    const userId = request.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json<ResponseType>(
        { success: false, message: 'User not authenticated' },
        { status: 401 }
      );
    }

    const db = await connectToDatabase();

    await Project.deleteMany({ _id: { $in: projectIds } });

    return NextResponse.json<ResponseType>(
      { success: true, message: 'Projects deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json<ResponseType>(
      { success: false, message: 'Failed to delete projects' },
      { status: 500 }
    );
  }
}
