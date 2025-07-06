import fs from 'fs/promises';
import path from 'path';

export interface Novedad {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
}

const dataFilePath = path.join(process.cwd(), 'data/novedades.json');

export async function getNovedades(): Promise<Novedad[]> {
  try {
    const jsonData = await fs.readFile(dataFilePath, 'utf8');
    return JSON.parse(jsonData);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      await saveNovedades([]);
      return [];
    }
    console.error('Error reading novedades data:', error);
    return [];
  }
}

export async function saveNovedades(novedades: Novedad[]): Promise<void> {
  try {
    const data = JSON.stringify(novedades, null, 2);
    await fs.mkdir(path.dirname(dataFilePath), { recursive: true });
    await fs.writeFile(dataFilePath, data, 'utf8');
  } catch (error) {
    console.error('Error saving novedades data:', error);
    throw new Error('No se pudieron guardar las novedades.');
  }
}

    