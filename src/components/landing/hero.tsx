import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function Hero() {
  return (
    <section className="relative -mt-20 flex h-screen w-full items-center justify-center">
      <div className="absolute inset-0 z-0">
        <Image
          src="https://placehold.co/1920x1080.png"
          alt="Panoramic view of the Talampaya Canyon at sunset"
          data-ai-hint="canyon sunset"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>
      <div className="relative z-10 flex flex-col items-center text-center text-white">
        <h1 className="font-headline text-4xl font-bold tracking-tight sm:text-6xl md:text-7xl">
          Villa Unión del Talampaya
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-primary-foreground/90 md:text-xl">
          Where nature sculpted masterpieces in stone and time stands still.
        </p>
        <div className="mt-8 flex gap-4">
          <Button size="lg" asChild>
            <Link href="#attractions">Explore Now</Link>
          </Button>
          <Button size="lg" variant="secondary" asChild>
            <Link href="#contact">Plan Your Trip</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
