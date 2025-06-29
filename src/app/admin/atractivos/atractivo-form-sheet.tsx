'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { upsertAttraction } from './actions';
import type { Attraction } from '@/lib/atractivos.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from '@/components/ui/sheet';

const attractionSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3, { message: 'El título debe tener al menos 3 caracteres.' }),
  description: z.string().min(10, { message: 'La descripción debe tener al menos 10 caracteres.' }),
  imageUrl: z.string().url({ message: 'Por favor, ingresa una URL de imagen válida.' }).default('https://placehold.co/600x400.png'),
  aiHint: z.string().min(2, { message: 'La pista para la IA debe tener al menos 2 caracteres.' }),
});

type AttractionFormValues = z.infer<typeof attractionSchema>;

interface AtractivoFormSheetProps {
  children: React.ReactNode;
  attraction?: Attraction | null;
}

export function AtractivoFormSheet({ children, attraction }: AtractivoFormSheetProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<AttractionFormValues>({
    resolver: zodResolver(attractionSchema),
    defaultValues: attraction || {
      title: '',
      description: '',
      imageUrl: 'https://placehold.co/600x400.png',
      aiHint: '',
    },
  });

  useEffect(() => {
    if (open) {
      form.reset(attraction || {
        title: '',
        description: '',
        imageUrl: 'https://placehold.co/600x400.png',
        aiHint: '',
      });
    }
  }, [open, attraction, form]);

  const onSubmit = async (values: AttractionFormValues) => {
    const result = await upsertAttraction(values);

    if (result.success) {
      toast({
        title: `Atractivo ${attraction ? 'actualizado' : 'creado'}`,
        description: 'El atractivo ha sido guardado correctamente.',
      });
      setOpen(false);
    } else {
       const firstError = result.errors ? Object.values(result.errors).flat()[0] : result.error;
       const errorMessage = firstError || 'Hubo un problema al guardar el atractivo.';
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
                <SheetTitle>{attraction ? 'Editar Atractivo' : 'Añadir Nuevo Atractivo'}</SheetTitle>
                <SheetDescription>
                  {attraction ? 'Modifica los detalles del atractivo.' : 'Completa la información para crear un nuevo atractivo.'}
                </SheetDescription>
              </SheetHeader>
              <div className="space-y-4 px-6 flex-1 overflow-y-auto">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <Label>Título</Label>
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
                      <Label>Descripción</Label>
                      <FormControl>
                        <Textarea {...field} rows={5}/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <Label>URL de la Imagen</Label>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="aiHint"
                  render={({ field }) => (
                    <FormItem>
                      <Label>Pista para IA (ej: "red canyon")</Label>
                      <FormControl>
                        <Input {...field} />
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
