import type { Metadata } from 'next';
import { InteractiveMap } from '@/components/landing/interactive-map';
import { Footer } from '@/components/landing/footer';
import { Header } from '@/components/landing/header';
import { getLugaresMapa, getTipsMapa, getColectivosMapa } from '@/lib/admin-mapa.service';

export const metadata: Metadata = {
  title: 'Mapa Interactivo - Villa Unión',
  description: 'Explora Villa Unión en el mapa interactivo. Descubrí atractivos turísticos, el clima actual y cómo llegar.',
};

export const dynamic = 'force-dynamic';

export default async function MapaInteractivoPage() {
  const [lugares, tips, colectivos] = await Promise.all([
    getLugaresMapa(),
    getTipsMapa(),
    getColectivosMapa(),
  ]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <InteractiveMap 
          initialLugares={lugares}
          initialTips={tips}
          initialColectivos={colectivos}
        />
      </main>
      <Footer />
    </div>
  );
}
