import { Header } from '@/components/landing/header';
import { Hero } from '@/components/landing/hero';
import { Attractions } from '@/components/landing/attractions';
import { Footer } from '@/components/landing/footer';
import { Gallery } from '@/components/landing/gallery';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <Attractions />
        <Gallery />
      </main>
      <Footer />
    </div>
  );
}
