import Image from 'next/image';
import type { SVGProps } from 'react';

export const Logo = (props: React.ComponentProps<typeof Image>) => (
  <Image
    //width={100}
    //height={100}
    className="" // Ejemplo de clases Tailwind
    priority // Opcional: carga prioritaria si es importante para el layout
    //src="/images/Logos/logo.png"
    {...props}
  />
);

export const TalampayaIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M3 17l6-6 4 4 8-8" />
    <path d="M3 7l6 6 4-4 8 8" />
  </svg>
);
