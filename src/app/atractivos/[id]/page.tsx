
import { getAttractions } from '@/lib/atractivos.service';
import { Header } from '@/components/landing/header';
import { Footer } from '@/components/landing/footer';
import Image from 'next/image';
import type { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';
import { serializeSlate, plainTextFromSlate } from '@/lib/slate-serializer';

// Generate metadata for the page
export async function generateMetadata(
  { params }: { params: { id: string } },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const attractions = await getAttractions();
  const attraction = attractions.find((a) => a.id === params.id);

  if (!attraction) {
    return {
      title: 'Atractivo no encontrado',
    };
  }
  
  const descriptionText = plainTextFromSlate(attraction.description);
  const title = `${attraction.title} | Villa Unión del Talampaya`;
  const description = descriptionText.substring(0, 160);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: attraction.imageUrl,
          width: 1200,
          height: 630,
          alt: `Imagen de ${attraction.title}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [attraction.imageUrl],
    },
  };
}

// Generate static paths for all attractions
export async function generateStaticParams() {
  const attractions = await getAttractions();
  return attractions.map((attraction) => ({
    id: attraction.id,
  }));
}

export default async function AttractionDetailPage({ params }: { params: { id: string } }) {
  const attractions = await getAttractions();
  const attraction = attractions.find((a) => a.id === params.id);

  if (!attraction) {
    notFound();
  }

  const serializedDescription = serializeSlate(attraction.description);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <article>
          <header className="relative h-[60vh] w-full">
            <Image
              src={attraction.imageUrl}
              alt={`Imagen panorámica de ${attraction.title}`}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/50" />
            <div className="relative z-10 flex h-full items-center justify-center">
              <h1 className="font-headline text-4xl font-bold tracking-tight text-white sm:text-6xl md:text-7xl text-center p-4">
                {attraction.title}
              </h1>
            </div>
          </header>
          <div className="container mx-auto max-w-4xl px-4 py-12 md:px-6 md:py-16">
            <div
                className="prose prose-lg dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: serializedDescription }}
            />
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
