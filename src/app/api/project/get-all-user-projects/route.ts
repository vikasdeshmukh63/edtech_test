import { NextResponse } from 'next/server';
import connectToDatabase from '../../db/db';
import Project from '../../models/project';
import { ResponseType } from '../../types/types';
export async function GET(req: Request) {
  try {
    const userId = req.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json<ResponseType>(
        { success: false, message: 'User not authenticated' },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const projects = await Project.find({ createdBy: userId });

    return NextResponse.json<ResponseType>(
      {
        success: true,
        message: 'Projects fetched successfully',
        data: projects,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json<ResponseType>(
      { success: false, message: 'Failed to get projects' },
      { status: 500 }
    );
  }
}
