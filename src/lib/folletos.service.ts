import fs from 'fs/promises';
import path from 'path';
<<<<<<< HEAD
import folletos from '../../data/folletos.json';
=======
import folletosData from '@/data/folletos.json';
>>>>>>> parent of 6e32407 (Verifica porque no puedo borrar Folletos cargados en producción, en camb)

export interface Folleto {
  id: string;
  title: string;
  description: string;
  downloadUrl?: string;
}

const dataFilePath = path.join(process.cwd(), 'data/folletos.json');

export async function getFolletos(): Promise<Folleto[]> {
<<<<<<< HEAD
  return folletos;
=======
  return folletosData;
>>>>>>> parent of 6e32407 (Verifica porque no puedo borrar Folletos cargados en producción, en camb)
}

export async function saveFolletos(folletos: Folleto[]): Promise<void> {
  try {
    const data = JSON.stringify(folletos, null, 2);
    await fs.mkdir(path.dirname(dataFilePath), { recursive: true });
    await fs.writeFile(dataFilePath, data, 'utf8');
  } catch (error) {
    console.error('Error saving folletos data:', error);
    throw new Error('No se pudieron guardar los folletos.');
  }
}
