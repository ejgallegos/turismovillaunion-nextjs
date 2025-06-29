import fs from 'fs/promises';
import path from 'path';

export interface Attraction {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  aiHint: string;
}

const dataFilePath = path.join(process.cwd(), 'src/data/atractivos.json');

export async function getAttractions(): Promise<Attraction[]> {
  try {
    const fileContents = await fs.readFile(dataFilePath, 'utf8');
    const attractions = JSON.parse(fileContents);
    return attractions;
  } catch (error) {
    console.error('Error reading attractions data:', error);
    // If the file doesn't exist or is empty, return an empty array
    if (error instanceof Error && (error as NodeJS.ErrnoException).code === 'ENOENT') {
      return [];
    }
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
