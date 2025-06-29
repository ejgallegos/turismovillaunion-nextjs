import type { Metadata } from 'next';
import { Contact } from '@/components/landing/contact';
import { Footer } from '@/components/landing/footer';
import { Header } from '@/components/landing/header';

export const metadata: Metadata = {
  title: 'Contacto | Villa Unión del Talampaya',
  description: 'Ponte en contacto con la Secretaría de Turismo de Villa Unión. Resuelve tus dudas y planifica tu viaje a este increíble destino en La Rioja, Argentina.',
};

export default function ContactoPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
