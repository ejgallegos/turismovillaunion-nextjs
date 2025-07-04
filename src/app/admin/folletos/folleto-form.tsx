
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Descendant } from 'slate';

import { upsertFolleto } from './actions';
import type { Folleto } from '@/lib/folletos.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormField, FormItem, FormMessage, FormLabel } from '@/components/ui/form';
import { FileText } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RichTextEditor } from '@/components/ui/rich-text-editor';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const ACCEPTED_DOWNLOAD_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];

const folletoSchema = z.object({
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
  downloadFile: z.any()
    .optional()
    .refine((files) => !files || files.length === 0 || files?.[0]?.size <= MAX_FILE_SIZE, `El tamaño máximo del archivo es 10MB.`)
    .refine(
      (files) => !files || files.length === 0 || ACCEPTED_DOWNLOAD_TYPES.includes(files?.[0]?.type),
      'Solo se aceptan archivos PDF, .jpg, .png y .webp.'
    ),
});

type FolletoFormValues = z.infer<typeof folletoSchema>;

interface FolletoFormProps {
  folleto?: Folleto | null;
}

const initialValue: Descendant[] = [
    {
      type: 'paragraph',
      children: [{ text: '' }],
    },
];

export function FolletoForm({ folleto }: FolletoFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  
  const defaultDescription = folleto?.description ? JSON.parse(folleto.description) : initialValue;

  const form = useForm<FolletoFormValues>({
    resolver: zodResolver(folletoSchema),
    defaultValues: {
      id: folleto?.id,
      title: folleto?.title || '',
      description: folleto?.description || JSON.stringify(initialValue),
      image: undefined,
      downloadFile: undefined,
    },
  });

  const { register } = form;

  const onSubmit = async (values: FolletoFormValues) => {
    const formData = new FormData();
    if (values.id) {
      formData.append('id', values.id);
    }
    formData.append('title', values.title);
    formData.append('description', values.description);
    
    if (values.image && values.image.length > 0) {
      formData.append('image', values.image[0]);
    } else if (!folleto?.id) {
        form.setError('image', { type: 'manual', message: 'La imagen de portada es requerida.' });
        return;
    }
    
    if (values.downloadFile && values.downloadFile.length > 0) {
      formData.append('downloadFile', values.downloadFile[0]);
    }
    
    const result = await upsertFolleto(formData);

    if (result && !result.success) {
       const errorMessage = result.errors ? (result.errors.image?.[0] || result.errors.title?.[0] || result.errors.description?.[0] || (result.errors as any).downloadFile?.[0]) : result.error;
       toast({
        title: 'Error',
        description: errorMessage || 'Hubo un problema al guardar el folleto.',
        variant: 'destructive',
      });
    } else {
        toast({
            title: `Folleto ${folleto ? 'actualizado' : 'creado'}`,
            description: 'El folleto ha sido guardado correctamente.',
        });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>{folleto ? 'Editar Folleto' : 'Añadir Nuevo Folleto'}</CardTitle>
            <CardDescription>
              {folleto ? 'Modifica los detalles del folleto.' : 'Completa la información para crear un nuevo folleto.'}
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
                  <FormLabel>Imagen de Portada</FormLabel>
                  <FormControl>
                      <Input type="file" {...register("image")} accept="image/jpeg,image/png,image/webp" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
              {folleto?.imageUrl && (
              <div className="mt-2 text-sm">
                <p className="text-muted-foreground mb-2">Imagen actual:</p>
                <Image 
                  src={folleto.imageUrl} 
                  alt={folleto.title || 'Imagen actual'} 
                  width={100} 
                  height={141}
                  className="rounded-md object-cover border"
                />
              </div>
            )}
              <FormField
              control={form.control}
              name="downloadFile"
              render={() => (
                <FormItem>
                  <FormLabel>Archivo de Descarga (PDF o Imagen)</FormLabel>
                  <FormControl>
                    <Input type="file" {...register("downloadFile")} accept="application/pdf,image/jpeg,image/png,image/webp" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {folleto?.downloadUrl && (
              <div className="mt-2 text-sm">
                <p className="text-muted-foreground mb-2">Archivo actual:</p>
                <Link href={folleto.downloadUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-primary hover:underline">
                  <FileText className="h-4 w-4" />
                  <span>{folleto.downloadUrl.split('/').pop()}</span>
                </Link>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => router.push('/admin/folletos')}>Cancelar</Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Guardando...' : 'Guardar'}
              </Button>
            </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
