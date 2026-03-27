'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules';

import { getHeroSlidesData } from './actions';
import { Skeleton } from '../ui/skeleton';
import { ChevronDown } from 'lucide-react';

interface HeroSlide {
  src: string;
  alt: string;
  hint: string;
  title: string;
  subtitle: string;
  buttonText?: string;
  buttonUrl?: string;
  showButton?: boolean;
}

const HeroSkeleton = () => (
  <div className="relative flex h-screen w-full items-center justify-center">
    <Skeleton className="absolute inset-0 z-0" />
    <div className="relative z-10 flex flex-col items-center p-4 text-center">
      <Skeleton className="h-20 w-3/4 mb-4" />
      <Skeleton className="h-8 w-1/2 mb-2" />
      <Skeleton className="h-6 w-1/3 mb-8" />
      <Skeleton className="h-14 w-48" />
    </div>
  </div>
);

export function Hero() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

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
            title: "Villa Unión",
            subtitle: "Tu puerta de entrada a la inmensidad de Talampaya y los secretos del Triásico.",
            buttonText: "Explorar Destinos",
            buttonUrl: "/atractivos",
            showButton: true,
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
      <section className="relative h-screen w-full">
        <HeroSkeleton />
      </section>
    );
  }

  const defaultSlide = {
    src: "/images/Banner/slider/home-slider-sec-turismo.png",
    alt: "Parque Nacional Talampaya",
    hint: "canyon red walls",
    title: "Villa Unión",
    subtitle: "Tu puerta de entrada a la inmensidad de Talampaya y los secretos del Triásico.",
    buttonText: "Explorar Destinos",
    buttonUrl: "/atractivos",
    showButton: true,
  };

  const displaySlides = slides.length > 0 ? slides : [defaultSlide];
  const activeSlide = displaySlides[activeIndex] || defaultSlide;

  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-secondary-foreground z-10" />
        <Swiper
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
          loop={displaySlides.length > 1}
          modules={[Autoplay, Pagination, EffectFade]}
          className="h-full w-full"
          onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        >
          {displaySlides.map((slide, index) => (
            <SwiperSlide key={index}>
              <Image
                src={slide.src}
                alt={slide.alt}
                data-ai-hint={slide.hint}
                fill
                className="object-cover"
                sizes="100vw"
                priority={index === 0}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      
      <div className="relative z-20 text-center px-4 max-w-4xl">
        {activeSlide.title && activeSlide.title !== "Villa Unión" ? (
          <>
            <h1 className="text-white text-3xl md:text-6xl lg:text-7xl font-black mb-4 md:mb-6 leading-tight tracking-tighter">
              {activeSlide.title}
            </h1>
            <p className="text-white/90 text-base md:text-xl font-light mb-8 md:mb-10 max-w-2xl mx-auto">
              {activeSlide.subtitle}
            </p>
          </>
        ) : (
          <>
            <h1 className="text-white text-4xl md:text-7xl lg:text-8xl font-black mb-4 md:mb-6 leading-tight tracking-tighter">
              Descubrí <br /><span className="text-accent">Villa Unión</span>
            </h1>
            <p className="text-white/90 text-base md:text-2xl font-light mb-8 md:mb-10 max-w-2xl mx-auto">
              {activeSlide.subtitle || defaultSlide.subtitle}
            </p>
          </>
        )}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
          {((activeSlide.showButton !== undefined && activeSlide.showButton) || (activeSlide.showButton === undefined && defaultSlide.showButton)) && (
            <Button asChild className="w-full md:w-auto bg-primary hover:bg-primary/90 text-white px-8 md:px-10 py-4 md:py-5 rounded-xl text-base md:text-lg font-bold transition-all transform hover:scale-105 min-h-[48px]">
              <Link href={activeSlide.buttonUrl || defaultSlide.buttonUrl}>
                {activeSlide.buttonText || defaultSlide.buttonText}
              </Link>
            </Button>
          )}
        </div>
      </div>
      
      <div className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 z-20 animate-bounce">
        <ChevronDown className="text-white text-3xl md:text-4xl" />
      </div>
    </section>
  );
}
