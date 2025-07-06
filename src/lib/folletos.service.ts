import fs from 'fs/promises';
import path from 'path';

export interface Folleto {
  id: string;
  title: string;
  description: string;
  downloadUrl?: string;
}

const dataFilePath = path.join(process.cwd(), 'data/folletos.json');

export async function getFolletos(): Promise<Folleto[]> {
  try {
    const jsonData = await fs.readFile(dataFilePath, 'utf8');
    return JSON.parse(jsonData);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      await saveFolletos([]);
      return [];
    }
    console.error('Error reading folletos data:', error);
    return [];
  }
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

    