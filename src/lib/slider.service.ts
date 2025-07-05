import fs from 'fs/promises';
import path from 'path';

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
  try {
    const fileContents = await fs.readFile(dataFilePath, 'utf8');
    if (!fileContents.trim()) {
        return [];
    }
    return JSON.parse(fileContents);
  } catch (error) {
    if (error instanceof Error && (error as NodeJS.ErrnoException).code === 'ENOENT') {
      if (process.env.NODE_ENV === 'production') {
        console.warn(`Slider data file not found: ${dataFilePath}. This might be a deployment issue if you expect data. Returning empty array.`);
        return [];
      }
      await saveSliderItems([]);
      return [];
    }
    console.warn(`Could not read or parse slider data from ${dataFilePath}. Returning empty array.`, error);
    return [];
  }
}

export async function saveSliderItems(items: SliderItem[]): Promise<void> {
  try {
    await fs.mkdir(path.dirname(dataFilePath), { recursive: true });
    const data = JSON.stringify(items, null, 2);
    await fs.writeFile(dataFilePath, data, 'utf8');
  } catch (error) {
    console.error('Error saving slider data:', error);
    throw new Error('No se pudieron guardar los items del slider.');
  }
}
