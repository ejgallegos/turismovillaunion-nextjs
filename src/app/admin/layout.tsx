'use client';

import type { ReactNode } from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
  SidebarFooter,
} from '@/components/ui/sidebar';
import Link from 'next/link';
import { Logo } from '@/components/icons';
import { UserButton, useUser } from '@clerk/nextjs';
import { Home, Mountain, Calendar, BedDouble, Map, FileText, Bot } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { user } = useUser();

  const menuItems = [
    { href: '/admin', icon: <Home />, label: 'Dashboard', tooltip: 'Dashboard' },
    { href: '/admin/attractions', icon: <Mountain />, label: 'Atractivos', tooltip: 'Atractivos' },
    { href: '/admin/events', icon: <Calendar />, label: 'Eventos', tooltip: 'Eventos' },
    { href: '/admin/services', icon: <BedDouble />, label: 'Servicios', tooltip: 'Servicios' },
    { href: '/admin/maps', icon: <Map />, label: 'Mapas', tooltip: 'Mapas' },
    { href: '/admin/brochures', icon: <FileText />, label: 'Folletos', tooltip: 'Folletos' },
    { href: '/admin/seo', icon: <Bot />, label: 'SEO', tooltip: 'SEO' },
  ];

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex h-16 items-center gap-2 p-2">
            <Logo />
            <span className="duration-200 group-data-[collapsible=icon]:hidden">
              Admin Panel
            </span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton asChild tooltip={item.tooltip} isActive={pathname === item.href}>
                  <Link href={item.href}>
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
            <div className="flex items-center gap-2 p-2">
                <UserButton afterSignOutUrl="/" />
                 <div className="duration-200 group-data-[collapsible=icon]:hidden">
                    <p className="text-sm font-medium">{user?.firstName || 'Usuario'}</p>
                 </div>
            </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-16 items-center justify-between border-b px-4 lg:justify-end">
           <SidebarTrigger className="lg:hidden" />
           <Link href="/" className="font-medium text-sm hover:underline">Volver al sitio</Link>
        </header>
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
