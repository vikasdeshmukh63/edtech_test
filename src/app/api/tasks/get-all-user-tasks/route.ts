import Task from '../../models/task';
import { ResponseType } from '../../types/types';
import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '../../db/db';

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');

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

    const tasks = await Task.find({ createdBy: userId }).select('-__v');

    return NextResponse.json<ResponseType>(
      {
        success: true,
        message: 'Tasks fetched successfully',
        data: tasks,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json<ResponseType>(
      {
        success: false,
        message: 'Failed to fetch tasks',
      },
      { status: 500 }
    );
  }
}
