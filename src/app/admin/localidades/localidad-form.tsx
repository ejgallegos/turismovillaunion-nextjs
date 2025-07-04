
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Descendant } from 'slate';

import { upsertLocalidad } from './actions';
import type { Localidad } from '@/lib/localidades.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormField, FormItem, FormMessage, FormLabel } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { RichTextEditor } from '@/components/ui/rich-text-editor';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const localidadSchema = z.object({
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

type LocalidadFormValues = z.infer<typeof localidadSchema>;

interface LocalidadFormProps {
  localidad?: Localidad | null;
}

const initialValue: Descendant[] = [
    {
      type: 'paragraph',
      children: [{ text: '' }],
    },
];

export function LocalidadForm({ localidad }: LocalidadFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  
  const defaultDescription = (() => {
    if (!localidad?.description) return initialValue;
    try {
      const parsed = JSON.parse(localidad.description);
      if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].type) {
        return parsed;
      }
    } catch (e) {
      return [{ type: 'paragraph', children: [{ text: localidad.description }] }];
    }
    return initialValue;
  })();

  const form = useForm<LocalidadFormValues>({
    resolver: zodResolver(localidadSchema),
    defaultValues: {
      id: localidad?.id,
      title: localidad?.title || '',
      description: localidad?.description || JSON.stringify(initialValue),
      image: undefined,
    },
  });
  
  const { register } = form;

  const onSubmit = async (values: LocalidadFormValues) => {
    const formData = new FormData();
    if (values.id) {
      formData.append('id', values.id);
    }
    formData.append('title', values.title);
    formData.append('description', values.description);
    if (values.image && values.image.length > 0) {
      formData.append('image', values.image[0]);
    } else if (!localidad?.id) {
        form.setError('image', { type: 'manual', message: 'La imagen es requerida para una nueva localidad.' });
        return;
    }

    const result = await upsertLocalidad(formData);

    if (result && !result.success) {
       const errorMessage = result.errors ? (result.errors.image?.[0] || result.errors.title?.[0] || result.errors.description?.[0]) : result.error;
       toast({
        title: 'Error',
        description: errorMessage || 'Hubo un problema al guardar la localidad.',
        variant: 'destructive',
      });
    } else {
      toast({
        title: `Localidad ${localidad ? 'actualizada' : 'creada'}`,
        description: 'La localidad ha sido guardada correctamente.',
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>{localidad ? 'Editar Localidad' : 'Añadir Nueva Localidad'}</CardTitle>
            <CardDescription>
              {localidad ? 'Modifica los detalles de la localidad.' : 'Completa la información para crear una nueva localidad.'}
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
              {localidad?.imageUrl && (
              <div className="mt-2 text-sm">
                <p className="text-muted-foreground mb-2">Imagen actual:</p>
                <Image 
                  src={localidad.imageUrl} 
                  alt={localidad.title || 'Imagen actual'} 
                  width={100} 
                  height={100} 
                  className="rounded-md object-cover border"
                />
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => router.push('/admin/localidades')}>Cancelar</Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Guardando...' : 'Guardar'}
              </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
