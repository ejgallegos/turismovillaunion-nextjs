import fs from 'fs/promises';
import path from 'path';
import serviciosData from '@/data/servicios.json';

export interface Servicio {
  id: string;
  icon: string;
  title: string;
  description: string;
}

const dataFilePath = path.join(process.cwd(), 'src/data/servicios.json');

export async function getServicios(): Promise<Servicio[]> {
  // Use the imported data directly to ensure it's included in the build
  return serviciosData as Servicio[];
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
