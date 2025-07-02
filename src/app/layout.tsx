import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/theme-provider';

export const metadata: Metadata = {
  title: 'Villa Unión del Talampaya | Tu Aventura te Espera',
  description: 'Descubre las maravillas naturales de Villa Unión. Explora el Parque Nacional Talampaya, Laguna Brava y más. Conoce uno de los destinos más impresionantes de Argentina.',
  openGraph: {
    title: 'Villa Unión del Talampaya | Tu Aventura te Espera',
    description: 'Descubre las maravillas naturales de Villa Unión. Explora el Parque Nacional Talampaya, Laguna Brava y más. Conoce uno de los destinos más impresionantes de Argentina.',
    url: 'https://villaunion.tur.ar',
    siteName: 'Villa Unión del Talampaya',
    images: [
      {
        url: 'https://placehold.co/1200x630.png',
        width: 1200,
        height: 630,
        alt: 'Una vista impresionante del Cañón de Talampaya.',
      },
    ],
    locale: 'es_AR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Villa Unión del Talampaya | Tu Aventura te Espera',
    description: 'Descubre las maravillas naturales de Villa Unión. Explora el Parque Nacional Talampaya, Laguna Brava y más.',
    images: ['https://placehold.co/1200x630.png'],
  },
  keywords: 'Villa Unión, Talampaya, La Rioja, Argentina, turismo, viajes, Laguna Brava, Cuesta de Miranda, aventura',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
