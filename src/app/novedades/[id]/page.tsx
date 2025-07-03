import { getNovedades } from '@/lib/novedades.service';
import { Header } from '@/components/landing/header';
import { Footer } from '@/components/landing/footer';
import Image from 'next/image';
import type { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar } from 'lucide-react';

// Generate metadata for the page
export async function generateMetadata(
  { params }: { params: { id: string } },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const novedades = await getNovedades();
  const novedad = novedades.find((n) => n.id === params.id);

  if (!novedad) {
    return {
      title: 'Novedad no encontrada',
    };
  }

  const title = `${novedad.title} | Novedades | Villa Unión del Talampaya`;
  const description = novedad.description.replace(/<[^>]*>/g, '').substring(0, 160);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: novedad.imageUrl,
          width: 1200,
          height: 630,
          alt: `Imagen de ${novedad.title}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [novedad.imageUrl],
    },
  };
}

// Generate static paths for all news
export async function generateStaticParams() {
  const novedades = await getNovedades();
  return novedades.map((novedad) => ({
    id: novedad.id,
  }));
}

export default async function NovedadDetailPage({ params }: { params: { id: string } }) {
  const novedades = await getNovedades();
  const novedad = novedades.find((n) => n.id === params.id);

  if (!novedad) {
    notFound();
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <article>
          <header className="relative h-[60vh] w-full">
            <Image
              src={novedad.imageUrl}
              alt={`Imagen panorámica de ${novedad.title}`}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/50" />
            <div className="relative z-10 flex h-full flex-col items-center justify-center p-4 text-center">
              <h1 className="font-headline text-4xl font-bold tracking-tight text-white sm:text-6xl md:text-7xl">
                {novedad.title}
              </h1>
              <div className="mt-4 flex items-center text-lg text-white/90">
                <Calendar className="mr-2 h-5 w-5" />
                <time dateTime={novedad.date}>
                  {format(parseISO(novedad.date), "dd 'de' MMMM 'de' yyyy", { locale: es })}
                </time>
              </div>
            </div>
          </header>
          <div className="container mx-auto max-w-4xl px-4 py-12 md:px-6 md:py-16">
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p>{novedad.description}</p>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
