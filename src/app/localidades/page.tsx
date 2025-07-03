import type { Metadata } from 'next';
import { Localidades } from '@/components/landing/localidades';
import { Footer } from '@/components/landing/footer';
import { Header } from '@/components/landing/header';

export const metadata: Metadata = {
  title: 'Localidades | Villa Unión del Talampaya',
  description: 'Descubre los pueblos y parajes que componen el Corredor del Bermejo. Cada localidad tiene una historia que contar.',
};

export default function LocalidadesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Localidades />
      </main>
      <Footer />
    </div>
  );
}
