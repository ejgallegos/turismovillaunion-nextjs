'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { upsertMapa } from './actions';
import type { Mapa } from '@/lib/mapas.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormField, FormItem, FormMessage, FormLabel } from '@/components/ui/form';
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from '@/components/ui/sheet';

const mapaSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3, { message: 'El título debe tener al menos 3 caracteres.' }),
  description: z.string().min(10, { message: 'La descripción debe tener al menos 10 caracteres.' }),
  downloadUrl: z.string().url({ message: 'URL de descarga no válida. Déjalo vacío si no hay.' }).optional().or(z.literal('')),
});

type MapaFormValues = z.infer<typeof mapaSchema>;

interface MapaFormSheetProps {
  children: React.ReactNode;
  mapa?: Mapa | null;
}

export function MapaFormSheet({ children, mapa }: MapaFormSheetProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<MapaFormValues>({
    resolver: zodResolver(mapaSchema),
    defaultValues: mapa || {
      title: '',
      description: '',
      downloadUrl: '',
    },
  });

  useEffect(() => {
    if (open) {
      form.reset(mapa || {
        title: '',
        description: '',
        downloadUrl: '',
      });
    }
  }, [open, mapa, form]);

  const onSubmit = async (values: MapaFormValues) => {
    const result = await upsertMapa(values);

    if (result.success) {
      toast({
        title: `Mapa ${mapa ? 'actualizado' : 'creado'}`,
        description: 'El mapa ha sido guardado correctamente.',
      });
      setOpen(false);
    } else {
       const firstError = result.errors ? Object.values(result.errors).flat()[0] : result.error;
       const errorMessage = firstError || 'Hubo un problema al guardar el mapa.';
       toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="p-0 sm:max-w-lg">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex h-full flex-col">
              <SheetHeader className="p-6">
                <SheetTitle>{mapa ? 'Editar Mapa' : 'Añadir Nuevo Mapa'}</SheetTitle>
                <SheetDescription>
                  {mapa ? 'Modifica los detalles del mapa.' : 'Completa la información para crear un nuevo mapa.'}
                </SheetDescription>
              </SheetHeader>
              <div className="space-y-4 px-6 flex-1 overflow-y-auto">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descripción</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={5}/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="downloadUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL de Descarga (PDF)</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="https://ejemplo.com/mapa.pdf" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <SheetFooter className="p-6 bg-secondary mt-auto">
                  <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
                  <Button type="submit" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? 'Guardando...' : 'Guardar'}
                  </Button>
                </SheetFooter>
            </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
