import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '../../db/db';
import Project from '../../models/project';
import { ResponseType } from '../../types/types';

// ! get all user projects route
export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');

    // if the user id is not present
    if (!userId) {
      return NextResponse.json<ResponseType>(
        { success: false, message: 'User not authenticated' },
        { status: 401 }
      );
    }

    // connecting to the database
    await connectToDatabase();

    // getting the projects
    const projects = await Project.find({ createdBy: userId }).select('-__v');

    // creating the response
    return NextResponse.json<ResponseType>(
      {
        success: true,
        message: 'Projects fetched successfully',
        data: projects,
      },
      { status: 200 }
    );
  } catch (error) {
    // creating the response
    return NextResponse.json<ResponseType>(
      { success: false, message: 'Failed to get projects' },
      { status: 500 }
    );
  }
}
