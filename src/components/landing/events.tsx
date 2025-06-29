import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getEventos } from '@/lib/eventos.service';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import Link from 'next/link';

export async function Events() {
  const events = await getEventos();

  return (
    <section className="w-full bg-secondary py-20 lg:py-28">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-12 text-center">
          <h2 className="font-headline text-3xl font-bold tracking-tight text-primary md:text-4xl">
            Próximos Eventos
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Únete a nuestras festividades locales y crea recuerdos inolvidables.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <Card key={event.id} className="flex flex-col overflow-hidden rounded-lg border-l-4 border-accent shadow-md transition-shadow duration-300 hover:shadow-xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <p className="font-bold text-sm text-primary uppercase">
                    {format(new Date(`${event.date}T00:00:00`), "dd MMM, yyyy", { locale: es })}
                  </p>
                  <Badge variant="outline" className="border-accent text-accent">{event.category}</Badge>
                </div>
                <CardTitle className="font-headline pt-2 text-xl">
                   <Link href={`/eventos/${event.id}`} className="hover:underline">
                    {event.title}
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <CardDescription className="text-base">{event.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
           {events.length === 0 && (
            <div className="col-span-full text-center text-muted-foreground">
              <p>No hay eventos programados en este momento.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
