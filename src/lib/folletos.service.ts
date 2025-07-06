import fs from 'fs/promises';
import path from 'path';
import folletos from '../../data/folletos.json';

export interface Folleto {
  id: string;
  title: string;
  description: string;
  downloadUrl?: string;
}

const dataFilePath = path.join(process.cwd(), 'data/folletos.json');

export async function getFolletos(): Promise<Folleto[]> {
  return folletos;
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
