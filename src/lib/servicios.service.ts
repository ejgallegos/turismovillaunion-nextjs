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
    const servicios = JSON.parse(fileContents);
    return servicios;
  } catch (error) {
    console.error('Error reading servicios data:', error);
    if (error instanceof Error && (error as NodeJS.ErrnoException).code === 'ENOENT') {
      await saveServicios([]);
      return [];
    }
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
