'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword, type AuthError } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (!auth) {
        // This is a more explicit error for the user, especially in a Docker context.
        const prodMessage = "Error de configuración de Firebase. Las variables de entorno (ej: NEXT_PUBLIC_FIREBASE_API_KEY) deben estar disponibles durante el proceso de 'build' de la imagen de Docker para que la aplicación pueda usarlas. Verifique la configuración de su despliegue.";
        const devMessage = "Firebase Auth no está inicializado. Revisa las variables de entorno en tu archivo .env.";
        
        // In a Docker build, NODE_ENV should be 'production'.
        // Note: process.env.NODE_ENV is available in the browser because Next.js replaces it at build time.
        const finalMessage = process.env.NODE_ENV === 'production' ? prodMessage : devMessage;
        
        throw new Error(finalMessage);
      }
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/admin');
    } catch (error) {
      console.error('Error signing in:', error);
      
      let description = 'Ocurrió un error inesperado. Por favor, inténtalo de nuevo.';

      if (error instanceof Error) {
        if ('code' in error) {
            const authError = error as AuthError;
            switch (authError.code) {
                case 'auth/invalid-api-key':
                    description = 'La clave de API de Firebase no es válida. Verifica las variables de entorno de producción.';
                    break;
                case 'auth/invalid-credential':
                case 'auth/user-not-found':
                case 'auth/wrong-password':
                     description = 'Las credenciales son incorrectas. Por favor, comprueba tu correo y contraseña.';
                     break;
                default:
                    description = `No se pudo iniciar sesión. (${authError.code})`;
            }
        } else if (error.message.includes('Firebase')) { // Catches my custom error message
            description = error.message;
        }
      }

      toast({
        title: 'Error al iniciar sesión',
        description,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Panel de Administración</CardTitle>
          <CardDescription>Inicia sesión para gestionar el contenido.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@ejemplo.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Ingresando...' : 'Ingresar'}
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <Button variant="link" asChild className="mx-auto text-sm text-muted-foreground">
              <Link href="/">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Volver al sitio principal
              </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
