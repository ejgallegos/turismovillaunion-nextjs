'use server';

import { getSliderItems } from "@/lib/slider.service";
import { getAttractions } from "@/lib/atractivos.service";
import { getNovedades } from "@/lib/novedades.service";

export async function getHeroSlidesData() {
    const [sliderItems, attractions, novedades] = await Promise.all([
        getSliderItems(),
        getAttractions(),
        getNovedades(),
    ]);

    const slides = sliderItems.map(item => {
        if (item.type === 'atractivo') {
            const attraction = attractions.find(a => a.id === item.id);
            if (!attraction) return null;
            return {
                src: attraction.imageUrl,
                alt: `Imagen de ${attraction.title}`,
                hint: "landscape",
                title: attraction.title,
                subtitle: attraction.description.replace(/<[^>]*>/g, ''),
                buttonText: "Conocer Más",
                buttonLink: `/atractivos/${attraction.id}`
            };
        }
        if (item.type === 'novedad') {
            const novedad = novedades.find(n => n.id === item.id);
            if (!novedad) return null;
            return {
                src: novedad.imageUrl,
                alt: `Imagen de ${novedad.title}`,
                hint: "event news",
                title: novedad.title,
                subtitle: novedad.description.replace(/<[^>]*>/g, ''),
                buttonText: "Leer Más",
                buttonLink: `/novedades/${novedad.id}`
            };
        }
        return null;
    }).filter((slide): slide is NonNullable<typeof slide> => slide !== null);

    return slides;
}
