import fs from 'fs/promises';
import path from 'path';
import mapas from '../../data/mapas.json';

export interface Mapa {
  id: string;
  title: string;
  description: string;
  downloadUrl?: string;
}

const dataFilePath = path.join(process.cwd(), 'data/mapas.json');

export async function getMapas(): Promise<Mapa[]> {
  return mapas;
}

export async function saveMapas(mapas: Mapa[]): Promise<void> {
  try {
    const data = JSON.stringify(mapas, null, 2);
    await fs.mkdir(path.dirname(dataFilePath), { recursive: true });
    await fs.writeFile(dataFilePath, data, 'utf8');
  } catch (error) {
    console.error('Error saving mapas data:', error);
    throw new Error('No se pudieron guardar los mapas.');
  }
}
