
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Descendant } from 'slate';

import { upsertAttraction } from './actions';
import type { Attraction } from '@/lib/atractivos.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormField, FormItem, FormMessage, FormLabel } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { RichTextEditor } from '@/components/ui/rich-text-editor';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const attractionSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3, { message: 'El título debe tener al menos 3 caracteres.' }),
  description: z.string().min(1, { message: 'La descripción es requerida.' }),
  image: z.any()
    .optional()
    .refine((files) => !files || files.length === 0 || files?.[0]?.size <= MAX_FILE_SIZE, `El tamaño máximo del archivo es 10MB.`)
    .refine(
      (files) => !files || files.length === 0 || ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      'Solo se aceptan formatos .jpg, .png y .webp.'
    ),
});

type AttractionFormValues = z.infer<typeof attractionSchema>;

interface AtractivoFormProps {
  attraction?: Attraction | null;
}

const initialValue: Descendant[] = [
    {
      type: 'paragraph',
      children: [{ text: '' }],
    },
];

export function AtractivoForm({ attraction }: AtractivoFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  
  const defaultDescription = (() => {
    if (!attraction?.description) return initialValue;
    try {
      const parsed = JSON.parse(attraction.description);
      if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].type) {
        return parsed;
      }
    } catch (e) {
      return [{ type: 'paragraph', children: [{ text: attraction.description }] }];
    }
    return initialValue;
  })();

  const form = useForm<AttractionFormValues>({
    resolver: zodResolver(attractionSchema),
    defaultValues: {
      id: attraction?.id,
      title: attraction?.title || '',
      description: attraction?.description || JSON.stringify(initialValue),
      image: undefined,
    },
  });

  const { register } = form;

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

    if (result && !result.success) { 
       const errorMessage = result.errors ? (result.errors.image?.[0] || result.errors.title?.[0] || result.errors.description?.[0]) : result.error;
       toast({
        title: 'Error',
        description: errorMessage || 'Hubo un problema al guardar el atractivo.',
        variant: 'destructive',
      });
    } else {
        toast({
            title: `Atractivo ${attraction ? 'actualizado' : 'creado'}`,
            description: 'El atractivo ha sido guardado correctamente.',
        });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>{attraction ? 'Editar Atractivo' : 'Añadir Nuevo Atractivo'}</CardTitle>
            <CardDescription>
              {attraction ? 'Modifica los detalles del atractivo.' : 'Completa la información para crear un nuevo atractivo.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
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
                     <RichTextEditor
                        initialValue={defaultDescription}
                        onChange={(value) => {
                            field.onChange(JSON.stringify(value));
                        }}
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
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => router.push('/admin/atractivos')}>Cancelar</Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Guardando...' : 'Guardar'}
              </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
