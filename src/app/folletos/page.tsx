import { Brochures } from '@/components/landing/brochures';
import { Footer } from '@/components/landing/footer';
import { Header } from '@/components/landing/header';

export default function FolletosPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Brochures />
      </main>
      <Footer />
    </div>
  );
}
