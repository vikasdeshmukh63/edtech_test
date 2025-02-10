import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '../../utils/utils';
import { errorHandler } from '../../utils/errorHandler';

export const runtime = 'nodejs';

export const GET = errorHandler(async () => {
  const token = (await cookies()).get('token')?.value;

  if (!token) {
    return NextResponse.json({ success: false });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return NextResponse.json({ success: false });
  }

  return NextResponse.json({ success: true });
});
