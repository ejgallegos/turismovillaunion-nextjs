'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { handleGenerateMetaTags } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Bot, Copy, Loader2 } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';

const initialState = {
  message: '',
  data: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Generando...
        </>
      ) : (
        'Generar Metaetiquetas'
      )}
    </Button>
  );
}

export function SeoGenerator() {
  const [state, formAction] = useFormState(handleGenerateMetaTags, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "¡Copiado!",
      description: "La metaetiqueta ha sido copiada a tu portapapeles.",
    });
  };

  useEffect(() => {
    if (state?.message && state.message !== 'Metaetiquetas generadas con éxito.') {
      toast({
        title: 'Error',
        description: state.message,
        variant: 'destructive',
      });
    }
    if (state?.message === 'Metaetiquetas generadas con éxito.') {
      formRef.current?.reset();
    }
  }, [state, toast]);

  return (
    <section id="seo-generator" className="w-full py-20 lg:py-28">
      <div className="container mx-auto grid grid-cols-1 gap-12 px-4 md:grid-cols-2 md:px-6">
        <div className="flex flex-col justify-center">
          <Bot className="mb-4 h-12 w-12 text-primary" />
          <h2 className="font-headline text-3xl font-bold tracking-tight text-primary md:text-4xl">
            SEO Potenciado por IA
          </h2>
          <p className="mt-4 max-w-xl text-lg text-muted-foreground">
            Aprovecha la IA para generar metaetiquetas dinámicas y optimizadas para SEO para nuestras atracciones. Selecciona un lugar de interés para ver cómo adaptamos el contenido para capturar el interés turístico actual.
          </p>
        </div>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Generador de Metaetiquetas</CardTitle>
            <CardDescription>Selecciona un lugar de interés para generar su título y meta descripción.</CardDescription>
          </CardHeader>
          <CardContent>
            <form ref={formRef} action={formAction} className="space-y-6">
              <div>
                <Label htmlFor="landmarkName">Lugar de Interés</Label>
                <Select name="landmarkName" required>
                  <SelectTrigger id="landmarkName" className="w-full">
                    <SelectValue placeholder="Selecciona un lugar de interés" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Talampaya">Talampaya</SelectItem>
                    <SelectItem value="Laguna Brava">Laguna Brava</SelectItem>
                    <SelectItem value="Cuesta de Miranda">Cuesta de Miranda</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <SubmitButton />
            </form>
            {state?.data && (
              <div className="mt-6 space-y-4 rounded-lg border bg-secondary/50 p-4">
                <div>
                  <Label className="text-sm font-semibold">Título Generado</Label>
                  <div className="relative mt-1">
                    <p className="rounded-md bg-background p-3 pr-10 text-sm">{state.data.title}</p>
                    <Button variant="ghost" size="icon" className="absolute right-1 top-1 h-8 w-8" onClick={() => copyToClipboard(state.data.title)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-semibold">Meta Descripción Generada</Label>
                  <div className="relative mt-1">
                    <p className="rounded-md bg-background p-3 pr-10 text-sm">{state.data.metaDescription}</p>
                     <Button variant="ghost" size="icon" className="absolute right-1 top-1 h-8 w-8" onClick={() => copyToClipboard(state.data.metaDescription)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
