import Link from 'next/link';
import { Logo } from '@/components/icons';
import { Button } from '@/components/ui/button';

// A mock social icon component
const SocialIcon = ({ children, href }: { children: React.ReactNode, href: string }) => (
  <Button variant="ghost" size="icon" asChild>
    <Link href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </Link>
  </Button>
);

const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
);
const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>
);
const TwitterIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 1.4 3.3 4.9 3.3 4.9s-1.4-1-3-1.3c-1.5-1.6-3-2.1-5-1.5s-4 1.5-4 4.5 1.5 5.5 5 5.5c2.5 0 4.5-2.5 4.5-2.5s-1.5 1-4.5 1c-3.5 0-5-3.5-5-5.5s1.5-5.5 5-5.5c2 0 3 .5 4.5 1.5s2.5 2.5 2.5 2.5z"></path></svg>
);


export function Footer() {
  return (
    <footer className="w-full bg-background border-t">
      <div className="container mx-auto px-4 md:px-6 py-8">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center gap-2">
            <Logo />
            <span className="font-headline text-lg font-bold">Villa Unión del Talampaya</span>
          </div>
          <div className="flex items-center gap-2">
            <SocialIcon href="#"><FacebookIcon className="h-5 w-5"/></SocialIcon>
            <SocialIcon href="#"><InstagramIcon className="h-5 w-5"/></SocialIcon>
            <SocialIcon href="#"><TwitterIcon className="h-5 w-5"/></SocialIcon>
          </div>
        </div>
        <div className="mt-6 border-t pt-6 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Secretaría de Turismo de Villa Unión. Todos los derechos reservados.</p>
          <p className="mt-1">Desarrollado con fines de demostración.</p>
        </div>
      </div>
    </footer>
  );
}
