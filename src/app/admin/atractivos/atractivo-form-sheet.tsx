'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Image from 'next/image';

import { upsertAttraction } from './actions';
import type { Attraction } from '@/lib/atractivos.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormField, FormItem, FormMessage, FormLabel } from '@/components/ui/form';
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const attractionSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3, { message: 'El título debe tener al menos 3 caracteres.' }),
  description: z.string().min(10, { message: 'La descripción debe tener al menos 10 caracteres.' }),
  image: z.any()
    .optional()
    .refine((files) => !files || files.length === 0 || files?.[0]?.size <= MAX_FILE_SIZE, `El tamaño máximo del archivo es 10MB.`)
    .refine(
      (files) => !files || files.length === 0 || ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      'Solo se aceptan formatos .jpg, .png y .webp.'
    ),
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
    defaultValues: {
      id: attraction?.id,
      title: attraction?.title || '',
      description: attraction?.description || '',
      image: undefined,
    },
  });
  
  const { register } = form;

  useEffect(() => {
    if (open) {
      form.reset({
        id: attraction?.id,
        title: attraction?.title || '',
        description: attraction?.description || '',
        image: undefined,
      });
    }
  }, [open, attraction, form]);

  const onSubmit = async (values: AttractionFormValues) => {
    const formData = new FormData();
    if (values.id) {
      formData.append('id', values.id);
    }
    formData.append('title', values.title);
    formData.append('description', values.description);
    if (values.image && values.image.length > 0) {
      formData.append('image', values.image[0]);
    } else if (!attraction?.id) {
        form.setError('image', { type: 'manual', message: 'La imagen es requerida para un nuevo atractivo.' });
        return;
    }

    const result = await upsertAttraction(formData);

    if (result.success) {
      toast({
        title: `Atractivo ${attraction ? 'actualizado' : 'creado'}`,
        description: 'El atractivo ha sido guardado correctamente.',
      });
      setOpen(false);
    } else {
       const errorMessage = result.errors ? (result.errors.image?.[0] || result.errors.title?.[0] || result.errors.description?.[0]) : result.error;
       toast({
        title: 'Error',
        description: errorMessage || 'Hubo un problema al guardar el atractivo.',
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
                        <Textarea
                          placeholder="Describe el atractivo..."
                          {...field}
                          rows={10}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="image"
                  render={() => (
                    <FormItem>
                      <FormLabel>Imagen</FormLabel>
                      <FormControl>
                         <Input type="file" {...register("image")} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 {attraction?.imageUrl && (
                  <div className="mt-2 text-sm">
                    <p className="text-muted-foreground mb-2">Imagen actual:</p>
                    <Image 
                      src={attraction.imageUrl} 
                      alt={attraction.title || 'Imagen actual'} 
                      width={100} 
                      height={100} 
                      className="rounded-md object-cover border"
                    />
                  </div>
                )}
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
