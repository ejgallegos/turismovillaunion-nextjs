import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';

export const metadata: Metadata = {
  title: 'Villa Unión del Talampaya | Your Adventure Awaits',
  description: 'Discover the natural wonders of Villa Unión. Explore Talampaya National Park, Laguna Brava, and more. Plan your trip to one of Argentina\'s most breathtaking destinations.',
  openGraph: {
    title: 'Villa Unión del Talampaya | Your Adventure Awaits',
    description: 'Discover the natural wonders of Villa Unión. Explore Talampaya National Park, Laguna Brava, and more. Plan your trip to one of Argentina\'s most breathtaking destinations.',
    url: 'https://villaunion.tur.ar', // Replace with actual URL
    siteName: 'Villa Unión del Talampaya',
    images: [
      {
        url: 'https://placehold.co/1200x630.png', // Replace with an actual hero image URL
        width: 1200,
        height: 630,
        alt: 'A stunning view of the Talampaya Canyon.',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Villa Unión del Talampaya | Your Adventure Awaits',
    description: 'Discover the natural wonders of Villa Unión. Explore Talampaya National Park, Laguna Brava, and more.',
    images: ['https://placehold.co/1200x630.png'], // Replace with an actual hero image URL
  },
  keywords: 'Villa Unión, Talampaya, La Rioja, Argentina, tourism, travel, Laguna Brava, Cuesta de Miranda, adventure',
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
