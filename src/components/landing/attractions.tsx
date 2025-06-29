import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Mountain, Shrub, Wind } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { TalampayaIcon } from '@/components/icons';

const attractions = [
  {
    icon: <TalampayaIcon className="h-10 w-10 text-primary" />,
    title: 'Talampaya National Park',
    description: "A UNESCO World Heritage site, famous for its towering red rock canyons and ancient petroglyphs.",
    imageUrl: 'https://placehold.co/600x400.png',
    aiHint: 'red canyon',
  },
  {
    icon: <Mountain className="h-10 w-10 text-primary" />,
    title: 'Laguna Brava',
    description: 'A stunning high-altitude salt lake, home to flamingos and surrounded by majestic Andean peaks.',
    imageUrl: 'https://placehold.co/600x400.png',
    aiHint: 'salt lake'
  },
  {
    icon: <Wind className="h-10 w-10 text-primary" />,
    title: 'Cuesta de Miranda',
    description: 'A breathtaking mountain pass with winding roads offering panoramic views of multicolored hills.',
    imageUrl: 'https://placehold.co/600x400.png',
    aiHint: 'winding road'
  },
];

export function Attractions() {
  return (
    <section id="attractions" className="w-full bg-secondary py-20 lg:py-28">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-12 text-center">
          <h2 className="font-headline text-3xl font-bold tracking-tight text-primary md:text-4xl">
            Discover Our Wonders
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            From ancient canyons to high-altitude lagoons, adventure is everywhere.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {attractions.map((attraction) => (
            <Card key={attraction.title} className="flex transform flex-col overflow-hidden rounded-lg shadow-lg transition-transform duration-300 hover:-translate-y-2">
              <div className="relative h-56 w-full">
                <Image
                  src={attraction.imageUrl}
                  alt={`Image of ${attraction.title}`}
                  data-ai-hint={attraction.aiHint}
                  fill
                  className="object-cover"
                />
              </div>
              <CardHeader className="flex flex-row items-start gap-4 pb-4">
                {attraction.icon}
                <div className="flex-1">
                  <CardTitle className="font-headline text-xl">{attraction.title}</CardTitle>
                  <CardDescription className="mt-2 text-base">{attraction.description}</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="mt-auto flex justify-end">
                <Button variant="link" className="text-accent" asChild>
                  <Link href="#">
                    Learn More <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
