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
                alt: `Imagen de ${item.title}`,
                hint: "landscape",
                title: item.title,
                subtitle: item.subtitle,
                buttonText: item.buttonText,
                buttonLink: `/atractivos/${attraction.id}`
            };
        }
        if (item.type === 'novedad') {
            const novedad = novedades.find(n => n.id === item.id);
            if (!novedad) return null;
            return {
                src: novedad.imageUrl,
                alt: `Imagen de ${item.title}`,
                hint: "event news",
                title: item.title,
                subtitle: item.subtitle,
                buttonText: item.buttonText,
                buttonLink: `/novedades/${novedad.id}`
            };
        }
        return null;
    }).filter((slide): slide is NonNullable<typeof slide> => slide !== null);

    return slides;
}
