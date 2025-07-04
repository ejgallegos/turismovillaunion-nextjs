
import { getLocalidades } from '@/lib/localidades.service';
import { Header } from '@/components/landing/header';
import { Footer } from '@/components/landing/footer';
import Image from 'next/image';
import type { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';
import { plainTextFromSlate } from '@/lib/slate-serializer';
import { generateMetaTags } from '@/ai/flows/generate-meta-tags';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

const SlateRenderer = dynamic(
  () => import('@/components/slate-renderer').then((mod) => mod.SlateRenderer),
  { 
    ssr: false,
    loading: () => (
      <div className="space-y-4">
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-5/6" />
        <Skeleton className="h-6 w-full" />
      </div>
    )
  }
);

export async function generateMetadata(
  { params }: { params: { id: string } },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const localidades = await getLocalidades();
  const localidad = localidades.find((a) => a.id === params.id);

  if (!localidad) {
    return {
      title: 'Localidad no encontrada',
    };
  }

  const content = plainTextFromSlate(localidad.description);
  const metaTags = await generateMetaTags({ content });
  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: metaTags.title,
    description: metaTags.description,
    keywords: metaTags.keywords,
    openGraph: {
      title: metaTags.title,
      description: metaTags.description,
      images: [
        {
          url: localidad.imageUrl,
          width: 1200,
          height: 630,
          alt: `Imagen de ${localidad.title}`,
        },
        ...previousImages
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTags.title,
      description: metaTags.description,
      images: [localidad.imageUrl],
    },
  };
}

export async function generateStaticParams() {
  const localidades = await getLocalidades();
  return localidades.map((localidad) => ({
    id: localidad.id,
  }));
}

export default async function LocalidadDetailPage({ params }: { params: { id: string } }) {
  const localidades = await getLocalidades();
  const localidad = localidades.find((a) => a.id === params.id);

  if (!localidad) {
    notFound();
  }
  
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <article>
          <header className="relative h-[60vh] w-full">
            <Image
              src={localidad.imageUrl}
              alt={`Imagen panorámica de ${localidad.title}`}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/50" />
            <div className="relative z-10 flex h-full items-center justify-center">
              <h1 className="font-headline text-4xl font-bold tracking-tight text-white sm:text-6xl md:text-7xl text-center p-4">
                {localidad.title}
              </h1>
            </div>
          </header>
          <div className="container mx-auto max-w-4xl px-4 py-12 md:px-6 md:py-16">
            <div
                className="prose prose-lg dark:prose-invert max-w-none"
            >
              <SlateRenderer content={localidad.description} />
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
