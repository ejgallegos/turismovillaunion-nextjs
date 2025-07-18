import fs from 'fs/promises';
import path from 'path';
import sliderItems from '../../data/slider.json';

export interface SliderItem {
  uuid: string;
  type: 'atractivo' | 'novedad';
  id: string; // id of the attraction or novelty
  title: string;
  subtitle: string;
  buttonText?: string;
}

const dataFilePath = path.join(process.cwd(), 'data/slider.json');

export async function getSliderItems(): Promise<SliderItem[]> {
  return sliderItems;
}

export async function saveSliderItems(items: SliderItem[]): Promise<void> {
  try {
    const data = JSON.stringify(items, null, 2);
    await fs.mkdir(path.dirname(dataFilePath), { recursive: true });
    await fs.writeFile(dataFilePath, data, 'utf8');
  } catch (error) {
    console.error('Error saving slider data:', error);
    throw new Error('No se pudieron guardar los items del slider.');
  }
}
