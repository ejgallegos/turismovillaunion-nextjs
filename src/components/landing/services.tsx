import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BedDouble, UtensilsCrossed, MountainSnow } from 'lucide-react';

const services = [
  {
    icon: <BedDouble className="h-10 w-10 text-primary" />,
    title: 'Alojamiento',
    description: 'Encuentra hoteles, cabañas y posadas acogedoras que se adaptan a todos los gustos y presupuestos para que tu descanso sea perfecto.',
  },
  {
    icon: <UtensilsCrossed className="h-10 w-10 text-primary" />,
    title: 'Gastronomía',
    description: 'Deleita tu paladar con la auténtica cocina regional. Descubre restaurantes y comedores que te ofrecen los sabores únicos de La Rioja.',
  },
  {
    icon: <MountainSnow className="h-10 w-10 text-primary" />,
    title: 'Excursiones',
    description: 'Vive la aventura con nuestras excursiones guiadas. Explora paisajes increíbles como Talampaya y Laguna Brava de la mano de expertos.',
  },
];

export function Services() {
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
          {services.map((service) => (
            <Card key={service.title} className="flex flex-col text-center items-center p-6 transform transition-transform duration-300 hover:-translate-y-2">
              <CardHeader className="p-0">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                  {service.icon}
                </div>
                <CardTitle className="font-headline pt-6 text-xl">{service.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow pt-4">
                <p className="text-base text-muted-foreground">{service.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
