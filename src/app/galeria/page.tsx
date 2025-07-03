import type { Metadata } from 'next';
import { Gallery } from '@/components/landing/gallery';
import { Footer } from '@/components/landing/footer';
import { Header } from '@/components/landing/header';
import { getGalleryItems } from '@/lib/galeria.service';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Galería de Imágenes | Villa Unión del Talampaya',
  description: 'Explora una colección de las mejores imágenes de Villa Unión, Talampaya y sus alrededores. Descubre la belleza de La Rioja en fotos.',
};

export default async function GaleriaPage() {
  const galleryItems = await getGalleryItems();
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Gallery items={galleryItems} />
      </main>
      <Footer />
    </div>
  );
}
