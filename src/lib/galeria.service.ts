import fs from 'fs/promises';
import path from 'path';

export interface GalleryItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
}

const dataFilePath = path.join(process.cwd(), 'data/galeria.json');

export async function getGalleryItems(): Promise<GalleryItem[]> {
  try {
    const jsonData = await fs.readFile(dataFilePath, 'utf8');
    return JSON.parse(jsonData);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      await saveGalleryItems([]);
      return [];
    }
    console.error('Error reading gallery data:', error);
    return [];
  }
}

export async function saveGalleryItems(items: GalleryItem[]): Promise<void> {
  try {
    const data = JSON.stringify(items, null, 2);
    await fs.mkdir(path.dirname(dataFilePath), { recursive: true });
    await fs.writeFile(dataFilePath, data, 'utf8');
  } catch (error) {
    console.error('Error saving gallery data:', error);
    throw new Error('No se pudieron guardar los elementos de la galería.');
  }
}

    