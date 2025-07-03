import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getServicios } from '@/lib/servicios.service';
import * as LucideIcons from 'lucide-react';
import Link from 'next/link';
import { EmptyState } from '../empty-state';

const getServiceIcon = (iconName: string) => {
    const IconComponent = (LucideIcons as any)[iconName] || LucideIcons.HelpCircle;
    return <IconComponent className="h-10 w-10 text-primary" />;
};

export async function Services() {
  const services = await getServicios();

  return (
    <section id="servicios" className="w-full bg-secondary py-20 lg:py-28">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-12 text-center">
          <h2 className="font-headline text-3xl font-bold tracking-tight text-primary md:text-4xl">
            Servicios Turísticos
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Todo lo que necesitas para una estadía cómoda y memorable en Villa Unión.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {services.length > 0 ? (
            services.map((service) => (
              <Link href={`/servicios/${service.id}`} key={service.id} className="block group">
                  <Card className="flex flex-col text-center items-center p-6 h-full transform transition-transform duration-300 group-hover:-translate-y-2">
                  <CardHeader className="p-0">
                      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                      {getServiceIcon(service.icon)}
                      </div>
                      <CardTitle className="font-headline pt-6 text-xl">{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow pt-4">
                      <p className="text-base text-muted-foreground line-clamp-4 text-center">
                        {service.description}
                      </p>
                  </CardContent>
                  </Card>
              </Link>
            ))
          ) : (
            <EmptyState title="No hay servicios" description="Aún no se han añadido servicios. Vuelve a consultar más tarde." />
          )}
        </div>
      </div>
    </section>
  );
}
