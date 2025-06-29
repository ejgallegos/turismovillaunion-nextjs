import { getEventos } from '@/lib/eventos.service';
import { Header } from '@/components/landing/header';
import { Footer } from '@/components/landing/footer';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { Calendar, Tag } from 'lucide-react';

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const eventos = await getEventos();
  const evento = eventos.find((e) => e.id === params.id);

  if (!evento) {
    return {
      title: 'Evento no encontrado',
    };
  }

  const title = `${evento.title} | Eventos en Villa Unión`;
  const description = evento.description;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime: new Date(evento.date).toISOString(),
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
  };
}

export async function generateStaticParams() {
  const eventos = await getEventos();
  return eventos.map((evento) => ({
    id: evento.id,
  }));
}

export default async function EventoDetailPage({ params }: Props) {
  const eventos = await getEventos();
  const evento = eventos.find((e) => e.id === params.id);

  if (!evento) {
    notFound();
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-secondary">
        <div className="container mx-auto max-w-4xl px-4 py-12 md:px-6 md:py-16">
          <article className="rounded-lg bg-background p-8 shadow-lg">
            <header className="mb-6 border-b pb-6">
              <h1 className="font-headline text-3xl font-bold tracking-tight text-primary md:text-4xl">
                {evento.title}
              </h1>
              <div className="mt-4 flex flex-wrap items-center gap-4 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  <time dateTime={evento.date}>
                    {format(new Date(`${evento.date}T00:00:00`), "dd 'de' MMMM, yyyy", { locale: es })}
                  </time>
                </div>
                <div className="flex items-center gap-2">
                   <Tag className="h-5 w-5" />
                  <Badge variant="outline" className="border-accent text-accent">{evento.category}</Badge>
                </div>
              </div>
            </header>
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p>{evento.description}</p>
            </div>
          </article>
        </div>
      </main>
      <Footer />
    </div>
  );
}
