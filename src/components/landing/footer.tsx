import Link from 'next/link';
import * as React from 'react';
import { Logo } from '@/components/icons';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
);

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>
);

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
);

const SocialIcon = ({ href, children }: { href: string, children: React.ReactNode }) => (
  <Link href={href} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary transition-colors">
    {children}
  </Link>
);

export function Footer() {
  return (
    <footer className="bg-[#1d131f] text-white py-20 mt-32 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          {/* Logo Column */}
          <div className="col-span-1 lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <Logo
                src="/images/Logos/logo-sec.png"
                alt="Secretaría de Turismo"
                width={80}
                height={80}
              />
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Portal Oficial de Turismo del Departamento General Felipe Varela. 
              Descubrí la magia de Villa Unión, puerta de entrada al Parque Nacional Talampaya y las Siete Maravillas de Argentina.
            </p>
            <div className="space-y-3 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 shrink-0" />
                <span>Av. San Martín s/n, Villa Unión, La Rioja</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 shrink-0" />
                <span>+54 0380 442-1234</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 shrink-0" />
                <span>turismo@villaunion.gob.ar</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 shrink-0" />
                <span>Lun - Vie: 8:00 a 20:00</span>
              </div>
            </div>
          </div>
          
          {/* Destinos Column */}
          <div>
            <h5 className="font-bold mb-6 text-primary">Destinos</h5>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><Link href="/localidades/villa-union" className="hover:text-white transition-colors">Villa Unión</Link></li>
              <li><Link href="/localidades/banda-florida" className="hover:text-white transition-colors">Banda Florida</Link></li>
              <li><Link href="/localidades/los-palacios" className="hover:text-white transition-colors">Los Palacios</Link></li>
              <li><Link href="/localidades/guandacol" className="hover:text-white transition-colors">Guandacol</Link></li>
              <li><Link href="/localidades/aicu-a" className="hover:text-white transition-colors">Aicuña</Link></li>
              <li><Link href="/localidades/pagancillo" className="hover:text-white transition-colors">Pagancillo</Link></li>
            </ul>
          </div>
          
          {/* Experiencias Column */}
          <div>
            <h5 className="font-bold mb-6 text-primary">Experiencias</h5>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><Link href="/atractivos/talampaya" className="hover:text-white transition-colors">Parque Nacional Talampaya</Link></li>
              <li><Link href="/atractivos/anchumbil" className="hover:text-white transition-colors">Cañón de Anchumbil</Link></li>
              <li><Link href="/atractivos/ca-n-del-tri-sico" className="hover:text-white transition-colors">Cañón del Triásico</Link></li>
              <li><Link href="/atractivos/mirador-la-loma" className="hover:text-white transition-colors">Mirador La Loma</Link></li>
              <li><Link href="/localidades/guandacol" className="hover:text-white transition-colors">Vallecito Encantado</Link></li>
              <li><Link href="/mapa-interactivo" className="hover:text-white transition-colors">Mapa Interactivo</Link></li>
            </ul>
          </div>
          
          {/* Follow Us Column */}
          <div>
            <h5 className="font-bold mb-6 text-primary">Síguenos</h5>
            <p className="text-slate-400 text-sm mb-4">
              Enterate de las últimas noticias, eventos y promociones turísticas.
            </p>
            <div className="flex gap-4 mb-6">
              <SocialIcon href="https://www.facebook.com/share/1GKhf5pKNx/?mibextid=qi2Omg">
                <FacebookIcon />
              </SocialIcon>
              <SocialIcon href="https://www.instagram.com">
                <InstagramIcon className="h-5 w-5" />
              </SocialIcon>
              <SocialIcon href="https://wa.me/5493804421234">
                <WhatsAppIcon className="h-5 w-5" />
              </SocialIcon>
            </div>
            <div className="space-y-2 text-sm text-slate-400">
              <Link href="/contacto" className="block hover:text-white transition-colors">Contacto</Link>
              <Link href="/mapas" className="block hover:text-white transition-colors">Mapas y Folletos</Link>
              <Link href="/novedades" className="block hover:text-white transition-colors">Novedades</Link>
            </div>
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 text-xs">
          <p>© {new Date().getFullYear()} Villa Unión Turismo. Todos los derechos reservados.</p>
          <div className="flex gap-8">
            <Link href="#" className="hover:text-white transition-colors">Política de Privacidad</Link>
            <Link href="#" className="hover:text-white transition-colors">Términos de Servicio</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
