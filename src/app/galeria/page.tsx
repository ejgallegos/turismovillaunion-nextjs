import { Footer } from '@/components/landing/footer';
import { Gallery } from '@/components/landing/gallery';
import { Header } from '@/components/landing/header';

export default function GaleriaPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 pt-20">
        <Gallery />
      </main>
      <Footer />
    </div>
  );
}
