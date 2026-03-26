import { getSliderItems, type SliderItem } from '@/lib/slider.service';
import { getAttractions, type Attraction } from '@/lib/atractivos.service';
import { getNovedades, type Novedad } from '@/lib/novedades.service';
import SliderClient from './slider-client';

export const dynamic = 'force-dynamic';

export default async function AdminSliderPage() {
  const [sliderItems, attractions, novedades] = await Promise.all([
    getSliderItems(),
    getAttractions(),
    getNovedades()
  ]);

  return (
    <SliderClient 
      initialSliderItems={sliderItems} 
      initialAttractions={attractions} 
      initialNovedades={novedades} 
    />
  );
}
