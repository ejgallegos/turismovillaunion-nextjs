
'use client';

import React from 'react';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import type { Attraction } from '@/lib/atractivos.service';
import { EmptyState } from '../empty-state';
import { Swiper, SwiperSlide } from 'swiper/react';
import { plainTextFromSlate } from '@/lib/slate-helpers';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';

// import required modules
import { EffectCoverflow, Pagination, Autoplay } from 'swiper/modules';

interface AtractivosProps {
  attractions: Attraction[];
  isPage?: boolean;
}

export function Atractivos({ attractions, isPage = false }: AtractivosProps) {

  if (!attractions || attractions.length === 0) {
    return (
        <section id="atractivos" className="w-full bg-secondary py-20 lg:py-28">
            <div className="container mx-auto px-4 md:px-6">
                <EmptyState title="No hay atractivos" description="Aún no se han añadido atractivos. Vuelve a consultar más tarde." />
            </div>
        </section>
    );
  }

  return (
    <section id="atractivos" className="w-full bg-secondary py-20 lg:py-28">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-12 text-center">
          <h2 className="font-headline text-3xl font-bold tracking-tight text-primary md:text-4xl">
            Descubre Nuestras Maravillas
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Descubre las maravillas naturales de nuestro Departamento Felipe Varela. Explora nuestros mejores atractivos. Y conoce uno de los destinos más impresionantes de Argentina.
          </p>
        </div>
        
        {isPage ? (
           <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
             {attractions.map((attraction) => (
                <Card key={attraction.id} className="flex transform flex-col overflow-hidden rounded-lg shadow-lg transition-transform duration-300 hover:-translate-y-2">
                    <Link href={`/atractivos/${attraction.id}`} className="block">
                        <div className="relative h-56 w-full">
                        <Image
                            src={attraction.imageUrl}
                            alt={`Imagen de ${attraction.title}`}
                            fill
                            className="object-cover"
                        />
                        </div>
                    </Link>
                    <div className="flex flex-grow flex-col items-start p-6">
                        <h2 className="mt-2 font-headline text-xl font-bold">
                            <Link href={`/atractivos/${attraction.id}`} className="hover:underline">{attraction.title}</Link>
                        </h2>
                        <p className="mt-2 flex-grow text-base text-muted-foreground line-clamp-3">
                            {plainTextFromSlate(attraction.description)}
                        </p>
                    </div>
                    <div className="flex justify-end p-6 pt-0">
                        <Button variant="link" className="text-accent" asChild>
                        <Link href={`/atractivos/${attraction.id}`}>
                            Leer más <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                        </Button>
                    </div>
                </Card>
             ))}
           </div>
        ) : (
            <Swiper
                effect={'coverflow'}
                grabCursor={true}
                centeredSlides={true}
                slidesPerView={'auto'}
                loop={true}
                autoplay={{
                delay: 5000,
                disableOnInteraction: false,
                }}
                coverflowEffect={{
                rotate: 50,
                stretch: 0,
                depth: 100,
                modifier: 1,
                slideShadows: true,
                }}
                pagination={{ clickable: true }}
                modules={[EffectCoverflow, Pagination, Autoplay]}
                className="w-full pb-12"
            >
            {attractions.map((attraction) => (
                <SwiperSlide key={attraction.id} className="!w-[300px] md:!w-[400px]">
                    <Card className="overflow-hidden rounded-lg shadow-lg">
                        <div className="relative h-80 w-full">
                            <Image
                                src={attraction.imageUrl}
                                alt={`Imagen de ${attraction.title}`}
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            <div className="absolute bottom-4 left-0 w-full p-6 flex justify-between items-end">
                                <h3 className="font-headline text-2xl font-semibold text-white drop-shadow-md max-w-[70%]">{attraction.title}</h3>
                                <Button size="sm" asChild>
                                    <Link href={`/atractivos/${attraction.id}`}>
                                    Conocer <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </Card>
                </SwiperSlide>
            ))}
            </Swiper>
        )}
      </div>
    </section>
  );
}
