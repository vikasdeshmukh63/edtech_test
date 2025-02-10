import { NextRequest, NextResponse } from 'next/server';
import { ApiError } from './errors';
import { ResponseType } from '../types/types';

type ErrorHandlerFunction = (
  request: NextRequest,
  params?: any
) => Promise<NextResponse>;

// ! error handler
export const errorHandler = (fn: ErrorHandlerFunction) => {
  return async (request: NextRequest, params?: any) => {
    try {
      // call the function
      return await fn(request, params);
    } catch (error) {
      // log the error
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
      // handle mongoose validation errors
      if ((error as any).name === 'ValidationError') {
        return NextResponse.json<ResponseType>(
          {
            success: false,
            message: Object.values((error as any).errors)
              .map((err: any) => err.message)
              .join(', '),
          },
          { status: 400 }
        );
      }

      // handle mongoose duplicate key errors
      if ((error as any).code === 11000) {
        return NextResponse.json<ResponseType>(
          {
            success: false,
            message: 'Duplicate field value entered',
          },
          { status: 400 }
        );
      }

      // handle all other errors
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
