import connectToDatabase from '@/app/api/db/db';
import Task from '@/app/api/models/task';
import { ResponseType } from '@/app/api/types/types';
import { NextResponse } from 'next/server';

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

    const tasks = await Task.find();

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
