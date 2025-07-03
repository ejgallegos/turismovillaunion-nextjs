import fs from 'fs/promises';
import path from 'path';

export interface Localidad {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
}

const dataFilePath = path.join(process.cwd(), 'src/data/localidades.json');

export async function getLocalidades(): Promise<Localidad[]> {
  try {
    const fileContents = await fs.readFile(dataFilePath, 'utf8');
    if (!fileContents.trim()) {
      return [];
    }
    return JSON.parse(fileContents);
  } catch (error) {
    if (error instanceof Error && (error as NodeJS.ErrnoException).code === 'ENOENT') {
      await saveLocalidades([]);
      return [];
    }
    console.warn(`Could not read or parse localidades data from ${dataFilePath}. Returning empty array.`, error);
    return [];
  }
}

export async function saveLocalidades(localidades: Localidad[]): Promise<void> {
  try {
    const data = JSON.stringify(localidades, null, 2);
    await fs.writeFile(dataFilePath, data, 'utf8');
  } catch (error) {
    console.error('Error saving localidades data:', error);
    throw new Error('No se pudieron guardar las localidades.');
  }
}
