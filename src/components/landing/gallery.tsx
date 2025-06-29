'use client';

import Image from 'next/image';
import React from 'react';
import Autoplay from 'embla-carousel-autoplay';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

const galleryImages = [
  {
    src: 'https://placehold.co/1200x600.png',
    alt: 'Paredes del cañón de Talampaya',
    hint: 'canyon walls',
  },
  {
    src: 'https://placehold.co/1200x600.png',
    alt: 'Vicuñas en Laguna Brava',
    hint: 'wildlife lagoon',
  },
  {
    src: 'https://placehold.co/1200x600.png',
    alt: 'La sinuosa Cuesta de Miranda',
    hint: 'mountain road',
  },
  {
    src: 'https://placehold.co/1200x600.png',
    alt: 'Formación rocosa conocida como "El Monje"',
    hint: 'rock formation',
  },
  {
    src: 'https://placehold.co/1200x600.png',
    alt: 'Flamencos en la laguna de altura',
    hint: 'flamingos lagoon',
  },
];

export function Gallery() {
  const plugin = React.useRef(Autoplay({ delay: 5000, stopOnInteraction: true }));

  return (
    <section className="w-full py-20 lg:py-28">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-12 text-center">
          <h2 className="font-headline text-3xl font-bold tracking-tight text-primary md:text-4xl">
            Viaje Visual
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Experimenta la impresionante belleza de nuestros paisajes a través de nuestro lente.
          </p>
        </div>
        <Carousel
          plugins={[plugin.current]}
          className="w-full max-w-4xl mx-auto"
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
          opts={{ loop: true }}
        >
          <CarouselContent className="-ml-0">
            {galleryImages.map((image, index) => (
              <CarouselItem key={index} className="pl-0">
                <div className="relative aspect-video overflow-hidden rounded-lg shadow-lg">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    data-ai-hint={image.hint}
                    fill
                    className="object-cover"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </section>
  );
}
