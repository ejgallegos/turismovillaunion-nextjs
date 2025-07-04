
import Image from 'next/image';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ArrowRight, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { getLocalidades } from '@/lib/localidades.service';
import { EmptyState } from '@/components/empty-state';
import { plainTextFromSlate } from '@/lib/slate-serializer';

export async function Localidades() {
  const localidades = await getLocalidades();

  return (
    <section id="localidades" className="w-full bg-secondary py-20 lg:py-28">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-12 text-center">
          <h2 className="font-headline text-3xl font-bold tracking-tight text-primary md:text-4xl">
            Explora Nuestras Localidades
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Cada pueblo y paraje tiene su encanto, su historia y su gente. Descúbrelos.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {localidades.length > 0 ? (
            localidades.map((localidad) => (
                <Card key={localidad.id} className="flex transform flex-col overflow-hidden rounded-lg shadow-lg transition-transform duration-300 hover:-translate-y-2">
                <div className="relative h-56 w-full">
                    <Image
                    src={localidad.imageUrl}
                    alt={`Imagen de ${localidad.title}`}
                    fill
                    className="object-cover"
                    />
                </div>
                <CardHeader className="flex flex-grow flex-row items-start gap-4 p-6">
                    <MapPin className="hidden md:block mt-1 h-6 w-6 flex-shrink-0 text-primary" />
                    <div className="flex-1">
                    <h3 className="font-headline text-xl font-bold"><Link href={`/localidades/${localidad.id}`} className="hover:underline">{localidad.title}</Link></h3>
                    <p className="mt-2 text-base text-muted-foreground line-clamp-3">
                        {plainTextFromSlate(localidad.description)}
                    </p>
                    </div>
                </CardHeader>
                <CardContent className="flex justify-end p-6 pt-0">
                    <Button variant="link" className="text-accent" asChild>
                    <Link href={`/localidades/${localidad.id}`}>
                        Conocer <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                    </Button>
                </CardContent>
                </Card>
            ))
          ) : (
            <EmptyState title="No hay localidades" description="Aún no se han añadido localidades. Vuelve a consultar más tarde." />
          )}
        </div>
      </div>
    </section>
  );
}
