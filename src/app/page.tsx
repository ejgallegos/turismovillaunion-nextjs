import type { Metadata } from 'next';
import { Header } from '@/components/landing/header';
import { Hero } from '@/components/landing/hero';
import { Atractivos } from '@/components/landing/attractions';
import { Footer } from '@/components/landing/footer';
import { News } from '@/components/landing/news';
import { getAttractions } from '@/lib/atractivos.service';

export const metadata: Metadata = {
	title: "Secretaría de Turismo del Dpto. Felipe Varela",
	description:
		"Descubre las maravillas naturales de nuestro Departamento Felipe Varela. Explora nuestros mejores atractivos. Y conoce uno de los destinos más impresionantes de Argentina.",
};

export default async function Home() {
  const attractions = await getAttractions();

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <Atractivos attractions={attractions} />
        <News />
      </main>
      <Footer />
    </div>
  );
}
