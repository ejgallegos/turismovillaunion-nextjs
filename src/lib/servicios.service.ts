import fs from 'fs/promises';
import path from 'path';

export interface Servicio {
  id: string;
  icon: string;
  title: string;
  description: string;
}

const dataFilePath = path.join(process.cwd(), 'src/data/servicios.json');

export async function getServicios(): Promise<Servicio[]> {
  try {
    const fileContents = await fs.readFile(dataFilePath, 'utf8');
    if (!fileContents.trim()) {
      return [];
    }
    return JSON.parse(fileContents);
  } catch (error) {
    if (error instanceof Error && (error as NodeJS.ErrnoException).code === 'ENOENT') {
      await saveServicios([]);
      return [];
    }
    console.warn(`Could not read or parse servicios data from ${dataFilePath}. Returning empty array.`, error);
    return [];
  }
}

export async function saveServicios(servicios: Servicio[]): Promise<void> {
  try {
    const data = JSON.stringify(servicios, null, 2);
    await fs.writeFile(dataFilePath, data, 'utf8');
  } catch (error) {
    console.error('Error saving servicios data:', error);
    throw new Error('No se pudieron guardar los servicios.');
  }
}
