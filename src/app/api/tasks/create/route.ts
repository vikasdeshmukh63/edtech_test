import { NextResponse } from 'next/server';
import { CreateTask, ResponseType } from '../../types/types';
import connectToDatabase from '../../db/db';
import Task from '../../models/task';

export async function POST(req: Request) {
  try {
    const {
      title,
      description,
      priority,
      dueDate,
      categoryId,
      projectId,
    }: CreateTask = await req.json();

    if (!title || !description || !priority || !dueDate || !categoryId) {
      return NextResponse.json<ResponseType>({
        success: false,
        message: 'All fields are required',
      });
    }
    console.log(req);
    await connectToDatabase();

    // const task = await Task.create({
    //   title,
    //   description,
    //   priority,
    //   dueDate,
    //   categoryId,
    //   createdBy: req.user.id,
    //   projectId,
    // });
  } catch (error) {}
}
