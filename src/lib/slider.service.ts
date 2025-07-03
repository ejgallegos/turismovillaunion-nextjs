import fs from 'fs/promises';
import path from 'path';

export interface SliderItem {
  uuid: string;
  type: 'atractivo' | 'novedad';
  id: string; // id of the attraction or novelty
}

const dataFilePath = path.join(process.cwd(), 'src/data/slider.json');

export async function getSliderItems(): Promise<SliderItem[]> {
  try {
    const fileContents = await fs.readFile(dataFilePath, 'utf8');
    const items = JSON.parse(fileContents);
    return items;
  } catch (error) {
    if (error instanceof Error && (error as NodeJS.ErrnoException).code === 'ENOENT') {
      await saveSliderItems([]);
      return [];
    }
    console.error('Error reading slider data:', error);
    return [];
  }
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
