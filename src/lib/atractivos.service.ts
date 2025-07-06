import fs from 'fs/promises';
import path from 'path';
import attractions from '../../data/atractivos.json';

export interface Attraction {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
}

const dataFilePath = path.join(process.cwd(), 'data/atractivos.json');

export async function getAttractions(): Promise<Attraction[]> {
  return attractions;
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
