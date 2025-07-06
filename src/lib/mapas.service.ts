import fs from 'fs/promises';
import path from 'path';
import mapasData from '@/data/mapas.json';

export interface Mapa {
  id: string;
  title: string;
  description: string;
  downloadUrl?: string;
}

const dataFilePath = path.join(process.cwd(), 'src/data/mapas.json');

export async function getMapas(): Promise<Mapa[]> {
  // Use the imported data directly to ensure it's included in the build
  return mapasData as Mapa[];
}

export async function saveMapas(mapas: Mapa[]): Promise<void> {
  try {
    const data = JSON.stringify(mapas, null, 2);
    await fs.writeFile(dataFilePath, data, 'utf8');
  } catch (error) {
    console.error('Error saving mapas data:', error);
    throw new Error('No se pudieron guardar los mapas.');
  }
}
