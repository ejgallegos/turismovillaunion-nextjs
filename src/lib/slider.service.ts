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
    // If file is empty or just whitespace, it's not valid JSON. Return empty array.
    if (!fileContents.trim()) {
        return [];
    }
    return JSON.parse(fileContents);
  } catch (error) {
    if (error instanceof Error && (error as NodeJS.ErrnoException).code === 'ENOENT') {
      // File doesn't exist, create it with an empty array.
      await saveSliderItems([]);
      return [];
    }
    // For any other error (including JSON parsing), log a warning and return empty.
    // This prevents the app from crashing due to a corrupted file.
    console.warn(`Could not read or parse slider data from ${dataFilePath}. Returning empty array.`, error);
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
