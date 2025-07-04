
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { Descendant } from 'slate';

import { upsertServicio } from './actions';
import type { Servicio } from '@/lib/servicios.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormField, FormItem, FormMessage, FormLabel } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { RichTextEditor } from '@/components/ui/rich-text-editor';

const servicioSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3, { message: 'El título debe tener al menos 3 caracteres.' }),
  description: z.string().min(1, { message: 'La descripción es requerida.' }),
  icon: z.string().min(2, { message: 'El ícono (nombre de Lucide) es requerido.' }),
});

type ServicioFormValues = z.infer<typeof servicioSchema>;

interface ServicioFormProps {
  servicio?: Servicio | null;
}

const initialValue: Descendant[] = [
    {
      type: 'paragraph',
      children: [{ text: '' }],
    },
];

export function ServicioForm({ servicio }: ServicioFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  
  const defaultDescription = servicio?.description ? JSON.parse(servicio.description) : initialValue;

  const form = useForm<ServicioFormValues>({
    resolver: zodResolver(servicioSchema),
    defaultValues: {
        ...servicio,
        description: servicio?.description || JSON.stringify(initialValue)
    } || {
      title: '',
      description: JSON.stringify(initialValue),
      icon: '',
    },
  });

  const onSubmit = async (values: ServicioFormValues) => {
    const result = await upsertServicio(values);

    if (result && !result.success) {
       const firstError = result.errors ? Object.values(result.errors).flat()[0] : result.error;
       const errorMessage = (firstError as string) || 'Hubo un problema al guardar el servicio.';
       toast({
        title: 'Error',
        description: errorMessage,
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
                    name="icon"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Ícono (Nombre de Lucide)</FormLabel>
                        <FormControl>
                        <Input {...field} placeholder="Ej: BedDouble, UtensilsCrossed" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
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
