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
import { UserButton } from '@clerk/nextjs';
import { Home, Mountain, Calendar, BedDouble, Map, FileText, Bot } from 'lucide-react';

export default function AdminLayout({ children }: { children: ReactNode }) {
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
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Dashboard" isActive={true}>
                <Link href="/admin">
                  <Home />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Atractivos">
                <Link href="/admin/attractions">
                  <Mountain />
                  <span>Atractivos</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Eventos">
                <Link href="/admin/events">
                  <Calendar />
                  <span>Eventos</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Servicios">
                <Link href="/admin/services">
                  <BedDouble />
                  <span>Servicios</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Mapas">
                <Link href="/admin/maps">
                  <Map />
                  <span>Mapas</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Folletos">
                <Link href="/admin/brochures">
                  <FileText />
                  <span>Folletos</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="SEO">
                <Link href="/admin/seo">
                  <Bot />
                  <span>SEO</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
            <div className="flex items-center gap-2 p-2">
                <UserButton afterSignOutUrl="/" />
                 <div className="duration-200 group-data-[collapsible=icon]:hidden">
                    <p className="text-sm font-medium">Usuario</p>
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
