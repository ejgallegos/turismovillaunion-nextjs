'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// import required modules
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules';

import { getHeroSlidesData } from './actions';
import { Skeleton } from '../ui/skeleton';

interface HeroSlide {
  src: string;
  alt: string;
  hint: string;
  title: string;
  subtitle: string;
  buttonText?: string;
  buttonLink: string;
}

const HeroSkeleton = () => (
    <div className="relative flex h-full w-full items-center justify-center">
        <Skeleton className="absolute inset-0 z-0" />
        <div className="relative z-10 flex flex-col items-center p-4 text-center">
            <Skeleton className="h-16 w-3/4 mb-4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-11 w-32 mt-8" />
        </div>
    </div>
);

export function Hero() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getHeroSlidesData();
        setSlides(data);
      } catch (error) {
        console.error("Failed to fetch hero slides data", error);
        setSlides([
			{
				src: "/images/Banner/slider/home-slider-sec-turismo.png",
				alt: "Paisaje de Talampaya",
				hint: "canyon sunset",
				title: "Secretaría de Turismo Felipe Varela",
				subtitle:
					"Tierra de tradiciones y paisajes apasionantes que no podes dejar de visitar.",
				buttonText: "Explora Ahora",
				buttonLink: "#atractivos",
			},
		]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
      return (
          <section className="relative h-[calc(100vh-theme(spacing.20))] w-full">
              <HeroSkeleton />
          </section>
      );
  }

  if (slides.length === 0) {
      return (
        <section className="relative h-[calc(100vh-theme(spacing.20))] w-full">
            <div className="relative flex h-full w-full items-center justify-center">
              <div className="absolute inset-0 z-0">
                <Image
                  src="/images/Banner/slider/home-slider-sec-turismo.png"
                  alt="Paisaje de Talampaya"
                  data-ai-hint="canyon sunset"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-black/25" />
              </div>
              <div className="relative z-10 flex flex-col items-center p-4 text-center text-white">
                <h1 className="font-headline text-4xl font-bold tracking-tight sm:text-6xl md:text-7xl">
                    Bienvenido a Villa Unión
                </h1>
                <p className="mt-4 max-w-2xl text-lg text-white/90 md:text-xl">
                    Añada elementos al slider desde el panel de administración para comenzar.
                </p>
                <div className="mt-8 flex gap-4">
                  <Button size="lg" asChild>
                    <Link href="#atractivos">Explorar</Link>
                  </Button>
                </div>
              </div>
            </div>
        </section>
      );
  }

  return (
    <section className="relative h-[calc(100vh-theme(spacing.20))] w-full">
      <Swiper
        spaceBetween={30}
        effect={'fade'}
        fadeEffect={{ crossFade: true }}
        centeredSlides={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        loop={slides.length > 1}
        modules={[Autoplay, Pagination, Navigation, EffectFade]}
        className="h-full w-full"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="relative flex h-full w-full items-center justify-center">
              <div className="absolute inset-0 z-0">
                <Image
                  src={slide.src}
                  alt={slide.alt}
                  data-ai-hint={slide.hint}
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
                <div className="absolute inset-0 bg-black/25" />
              </div>
              <div className="relative z-10 flex flex-col items-center p-4 text-center text-white">
                <h1 className="font-headline text-4xl font-bold tracking-tight sm:text-6xl md:text-7xl">
                  {slide.title}
                </h1>
                <p className="mt-4 max-w-2xl text-lg text-white/90 md:text-xl line-clamp-3">
                  {slide.subtitle}
                </p>
                {slide.buttonText && (
                  <div className="mt-8 flex gap-4">
                    <Button size="lg" asChild>
                      <Link href={slide.buttonLink}>{slide.buttonText}</Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
