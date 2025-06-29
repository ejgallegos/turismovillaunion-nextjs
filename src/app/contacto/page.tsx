import { Contact } from '@/components/landing/contact';
import { Footer } from '@/components/landing/footer';
import { Header } from '@/components/landing/header';

export default function ContactoPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 pt-20">
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
