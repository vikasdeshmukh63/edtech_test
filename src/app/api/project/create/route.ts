import { NextResponse } from 'next/server';
import Project from '../../models/project';
import { CreateProject, ResponseType } from '../../types/types';
import connectToDatabase from '../../db/db';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const { title, description }: CreateProject = await req.json();

    if (!title || !description) {
      return NextResponse.json(
        { success: false, message: 'All fields are required' },
        { status: 400 }
      );
    }

    const userId = req.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json<ResponseType>(
        {
          success: false,
          message: 'User not authenticated',
        },
        { status: 401 }
      );
    }

    await connectToDatabase();

    await Project.create({
      title,
      description,
      createdBy: userId,
    });

    return NextResponse.json<ResponseType>(
      {
        success: true,
        message: 'Project created successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json<ResponseType>(
      { success: false, message: 'Failed to create project' },
      { status: 500 }
    );
  }
}
