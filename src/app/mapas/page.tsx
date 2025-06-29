import { Maps } from '@/components/landing/maps';
import { Footer } from '@/components/landing/footer';
import { Header } from '@/components/landing/header';

export default function MapasPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Maps />
      </main>
      <Footer />
    </div>
  );
}
