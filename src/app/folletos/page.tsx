import type { Metadata } from 'next';
import { Brochures } from '@/components/landing/brochures';
import { Footer } from '@/components/landing/footer';
import { Header } from '@/components/landing/header';

export const metadata: Metadata = {
  title: 'Folletos y Guías | Villa Unión del Talampaya',
  description: 'Descarga folletos, guías y mapas en PDF de Villa Unión y sus alrededores para planificar tu viaje.',
};

export default function FolletosPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Brochures />
      </main>
      <Footer />
    </div>
  );
}
