
import { getServicios } from '@/lib/servicios.service';
import { Header } from '@/components/landing/header';
import { Footer } from '@/components/landing/footer';
import { notFound } from 'next/navigation';
import type { Metadata, ResolvingMetadata } from 'next';
import * as LucideIcons from 'lucide-react';

const getServiceIcon = (iconName: string, props: any) => {
    const IconComponent = (LucideIcons as any)[iconName] || LucideIcons.HelpCircle;
    return <IconComponent {...props} />;
};

export async function generateMetadata(
  { params }: { params: { id: string } },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const servicios = await getServicios();
  const servicio = servicios.find((s) => s.id === params.id);

  if (!servicio) {
    return {
      title: 'Servicio no encontrado',
    };
  }

  const title = `${servicio.title} | Servicios en Villa Unión`;
  const description = servicio.description;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
  };
}

export async function generateStaticParams() {
  const servicios = await getServicios();
  return servicios.map((servicio) => ({
    id: servicio.id,
  }));
}

export default async function ServicioDetailPage({ params }: { params: { id: string } }) {
  const servicios = await getServicios();
  const servicio = servicios.find((s) => s.id === params.id);

  if (!servicio) {
    notFound();
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="bg-secondary py-20 lg:py-28">
          <div className="container mx-auto max-w-4xl px-4 md:px-6">
            <div className="flex flex-col items-center text-center">
              <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-primary/10">
                {getServiceIcon(servicio.icon, { className: 'h-12 w-12 text-primary' })}
              </div>
              <h1 className="font-headline text-3xl font-bold tracking-tight text-primary md:text-4xl">
                {servicio.title}
              </h1>
            </div>
          </div>
        </div>
        <div className="py-12 md:py-16">
          <div className="container mx-auto max-w-3xl px-4 md:px-6">
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p>{servicio.description}</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
