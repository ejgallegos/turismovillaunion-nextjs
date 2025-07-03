'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, MapPin, Phone } from 'lucide-react';
import { sendContactEmail } from '@/app/contacto/actions';
import { Separator } from '@/components/ui/separator';

const formSchema = z.object({
  name: z.string().min(2, { message: 'El nombre debe tener al menos 2 caracteres.' }),
  email: z.string().email({ message: 'Por favor, ingresa una dirección de correo electrónico válida.' }),
  message: z.string().min(10, { message: 'El mensaje debe tener al menos 10 caracteres.' }),
});

export function Contact() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const result = await sendContactEmail(values);

    if (result.success) {
      toast({
        title: '¡Mensaje Enviado!',
        description: 'Gracias por contactarnos. Nos pondremos en contacto en breve.',
      });
      form.reset();
    } else {
      const errorMessage = result.error || 'Hubo un problema al enviar el mensaje.';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  }

  return (
    <section className="w-full bg-secondary py-20 lg:py-28">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-12 text-center">
          <h2 className="font-headline text-3xl font-bold tracking-tight text-primary md:text-4xl">
            Ponte en Contacto
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            ¿Tienes preguntas? Estamos aquí para ayudarte. Rellena el formulario y te contactaremos.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardContent className="p-8">
                <h3 className="font-headline text-2xl font-bold mb-6">Información de Contacto</h3>
                <div className="space-y-6">

                  <div>
                    <h4 className="font-semibold text-lg text-foreground mb-3">Oficina de Turismo Villa Unión</h4>
                    <div className="space-y-3 text-muted-foreground">
                      <div className="flex items-start gap-4">
                        <Clock className="h-5 w-5 flex-shrink-0 text-accent mt-0.5" />
                        <span>Todos los días de 8.30 a 21.30</span>
                      </div>
                      <div className="flex items-start gap-4">
                        <MapPin className="h-5 w-5 flex-shrink-0 text-accent mt-0.5" />
                        <span>Nicolás Dávila Sur</span>
                      </div>
                      <div className="flex items-start gap-4">
                        <Phone className="h-5 w-5 flex-shrink-0 text-accent mt-0.5" />
                        <span>3804617137</span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold text-lg text-foreground mb-3">Posta de Turismo Pagancillo</h4>
                    <div className="space-y-3 text-muted-foreground">
                      <div className="flex items-start gap-4">
                        <Clock className="h-5 w-5 flex-shrink-0 text-accent mt-0.5" />
                        <span>Todos los días de 8.30 a 22.00</span>
                      </div>
                      <div className="flex items-start gap-4">
                        <MapPin className="h-5 w-5 flex-shrink-0 text-accent mt-0.5" />
                        <span>Ruta Nro. 76</span>
                      </div>
                      <div className="flex items-start gap-4">
                        <Phone className="h-5 w-5 flex-shrink-0 text-accent mt-0.5" />
                        <span>3825587085</span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold text-lg text-foreground mb-3">Oficina de Turismo Guandacol</h4>
                    <div className="space-y-3 text-muted-foreground">
                      <div className="flex items-start gap-4">
                        <Clock className="h-5 w-5 flex-shrink-0 text-accent mt-0.5" />
                        <span>Todos los días de 9.00 a 21.00</span>
                      </div>
                      <div className="flex items-start gap-4">
                        <MapPin className="h-5 w-5 flex-shrink-0 text-accent mt-0.5" />
                        <span>San Martín s/n - Casa de Felipe Varela</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-3">
             <Card className="h-full">
              <CardContent className="p-8">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombre Completo</FormLabel>
                          <FormControl>
                            <Input placeholder="Juan Pérez" {...field} disabled={form.formState.isSubmitting} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Correo Electrónico</FormLabel>
                          <FormControl>
                            <Input placeholder="tu@ejemplo.com" {...field} disabled={form.formState.isSubmitting}/>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mensaje</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Escribe tu mensaje aquí..." rows={6} {...field} disabled={form.formState.isSubmitting} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full" size="lg" disabled={form.formState.isSubmitting}>
                      {form.formState.isSubmitting ? 'Enviando...' : 'Enviar Mensaje'}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
