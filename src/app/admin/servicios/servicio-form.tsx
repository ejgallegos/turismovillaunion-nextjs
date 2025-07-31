
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { upsertServicio } from './actions';
import type { Servicio } from '@/lib/servicios.service';
import type { Localidad } from '@/lib/localidades.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormField, FormItem, FormMessage, FormLabel } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText } from 'lucide-react';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_DOWNLOAD_TYPES = ['application/pdf'];

const servicioSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3, { message: 'El título debe tener al menos 3 caracteres.' }),
  localidadId: z.string().min(1, { message: 'Debe seleccionar una localidad.' }),
  downloadFile: z.any()
    .optional()
    .refine((files) => !files || files.length === 0 || files?.[0]?.size <= MAX_FILE_SIZE, `El tamaño máximo del archivo es 10MB.`)
    .refine(
      (files) => !files || files.length === 0 || ACCEPTED_DOWNLOAD_TYPES.includes(files?.[0]?.type),
      'Solo se aceptan archivos PDF.'
    ),
});

type ServicioFormValues = z.infer<typeof servicioSchema>;

interface ServicioFormProps {
  servicio?: Servicio | null;
  localidades: Localidad[];
}

export function ServicioForm({ servicio, localidades }: ServicioFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  
  const form = useForm<ServicioFormValues>({
    resolver: zodResolver(servicioSchema),
    defaultValues: servicio || {
      title: '',
      localidadId: '',
      downloadFile: undefined,
    },
  });

  const { register } = form;

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
       const errorMessage = result.errors ? Object.values(result.errors).flat()[0] as string : result.error;
       toast({
        title: 'Error',
        description: errorMessage || 'Hubo un problema al guardar el servicio.',
        variant: 'destructive',
      });
    } else {
        toast({
            title: `Servicio ${servicio ? 'actualizado' : 'creado'}`,
            description: 'El servicio ha sido guardado correctamente.',
        });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
            <CardHeader>
                <CardTitle>{servicio ? 'Editar Servicio' : 'Añadir Nuevo Servicio'}</CardTitle>
                <CardDescription>
                    {servicio ? 'Modifica los detalles del servicio.' : 'Completa la información para crear un nuevo servicio.'}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
                        <FormLabel>Título del Documento</FormLabel>
                        <FormControl>
                        <Input placeholder="Ej: Listado de Hoteles" {...field} />
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
                        <FormLabel>Archivo PDF</FormLabel>
                        <FormControl>
                            <Input type="file" {...register("downloadFile")} accept="application/pdf" />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                {servicio?.downloadUrl && (
                <div className="mt-2 text-sm">
                    <p className="text-muted-foreground mb-2">Archivo actual:</p>
                    <Link href={servicio.downloadUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-primary hover:underline">
                    <FileText className="h-4 w-4" />
                    <span>{servicio.downloadUrl.split('/').pop()}</span>
                    </Link>
                </div>
                )}
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => router.push('/admin/servicios')}>Cancelar</Button>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? 'Guardando...' : 'Guardar'}
                </Button>
            </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
