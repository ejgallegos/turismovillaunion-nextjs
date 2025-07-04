
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Descendant } from 'slate';

import { upsertMapa } from './actions';
import type { Mapa } from '@/lib/mapas.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormField, FormItem, FormMessage, FormLabel } from '@/components/ui/form';
import { FileText } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RichTextEditor } from '@/components/ui/rich-text-editor';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_DOWNLOAD_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];

const mapaSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3, { message: 'El título debe tener al menos 3 caracteres.' }),
  description: z.string().min(1, { message: 'La descripción es requerida.' }),
  downloadFile: z.any()
    .optional()
    .refine((files) => !files || files.length === 0 || files?.[0]?.size <= MAX_FILE_SIZE, `El tamaño máximo del archivo es 10MB.`)
    .refine(
      (files) => !files || files.length === 0 || ACCEPTED_DOWNLOAD_TYPES.includes(files?.[0]?.type),
      'Solo se aceptan archivos PDF, .jpg, .png y .webp.'
    ),
});

type MapaFormValues = z.infer<typeof mapaSchema>;

interface MapaFormProps {
  mapa?: Mapa | null;
}

const initialValue: Descendant[] = [
    {
      type: 'paragraph',
      children: [{ text: '' }],
    },
];

export function MapaForm({ mapa }: MapaFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  
  const defaultDescription = mapa?.description ? JSON.parse(mapa.description) : initialValue;

  const form = useForm<MapaFormValues>({
    resolver: zodResolver(mapaSchema),
    defaultValues: {
      id: mapa?.id,
      title: mapa?.title || '',
      description: mapa?.description || JSON.stringify(initialValue),
      downloadFile: undefined,
    },
  });

  const { register } = form;

  const onSubmit = async (values: MapaFormValues) => {
    const formData = new FormData();
    if (values.id) {
      formData.append('id', values.id);
    }
    formData.append('title', values.title);
    formData.append('description', values.description);
    
    if (values.downloadFile && values.downloadFile.length > 0) {
      formData.append('downloadFile', values.downloadFile[0]);
    }
    
    const result = await upsertMapa(formData);

    if (result && !result.success) {
       const errorMessage = result.errors ? (Object.values(result.errors).flat()[0] as string) : result.error;
       toast({
        title: 'Error',
        description: errorMessage || 'Hubo un problema al guardar el mapa.',
        variant: 'destructive',
      });
    } else {
        toast({
            title: `Mapa ${mapa ? 'actualizado' : 'creado'}`,
            description: 'El mapa ha sido guardado correctamente.',
        });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>{mapa ? 'Editar Mapa' : 'Añadir Nuevo Mapa'}</CardTitle>
            <CardDescription>
              {mapa ? 'Modifica los detalles del mapa.' : 'Completa la información para crear un nuevo mapa.'}
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
            {mapa?.downloadUrl && (
              <div className="mt-2 text-sm">
                <p className="text-muted-foreground mb-2">Archivo actual:</p>
                <Link href={mapa.downloadUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-primary hover:underline">
                  <FileText className="h-4 w-4" />
                  <span>{mapa.downloadUrl.split('/').pop()}</span>
                </Link>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => router.push('/admin/mapas')}>Cancelar</Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Guardando...' : 'Guardar'}
              </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
