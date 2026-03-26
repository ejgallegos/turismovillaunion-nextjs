'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { upsertServicio } from './actions';
import type { Servicio } from '@/lib/servicios.service';
import type { Localidad } from '@/lib/localidades.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormField, FormItem, FormMessage, FormLabel } from '@/components/ui/form';
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from '@/components/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ACCEPTED_DOWNLOAD_TYPES = ['application/pdf'];

const servicioSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3, { message: 'El título es requerido.' }),
  localidadId: z.string().min(1, { message: 'La localidad es requerida.' }),
  downloadFile: z.any()
    .optional()
    .refine((files) => !files || files.length === 0 || files?.[0]?.size <= MAX_FILE_SIZE, `El tamaño máximo es 10MB.`)
    .refine(
      (files) => !files || files.length === 0 || ACCEPTED_DOWNLOAD_TYPES.includes(files?.[0]?.type),
      'Solo se aceptan archivos PDF.'
    ),
});

type ServicioFormValues = z.infer<typeof servicioSchema>;

interface ServicioFormSheetProps {
  children: React.ReactNode;
  servicio?: Servicio | null;
  localidades: Localidad[];
}

export function ServicioFormSheet({ children, servicio, localidades }: ServicioFormSheetProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<ServicioFormValues>({
    resolver: zodResolver(servicioSchema),
    defaultValues: servicio || {
      title: '',
      localidadId: '',
      downloadFile: undefined,
    },
  });

  useEffect(() => {
    if (open) {
      form.reset(servicio || {
        title: '',
        localidadId: '',
        downloadFile: undefined,
      });
    }
  }, [open, servicio, form]);

  const onSubmit = async (values: ServicioFormValues) => {
    const formData = new FormData();
    if (values.id) {
      formData.append('id', values.id);
    }
    formData.append('title', values.title);
    formData.append('localidadId', values.localidadId);
    
    if (values.downloadFile && values.downloadFile.length > 0) {
      formData.append('downloadFile', values.downloadFile[0]);
    } else if (!servicio?.id) {
      form.setError('downloadFile', { type: 'manual', message: 'El archivo PDF es requerido.' });
      return;
    }
    
    const result = await upsertServicio(formData);

    if (result && !result.success) {
      const firstError = result.errors ? Object.values(result.errors).flat()[0] : result.error;
      const errorMessage = firstError || 'Hubo un problema al guardar el servicio.';
      toast({
        title: 'Error',
        description: errorMessage as string,
        variant: 'destructive',
      });
    } else {
      toast({
        title: `Servicio ${servicio ? 'actualizado' : 'creado'}`,
        description: 'El servicio ha sido guardado correctamente.',
      });
      setOpen(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="p-0 sm:max-w-lg">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex h-full flex-col">
              <SheetHeader className="p-6">
                <SheetTitle>{servicio ? 'Editar Servicio' : 'Añadir Nuevo Servicio'}</SheetTitle>
                <SheetDescription>
                  {servicio ? 'Modifica los detalles del servicio.' : 'Completa la información para crear un nuevo servicio.'}
                </SheetDescription>
              </SheetHeader>
              <div className="space-y-4 px-6 flex-1 overflow-y-auto">
                <FormField
                  control={form.control}
                  name="localidadId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Localidad</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona una localidad" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {localidades.map(l => <SelectItem key={l.id} value={l.id}>{l.title}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                  name="downloadFile"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Archivo PDF</FormLabel>
                      <FormControl>
                        <Input 
                          type="file" 
                          accept="application/pdf"
                          onChange={(e) => field.onChange(e.target.files)}
                        />
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
