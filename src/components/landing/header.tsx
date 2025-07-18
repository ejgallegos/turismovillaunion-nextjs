'use client';

import Link from 'next/link';
import { Logo } from '@/components/icons';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '../theme-toggle';
import { Button } from '@/components/ui/button';
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
  { href: '/localidades', label: 'Localidades' },
  { href: '/atractivos', label: 'Atractivos' },
  { href: '/servicios', label: 'Servicios' },
  { href: '/mapas', label: 'Mapas' },
  { href: '/folletos', label: 'Folletos' },
  { href: '/contacto', label: 'Contacto' },
];

export function Header() {
  return (
		<header
			className={cn(
				"sticky top-0 z-50 w-full border-b bg-background shadow-sm"
			)}
		>
			<div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
				<Link
					href="/"
					className="flex items-center gap-2"
					aria-label="Volver a la página principal"
				>
					<Logo
						src="/images/Logos/logo-sec.png"
						alt={"Secretaría de Turísmo"}
						width={125}
						height={125}
					/>
				</Link>

				<nav className="hidden items-center gap-6 lg:flex">
					{navLinks.map((link) => (
						<Link
							key={link.href}
							href={link.href}
							className="font-medium text-foreground/80 transition-colors hover:text-primary"
						>
							{link.label}
						</Link>
					))}
					<ThemeToggle />
				</nav>

				<div className="flex items-center gap-2 lg:hidden">
					<ThemeToggle />
					<Sheet>
						<SheetTrigger asChild>
							<Button variant="ghost" size="icon">
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
												alt={"Secretaría de Turísmo"}
												width={125}
												height={125}
											/>
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
							</div>
						</SheetContent>
					</Sheet>
				</div>
			</div>
		</header>
  );
}
