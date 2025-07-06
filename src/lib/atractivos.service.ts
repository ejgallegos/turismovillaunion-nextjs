import fs from 'fs/promises';
import path from 'path';
import attractionsData from '@/data/atractivos.json';

export interface Attraction {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
}

const dataFilePath = path.join(process.cwd(), 'src/data/atractivos.json');

export async function getAttractions(): Promise<Attraction[]> {
  // Use the imported data directly to ensure it's included in the build
  return attractionsData as Attraction[];
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
