import fs from 'fs/promises';
import path from 'path';

export interface Folleto {
  id: string;
  title: string;
  description: string;
  downloadUrl?: string;
}

const dataFilePath = path.join(process.cwd(), 'src/data/folletos.json');

export async function getFolletos(): Promise<Folleto[]> {
  try {
    const fileContents = await fs.readFile(dataFilePath, 'utf8');
    if (!fileContents.trim()) {
      return [];
    }
    return JSON.parse(fileContents);
  } catch (error) {
    if (error instanceof Error && (error as NodeJS.ErrnoException).code === 'ENOENT') {
      if (process.env.NODE_ENV === 'production') {
        console.warn(`Folletos data file not found: ${dataFilePath}. This might be a deployment issue if you expect data. Returning empty array.`);
        return [];
      }
      await saveFolletos([]);
      return [];
    }
    console.warn(`Could not read or parse folletos data from ${dataFilePath}. Returning empty array.`, error);
    return [];
  }
}

export async function saveFolletos(folletos: Folleto[]): Promise<void> {
  try {
    await fs.mkdir(path.dirname(dataFilePath), { recursive: true });
    const data = JSON.stringify(folletos, null, 2);
    await fs.writeFile(dataFilePath, data, 'utf8');
  } catch (error) {
    console.error('Error saving folletos data:', error);
    throw new Error('No se pudieron guardar los folletos.');
  }
}
