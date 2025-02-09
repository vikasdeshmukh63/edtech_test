import Project from '../../models/project';
import { ResponseType } from '../../types/types';
import { NextResponse } from 'next/server';
import connectToDatabase from '../../db/db';

export async function GET(req: Request) {
  try {
    const userId = req.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'User not authenticated' },
        { status: 401 }
      );
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
  } catch (error) {
    return NextResponse.json<ResponseType>(
      { success: false, message: 'Failed to get projects' },
      { status: 500 }
    );
  }
}
