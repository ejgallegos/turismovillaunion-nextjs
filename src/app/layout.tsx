import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/theme-provider';
import { WhatsAppButton } from '@/components/whatsapp-button';
import { GoogleAnalytics } from '@/components/google-analytics';
import { Suspense } from 'react';
import { RecaptchaProvider } from '@/components/recaptcha-provider';
import { OrganizationSchema } from '@/components/seo/schema';

export const metadata: Metadata = {
	title: "Secretaría de Turismo del Dpto. Felipe Varela",
	description:
		"Descubre las maravillas naturales de nuestro Departamento Felipe Varela. Explora nuestros mejores atractivos. Y conoce uno de los destinos más impresionantes de Argentina.",
	metadataBase: new URL('https://turismovillaunion.gob.ar'),
	alternates: {
		canonical: '/',
		languages: {
			'es': '/',
		},
	},
	icons: {
		icon: "/favicon.ico",
		shortcut: "/favicon.ico",
		apple: "/favicon.ico",
	},
	other: {
		"theme-color": "#7c3aed",
	},
	openGraph: {
		title: "Secretaría de Turismo del Dpto. Felipe Varela",
		description:
			"Descubre las maravillas naturales de nuestro Departamento Felipe Varela. Explora nuestros mejores atractivos. Y conoce uno de los destinos más impresionantes de Argentina.",
		url: "https://turismovillaunion.gob.ar",
		siteName: "Secretaría de Turismo del Dpto. Felipe Varela",
		images: [
			{
				url: "/images/Logos/logo-sec.png",
				width: 1200,
				height: 630,
				alt: "Secretaría de Turismo del Dpto. Felipe Varela",
			},
		],
		locale: "es_AR",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Secretaría de Turismo del Dpto. Felipe Varela",
		description:
			"Descubre las maravillas naturales de nuestro Departamento Felipe Varela. Explora nuestros mejores atractivos. Y conoce uno de los destinos más impresionantes de Argentina.",
		images: ["/images/Logos/logo-sec.png"],
	},
	keywords:
		"Villa Unión, Talampaya, La Rioja, Argentina, turismo, viajes, Cuesta de Miranda, aventura",
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
    <html lang="es" className="scroll-smooth" suppressHydrationWarning style={{ colorScheme: 'light dark' }}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
        <OrganizationSchema />
      </head>
      <body className="font-body antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <RecaptchaProvider>
            {children}
            <WhatsAppButton />
            <Toaster />
          </RecaptchaProvider>
        </ThemeProvider>
        <Suspense fallback={null}>
          <GoogleAnalytics />
        </Suspense>
      </body>
    </html>
  );
}
