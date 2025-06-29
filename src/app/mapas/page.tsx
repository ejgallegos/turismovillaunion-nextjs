import type { Metadata } from 'next';
import { Maps } from '@/components/landing/maps';
import { Footer } from '@/components/landing/footer';
import { Header } from '@/components/landing/header';

export const metadata: Metadata = {
  title: 'Mapas de la Región | Villa Unión del Talampaya',
  description: 'Encuentra mapas detallados de Villa Unión, el Parque Nacional Talampaya y las rutas turísticas de la región.',
};

export default function MapasPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Maps />
      </main>
      <Footer />
    </div>
  );
}
