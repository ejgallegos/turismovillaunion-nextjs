import fs from 'fs/promises';
import path from 'path';
import novedadesData from '@/data/novedades.json';

export interface Novedad {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
}

const dataFilePath = path.join(process.cwd(), 'src/data/novedades.json');

export async function getNovedades(): Promise<Novedad[]> {
  // Use the imported data directly to ensure it's included in the build
  return novedadesData as Novedad[];
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
