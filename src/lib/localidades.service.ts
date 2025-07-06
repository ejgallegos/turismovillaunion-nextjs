import fs from 'fs/promises';
import path from 'path';

export interface Localidad {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
}

const dataFilePath = path.join(process.cwd(), 'data/localidades.json');

export async function getLocalidades(): Promise<Localidad[]> {
    try {
    const jsonData = await fs.readFile(dataFilePath, 'utf8');
    return JSON.parse(jsonData);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      await saveLocalidades([]);
      return [];
    }
    console.error('Error reading localidades data:', error);
    return [];
  }
}

export async function saveLocalidades(localidades: Localidad[]): Promise<void> {
  try {
    const data = JSON.stringify(localidades, null, 2);
    await fs.mkdir(path.dirname(dataFilePath), { recursive: true });
    await fs.writeFile(dataFilePath, data, 'utf8');
  } catch (error) {
    console.error('Error saving localidades data:', error);
    throw new Error('No se pudieron guardar las localidades.');
  }
}

    