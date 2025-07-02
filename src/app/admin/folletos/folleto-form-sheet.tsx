'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Image from 'next/image';
import Link from 'next/link';

import { upsertFolleto } from './actions';
import type { Folleto } from '@/lib/folletos.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormField, FormItem, FormMessage, FormLabel } from '@/components/ui/form';
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from '@/components/ui/sheet';
import { FileText } from 'lucide-react';
import { RichTextEditor } from '@/components/ui/rich-text-editor';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const ACCEPTED_DOWNLOAD_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];

const folletoSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3, { message: 'El título debe tener al menos 3 caracteres.' }),
  description: z.string().min(10, { message: 'La descripción debe tener al menos 10 caracteres.' }),
  image: z.any()
    .optional()
    .refine((files) => !files || files.length === 0 || files?.[0]?.size <= MAX_FILE_SIZE, `El tamaño máximo del archivo es 5MB.`)
    .refine(
      (files) => !files || files.length === 0 || ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      'Solo se aceptan formatos .jpg, .png y .webp.'
    ),
  downloadFile: z.any()
    .optional()
    .refine((files) => !files || files.length === 0 || files?.[0]?.size <= MAX_FILE_SIZE, `El tamaño máximo del archivo es 5MB.`)
    .refine(
      (files) => !files || files.length === 0 || ACCEPTED_DOWNLOAD_TYPES.includes(files?.[0]?.type),
      'Solo se aceptan archivos PDF, .jpg, .png y .webp.'
    ),
});

type FolletoFormValues = z.infer<typeof folletoSchema>;

interface FolletoFormSheetProps {
  children: React.ReactNode;
  folleto?: Folleto | null;
}

export function FolletoFormSheet({ children, folleto }: FolletoFormSheetProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<FolletoFormValues>({
    resolver: zodResolver(folletoSchema),
    defaultValues: {
      id: folleto?.id,
      title: folleto?.title || '',
      description: folleto?.description || '',
      image: undefined,
      downloadFile: undefined,
    },
  });

  const { register } = form;

  useEffect(() => {
    if (open) {
      form.reset({
        id: folleto?.id,
        title: folleto?.title || '',
        description: folleto?.description || '',
        image: undefined,
        downloadFile: undefined,
      });
    }
  }, [open, folleto, form]);

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

    if (result.success) {
      toast({
        title: `Folleto ${folleto ? 'actualizado' : 'creado'}`,
        description: 'El folleto ha sido guardado correctamente.',
      });
      setOpen(false);
    } else {
       const errorMessage = result.errors ? (result.errors.image?.[0] || result.errors.title?.[0] || result.errors.description?.[0] || (result.errors as any).downloadFile?.[0]) : result.error;
       toast({
        title: 'Error',
        description: errorMessage || 'Hubo un problema al guardar el folleto.',
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
                <SheetTitle>{folleto ? 'Editar Folleto' : 'Añadir Nuevo Folleto'}</SheetTitle>
                <SheetDescription>
                  {folleto ? 'Modifica los detalles del folleto.' : 'Completa la información para crear un nuevo folleto.'}
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
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <RichTextEditor
                    value={form.watch('description')}
                    onChange={(value) => {
                      form.setValue('description', value, { shouldValidate: true, shouldDirty: true });
                    }}
                    placeholder="Describe el contenido del folleto..."
                  />
                  {form.formState.errors.description && (
                    <p className="text-sm font-medium text-destructive">
                      {form.formState.errors.description.message}
                    </p>
                  )}
                </FormItem>
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
