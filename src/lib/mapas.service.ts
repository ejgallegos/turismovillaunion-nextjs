import fs from 'fs/promises';
import path from 'path';

export interface Mapa {
  id: string;
  title: string;
  description: string;
  downloadUrl?: string;
}

const dataFilePath = path.join(process.cwd(), 'src/data/mapas.json');

export async function getMapas(): Promise<Mapa[]> {
  try {
    const fileContents = await fs.readFile(dataFilePath, 'utf8');
    const mapas = JSON.parse(fileContents);
    return mapas;
  } catch (error) {
    console.error('Error reading mapas data:', error);
    if (error instanceof Error && (error as NodeJS.ErrnoException).code === 'ENOENT') {
      await saveMapas([]);
      return [];
    }
    return [];
  }
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
