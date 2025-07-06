
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Download } from 'lucide-react';
import Link from 'next/link';
import { getFolletos } from '@/lib/folletos.service';
import { EmptyState } from '../empty-state';
import { plainTextFromSlate } from '@/lib/slate-serializer';

export async function Brochures() {
  const brochures = await getFolletos();

  return (
    <section id="folletos" className="w-full bg-secondary py-20 lg:py-28">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-12 text-center">
          <h2 className="font-headline text-3xl font-bold tracking-tight text-primary md:text-4xl">
            Folletos
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Descarga nuestras guías y folletos en formato PDF para llevarlos contigo en tu viaje.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {brochures.length > 0 ? (
            brochures.map((brochure) => (
              <Card key={brochure.id}>
                <CardContent className="p-6 flex flex-col items-center text-center gap-4 h-full">
                    <h3 className="font-headline text-xl font-bold">{brochure.title}</h3>
                    <p className="text-muted-foreground flex-grow line-clamp-3">
                        {plainTextFromSlate(brochure.description)}
                    </p>
                    <Button asChild className="w-full mt-auto" disabled={!brochure.downloadUrl || brochure.downloadUrl === '#'}>
                        <Link href={brochure.downloadUrl || '#'} target="_blank" rel="noopener noreferrer">
                            <Download className="mr-2 h-4 w-4" />
                            Descargar
                        </Link>
                    </Button>
                </CardContent>
              </Card>
            ))
          ) : (
            <EmptyState title="No hay folletos" description="No hay folletos disponibles en este momento. Vuelve a consultar más tarde." />
          )}
        </div>
      </div>
    </section>
  );
}
