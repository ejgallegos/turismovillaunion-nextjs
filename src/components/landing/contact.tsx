'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Mail, MapPin, Phone } from 'lucide-react';

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

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast({
      title: '¡Mensaje Enviado!',
      description: "Gracias por contactarnos. Nos pondremos en contacto en breve.",
    });
    form.reset();
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
              <CardContent className="p-8 space-y-6">
                <h3 className="font-headline text-2xl font-bold">Información de Contacto</h3>
                <div className="space-y-4 text-muted-foreground">
                  <div className="flex items-start gap-4">
                    <MapPin className="h-6 w-6 flex-shrink-0 text-accent" />
                    <span>Ruta 40, F5360 Villa Unión, La Rioja, Argentina</span>
                  </div>
                  <div className="flex items-start gap-4">
                    <Phone className="h-6 w-6 flex-shrink-0 text-accent" />
                    <span>+54 (3825) 47-0543</span>
                  </div>
                  <div className="flex items-start gap-4">
                    <Mail className="h-6 w-6 flex-shrink-0 text-accent" />
                    <span>info@villaunion.tur.ar</span>
                  </div>
                </div>
                <div className="aspect-video w-full overflow-hidden rounded-lg">
                    <Image src="https://placehold.co/600x400.png" data-ai-hint="map location" width={600} height={400} alt="Mapa de Villa Unión" className="object-cover w-full h-full"/>
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
                            <Input placeholder="Juan Pérez" {...field} />
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
                            <Input placeholder="tu@ejemplo.com" {...field} />
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
                            <Textarea placeholder="Escribe tu mensaje aquí..." rows={6} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full" size="lg">Enviar Mensaje</Button>
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
