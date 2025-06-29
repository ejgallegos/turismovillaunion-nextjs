import { Events } from '@/components/landing/events';
import { Footer } from '@/components/landing/footer';
import { Header } from '@/components/landing/header';

export default function EventosPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Events />
      </main>
      <Footer />
    </div>
  );
}
