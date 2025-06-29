'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar as CalendarIcon } from 'lucide-react';

import { upsertEvento } from './actions';
import type { Evento } from '@/lib/eventos.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormField, FormItem, FormMessage, FormLabel } from '@/components/ui/form';
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from '@/components/ui/sheet';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';


const eventoSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3, { message: 'El título debe tener al menos 3 caracteres.' }),
  description: z.string().min(10, { message: 'La descripción debe tener al menos 10 caracteres.' }),
  date: z.date({ required_error: 'La fecha es requerida.' }),
  category: z.string().min(3, { message: 'La categoría debe tener al menos 3 caracteres.' }),
  icon: z.string().min(2, { message: 'El ícono es requerido (ej: Sun, Calendar).' }),
});

type EventoFormValues = z.infer<typeof eventoSchema>;

interface EventoFormSheetProps {
  children: React.ReactNode;
  evento?: Evento | null;
}

export function EventoFormSheet({ children, evento }: EventoFormSheetProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  
  const defaultValues = evento
    ? { ...evento, date: new Date(`${evento.date}T00:00:00`) } // Ensure correct date parsing
    : {
        title: '',
        description: '',
        date: new Date(),
        category: '',
        icon: '',
      };

  const form = useForm<EventoFormValues>({
    resolver: zodResolver(eventoSchema),
    defaultValues,
  });

  useEffect(() => {
    if (open) {
      const resetValues = evento
        ? { ...evento, date: new Date(`${evento.date}T00:00:00`) }
        : {
            title: '',
            description: '',
            date: new Date(),
            category: '',
            icon: '',
          };
      form.reset(resetValues);
    }
  }, [open, evento, form]);

  const onSubmit = async (values: EventoFormValues) => {
    // Format date back to string for the server action
    const dataToSubmit = {
      ...values,
      date: format(values.date, 'yyyy-MM-dd'),
    };
    const result = await upsertEvento(dataToSubmit);

    if (result.success) {
      toast({
        title: `Evento ${evento ? 'actualizado' : 'creado'}`,
        description: 'El evento ha sido guardado correctamente.',
      });
      setOpen(false);
    } else {
       const firstError = result.errors ? Object.values(result.errors).flat()[0] : result.error;
       const errorMessage = firstError || 'Hubo un problema al guardar el evento.';
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
                <SheetTitle>{evento ? 'Editar Evento' : 'Añadir Nuevo Evento'}</SheetTitle>
                <SheetDescription>
                  {evento ? 'Modifica los detalles del evento.' : 'Completa la información para crear un nuevo evento.'}
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
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Fecha del Evento</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP", { locale: es })
                              ) : (
                                <span>Elige una fecha</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categoría</FormLabel>
                      <FormControl>
                        <Input {...field} />
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
                        <Input {...field} placeholder="Ej: Sun, Calendar, Users" />
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
