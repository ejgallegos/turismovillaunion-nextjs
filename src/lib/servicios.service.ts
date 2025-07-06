import fs from 'fs/promises';
import path from 'path';

export interface Servicio {
  id: string;
  icon: string;
  title: string;
  description: string;
}

const dataFilePath = path.join(process.cwd(), 'data/servicios.json');

export async function getServicios(): Promise<Servicio[]> {
    try {
    const jsonData = await fs.readFile(dataFilePath, 'utf8');
    return JSON.parse(jsonData);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      await saveServicios([]);
      return [];
    }
    console.error('Error reading servicios data:', error);
    return [];
  }
}

export async function saveServicios(servicios: Servicio[]): Promise<void> {
  try {
    const data = JSON.stringify(servicios, null, 2);
    await fs.mkdir(path.dirname(dataFilePath), { recursive: true });
    await fs.writeFile(dataFilePath, data, 'utf8');
  } catch (error) {
    console.error('Error saving servicios data:', error);
    throw new Error('No se pudieron guardar los servicios.');
  }
}

    