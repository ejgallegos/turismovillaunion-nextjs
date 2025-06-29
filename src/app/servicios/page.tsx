import { Services } from '@/components/landing/services';
import { Footer } from '@/components/landing/footer';
import { Header } from '@/components/landing/header';

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
