
import { getLocalidades } from '@/lib/localidades.service';
import { Header } from '@/components/landing/header';
import { Footer } from '@/components/landing/footer';
import Image from 'next/image';
import type { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';
import { plainTextFromSlate } from '@/lib/slate-serializer';
import { generateMetaTags } from '@/ai/flows/generate-meta-tags';
import { ContentRenderer } from '@/components/content-renderer';

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

  // Only attempt to generate AI metadata if an API key is available.
  if (process.env.GOOGLE_API_KEY) {
    try {
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
    } catch (error) {
      console.warn(`[AI Metadata Warning] Failed to generate AI metadata for localidad "${params.id}". This can happen due to API errors or content restrictions. Falling back to basic metadata.`, error);
    }
  }
  
  // Fallback to basic metadata if AI generation is skipped or fails
  const descriptionText = plainTextFromSlate(localidad.description).substring(0, 160);
  const previousImages = (await parent).openGraph?.images || [];
  return {
    title: localidad.title,
    description: descriptionText,
    openGraph: {
        title: localidad.title,
        description: descriptionText,
        images: [
            {
                url: localidad.imageUrl,
                width: 1200,
                height: 630,
                alt: `Imagen de ${localidad.title}`,
            },
            ...previousImages
        ]
    }
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
              <ContentRenderer content={localidad.description} />
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
