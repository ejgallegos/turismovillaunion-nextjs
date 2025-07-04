
'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

const SlateRenderer = dynamic(
  () => import('@/components/slate-renderer').then((mod) => mod.SlateRenderer),
  {
    ssr: false,
    loading: () => (
      <div className="space-y-4">
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-5/6" />
        <Skeleton className="h-6 w-full" />
      </div>
    ),
  }
);

export function ContentRenderer({ content }: { content: string }) {
  return <SlateRenderer content={content} />;
}
