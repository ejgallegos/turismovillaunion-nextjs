
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

import { upsertNovedad } from './actions';
import type { Novedad } from '@/lib/novedades.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormField, FormItem, FormMessage, FormLabel } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const novedadSchema = z.object({
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

type NovedadFormValues = z.infer<typeof novedadSchema>;

interface NovedadFormProps {
  novedad?: Novedad | null;
}

export function NovedadForm({ novedad }: NovedadFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  
  const form = useForm<NovedadFormValues>({
    resolver: zodResolver(novedadSchema),
    defaultValues: {
      id: novedad?.id,
      title: novedad?.title || '',
      description: novedad?.description || '',
      image: undefined,
    },
  });
  
  const { register } = form;

  const onSubmit = async (values: NovedadFormValues) => {
    const formData = new FormData();
    if (values.id) {
      formData.append('id', values.id);
    }
    formData.append('title', values.title);
    formData.append('description', values.description);
    if (values.image && values.image.length > 0) {
      formData.append('image', values.image[0]);
    } else if (!novedad?.id) {
        form.setError('image', { type: 'manual', message: 'La imagen es requerida para una nueva novedad.' });
        return;
    }

    const result = await upsertNovedad(formData);

    if (result && !result.success) {
       const errorMessage = result.errors ? (result.errors.image?.[0] || result.errors.title?.[0] || result.errors.description?.[0]) : result.error;
       toast({
        title: 'Error',
        description: errorMessage || 'Hubo un problema al guardar la novedad.',
        variant: 'destructive',
      });
    } else {
        toast({
            title: `Novedad ${novedad ? 'actualizada' : 'creada'}`,
            description: 'La novedad ha sido guardada correctamente.',
        });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>{novedad ? 'Editar Novedad' : 'Añadir Nueva Novedad'}</CardTitle>
            <CardDescription>
              {novedad ? 'Modifica los detalles de la novedad.' : 'Completa la información para crear una nueva novedad.'}
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
                    <Textarea
                      placeholder="Describe la novedad..."
                      {...field}
                      value={field.value || ''}
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
              {novedad?.imageUrl && (
              <div className="mt-2 text-sm">
                <p className="text-muted-foreground mb-2">Imagen actual:</p>
                <Image 
                  src={novedad.imageUrl} 
                  alt={novedad.title || 'Imagen actual'} 
                  width={100} 
                  height={100} 
                  className="rounded-md object-cover border"
                />
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => router.push('/admin/novedades')}>Cancelar</Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Guardando...' : 'Guardar'}
              </Button>
            </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
