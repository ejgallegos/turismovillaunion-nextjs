
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, FileText } from 'lucide-react';
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
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {brochures.length > 0 ? (
            brochures.map((brochure) => (
              <Card key={brochure.id} className="flex flex-col text-center items-center p-6">
                <FileText className="h-12 w-12 text-primary mb-4" />
                <CardHeader className="p-0">
                    <CardTitle className="font-headline text-xl">{brochure.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow pt-4">
                    <p className="text-muted-foreground line-clamp-3">
                        {plainTextFromSlate(brochure.description)}
                    </p>
                </CardContent>
                <CardFooter className="p-0 pt-4 w-full">
                    <Button asChild className="w-full" disabled={!brochure.downloadUrl || brochure.downloadUrl === '#'}>
                        <Link href={brochure.downloadUrl || '#'} target="_blank" rel="noopener noreferrer">
                        <Download className="mr-2 h-4 w-4" />
                        Descargar
                        </Link>
                    </Button>
                </CardFooter>
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
