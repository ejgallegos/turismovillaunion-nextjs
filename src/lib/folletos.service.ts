import fs from 'fs/promises';
import path from 'path';

export interface Folleto {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  aiHint: string;
  downloadUrl?: string;
}

const dataFilePath = path.join(process.cwd(), 'src/data/folletos.json');

export async function getFolletos(): Promise<Folleto[]> {
  try {
    const fileContents = await fs.readFile(dataFilePath, 'utf8');
    const folletos = JSON.parse(fileContents);
    return folletos;
  } catch (error) {
    console.error('Error reading folletos data:', error);
    if (error instanceof Error && (error as NodeJS.ErrnoException).code === 'ENOENT') {
      await saveFolletos([]);
      return [];
    }
    return [];
  }
}

export async function saveFolletos(folletos: Folleto[]): Promise<void> {
  try {
    const data = JSON.stringify(folletos, null, 2);
    await fs.writeFile(dataFilePath, data, 'utf8');
  } catch (error) {
    console.error('Error saving folletos data:', error);
    throw new Error('No se pudieron guardar los folletos.');
  }
}
