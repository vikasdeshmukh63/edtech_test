import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '../../utils/utils';
import { errorHandler } from '../../utils/errorHandler';

export const runtime = 'nodejs';

// ! check auth route
export const GET = errorHandler(async () => {
  // getting the token
  const token = (await cookies()).get('token')?.value;

  // if the token is not present
  if (!token) {
    return NextResponse.json({ success: false });
  }

  // verifying the token
  const decoded = verifyToken(token);

  // if the token is invalid
  if (!decoded) {
    return NextResponse.json({ success: false });
  }

  // returning the success
  return NextResponse.json({ success: true });
});
