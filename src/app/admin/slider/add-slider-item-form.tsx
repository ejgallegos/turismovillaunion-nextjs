'use client';

import { useMemo, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { addSliderItem, updateSliderItem } from './actions';
import type { Attraction } from '@/lib/atractivos.service';
import type { Novedad } from '@/lib/novedades.service';
import type { SliderItem } from '@/lib/slider.service';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';

const sliderItemSchema = z.object({
  uuid: z.string().optional(),
  type: z.enum(['atractivo', 'novedad'], { required_error: 'Debe seleccionar un tipo.' }),
  id: z.string().min(1, 'Debe seleccionar un elemento.'),
  title: z.string().min(3, { message: 'El título debe tener al menos 3 caracteres.' }),
  subtitle: z.string().min(10, { message: 'El subtítulo debe tener al menos 10 caracteres.' }),
  buttonText: z.string().optional(),
  buttonUrl: z.string().url({ message: 'URL inválida' }).optional().or(z.literal('')),
  showButton: z.boolean().optional(),
});

type SliderItemFormValues = z.infer<typeof sliderItemSchema>;

interface AddSliderItemFormProps {
  attractions: Attraction[];
  novedades: Novedad[];
  editingItem?: SliderItem;
  onSuccess?: () => void;
  onCancel?: () => void;
  onSuccessUrl?: string;
  onCancelUrl?: string;
}

export function AddSliderItemForm({ attractions, novedades, editingItem, onSuccess, onCancel, onSuccessUrl, onCancelUrl }: AddSliderItemFormProps) {
  const { toast } = useToast();
  const form = useForm<SliderItemFormValues>({
    resolver: zodResolver(sliderItemSchema),
    defaultValues: {
      uuid: '',
      type: 'atractivo',
      id: '',
      title: '',
      subtitle: '',
      buttonText: '',
      buttonUrl: '',
      showButton: false,
    },
  });

  // Populate form when editing
  useEffect(() => {
    if (editingItem) {
      form.reset({
        uuid: editingItem.uuid,
        type: editingItem.type,
        id: editingItem.id,
        title: editingItem.title,
        subtitle: editingItem.subtitle,
        buttonText: editingItem.buttonText || '',
        buttonUrl: editingItem.buttonUrl || '',
        showButton: editingItem.showButton || false,
      });
    }
  }, [editingItem, form]);

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
    if (values.uuid) {
      formData.append('uuid', values.uuid);
    }
    formData.append('type', values.type);
    formData.append('id', values.id);
    formData.append('title', values.title);
    formData.append('subtitle', values.subtitle);
    if (values.buttonText) {
      formData.append('buttonText', values.buttonText);
    }
    if (values.buttonUrl) {
      formData.append('buttonUrl', values.buttonUrl);
    }
    formData.append('showButton', values.showButton ? 'on' : 'off');

    let result;
    if (editingItem) {
      result = await updateSliderItem(formData);
      if (result.success) {
        toast({
          title: 'Elemento actualizado',
          description: 'El elemento se ha actualizado correctamente.',
        });
        if (onSuccess) {
          onSuccess();
        } else if (onSuccessUrl) {
          window.location.href = onSuccessUrl;
        }
      } else {
        const errorMessage = result.errors ? (Object.values(result.errors).flat()[0] as string) : result.error;
        toast({
          title: 'Error',
          description: errorMessage || 'No se pudo actualizar el elemento.',
          variant: 'destructive',
        });
      }
    } else {
      result = await addSliderItem(formData);
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
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{editingItem ? 'Editar Elemento' : 'Añadir Elemento al Slider'}</CardTitle>
        <CardDescription>{editingItem ? 'Modifica los datos del elemento seleccionado.' : 'Selecciona un tipo y luego un elemento para añadir al slider de la página principal.'}</CardDescription>
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
            <FormField
              control={form.control}
              name="showButton"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Mostrar Botón</FormLabel>
                    <CardDescription>
                      Habilita para mostrar el botón en el slider
                    </CardDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            {form.watch('showButton') && (
              <>
                <FormField
                  control={form.control}
                  name="buttonText"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Texto del Botón</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej: Ver más, Explorar..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="buttonUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL del Botón</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej: https://ejemplo.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
          </CardContent>
          <CardFooter className="flex gap-2">
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? 'Guardando...' : editingItem ? 'Actualizar' : 'Añadir al Slider'}
            </Button>
            {editingItem && (onCancel || onCancelUrl) && (
              <Button type="button" variant="outline" onClick={() => {
                if (onCancel) {
                  onCancel();
                } else if (onCancelUrl) {
                  window.location.href = onCancelUrl;
                }
              }}>
                Cancelar
              </Button>
            )}
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
