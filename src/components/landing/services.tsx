
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getServicios, Servicio } from '@/lib/servicios.service';
import { getLocalidades, Localidad } from '@/lib/localidades.service';
import Link from 'next/link';
import { EmptyState } from '../empty-state';
import { Download, FileText } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '../ui/button';

export async function Services() {
  const [services, localidades] = await Promise.all([
    getServicios(),
    getLocalidades()
  ]);

  const servicesByLocalidad = localidades.map(localidad => ({
    ...localidad,
    services: services.filter(s => s.localidadId === localidad.id)
  })).filter(l => l.services.length > 0);

  return (
    <section id="servicios" className="w-full bg-secondary py-20 lg:py-28">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-12 text-center">
          <h2 className="font-headline text-3xl font-bold tracking-tight text-primary md:text-4xl">
            Servicios Turísticos
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Encuentra guías y listados de servicios en formato PDF para cada una de nuestras localidades.
          </p>
        </div>
        <div className="max-w-4xl mx-auto">
          {servicesByLocalidad.length > 0 ? (
            <Accordion type="multiple" className="w-full">
              {servicesByLocalidad.map(localidad => (
                <AccordionItem value={localidad.id} key={localidad.id}>
                  <AccordionTrigger className="text-xl font-headline hover:no-underline">
                    {localidad.title}
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="grid grid-cols-1 gap-4 pt-4 sm:grid-cols-2 lg:grid-cols-3">
                        {localidad.services.map(service => (
                            <Card key={service.id}>
                                <CardContent className="p-4 flex flex-col items-center text-center gap-3 h-full">
                                    <FileText className="h-8 w-8 text-primary" />
                                    <h3 className="font-semibold flex-grow">{service.title}</h3>
                                    <Button asChild className="w-full mt-auto" size="sm">
                                        <Link href={service.downloadUrl} target="_blank" rel="noopener noreferrer">
                                            <Download className="mr-2 h-4 w-4" />
                                            Descargar PDF
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <EmptyState title="No hay servicios" description="Aún no se han añadido documentos de servicios. Vuelve a consultar más tarde." />
          )}
        </div>
      </div>
    </section>
  );
}
