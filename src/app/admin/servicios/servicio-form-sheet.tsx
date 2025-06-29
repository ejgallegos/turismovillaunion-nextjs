'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { upsertServicio } from './actions';
import type { Servicio } from '@/lib/servicios.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormField, FormItem, FormMessage, FormLabel } from '@/components/ui/form';
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from '@/components/ui/sheet';

const servicioSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3, { message: 'El título debe tener al menos 3 caracteres.' }),
  description: z.string().min(10, { message: 'La descripción debe tener al menos 10 caracteres.' }),
  icon: z.string().min(2, { message: 'El ícono (nombre de Lucide) es requerido.' }),
});

type ServicioFormValues = z.infer<typeof servicioSchema>;

interface ServicioFormSheetProps {
  children: React.ReactNode;
  servicio?: Servicio | null;
}

export function ServicioFormSheet({ children, servicio }: ServicioFormSheetProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<ServicioFormValues>({
    resolver: zodResolver(servicioSchema),
    defaultValues: servicio || {
      title: '',
      description: '',
      icon: '',
    },
  });

  useEffect(() => {
    if (open) {
      form.reset(servicio || {
        title: '',
        description: '',
        icon: '',
      });
    }
  }, [open, servicio, form]);

  const onSubmit = async (values: ServicioFormValues) => {
    const result = await upsertServicio(values);

    if (result.success) {
      toast({
        title: `Servicio ${servicio ? 'actualizado' : 'creado'}`,
        description: 'El servicio ha sido guardado correctamente.',
      });
      setOpen(false);
    } else {
       const firstError = result.errors ? Object.values(result.errors).flat()[0] : result.error;
       const errorMessage = firstError || 'Hubo un problema al guardar el servicio.';
       toast({
        title: 'Error',
        description: errorMessage,
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
                <SheetTitle>{servicio ? 'Editar Servicio' : 'Añadir Nuevo Servicio'}</SheetTitle>
                <SheetDescription>
                  {servicio ? 'Modifica los detalles del servicio.' : 'Completa la información para crear un nuevo servicio.'}
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
                      <FormLabel>Descripción</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={5}/>
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
