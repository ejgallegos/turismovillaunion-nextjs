import Image from 'next/image';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ArrowRight, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { getAttractions } from '@/lib/atractivos.service';
import { EmptyState } from '../empty-state';

export async function Atractivos() {
  const attractions = await getAttractions();

  return (
    <section id="atractivos" className="w-full bg-secondary py-20 lg:py-28">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-12 text-center">
          <h2 className="font-headline text-3xl font-bold tracking-tight text-primary md:text-4xl">
            Descubre Nuestras Maravillas
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Desde cañones ancestrales hasta lagunas de altura, la aventura está en todas partes.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {attractions.length > 0 ? (
            attractions.map((attraction) => (
              <Card key={attraction.id} className="flex transform flex-col overflow-hidden rounded-lg shadow-lg transition-transform duration-300 hover:-translate-y-2">
                <div className="relative h-56 w-full">
                  <Image
                    src={attraction.imageUrl}
                    alt={`Imagen de ${attraction.title}`}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardHeader className="flex flex-grow flex-row items-start gap-4 p-6">
                  <MapPin className="hidden md:block mt-1 h-6 w-6 flex-shrink-0 text-primary" />
                  <div className="flex-1">
                    <h3 className="font-headline text-xl font-bold"><Link href={`/atractivos/${attraction.id}`} className="hover:underline">{attraction.title}</Link></h3>
                    <p className="mt-2 text-base text-muted-foreground line-clamp-3">
                      {attraction.description}
                    </p>
                  </div>
                </CardHeader>
                <CardContent className="flex justify-end p-6 pt-0">
                  <Button variant="link" className="text-accent" asChild>
                    <Link href={`/atractivos/${attraction.id}`}>
                      Conocer <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))
          ) : (
            <EmptyState title="No hay atractivos" description="Aún no se han añadido atractivos. Vuelve a consultar más tarde." />
          )}
        </div>
      </div>
    </section>
  );
}
