import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Users, Sun } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const events = [
  {
    date: '12 OCT, 2024',
    title: 'Festival Nacional del Pimiento',
    description: 'Una celebración de la agricultura y gastronomía local con música en vivo, bailes y puestos de comida tradicional.',
    category: 'Festival',
    icon: <Sun className="h-6 w-6 text-accent" />,
  },
  {
    date: '05 NOV, 2024',
    title: 'Caminata de Luna Llena en Talampaya',
    description: 'Un recorrido guiado único por el cañón de Talampaya bajo la luz de la luna llena.',
    category: 'Tour',
    icon: <Calendar className="h-6 w-6 text-accent" />,
  },
  {
    date: '20 DIC, 2024',
    title: 'Feria de Artesanos de Villa Unión',
    description: 'Descubre la artesanía y el arte local en la feria anual de artesanos en la plaza principal.',
    category: 'Comunidad',
    icon: <Users className="h-6 w-6 text-accent" />,
  },
];

export function Events() {
  return (
    <section id="events" className="w-full bg-secondary py-20 lg:py-28">
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
            <Card key={event.title} className="flex flex-col overflow-hidden rounded-lg border-l-4 border-accent shadow-md transition-shadow duration-300 hover:shadow-xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <p className="font-bold text-sm text-primary">{event.date}</p>
                  <Badge variant="outline" className="border-accent text-accent">{event.category}</Badge>
                </div>
                <CardTitle className="font-headline pt-2 text-xl">{event.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <CardDescription className="text-base">{event.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
