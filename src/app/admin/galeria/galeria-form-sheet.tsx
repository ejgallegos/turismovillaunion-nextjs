
'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Image from 'next/image';

import { upsertGalleryItem } from './actions';
import type { GalleryItem } from '@/lib/galeria.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormField, FormItem, FormMessage, FormLabel } from '@/components/ui/form';
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const galleryItemSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3, { message: 'El título debe tener al menos 3 caracteres.' }),
  description: z.string().optional(),
  image: z.any()
    .optional()
    .refine((files) => !files || files.length === 0 || files?.[0]?.size <= MAX_FILE_SIZE, `El tamaño máximo del archivo es 10MB.`)
    .refine(
      (files) => !files || files.length === 0 || ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      'Solo se aceptan formatos .jpg, .png y .webp.'
    ),
});

type GalleryItemFormValues = z.infer<typeof galleryItemSchema>;

interface GaleriaFormSheetProps {
  children: React.ReactNode;
  galleryItem?: GalleryItem | null;
}

export function GaleriaFormSheet({ children, galleryItem }: GaleriaFormSheetProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<GalleryItemFormValues>({
    resolver: zodResolver(galleryItemSchema),
    defaultValues: {
      id: galleryItem?.id,
      title: galleryItem?.title || '',
      description: galleryItem?.description || '',
      image: undefined,
    },
  });
  
  const { register } = form;

  useEffect(() => {
    if (open) {
      form.reset({
        id: galleryItem?.id,
        title: galleryItem?.title || '',
        description: galleryItem?.description || '',
        image: undefined,
      });
    }
  }, [open, galleryItem, form]);

  const onSubmit = async (values: GalleryItemFormValues) => {
    const formData = new FormData();
    if (values.id) {
      formData.append('id', values.id);
    }
    formData.append('title', values.title);
    if(values.description) {
        formData.append('description', values.description);
    }
    if (values.image && values.image.length > 0) {
      formData.append('image', values.image[0]);
    } else if (!galleryItem?.id) {
        form.setError('image', { type: 'manual', message: 'La imagen es requerida para un nuevo elemento.' });
        return;
    }

    const result = await upsertGalleryItem(formData);

    if (result.success) {
      toast({
        title: `Elemento ${galleryItem ? 'actualizado' : 'creado'}`,
        description: 'El elemento de la galería se ha guardado correctamente.',
      });
      setOpen(false);
    } else {
       const errorMessage = result.errors ? (result.errors.image?.[0] || result.errors.title?.[0] || result.errors.description?.[0]) : result.error;
       toast({
        title: 'Error',
        description: errorMessage || 'Hubo un problema al guardar el elemento.',
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
                <SheetTitle>{galleryItem ? 'Editar Elemento' : 'Añadir a Galería'}</SheetTitle>
                <SheetDescription>
                  {galleryItem ? 'Modifica los detalles de la imagen.' : 'Completa la información para añadir una nueva imagen.'}
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
                      <FormLabel>Descripción (Opcional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe la imagen..."
                          {...field}
                          value={field.value || ''}
                          rows={5}
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
                 {galleryItem?.imageUrl && (
                  <div className="mt-2 text-sm">
                    <p className="text-muted-foreground mb-2">Imagen actual:</p>
                    <Image 
                      src={galleryItem.imageUrl} 
                      alt={galleryItem.title || 'Imagen actual'} 
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
