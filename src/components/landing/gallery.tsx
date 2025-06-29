import Image from 'next/image';

const galleryImages = [
  { src: 'https://placehold.co/600x400.png', alt: 'Talampaya canyon walls', hint: 'canyon walls' },
  { src: 'https://placehold.co/600x800.png', alt: 'Vicuñas at Laguna Brava', hint: 'wildlife lagoon' },
  { src: 'https://placehold.co/600x400.png', alt: 'The winding Cuesta de Miranda road', hint: 'mountain road' },
  { src: 'https://placehold.co/600x400.png', alt: 'Rock formation known as "The Monk"', hint: 'rock formation' },
  { src: 'https://placehold.co/600x400.png', alt: 'Flamingos in the high-altitude lagoon', hint: 'flamingos lagoon' },
  { src: 'https://placehold.co/600x800.png', alt: 'A starry night sky over the desert', hint: 'night sky' },
];

export function Gallery() {
  return (
    <section id="gallery" className="w-full py-20 lg:py-28">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-12 text-center">
          <h2 className="font-headline text-3xl font-bold tracking-tight text-primary md:text-4xl">
            Visual Journey
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Experience the breathtaking beauty of our landscapes through our lens.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="grid gap-4">
            <div className="overflow-hidden rounded-lg shadow-lg">
              <Image
                src={galleryImages[0].src}
                alt={galleryImages[0].alt}
                data-ai-hint={galleryImages[0].hint}
                width={600}
                height={400}
                className="h-auto w-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
            <div className="overflow-hidden rounded-lg shadow-lg">
              <Image
                src={galleryImages[1].src}
                alt={galleryImages[1].alt}
                data-ai-hint={galleryImages[1].hint}
                width={600}
                height={800}
                className="h-auto w-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
          </div>
          <div className="grid gap-4">
            <div className="overflow-hidden rounded-lg shadow-lg">
              <Image
                src={galleryImages[2].src}
                alt={galleryImages[2].alt}
                data-ai-hint={galleryImages[2].hint}
                width={600}
                height={800}
                className="h-auto w-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
            <div className="overflow-hidden rounded-lg shadow-lg">
              <Image
                src={galleryImages[3].src}
                alt={galleryImages[3].alt}
                data-ai-hint={galleryImages[3].hint}
                width={600}
                height={400}
                className="h-auto w-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
          </div>
          <div className="grid gap-4">
            <div className="overflow-hidden rounded-lg shadow-lg">
              <Image
                src={galleryImages[4].src}
                alt={galleryImages[4].alt}
                data-ai-hint={galleryImages[4].hint}
                width={600}
                height={400}
                className="h-auto w-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
             <div className="overflow-hidden rounded-lg shadow-lg">
              <Image
                src={galleryImages[5].src}
                alt={galleryImages[5].alt}
                data-ai-hint={galleryImages[5].hint}
                width={600}
                height={800}
                className="h-auto w-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
          </div>
           <div className="grid gap-4">
             <div className="overflow-hidden rounded-lg shadow-lg">
              <Image
                src={galleryImages[0].src}
                alt={galleryImages[0].alt}
                data-ai-hint={galleryImages[0].hint}
                width={600}
                height={800}
                className="h-auto w-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
            <div className="overflow-hidden rounded-lg shadow-lg">
              <Image
                src={galleryImages[1].src}
                alt={galleryImages[1].alt}
                data-ai-hint={galleryImages[1].hint}
                width={600}
                height={400}
                className="h-auto w-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
