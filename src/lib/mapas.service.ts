import fs from 'fs/promises';
import path from 'path';

export interface Mapa {
  id: string;
  title: string;
  description: string;
  downloadUrl?: string;
}

const dataFilePath = path.join(process.cwd(), 'data/mapas.json');

export async function getMapas(): Promise<Mapa[]> {
  try {
    const jsonData = await fs.readFile(dataFilePath, 'utf8');
    return JSON.parse(jsonData);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      await saveMapas([]);
      return [];
    }
    console.error('Error reading mapas data:', error);
    return [];
  }
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

    