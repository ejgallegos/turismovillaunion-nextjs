import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Users, Sun } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const events = [
  {
    date: 'OCT 12, 2024',
    title: 'Festival Nacional del Pimiento',
    description: 'A celebration of local agriculture and cuisine with live music, dancing, and traditional food stalls.',
    category: 'Festival',
    icon: <Sun className="h-6 w-6 text-accent" />,
  },
  {
    date: 'NOV 05, 2024',
    title: 'Talampaya Full Moon Walk',
    description: 'A unique guided tour through the Talampaya canyon under the light of the full moon.',
    category: 'Tour',
    icon: <Calendar className="h-6 w-6 text-accent" />,
  },
  {
    date: 'DEC 20, 2024',
    title: 'Feria de Artesanos de Villa Unión',
    description: 'Discover local crafts and artistry at the annual artisan fair in the main square.',
    category: 'Community',
    icon: <Users className="h-6 w-6 text-accent" />,
  },
];

export function Events() {
  return (
    <section id="events" className="w-full bg-secondary py-20 lg:py-28">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-12 text-center">
          <h2 className="font-headline text-3xl font-bold tracking-tight text-primary md:text-4xl">
            Upcoming Events
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Join our local festivities and create unforgettable memories.
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
