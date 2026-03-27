'use server';

import { getSliderItems } from "@/lib/slider.service";
import { getAttractions } from "@/lib/atractivos.service";
import { getNovedades } from "@/lib/novedades.service";

function extractTextFromDescription(description: string | undefined): string {
    if (!description) return '';
    try {
        if (typeof description === 'string' && description.startsWith('[')) {
            const parsed = JSON.parse(description);
            return parsed.map((block: { children?: { text?: string }[] }) => 
                block.children?.map((child) => child.text).join('') || ''
            ).join(' ').slice(0, 150) + '...';
        }
        return typeof description === 'string' ? description.slice(0, 150) + '...' : '';
    } catch {
        return typeof description === 'string' ? description : '';
    }
}

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
                buttonUrl: item.buttonUrl || `/atractivos/${attraction.id}`,
                showButton: item.showButton ?? true,
            };
        }
        if (item.type === 'novedad') {
            const newest = novedades.find(n => n.id === item.id);
            if (!newest) return null;
            return {
                src: newest.imageUrl,
                alt: `Imagen de ${newest.title}`,
                hint: "event news",
                title: newest.title,
                subtitle: extractTextFromDescription(newest.description) || item.subtitle,
                buttonText: item.buttonText,
                buttonUrl: item.buttonUrl || `/novedades/${newest.id}`,
                showButton: item.showButton ?? true,
            };
        }
        return null;
    }).filter((slide): slide is NonNullable<typeof slide> => slide !== null);

    return slides;
}
