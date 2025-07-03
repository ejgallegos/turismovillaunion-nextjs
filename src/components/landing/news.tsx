import Image from 'next/image';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ArrowRight, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { getNovedades } from '@/lib/novedades.service';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

export async function News() {
  const allNovedades = await getNovedades();
  const latestNovedades = allNovedades.slice(0, 3); // Show only the latest 3

  if (latestNovedades.length === 0) {
    return null; // Don't render the section if there's no news
  }

  return (
    <section id="novedades" className="w-full py-20 lg:py-28">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-12 text-center">
          <h2 className="font-headline text-3xl font-bold tracking-tight text-primary md:text-4xl">
            Últimas Novedades
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Mantente al día con lo que está sucediendo en Villa Unión.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {latestNovedades.map((novedad) => (
            <Card key={novedad.id} className="flex transform flex-col overflow-hidden rounded-lg shadow-lg transition-transform duration-300 hover:-translate-y-2">
                <Link href={`/novedades/${novedad.id}`} className="block">
                    <div className="relative h-56 w-full">
                        <Image
                        src={novedad.imageUrl}
                        alt={`Imagen de ${novedad.title}`}
                        fill
                        className="object-cover"
                        />
                    </div>
                </Link>
                <CardHeader className="flex flex-grow flex-col items-start p-6">
                    <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="mr-2 h-4 w-4" />
                        <time dateTime={novedad.date}>
                        {format(parseISO(novedad.date), "dd 'de' MMMM, yyyy", { locale: es })}
                        </time>
                    </div>
                    <h3 className="mt-2 font-headline text-xl font-bold">
                        <Link href={`/novedades/${novedad.id}`} className="hover:underline">{novedad.title}</Link>
                    </h3>
                    <p className="mt-2 text-base text-muted-foreground line-clamp-3">
                        {novedad.description}
                    </p>
                </CardHeader>
                <CardContent className="flex justify-end p-6 pt-0">
                    <Button variant="link" className="text-accent" asChild>
                    <Link href={`/novedades/${novedad.id}`}>
                        Leer más <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                    </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        {allNovedades.length > 3 && (
            <div className="mt-12 text-center">
                <Button asChild>
                    <Link href="/novedades">Ver Todas las Novedades</Link>
                </Button>
            </div>
        )}
      </div>
    </section>
  );
}
