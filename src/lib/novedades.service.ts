import fs from 'fs/promises';
import path from 'path';

export interface Novedad {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
}

const dataFilePath = path.join(process.cwd(), 'src/data/novedades.json');

export async function getNovedades(): Promise<Novedad[]> {
  try {
    const fileContents = await fs.readFile(dataFilePath, 'utf8');
    if (!fileContents.trim()) {
      return [];
    }
    return JSON.parse(fileContents);
  } catch (error) {
    if (error instanceof Error && (error as NodeJS.ErrnoException).code === 'ENOENT') {
      await saveNovedades([]);
      return [];
    }
    console.warn(`Could not read or parse novedades data from ${dataFilePath}. Returning empty array.`, error);
    return [];
  }
}

export async function saveNovedades(novedades: Novedad[]): Promise<void> {
  try {
    const data = JSON.stringify(novedades, null, 2);
    await fs.writeFile(dataFilePath, data, 'utf8');
  } catch (error) {
    console.error('Error saving novedades data:', error);
    throw new Error('No se pudieron guardar las novedades.');
  }
}
