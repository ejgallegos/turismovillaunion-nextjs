import type { Metadata } from 'next';
import { Header } from '@/components/landing/header';
import { Hero } from '@/components/landing/hero';
import { Atractivos } from '@/components/landing/attractions';
import { Footer } from '@/components/landing/footer';

export const metadata: Metadata = {
	title: "Secretaría de Turismo del Dpto. Felipe Varela",
	description:
		"Descubre las maravillas naturales de nuestro Departamento Felipe Varela. Explora nuestros mejores atractivos. Y conoce uno de los destinos más impresionantes de Argentina.",
};

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <Atractivos />
      </main>
      <Footer />
    </div>
  );
}
