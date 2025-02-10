import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '../../db/db';
import Task from '../../models/task';
import { ResponseType } from '../../types/types';

interface TaskQuery {
  priority?: string;
  assignedTo?: string;
  status?: string;
  categoryId?: string;
  projectId?: string;
  search?: string;
  dueDate?: {
    $gte?: Date;
    $lte?: Date;
  };
  $or?: Array<
    | { title: { $regex: string; $options: string } }
    | { description: { $regex: string; $options: string } }
  >;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const priority = searchParams.get('priority');
    const assignedTo = searchParams.get('assignedTo');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const search = searchParams.get('search');
    const status = searchParams.get('status');
    const categoryId = searchParams.get('categoryId');
    const projectId = searchParams.get('projectId');

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

    // Build query
    const query: TaskQuery = {};

    // Add filters only if they have values
    if (priority) query.priority = priority;
    if (assignedTo) query.assignedTo = assignedTo;
    if (status) query.status = status;
    if (categoryId) query.categoryId = categoryId;
    if (projectId) query.projectId = projectId;
    if (startDate || endDate) {
      query.dueDate = {};
      if (startDate) query.dueDate.$gte = new Date(startDate);
      if (endDate) query.dueDate.$lte = new Date(endDate);
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;

    const [tasks, total] = await Promise.all([
      Task.find(query)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .select('-__v'),
      Task.countDocuments(query),
    ]);

    const hasMore = total > skip + tasks.length;

    return NextResponse.json<ResponseType>(
      {
        success: true,
        message: 'Tasks fetched successfully',
        data: tasks,
        hasMore,
        total,
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
