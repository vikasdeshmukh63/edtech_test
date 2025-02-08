'use client';

import { useAuthRedirect } from '@/hooks/useAuthRedirect';
import Image from 'next/image';

export default function Home() {
  useAuthRedirect();
  return <div>h1</div>;
}
