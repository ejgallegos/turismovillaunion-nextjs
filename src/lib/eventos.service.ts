import fs from 'fs/promises';
import path from 'path';

export interface Evento {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  description: string;
  category: string;
  icon: string; // lucide-react icon name
}

const dataFilePath = path.join(process.cwd(), 'src/data/eventos.json');

export async function getEventos(): Promise<Evento[]> {
  try {
    const fileContents = await fs.readFile(dataFilePath, 'utf8');
    const eventos = JSON.parse(fileContents);
    return eventos;
  } catch (error) {
    console.error('Error reading eventos data:', error);
    if (error instanceof Error && (error as NodeJS.ErrnoException).code === 'ENOENT') {
      await saveEventos([]);
      return [];
    }
    return [];
  }
}

export async function saveEventos(eventos: Evento[]): Promise<void> {
  try {
    const data = JSON.stringify(eventos, null, 2);
    await fs.writeFile(dataFilePath, data, 'utf8');
  } catch (error) {
    console.error('Error saving eventos data:', error);
    throw new Error('No se pudieron guardar los eventos.');
  }
}
