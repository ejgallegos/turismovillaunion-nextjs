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
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground">Algo salió mal</h2>
        <p className="mt-2 text-muted-foreground">
          Ha ocurrido un error inesperado. Por favor, intenta de nuevo.
        </p>
        {error.digest && (
          <p className="mt-1 text-xs text-muted-foreground">
            Código de error: {error.digest}
          </p>
        )}
      </div>
      <Button onClick={() => reset()}>Intentar de nuevo</Button>
    </div>
  );
}
