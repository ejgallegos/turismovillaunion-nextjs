import { Atractivos } from '@/components/landing/attractions';
import { Footer } from '@/components/landing/footer';
import { Header } from '@/components/landing/header';

export default function AtractivosPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Atractivos />
      </main>
      <Footer />
    </div>
  );
}
