import type { Metadata } from 'next';
import { Atractivos } from '@/components/landing/attractions';
import { Footer } from '@/components/landing/footer';
import { Header } from '@/components/landing/header';
import { getAttractions } from '@/lib/atractivos.service';

export const metadata: Metadata = {
  title: 'Atractivos Turísticos | Villa Unión del Talampaya',
  description: 'Explora los principales atractivos de Villa Unión: el Parque Nacional Talampaya, la Cuesta de Miranda. ¡Tu aventura comienza aquí!',
};

export default async function AtractivosPage() {
  const attractions = await getAttractions();

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Atractivos attractions={attractions} isPage />
      </main>
      <Footer />
    </div>
  );
}
