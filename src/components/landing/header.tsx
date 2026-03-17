'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/icons';
import { MapPin } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const navLinks = [
  { href: '/localidades', label: 'Destinos' },
  { href: '/atractivos', label: 'Experiencias' },
  { href: '/servicios', label: 'Servicios' },
  //{ href: '/mapa-interactivo', label: 'Mapa' },
  //{ href: '/novedades', label: 'Novedades' },
  { href: '/folletos', label: 'Folletos' },
  { href: '/contacto', label: 'Contacto' },
];

export function Header() {
  return (
		<header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 md:px-10 py-3 md:py-4 backdrop-blur-md bg-black/30 border-b border-white/20">
			<Link
				href="/"
				className="flex items-center gap-3"
				aria-label="Volver a la página principal"
			>
				<Logo
					src="/images/Logos/logo-sec.png"
					alt="Secretaría de Turismo"
					width={100}
					height={100}
				/>
				{/* <h1 className="text-white text-lg md:text-xl font-black tracking-tight hidden sm:block">VILLA UNIÓN</h1> */}
			</Link>

			<nav className="hidden md:flex items-center gap-6 lg:gap-8">
				{navLinks.map((link) => (
					<Link
						key={link.href}
						href={link.href}
						className="text-white text-sm font-semibold hover:text-accent transition-colors"
					>
						{link.label}
					</Link>
				))}
			</nav>

			<div className="flex items-center gap-4">
				<Button
					asChild
					className="bg-accent hover:bg-orange-600 text-white px-4 py-2.5 rounded-xl text-sm font-bold tracking-wide transition-all shadow-lg shadow-accent/20 hidden sm:flex min-h-[44px]"
				>
					<Link href="/mapa-interactivo">
						<MapPin className="h-5 w-5" /> <span className="hidden md:inline">Mapa Interactivo</span>
					</Link>
				</Button>

				<Sheet>
					<SheetTrigger asChild>
						<Button
							variant="ghost"
							size="icon"
							className="text-white hover:bg-white/10 min-w-[44px] min-h-[44px]"
						>
							<Menu className="h-6 w-6" />
							<span className="sr-only">Abrir menú</span>
						</Button>
					</SheetTrigger>
					<SheetContent side="right">
						<SheetHeader>
							<SheetTitle>
								<SheetClose asChild>
									<Link
										href="/"
										className="flex items-center gap-2"
									>
										<Logo
											src="/images/Logos/logo-sec.png"
											alt="Secretaría de Turismo"
											width={100}
											height={100}
										/>
										{/* <span className="font-bold">VILLA UNIÓN</span> */}
									</Link>
								</SheetClose>
							</SheetTitle>
						</SheetHeader>
						<Separator className="my-4" />
						<div className="flex flex-col gap-4">
							{navLinks.map((link) => (
								<SheetClose asChild key={link.href}>
									<Link
										href={link.href}
										className="text-lg font-medium text-foreground/80 transition-colors hover:text-primary"
									>
										{link.label}
									</Link>
								</SheetClose>
							))}
							<SheetClose asChild>
								<Button asChild className="bg-accent mt-4">
									<Link href="/mapa-interactivo">
										<MapPin className="h-5 w-5" /> Mapa Interactivo
									</Link>
								</Button>
							</SheetClose>
						</div>
					</SheetContent>
				</Sheet>
			</div>
		</header>
  );
}
