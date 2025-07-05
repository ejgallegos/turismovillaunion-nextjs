import type { Metadata } from 'next';
import { Atractivos } from '@/components/landing/attractions';
import { Footer } from '@/components/landing/footer';
import { Header } from '@/components/landing/header';

export const metadata: Metadata = {
  title: 'Atractivos Turísticos | Villa Unión del Talampaya',
  description: 'Explora los principales atractivos de Villa Unión: el Parque Nacional Talampaya, la Cuesta de Miranda. ¡Tu aventura comienza aquí!',
};

export default function AtractivosPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Atractivos />
      </main>
      <Footer />
    </div>
  );
}
