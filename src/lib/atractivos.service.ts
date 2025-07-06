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
    const jsonData = await fs.readFile(dataFilePath, 'utf8');
    return JSON.parse(jsonData);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      await saveAttractions([]);
      return [];
    }
    console.error('Error reading attractions data:', error);
    return [];
  }
}

export async function saveAttractions(attractions: Attraction[]): Promise<void> {
  try {
    const data = JSON.stringify(attractions, null, 2);
    await fs.mkdir(path.dirname(dataFilePath), { recursive: true });
    await fs.writeFile(dataFilePath, data, 'utf8');
  } catch (error) {
    console.error('Error saving attractions data:', error);
    throw new Error('No se pudieron guardar los atractivos.');
  }
}
