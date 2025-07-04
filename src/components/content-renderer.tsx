
'use client';

import React, { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { serializeSlate } from '@/lib/slate-serializer';

export function ContentRenderer({ content }: { content: string }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-5/6" />
        <Skeleton className="h-6 w-full" />
      </div>
    );
  }
  
  const html = serializeSlate(content);
  
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
