import type { Metadata } from 'next';
import { Events } from '@/components/landing/events';
import { Footer } from '@/components/landing/footer';
import { Header } from '@/components/landing/header';

export const metadata: Metadata = {
  title: 'Eventos y Festivales | Villa Unión del Talampaya',
  description: 'Descubre los próximos eventos en Villa Unión. Desde el Festival Nacional del Pimiento hasta caminatas bajo la luna llena en Talampaya.',
};

export default function EventosPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Events />
      </main>
      <Footer />
    </div>
  );
}
