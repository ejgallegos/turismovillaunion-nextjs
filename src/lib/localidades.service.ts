import fs from 'fs/promises';
import path from 'path';
import localidadesData from '@/data/localidades.json';

export interface Localidad {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
}

const dataFilePath = path.join(process.cwd(), 'src/data/localidades.json');

export async function getLocalidades(): Promise<Localidad[]> {
  // Use the imported data directly to ensure it's included in the build
  return localidadesData as Localidad[];
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
