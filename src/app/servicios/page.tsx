import type { Metadata } from 'next';
import { Services } from '@/components/landing/services';
import { Footer } from '@/components/landing/footer';
import { Header } from '@/components/landing/header';
import { getServicios } from '@/lib/servicios.service';
import { getLocalidades } from '@/lib/localidades.service';

export const metadata: Metadata = {
  title: 'Servicios Turísticos | Villa Unión del Talampaya',
  description: 'Encuentra toda la información sobre alojamiento, gastronomía, excursiones y otros servicios turísticos en Villa Unión.',
};

export const dynamic = 'force-dynamic';

export default async function ServiciosPage() {
  const [services, localidades] = await Promise.all([
    getServicios(),
    getLocalidades()
  ]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Services services={services} localidades={localidades} />
      </main>
      <Footer />
    </div>
  );
}
