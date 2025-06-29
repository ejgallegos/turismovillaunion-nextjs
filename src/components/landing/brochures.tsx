import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Download } from 'lucide-react';
import Link from 'next/link';
import { getFolletos } from '@/lib/folletos.service';

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
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {brochures.map((brochure) => (
            <Card key={brochure.id} className="flex flex-col overflow-hidden">
              <CardHeader className="p-0">
                <div className="relative aspect-[3/4] w-full">
                  <Image
                    src={brochure.imageUrl}
                    alt={`Portada del folleto ${brochure.title}`}
                    data-ai-hint={brochure.aiHint}
                    fill
                    className="object-cover"
                  />
                </div>
              </CardHeader>
              <CardContent className="flex-grow p-6">
                <CardTitle className="font-headline text-xl">{brochure.title}</CardTitle>
                <p className="mt-2 text-muted-foreground">{brochure.description}</p>
              </CardContent>
              <CardFooter className="p-6 pt-0">
                <Button asChild className="w-full" disabled={!brochure.downloadUrl || brochure.downloadUrl === '#'}>
                  <Link href={brochure.downloadUrl || '#'} target="_blank" rel="noopener noreferrer">
                    <Download className="mr-2 h-4 w-4" />
                    Descargar
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
           {brochures.length === 0 && (
            <div className="col-span-full text-center text-muted-foreground">
              <p>No hay folletos disponibles en este momento.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
