import { Attractions } from '@/components/landing/attractions';
import { Footer } from '@/components/landing/footer';
import { Header } from '@/components/landing/header';

export default function AtraccionesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 pt-20">
        <Attractions />
      </main>
      <Footer />
    </div>
  );
}
