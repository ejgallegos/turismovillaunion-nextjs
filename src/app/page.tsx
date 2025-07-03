import type { Metadata } from 'next';
import { Header } from '@/components/landing/header';
import { Hero } from '@/components/landing/hero';
import { Atractivos } from '@/components/landing/attractions';
import { Footer } from '@/components/landing/footer';
import { News } from '@/components/landing/news';

export const metadata: Metadata = {
  title: 'Villa Unión del Talampaya | Tu Aventura te Espera',
  description: 'Descubre las maravillas naturales de Villa Unión. Explora el Parque Nacional Talampaya, Laguna Brava y más. Conoce uno de los destinos más impresionantes de Argentina.',
};

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <Atractivos />
        <News />
      </main>
      <Footer />
    </div>
  );
}
