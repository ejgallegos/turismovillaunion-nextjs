import type { Metadata } from 'next';
import { Services } from '@/components/landing/services';
import { Footer } from '@/components/landing/footer';
import { Header } from '@/components/landing/header';

export const metadata: Metadata = {
  title: 'Servicios Turísticos | Villa Unión del Talampaya',
  description: 'Encuentra toda la información sobre alojamiento, gastronomía, excursiones y otros servicios turísticos en Villa Unión.',
};

export default function ServiciosPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Services />
      </main>
      <Footer />
    </div>
  );
}
