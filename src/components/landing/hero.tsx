'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import React from 'react';
import Autoplay from 'embla-carousel-autoplay';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';

const heroSlides = [
  {
    src: 'https://placehold.co/1920x1080.png',
    alt: 'Vista panorámica del Cañón de Talampaya al atardecer',
    hint: 'canyon sunset',
    title: 'Villa Unión del Talampaya',
    subtitle: 'Donde la naturaleza esculpió obras maestras en piedra y el tiempo se detiene.',
    buttonText: 'Explora Ahora',
    buttonLink: '#attractions',
  },
  {
    src: 'https://placehold.co/1920x1080.png',
    alt: 'Vista de la Laguna Brava con flamencos',
    hint: 'salt lake',
    title: 'Descubre la Mágica Laguna Brava',
    subtitle: 'Un espejo de sal en el corazón de los Andes.',
    buttonText: 'Ver Atracciones',
    buttonLink: '/atracciones',
  },
  {
    src: 'https://placehold.co/1920x1080.png',
    alt: 'La sinuosa Cuesta de Miranda',
    hint: 'winding road',
    title: 'Aventúrate en la Cuesta de Miranda',
    subtitle: 'Un camino de colores y vistas que te quitarán el aliento.',
    buttonText: 'Ver Más',
    buttonLink: '/atracciones',
  },
];

export function Hero() {
  const plugin = React.useRef(Autoplay({ delay: 5000, stopOnInteraction: true }));

  return (
    <Carousel
      plugins={[plugin.current]}
      className="relative -mt-20 w-full h-screen"
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselContent>
        {heroSlides.map((slide, index) => (
          <CarouselItem key={index}>
            <section className="relative flex h-screen w-full items-center justify-center">
              <div className="absolute inset-0 z-0">
                <Image
                  src={slide.src}
                  alt={slide.alt}
                  data-ai-hint={slide.hint}
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
                <div className="absolute inset-0 bg-black/50" />
              </div>
              <div className="relative z-10 flex flex-col items-center text-center text-white p-4">
                <h1 className="font-headline text-4xl font-bold tracking-tight sm:text-6xl md:text-7xl">
                  {slide.title}
                </h1>
                <p className="mt-4 max-w-2xl text-lg text-primary-foreground/90 md:text-xl">
                  {slide.subtitle}
                </p>
                <div className="mt-8 flex gap-4">
                  <Button size="lg" asChild>
                    <Link href={slide.buttonLink}>{slide.buttonText}</Link>
                  </Button>
                </div>
              </div>
            </section>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
