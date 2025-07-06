import fs from 'fs/promises';
import path from 'path';
import sliderData from '@/data/slider.json';

export interface SliderItem {
  uuid: string;
  type: 'atractivo' | 'novedad';
  id: string; // id of the attraction or novelty
  title: string;
  subtitle: string;
  buttonText?: string;
}

const dataFilePath = path.join(process.cwd(), 'src/data/slider.json');

export async function getSliderItems(): Promise<SliderItem[]> {
  // Use the imported data directly to ensure it's included in the build
  return sliderData as SliderItem[];
}

export async function saveSliderItems(items: SliderItem[]): Promise<void> {
  try {
    const data = JSON.stringify(items, null, 2);
    await fs.writeFile(dataFilePath, data, 'utf8');
  } catch (error) {
    console.error('Error saving slider data:', error);
    throw new Error('No se pudieron guardar los items del slider.');
  }
}
