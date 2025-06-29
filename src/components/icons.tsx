import type { SVGProps } from 'react';

export const Logo = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100"
    width="40"
    height="40"
    {...props}
  >
    <path
      d="M50,5A45,45,0,0,0,14.64,14.64L85.36,85.36A45,45,0,0,0,50,5Z"
      fill="hsl(var(--primary))"
    />
    <path
      d="M50,95A45,45,0,0,0,85.36,85.36L14.64,14.64A45,45,0,0,0,50,95Z"
      fill="hsl(var(--accent))"
    />
    <title>Logo de Villa Unión del Talampaya</title>
  </svg>
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
    <title>Ícono de Talampaya</title>
  </svg>
);
