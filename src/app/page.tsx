import type { Metadata } from 'next';
import { Header } from '@/components/landing/header';
import { Hero } from '@/components/landing/hero';
import { Footer } from '@/components/landing/footer';
import { getAttractions } from '@/lib/atractivos.service';
import { getServicios } from '@/lib/servicios.service';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Star, Wine, Footprints, Car, MapPin } from 'lucide-react';
import { Logo } from '@/components/icons';

export const metadata: Metadata = {
  title: "Secretaría de Turismo Gral. Felipe Varela - Puerta de Entrada a Talampaya",
  description: "Tu puerta de entrada a la inmensidad de Talampaya y los secretos del Triásico. Descubrí los mejores destinos, experiencias y planes en Villa Unión, La Rioja, Argentina.",
};

export default async function Home() {
  const attractions = await getAttractions();
  const servicios = await getServicios();

  const featuredAttractions = attractions.slice(0, 3);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        
        {/* Featured Destinations Section */}
        <section className="w-full py-16 md:py-24 lg:py-32">
          <div className="max-w-7xl mx-auto px-6 md:px-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 md:mb-12">
              <div>
                <h2 className="text-primary font-bold tracking-widest uppercase text-sm mb-3">Próximos Aventuras</h2>
                <h3 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight">Destinos Destacados</h3>
              </div>
              <Link href="/atractivos" className="text-primary font-bold flex items-center gap-2 hover:underline hidden md:flex">
                Ver todos <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {featuredAttractions.map((attraction) => (
                <Link href={`/atractivos/${attraction.id}`} key={attraction.id} className="group relative h-[350px] md:h-[500px] rounded-xl overflow-hidden shadow-2xl transition-transform hover:-translate-y-2">
                  <Image
                    src={attraction.imageUrl}
                    alt={attraction.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-4 md:p-8">
                    <h4 className="text-white text-xl md:text-2xl font-bold mb-2">{attraction.title}</h4>
                    <p className="text-white/70 text-sm line-clamp-2 mb-4">
                      {(() => {
                        try {
                          if (attraction.description && typeof attraction.description === 'string' && attraction.description.startsWith('[')) {
                            const parsed = JSON.parse(attraction.description);
                            return parsed.map((block: { children?: { text?: string }[] }) => 
                              block.children?.map((child) => child.text).join('') || ''
                            ).join(' ');
                          }
                          return attraction.description || 'Descubre este increíble destino en Villa Unión';
                        } catch {
                          return attraction.description || 'Descubre este increíble destino en Villa Unión';
                        }
                      })()}
                    </p>
                    <span className="bg-white/20 hover:bg-white text-white hover:text-primary px-4 py-2 rounded-lg text-xs font-bold transition-colors inline-block min-h-[44px] flex items-center">
                      Ver más
                    </span>
                  </div>
                </Link>
              ))}
              
              {featuredAttractions.length === 0 && (
                <>
                  <div className="group relative h-[350px] md:h-[500px] rounded-xl overflow-hidden shadow-2xl">
                    <Image src="/images/Banner/slider/home-slider-sec-turismo.png" alt="Talampaya" fill className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 p-4 md:p-8">
                      <h4 className="text-white text-xl md:text-2xl font-bold mb-2">Parque Nacional Talampaya</h4>
                      <p className="text-white/70 text-sm line-clamp-2 mb-4">Patrimonio Mundial con impresionantes formaciones de arenisca roja.</p>
                    </div>
                  </div>
                  <div className="group relative h-[350px] md:h-[500px] rounded-xl overflow-hidden shadow-2xl">
                    <Image src="/images/Banner/slider/home-slider-sec-turismo.png" alt="Ischigualasto" fill className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 p-4 md:p-8">
                      <h4 className="text-white text-xl md:text-2xl font-bold mb-2">Ischigualasto</h4>
                      <p className="text-white/70 text-sm line-clamp-2 mb-4">Conocido como el Valle de la Luna.</p>
                    </div>
                  </div>
                  <div className="group relative h-[350px] md:h-[500px] rounded-xl overflow-hidden shadow-2xl">
                    <Image src="/images/Banner/slider/home-slider-sec-turismo.png" alt="Cañón del Triásico" fill className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 p-4 md:p-8">
                      <h4 className="text-white text-xl md:text-2xl font-bold mb-2">Cañón del Triásico</h4>
                      <p className="text-white/70 text-sm line-clamp-2 mb-4">Una gema oculta para amantes de la naturaleza.</p>
                    </div>
                  </div>
                </>
              )}
            </div>
            
            <div className="mt-8 text-center md:hidden">
              <Button asChild className="bg-primary">
                <Link href="/atractivos">Ver todos los destinos</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Experiences Section */}
        <section className="w-full bg-primary/5 rounded-xl p-6 md:p-16 lg:p-20 my-8">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="text-primary font-bold tracking-widest uppercase text-sm mb-3">Vive la Región</h2>
            <h3 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight">Experiencias Inolvidables</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            <div className="bg-white dark:bg-background-dark p-6 md:p-8 rounded-xl shadow-sm border border-primary/10 hover:border-primary transition-colors text-center group">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                <Star className="text-3xl md:text-4xl" />
              </div>
              <h5 className="text-xl font-bold mb-3">Astroturismo</h5>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Contemplá el cielo más puro de Argentina bajo las estrellas de Talampaya.</p>
            </div>
            
            <div className="bg-white dark:bg-background-dark p-6 md:p-8 rounded-xl shadow-sm border border-primary/10 hover:border-primary transition-colors text-center group">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                <Wine className="text-3xl md:text-4xl" />
              </div>
              <h5 className="text-lg md:text-xl font-bold mb-3">Enoturismo</h5>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Rutas del vino de altura con catas exclusivas en bodegas boutique locales.</p>
            </div>
            
            <div className="bg-white dark:bg-background-dark p-6 md:p-8 rounded-xl shadow-sm border border-primary/10 hover:border-primary transition-colors text-center group">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                <Footprints className="text-3xl md:text-4xl" />
              </div>
              <h5 className="text-lg md:text-xl font-bold mb-3">Trekking</h5>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Senderos de baja y alta dificultad a través de formaciones geológicas únicas.</p>
            </div>
            
            <div className="bg-white dark:bg-background-dark p-6 md:p-8 rounded-xl shadow-sm border border-primary/10 hover:border-primary transition-colors text-center group">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                <Car className="text-3xl md:text-4xl" />
              </div>
              <h5 className="text-lg md:text-xl font-bold mb-3">Aventura</h5>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Expediciones 4x4 y travesías por el corazón de la Cordillera de los Andes.</p>
            </div>
          </div>
        </section>

        {/* Plan Your Trip Section */}
        <section className="w-full py-16 md:py-24 lg:py-32">
          <div className="max-w-7xl mx-auto px-6 md:px-10">
            <div className="mb-10 md:mb-12">
              <h2 className="text-primary font-bold tracking-widest uppercase text-sm mb-3">Tu Viaje Comienza Aquí</h2>
              <h3 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight">Planifica Tu Viaje</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Alojamiento Card */}
              <div className="bg-primary/5 dark:bg-primary/20 p-6 md:p-10 rounded-xl flex flex-col justify-between min-h-[350px] md:min-h-[400px]">
                <div>
                  <div className="w-14 h-14 md:w-16 md:h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4 md:mb-6">
                    <svg className="w-7 h-7 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <h4 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">Alojamiento</h4>
                  <p className="text-slate-600 dark:text-slate-300 text-sm">Encontrá el alojamiento perfecto, desde hoteles boutique hasta cabañas rústicas en el corazón del valle.</p>
                </div>
                <Button asChild className="flex items-center gap-2 font-bold text-primary group bg-transparent hover:bg-transparent p-0 mt-6 min-h-[44px]">
                  <Link href="/servicios">
                    Buscar <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                  </Link>
                </Button>
              </div>
              
              {/* Gastronomía Card */}
              <div className="bg-primary/10 dark:bg-primary/30 p-6 md:p-10 rounded-xl flex flex-col justify-between min-h-[350px] md:min-h-[400px]">
                <div>
                  <div className="w-14 h-14 md:w-16 md:h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4 md:mb-6">
                    <svg className="w-7 h-7 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h4 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">Gastronomía</h4>
                  <p className="text-slate-600 dark:text-slate-300 text-sm">Probá los sabores auténticos de La Rioja. Empanadas tradicionales, locro y el mejor Torrontés.</p>
                </div>
                <Button asChild className="flex items-center gap-2 font-bold text-primary group bg-transparent hover:bg-transparent p-0 mt-6 min-h-[44px]">
                  <Link href="/servicios">
                    Guía Gastronómica <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                  </Link>
                </Button>
              </div>
              
              {/* Mapa Interactivo Card */}
              <Link href="/mapa-interactivo" className="relative overflow-hidden rounded-xl min-h-[350px] md:min-h-[400px] group">
                <Image 
                  alt="Mapa Regional" 
                  src="/images/Banner/slider/home-slider-sec-turismo.png"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-primary/40 backdrop-blur-[2px] p-6 md:p-10 flex flex-col justify-between">
                  <div>
                    <div className="w-14 h-14 md:w-16 md:h-16 bg-white/20 text-white rounded-full flex items-center justify-center mb-4 md:mb-6">
                      <MapPin className="w-7 h-7 md:w-8 md:h-8" />
                    </div>
                    <h4 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 text-white">Mapa Interactivo</h4>
                    <p className="text-white/90 text-sm">Encontrá los principales atractivos, miradores y estaciones de servicio de la región.</p>
                  </div>
                  <Button className="bg-white text-primary px-4 md:px-6 py-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-accent hover:text-white transition-colors w-full mt-6 min-h-[44px]">
                    Abrir Mapa <ArrowRight className="h-5 w-5" />
                  </Button>
                </div>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
