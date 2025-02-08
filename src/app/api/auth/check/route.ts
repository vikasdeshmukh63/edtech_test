import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '../../utils/utils';

export const runtime = 'nodejs';

export async function GET() {
  const token = cookies().get('token')?.value;

  if (!token) {
    return NextResponse.json({ success: false });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return NextResponse.json({ success: false });
  }

  return NextResponse.json({ success: true });
}
