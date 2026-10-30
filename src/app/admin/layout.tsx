'use client';

import { useState } from 'react';
import { LayoutDashboard, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
		<div className="flex min-h-screen w-full flex-col">
			<header className="sticky top-0 flex h-16 items-center gap-2 border-b bg-background px-4 md:px-6 z-50">
				{/* Mobile menu button */}
				<button
					className="md:hidden p-2 hover:bg-accent rounded-md"
					onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
					aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
				>
					{mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
				</button>

				{/* Desktop navigation */}
				<nav className="hidden md:flex md:items-center md:gap-1 overflow-visible flex-1">
					<Link
						href="/admin"
						className="flex items-center gap-1 text-lg font-semibold md:text-sm flex-shrink-0"
					>
						<LayoutDashboard className="h-4 w-4 text-primary" />
						<span className="font-headline font-bold text-primary whitespace-nowrap">
							Admin
						</span>
					</Link>
					{/* Main items visible on all desktop screens */}
					<div className="hidden md:flex md:items-center md:gap-0 lg:gap-1">
						<Link
							href="/admin/atractivos"
							className="text-muted-foreground transition-colors hover:text-foreground whitespace-nowrap px-1 lg:px-2 py-1 text-xs lg:text-sm"
						>
							Atractivos
						</Link>
						<Link
							href="/admin/localidades"
							className="text-muted-foreground transition-colors hover:text-foreground whitespace-nowrap px-1 lg:px-2 py-1 text-xs lg:text-sm"
						>
							Localidades
						</Link>
						<Link
							href="/admin/novedades"
							className="text-muted-foreground transition-colors hover:text-foreground whitespace-nowrap px-1 lg:px-2 py-1 text-xs lg:text-sm"
						>
							Novedades
						</Link>
						<Link
							href="/admin/servicios"
							className="text-muted-foreground transition-colors hover:text-foreground whitespace-nowrap px-1 lg:px-2 py-1 text-xs lg:text-sm"
						>
							Servicios
						</Link>
						<Link
							href="/admin/folletos"
							className="text-muted-foreground transition-colors hover:text-foreground whitespace-nowrap px-1 lg:px-2 py-1 text-xs lg:text-sm"
						>
							Folletos
						</Link>
						<Link
							href="/admin/mapa-interactivo"
							className="text-muted-foreground transition-colors hover:text-foreground whitespace-nowrap px-1 lg:px-2 py-1 text-xs lg:text-sm"
						>
							Mapa Int.
						</Link>
						<Link
							href="/admin/slider"
							className="text-muted-foreground transition-colors hover:text-foreground whitespace-nowrap px-1 lg:px-2 py-1 text-xs lg:text-sm"
						>
							Slider
						</Link>
					</div>
				</nav>

				{/* Right side - local mode indicator */}
				<div className="flex w-full items-center justify-end gap-2 md:ml-auto md:gap-2 lg:gap-4">
					<span className="rounded-full border px-3 py-1 text-xs font-medium text-muted-foreground">
						Modo local
					</span>
					<Button variant="outline" size="sm" asChild>
						<Link href="/">Ver sitio</Link>
					</Button>
				</div>
			</header>

			{/* Mobile menu overlay */}
			{mobileMenuOpen && (
				<div className="fixed inset-0 z-40 md:hidden">
					{/* Backdrop */}
					<div 
						className="absolute inset-0 bg-background/80 backdrop-blur-sm"
						onClick={closeMobileMenu}
					/>
					{/* Mobile menu panel */}
					<nav className="absolute left-0 top-16 h-[calc(100vh-4rem)] w-64 overflow-y-auto border-r bg-background p-4 shadow-lg">
						<div className="flex flex-col gap-2">
							<Link
								href="/admin"
								onClick={closeMobileMenu}
								className="flex items-center gap-2 text-lg font-semibold p-2 rounded-md hover:bg-accent"
							>
								<LayoutDashboard className="h-5 w-5 text-primary" />
								<span className="font-headline font-bold text-primary">
									Admin
								</span>
							</Link>
							<div className="h-px bg-border my-2" />
							<Link
								href="/admin/atractivos"
								onClick={closeMobileMenu}
								className="text-muted-foreground transition-colors hover:text-foreground p-2 rounded-md hover:bg-accent"
							>
								Atractivos
							</Link>
							<Link
								href="/admin/localidades"
								onClick={closeMobileMenu}
								className="text-muted-foreground transition-colors hover:text-foreground p-2 rounded-md hover:bg-accent"
							>
								Local
							</Link>
							<Link
								href="/admin/novedades"
								onClick={closeMobileMenu}
								className="text-muted-foreground transition-colors hover:text-foreground p-2 rounded-md hover:bg-accent"
							>
								Novedades
							</Link>
							<Link
								href="/admin/servicios"
								onClick={closeMobileMenu}
								className="text-muted-foreground transition-colors hover:text-foreground p-2 rounded-md hover:bg-accent"
							>
								Servicios
							</Link>
							<Link
								href="/admin/folletos"
								onClick={closeMobileMenu}
								className="text-muted-foreground transition-colors hover:text-foreground p-2 rounded-md hover:bg-accent"
							>
								Folletos
							</Link>
							<Link
								href="/admin/mapa-interactivo"
								onClick={closeMobileMenu}
								className="text-muted-foreground transition-colors hover:text-foreground p-2 rounded-md hover:bg-accent"
							>
								Mapa Interactivo
							</Link>
							<Link
								href="/admin/slider"
								onClick={closeMobileMenu}
								className="text-muted-foreground transition-colors hover:text-foreground p-2 rounded-md hover:bg-accent"
							>
								Slider
							</Link>
						</div>
					</nav>
				</div>
			)}

			<main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
				{children}
			</main>
		</div>
  );
}
