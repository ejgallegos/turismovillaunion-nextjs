import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Download } from 'lucide-react';
import Link from 'next/link';
import { getMapas } from '@/lib/mapas.service';

export async function Maps() {
  const maps = await getMapas();
  
  return (
    <section id="mapas" className="w-full py-20 lg:py-28">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-12 text-center">
          <h2 className="font-headline text-3xl font-bold tracking-tight text-primary md:text-4xl">
            Mapas de la Región
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Encuentra tu camino y explora cada rincón de Villa Unión y sus alrededores.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
             {maps.map((map) => (
              <Card key={map.id}>
                  <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                      <h3 className="font-headline text-xl font-bold">{map.title}</h3>
                      <p className="text-muted-foreground flex-grow">{map.description}</p>
                      <Button asChild disabled={!map.downloadUrl || map.downloadUrl === '#'}>
                          <Link href={map.downloadUrl || '#'} target="_blank" rel="noopener noreferrer">
                              <Download className="mr-2 h-4 w-4" />
                              Descargar PDF
                          </Link>
                      </Button>
                  </CardContent>
              </Card>
             ))}
             {maps.length === 0 && (
                <div className="col-span-full text-center text-muted-foreground">
                  <p>No hay mapas disponibles para descargar en este momento.</p>
                </div>
              )}
          </div>
        </div>
      </div>
    </section>
  );
}
