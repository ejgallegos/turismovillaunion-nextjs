import fs from 'fs/promises';
import path from 'path';

export interface Attraction {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
}

const dataFilePath = path.join(process.cwd(), 'src/data/atractivos.json');

export async function getAttractions(): Promise<Attraction[]> {
  try {
    const fileContents = await fs.readFile(dataFilePath, 'utf8');
    if (!fileContents.trim()) {
      return [];
    }
    return JSON.parse(fileContents);
  } catch (error) {
    if (error instanceof Error && (error as NodeJS.ErrnoException).code === 'ENOENT') {
      await saveAttractions([]);
      return [];
    }
    console.warn(`Could not read or parse attractions data from ${dataFilePath}. Returning empty array.`, error);
    return [];
  }
}

export async function saveAttractions(attractions: Attraction[]): Promise<void> {
  try {
    const data = JSON.stringify(attractions, null, 2);
    await fs.writeFile(dataFilePath, data, 'utf8');
  } catch (error) {
    console.error('Error saving attractions data:', error);
    throw new Error('No se pudieron guardar los atractivos.');
  }
}
