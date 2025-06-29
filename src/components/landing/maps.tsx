import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Download, MapPin } from 'lucide-react';
import Link from 'next/link';

export function Maps() {
  return (
    <section id="mapas" className="w-full py-20 lg:py-28">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-12 text-center">
          <h2 className="font-headline text-3xl font-bold tracking-tight text-primary md:text-4xl">
            Mapas de la Región
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Encuentra tu camino y explora cada rincón de Villa Unión y sus alrededores.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8">
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="relative aspect-video w-full">
                <Image
                  src="https://placehold.co/1200x600.png"
                  alt="Mapa interactivo de Villa Unión"
                  data-ai-hint="region map"
                  fill
                  className="object-cover"
                />
                 <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <div className="text-center text-white">
                    <MapPin className="h-16 w-16 mx-auto text-white" />
                    <h3 className="mt-4 text-2xl font-bold">Mapa Interactivo Próximamente</h3>
                    <p className="mt-2">Mientras tanto, descarga nuestros mapas en PDF.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
             <Card>
                <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                    <h3 className="font-headline text-xl font-bold">Mapa de Villa Unión</h3>
                    <p className="text-muted-foreground">Un mapa detallado del centro de la ciudad y sus principales servicios.</p>
                    <Button asChild>
                        <Link href="#">
                            <Download className="mr-2 h-4 w-4" />
                            Descargar PDF
                        </Link>
                    </Button>
                </CardContent>
             </Card>
             <Card>
                <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                    <h3 className="font-headline text-xl font-bold">Mapa de Atractivos</h3>
                    <p className="text-muted-foreground">Ubicación de Talampaya, Laguna Brava, Cuesta de Miranda y más.</p>
                    <Button asChild>
                        <Link href="#">
                            <Download className="mr-2 h-4 w-4" />
                            Descargar PDF
                        </Link>
                    </Button>
                </CardContent>
             </Card>
             <Card>
                <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                    <h3 className="font-headline text-xl font-bold">Mapa de Rutas</h3>
                    <p className="text-muted-foreground">Principales rutas y caminos para llegar y moverte por la región.</p>
                    <Button asChild>
                        <Link href="#">
                            <Download className="mr-2 h-4 w-4" />
                            Descargar PDF
                        </Link>
                    </Button>
                </CardContent>
             </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
