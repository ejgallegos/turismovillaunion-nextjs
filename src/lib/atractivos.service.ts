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
    return [];
  }
}
