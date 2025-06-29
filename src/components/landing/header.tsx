'use client';

import Link from 'next/link';
import { Logo } from '@/components/icons';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { ThemeToggle } from '../theme-toggle';

const navLinks = [
  { href: '/atracciones', label: 'Atracciones' },
  { href: '/galeria', label: 'Galería' },
  { href: '/eventos', label: 'Eventos' },
  { href: '/contacto', label: 'Contacto' },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300',
        isScrolled ? 'border-b bg-background/80 backdrop-blur-sm' : 'bg-transparent'
      )}
    >
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2" aria-label="Volver a la página principal">
          <Logo />
          <span className="hidden font-headline text-xl font-bold text-primary sm:inline-block">
            Villa Unión
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <nav className="hidden items-center gap-6 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-medium text-foreground/80 transition-colors hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
