'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { LayoutDashboard, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!auth) {
        // This can happen if Firebase keys are not in .env
        // Redirect to login, where the form will show an error message.
        router.push('/login');
        return;
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push('/login');
      } else {
        setUser(currentUser);
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleSignOut = async () => {
    if (!auth) return;
    await auth.signOut();
    router.push('/login');
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 z-50">
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <Link href="/admin" className="flex items-center gap-2 text-lg font-semibold md:text-base">
            <LayoutDashboard className="h-6 w-6 text-primary" />
            <span className="font-headline text-xl font-bold text-primary">Admin</span>
          </Link>
          <Link href="/admin/atractivos" className="text-muted-foreground transition-colors hover:text-foreground">
            Atractivos
          </Link>
          <Link href="/admin/localidades" className="text-muted-foreground transition-colors hover:text-foreground">
            Localidades
          </Link>
          <Link href="/admin/novedades" className="text-muted-foreground transition-colors hover:text-foreground">
            Novedades
          </Link>
          <Link href="/admin/servicios" className="text-muted-foreground transition-colors hover:text-foreground">
            Servicios
          </Link>
           <Link href="/admin/folletos" className="text-muted-foreground transition-colors hover:text-foreground">
            Folletos
          </Link>
          <Link href="/admin/mapas" className="text-muted-foreground transition-colors hover:text-foreground">
            Mapas
          </Link>
           <Link href="/admin/slider" className="text-muted-foreground transition-colors hover:text-foreground">
            Slider
          </Link>
        </nav>
        <div className="flex w-full items-center justify-end gap-4 md:ml-auto md:gap-2 lg:gap-4">
           <div className='text-sm text-muted-foreground'>
            {user?.email}
           </div>
          <Button onClick={handleSignOut} variant="outline" size="sm">
            Cerrar Sesión
          </Button>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        {children}
      </main>
    </div>
  );
}
