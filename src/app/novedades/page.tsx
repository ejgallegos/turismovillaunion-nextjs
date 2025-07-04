import type { Metadata } from 'next';
import { Footer } from '@/components/landing/footer';
import { Header } from '@/components/landing/header';
import { getNovedades } from '@/lib/novedades.service';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/empty-state';

export const metadata: Metadata = {
  title: 'Novedades | Villa Unión del Talampaya',
  description: 'Mantente al día con las últimas noticias, eventos y novedades de Villa Unión y sus alrededores.',
};

export default async function NovedadesPage() {
    const novedades = (await getNovedades()).reverse();

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="w-full bg-secondary py-20 lg:py-28">
            <div className="container mx-auto px-4 md:px-6">
                <div className="mb-12 text-center">
                    <h1 className="font-headline text-3xl font-bold tracking-tight text-primary md:text-4xl">
                        Novedades
                    </h1>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                        Las últimas noticias y eventos de nuestro rincón en La Rioja.
                    </p>
                </div>
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {novedades.length > 0 ? (
                        novedades.map((novedad) => (
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
                                    <h2 className="mt-2 font-headline text-xl font-bold">
                                        <Link href={`/novedades/${novedad.id}`} className="hover:underline">{novedad.title}</Link>
                                    </h2>
                                    <p className="mt-2 flex-grow text-base text-muted-foreground line-clamp-3">
                                        {novedad.description.replace(/<[^>]*>?/gm, '')}
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
                        ))
                    ) : (
                        <EmptyState title="No hay novedades" description="No se han publicado noticias recientemente. Vuelve a consultar más tarde." />
                    )}
                </div>
            </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
