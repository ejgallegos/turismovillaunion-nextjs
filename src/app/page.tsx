import { Header } from '@/components/landing/header';
import { Hero } from '@/components/landing/hero';
import { Attractions } from '@/components/landing/attractions';
import { Gallery } from '@/components/landing/gallery';
import { Events } from '@/components/landing/events';
import { Contact } from '@/components/landing/contact';
import { Footer } from '@/components/landing/footer';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <Attractions />
        <Gallery />
        <Events />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
