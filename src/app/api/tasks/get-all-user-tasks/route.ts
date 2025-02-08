import Task from '../../models/task';
import { ResponseType } from '../../types/types';
import { NextResponse } from 'next/server';
import connectToDatabase from '../../db/db';

export async function GET(req: Request) {
  try {
    const userId = req.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json<ResponseType>({
        success: false,
        message: 'User not authenticated',
      });
    }

    await connectToDatabase();

    const tasks = await Task.find({ createdBy: userId });
    
    return NextResponse.json<ResponseType>({
      success: true,
      message: 'Tasks fetched successfully',
      data: tasks,
    });

  } catch (error) {
    return NextResponse.json<ResponseType>({
      success: false,
      message: 'Failed to fetch tasks',
    });
  }
}
