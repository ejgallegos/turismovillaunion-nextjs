'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Admin error:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground">Algo salió mal</h2>
        <p className="mt-2 text-muted-foreground">
          Ha ocurrido un error en el panel de administración.
        </p>
        {error.digest && (
          <p className="mt-1 text-xs text-muted-foreground">
            Código: {error.digest}
          </p>
        )}
      </div>
      <Button onClick={() => reset()}>Reintentar</Button>
    </div>
  );
}
