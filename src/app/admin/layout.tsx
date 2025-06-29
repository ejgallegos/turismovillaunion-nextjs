'use client';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { UserButton } from '@clerk/nextjs';
import { Home, Mountain, Calendar, BedDouble, Map, FileText, Bot } from 'lucide-react';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const menuItems = [
    { href: '/admin', icon: <Home className="h-4 w-4" />, label: 'Dashboard' },
    { href: '/admin/attractions', icon: <Mountain className="h-4 w-4" />, label: 'Atractivos' },
    { href: '/admin/events', icon: <Calendar className="h-4 w-4" />, label: 'Eventos' },
    { href: '/admin/services', icon: <BedDouble className="h-4 w-4" />, label: 'Servicios' },
    { href: '/admin/maps', icon: <Map className="h-4 w-4" />, label: 'Mapas' },
    { href: '/admin/brochures', icon: <FileText className="h-4 w-4" />, label: 'Folletos' },
    { href: '/admin/seo', icon: <Bot className="h-4 w-4" />, label: 'SEO' },
  ];

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 flex h-16 items-center justify-between gap-4 border-b bg-background px-4 md:px-6">
        <Link href="/admin" className="flex items-center gap-2">
            <h1 className="text-lg font-semibold">Admin Panel</h1>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
            Volver al sitio
          </Link>
          <UserButton afterSignOutUrl="/" />
        </div>
      </header>
      <div className="flex flex-1">
        <aside className="hidden w-60 flex-col border-r bg-muted/40 p-4 md:flex">
          <nav className="flex flex-col gap-1">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            {children}
        </main>
      </div>
    </div>
  );
}
