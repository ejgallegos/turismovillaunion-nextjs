'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import type { Servicio } from '@/lib/servicios.service';
import type { Localidad } from '@/lib/localidades.service';
import Link from 'next/link';
import { EmptyState } from '../empty-state';
import { Download, FileText, MapPin } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';

interface ServicesProps {
  services: Servicio[];
  localidades: Localidad[];
}

export function Services({ services, localidades }: ServicesProps) {
  const [selectedLocalidad, setSelectedLocalidad] = useState<string>('all');

  const localidadMap = useMemo(() => {
    const map = new Map<string, string>();
    localidades.forEach(l => map.set(l.id, l.title));
    return map;
  }, [localidades]);

  const filteredServices = useMemo(() => {
    if (selectedLocalidad === 'all') {
      return services;
    }
    return services.filter(s => s.localidadId === selectedLocalidad);
  }, [services, selectedLocalidad]);

  const localitiesWithServices = useMemo(() => {
    const serviceLocalidadIds = new Set(services.map(s => s.localidadId));
    return localidades.filter(l => serviceLocalidadIds.has(l.id));
  }, [services, localidades]);

  return (
    <section id="servicios" className="w-full bg-secondary py-20 lg:py-28">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-8 text-center">
          <h2 className="font-headline text-3xl font-bold tracking-tight text-primary md:text-4xl">
            Servicios Turísticos
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Encuentra guías y listados de servicios en formato PDF para cada una de nuestras localidades.
          </p>
        </div>

        {localitiesWithServices.length > 1 && (
          <div className="mb-12 flex flex-wrap items-center justify-center gap-2">
            <Button
              variant={selectedLocalidad === 'all' ? 'default' : 'outline'}
              onClick={() => setSelectedLocalidad('all')}
            >
              Todos
            </Button>
            {localitiesWithServices.map(localidad => (
              <Button
                key={localidad.id}
                variant={selectedLocalidad === localidad.id ? 'default' : 'outline'}
                onClick={() => setSelectedLocalidad(localidad.id)}
              >
                {localidad.title}
              </Button>
            ))}
          </div>
        )}

        <div className="mx-auto max-w-6xl">
          {filteredServices.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {filteredServices.map(service => (
                <Card key={service.id} className="flex flex-col">
                  <CardContent className="flex flex-1 flex-col items-center justify-between p-4 text-center">
                    <div className="flex-grow">
                      <FileText className="mx-auto mb-3 h-10 w-10 text-primary" />
                      <h3 className="mb-2 font-semibold">{service.title}</h3>
                      <div className="mb-4 flex items-center justify-center text-sm text-muted-foreground">
                        <MapPin className="mr-1.5 h-4 w-4 flex-shrink-0" />
                        <span>{localidadMap.get(service.localidadId) || 'Desconocida'}</span>
                      </div>
                    </div>
                    <Button asChild className="mt-2 w-full" size="sm">
                      <Link href={service.downloadUrl} target="_blank" rel="noopener noreferrer">
                        <Download className="mr-2 h-4 w-4" />
                        Descargar PDF
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState title="No hay servicios" description="No hay documentos de servicios para la localidad seleccionada." />
          )}
        </div>
      </div>
    </section>
  );
}
