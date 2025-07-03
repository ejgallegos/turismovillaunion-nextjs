'use client';

import React from 'react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import type { GalleryItem } from '@/lib/galeria.service';
import { EmptyState } from '../empty-state';
import { CameraOff } from 'lucide-react';

interface GalleryProps {
    items: GalleryItem[];
}

export function Gallery({ items }: GalleryProps) {
    return (
        <section id="galeria" className="w-full bg-secondary py-20 lg:py-28">
            <div className="container mx-auto px-4 md:px-6">
                <div className="mb-12 text-center">
                    <h2 className="font-headline text-3xl font-bold tracking-tight text-primary md:text-4xl">
                        Galería de Imágenes
                    </h2>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                        Un vistazo a la belleza de nuestra tierra, capturada en momentos inolvidables.
                    </p>
                </div>

                {items.length > 0 ? (
                    <div className="grid grid-cols-2 gap-2 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
                        {items.map((item) => (
                            <Dialog key={item.id}>
                                <DialogTrigger asChild>
                                    <div className="group relative aspect-square cursor-pointer overflow-hidden rounded-lg">
                                        <Image
                                            src={item.imageUrl}
                                            alt={item.title}
                                            fill
                                            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                                        <div className="absolute bottom-0 left-0 p-4">
                                            <h3 className="translate-y-4 text-lg font-bold text-white opacity-0 drop-shadow-md transition-all group-hover:translate-y-0 group-hover:opacity-100">{item.title}</h3>
                                        </div>
                                    </div>
                                </DialogTrigger>
                                <DialogContent className="max-w-4xl p-2 sm:p-4">
                                    <div className="relative aspect-video">
                                        <Image src={item.imageUrl} alt={item.title} fill className="object-contain rounded-md" />
                                    </div>
                                    <DialogHeader className="pt-4 text-left">
                                        <DialogTitle>{item.title}</DialogTitle>
                                        {item.description && (
                                            <DialogDescription>{item.description}</DialogDescription>
                                        )}
                                    </DialogHeader>
                                </DialogContent>
                            </Dialog>
                        ))}
                    </div>
                ) : (
                    <EmptyState 
                        title="La galería está vacía" 
                        description="Aún no se han añadido imágenes. Vuelve a consultar más tarde." 
                        icon={<CameraOff className="h-16 w-16 text-muted-foreground" />}
                    />
                )}
            </div>
        </section>
    );
}
