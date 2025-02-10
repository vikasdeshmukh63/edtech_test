import { NextRequest, NextResponse } from 'next/server';
import { ApiError } from './errors';
import { ResponseType } from '../types/types';

type ErrorHandlerFunction = (
  request: NextRequest,
  params?: any
) => Promise<NextResponse>;

export const errorHandler = (fn: ErrorHandlerFunction) => {
  return async (request: NextRequest, params?: any) => {
    try {
      return await fn(request, params);
    } catch (error) {
      console.error('Error:', error);

      if (error instanceof ApiError) {
        return NextResponse.json<ResponseType>(
          {
            success: false,
            message: error.message,
          },
          { status: error.statusCode }
        );
      }

      // Handle mongoose validation errors
      if (error.name === 'ValidationError') {
        return NextResponse.json<ResponseType>(
          {
            success: false,
            message: Object.values(error.errors)
              .map((err: any) => err.message)
              .join(', '),
          },
          { status: 400 }
        );
      }

      // Handle mongoose duplicate key errors
      if (error.code === 11000) {
        return NextResponse.json<ResponseType>(
          {
            success: false,
            message: 'Duplicate field value entered',
          },
          { status: 400 }
        );
      }

      // Handle all other errors
      return NextResponse.json<ResponseType>(
        {
          success: false,
          message: 'Internal Server Error',
        },
        { status: 500 }
      );
    }
  };
};
