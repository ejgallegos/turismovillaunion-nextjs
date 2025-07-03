'use client';

import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { addSliderItem } from './actions';
import type { Attraction } from '@/lib/atractivos.service';
import type { Novedad } from '@/lib/novedades.service';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const sliderItemSchema = z.object({
  type: z.enum(['atractivo', 'novedad'], { required_error: 'Debe seleccionar un tipo.' }),
  id: z.string().min(1, 'Debe seleccionar un elemento.'),
  title: z.string().min(3, { message: 'El título debe tener al menos 3 caracteres.' }),
  subtitle: z.string().min(10, { message: 'El subtítulo debe tener al menos 10 caracteres.' }),
});

type SliderItemFormValues = z.infer<typeof sliderItemSchema>;

interface AddSliderItemFormProps {
  attractions: Attraction[];
  novedades: Novedad[];
}

export function AddSliderItemForm({ attractions, novedades }: AddSliderItemFormProps) {
  const { toast } = useToast();
  const form = useForm<SliderItemFormValues>({
    resolver: zodResolver(sliderItemSchema),
    defaultValues: {
      id: '',
      title: '',
      subtitle: '',
    },
  });

  const selectedType = form.watch('type');

  const itemsToShow = useMemo(() => {
    if (selectedType === 'atractivo') {
      return attractions;
    }
    if (selectedType === 'novedad') {
      return novedades;
    }
    return [];
  }, [selectedType, attractions, novedades]);
  
  const onSubmit = async (values: SliderItemFormValues) => {
    const formData = new FormData();
    formData.append('type', values.type);
    formData.append('id', values.id);
    formData.append('title', values.title);
    formData.append('subtitle', values.subtitle);

    const result = await addSliderItem(formData);
    if (result.success) {
      toast({
        title: 'Elemento añadido',
        description: 'El elemento se ha añadido al slider principal.',
      });
      form.reset();
    } else {
       const errorMessage = result.errors ? (Object.values(result.errors).flat()[0] as string) : result.error;
       toast({
        title: 'Error',
        description: errorMessage || 'No se pudo añadir el elemento.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Añadir Elemento al Slider</CardTitle>
        <CardDescription>Selecciona un tipo y luego un elemento para añadir al slider de la página principal.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Elemento</FormLabel>
                  <Select onValueChange={(value) => {
                      field.onChange(value);
                      form.setValue('id', ''); // Reset id when type changes
                    }} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un tipo..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="atractivo">Atractivo</SelectItem>
                      <SelectItem value="novedad">Novedad</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Elemento Específico</FormLabel>
                   <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value} disabled={!selectedType}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={!selectedType ? "Primero selecciona un tipo" : "Selecciona un elemento..."} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {itemsToShow.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.title}
                        </SelectItem>
                      ))}
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
                  <FormLabel>Título para el Slider</FormLabel>
                  <FormControl>
                    <Input placeholder="Título personalizado..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="subtitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subtítulo para el Slider</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Subtítulo personalizado..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? 'Añadiendo...' : 'Añadir al Slider'}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
